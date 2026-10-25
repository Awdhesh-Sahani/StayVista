const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config();

async function initDb() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(MONGODB_URI);
    const sampleListings = initData.data;
    const existingSamples = await Listing.find({
        $or: sampleListings.map(({ title, location, country }) => ({ title, location, country })),
    }).select("title location country").lean();
    const existingSampleKeys = new Set(
        existingSamples.map(({ title, location, country }) => JSON.stringify([title, location, country]))
    );
    const missingSamples = sampleListings.filter(({ title, location, country }) =>
        !existingSampleKeys.has(JSON.stringify([title, location, country]))
    );

    if (missingSamples.length === 0) {
        console.log("All sample listings are already present.");
        return;
    }

    await Listing.insertMany(missingSamples);
    console.log(`Seeded ${missingSamples.length} sample listings.`);
}

initDb()
    .catch((err) => {
        console.error("Failed to seed listings:", err);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());