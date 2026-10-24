const crypto = require("crypto");
const AuthSession = require("../models/authSession.js");
const wrapAsync = require("./wrapAsync.js");

const SESSION_COOKIE = "stayvista_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function hashSessionToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function getSessionToken(req) {
    const cookie = req.headers.cookie
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
    const token = cookie?.slice(SESSION_COOKIE.length + 1);
    return token && /^[a-f0-9]{64}$/i.test(token) ? token : null;
}

function setSessionCookie(req, res, token) {
    const secure = req.secure ? "; Secure" : "";
    res.setHeader("Set-Cookie",
        `${SESSION_COOKIE}=${token}; Max-Age=${SESSION_DURATION_MS / 1000}; Path=/; HttpOnly; SameSite=Lax${secure}`);
}

function clearSessionCookie(req, res) {
    const secure = req.secure ? "; Secure" : "";
    res.setHeader("Set-Cookie",
        `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`);
}

async function startSession(user, req, res) {
    const token = crypto.randomBytes(32).toString("hex");
    await AuthSession.create({
        user: user._id,
        tokenHash: hashSessionToken(token),
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    });
    setSessionCookie(req, res, token);
}

async function endSession(req, res) {
    const token = getSessionToken(req);
    if (token) {
        await AuthSession.deleteOne({ tokenHash: hashSessionToken(token) });
    }
    clearSessionCookie(req, res);
}

const loadCurrentUser = wrapAsync(async (req, res, next) => {
    res.locals.authPage = false;
    res.locals.currentUser = null;

    const token = getSessionToken(req);
    if (token) {
        const session = await AuthSession.findOne({
            tokenHash: hashSessionToken(token),
            expiresAt: { $gt: new Date() },
        }).populate("user", "email");

        if (session?.user) {
            req.currentUser = session.user;
            res.locals.currentUser = session.user;
        } else {
            clearSessionCookie(req, res);
        }
    }

    next();
});

function requireAuth(req, res, next) {
    if (!req.currentUser) {
        return res.redirect("/login");
    }
    next();
}

module.exports = {
    startSession,
    endSession,
    loadCurrentUser,
    requireAuth,
};