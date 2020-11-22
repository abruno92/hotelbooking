/**
 * This file contains helper methods related to authentication.
 */
const bcrypt = require("bcrypt");

/**
 * Time in seconds until a JWT expires.
 * @type {number}
 */
const jwtExpirySeconds = 60 * 10;

/**
 * Takes in a password string and returns the bcrypt hash value of that password.
 * @param {string} password - The password
 * @returns {string} hash value. of the password
 */
function getHashedPassword(password) {
    return bcrypt.hashSync(password, 10);
}

/**
 * Uses {@link bcrypt.compareSync} to test whether or not
 * the given password matches the given hash value.
 * @param {string} password - The password
 * @param {string} hash - The hash value
 * @returns {boolean} True if they match, false otherwise
 */
function confirmPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    jwtExpirySeconds: jwtExpirySeconds,
    getHashedPassword: getHashedPassword,
    confirmPassword: confirmPassword
};