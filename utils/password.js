const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const hash = await scrypt(password, salt, 64);
    return { salt, hash: hash.toString("hex") };
}

async function verifyPassword(password, salt, expectedHash) {
    const { hash } = await hashPassword(password, salt);
    const actualBuffer = Buffer.from(hash, "hex");
    const expectedBuffer = Buffer.from(expectedHash, "hex");
    return actualBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

module.exports = { hashPassword, verifyPassword };
