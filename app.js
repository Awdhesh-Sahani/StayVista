require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Joi = require("joi");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const { startSession, endSession, loadCurrentUser, requireAuth } = require("./utils/auth.js");
const { hashPassword, verifyPassword } = require("./utils/password.js");
const { listingSchema } = require("./schema.js");
const PORT = process.env.PORT || 8080;


const authFormSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().min(8).required(),
    returnTo: Joi.string().optional(),
});
const listingSearchSchema = Joi.object({
    place: Joi.string().trim().max(100).allow(""),
    activity: Joi.string().trim().max(100).allow(""),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
}).unknown(false);


async function startServer() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
        console.log(`StayVista server running on port ${PORT}`);
    });
}

app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(loadCurrentUser);

function renderAuthPage(res, page, statusCode, message, returnTo = "/listings") {
    res.status(statusCode).render(`auth/${page}.ejs`, {
        authPage: true,
        message,
        returnTo,
    });
}

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.render("home.ejs", { authPage: true });
});

app.get(["/login", "/signup"], (req, res) => {
    if (req.currentUser) {
        return res.redirect(getSafeReturnTo(req.query.returnTo));
    }
    const page = req.path === "/signup" ? "signup" : "login";
    renderAuthPage(res, page, 200, null, getSafeReturnTo(req.query.returnTo));
});

app.post("/signup", wrapAsync(async(req, res) => {
    const returnTo = getSafeReturnTo(req.body.returnTo);
    const { error, value } = authFormSchema.validate(req.body, { abortEarly: true });
    if (error) {
        return renderAuthPage(res, "signup", 400, error.details[0].message, returnTo);
    }

    const { salt, hash } = await hashPassword(value.password);
    const user = new User({
        email: value.email,
        passwordHash: hash,
        passwordSalt: salt,
    });

    try {
        await user.save();
    } catch (err) {
        if (err.code === 11000) {
            return renderAuthPage(res, "signup", 409, "An account with this email already exists.", returnTo);
        }
        throw err;
    }

    await startSession(user, req, res);
    res.redirect(returnTo);
}));

app.post("/login", wrapAsync(async(req, res) => {
    const returnTo = getSafeReturnTo(req.body.returnTo);
    const { error, value } = authFormSchema.validate(req.body, { abortEarly: true });
    if (error) {
        return renderAuthPage(res, "login", 400, error.details[0].message, returnTo);
    }

    const user = await User.findOne({ email: value.email })
        .select("+passwordHash +passwordSalt");
    if (!user || !(await verifyPassword(value.password, user.passwordSalt, user.passwordHash))) {
        return renderAuthPage(res, "login", 401, "Email or password is incorrect.", returnTo);
    }

    await startSession(user, req, res);
    res.redirect(returnTo);
}));

app.post("/logout", wrapAsync(async(req, res) => {
    await endSession(req, res);
    res.redirect("/home");
}));

const validateListing = (req, res, next) => {
    let { error, value } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.body = value;
        next();
    }
}

// index route

app.get("/listings", (req, res, next) => {
    if (["place", "activity", "minPrice", "maxPrice"].some((key) => key in req.query)) {
        return requireAuth(req, res, next);
    }
    next();
}, wrapAsync(async(req, res) => {
    const searchQuery = {...req.query };
    if (searchQuery.minPrice === "") delete searchQuery.minPrice;
    if (searchQuery.maxPrice === "") delete searchQuery.maxPrice;

    const { error, value: filters } = listingSearchSchema.validate(searchQuery);
    if (error) {
        throw new ExpressError(400, "Search terms must be valid and prices cannot be negative.");
    }
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined &&
        filters.minPrice > filters.maxPrice) {
        throw new ExpressError(400, "Minimum price cannot be greater than maximum price.");
    }

    const query = {};
    if (filters.place) {
        const placePattern = new RegExp(filters.place.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        query.$or = [{ location: placePattern }, { country: placePattern }];
    }
    if (filters.activity) {
        const activityPattern = new RegExp(filters.activity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        query.$and = [
            ...(query.$and || []),
            { $or: [{ title: activityPattern }, { description: activityPattern }] },
        ];
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", {
        allListings,
        filters: {
            place: filters.place || "",
            activity: filters.activity || "",
            minPrice: filters.minPrice ?? "",
            maxPrice: filters.maxPrice ?? "",
        },
    });
}));


// New Route

app.get("/listings/new", requireAuth, (req, res) => {
    res.render("listings/new.ejs");
});

// Show route

app.get("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", { listing });
}));

// Create Route

app.post("/listings", requireAuth, validateListing, wrapAsync(async(req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

//Edit Route

app.get("/listings/:id/edit", requireAuth, wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Uppdate Route

app.put("/listings/:id", requireAuth, validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing }, { runValidators: true });
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listings/${id}`);
}));

// Delete Route

app.delete("/listings/:id", requireAuth, wrapAsync(async(req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listings");
}));


app.all(`/{*any}`, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

// Error Handler Middlewere

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });

});

function getSafeReturnTo(value) {
    if (typeof value === "string" && value.startsWith("/") &&
        !value.startsWith("//") && !value.includes("\\")) {
        return value;
    }
    return "/listings";
}

startServer().catch((err) => {
    console.error("Failed to start StayVista:", err);
    process.exitCode = 1;
});
