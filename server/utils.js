/**
 * This file contains various utility functions.
 */
const {AxiosInstance, create} = require('axios');
const {jwt} = require("./config");
const apiUrl = require('./apiUrl');

/**
 * Passes the JWT cookie from the provided request object
 * to the Axios instance.
 * @param req - The Request Object
 * @returns {AxiosInstance} - The modified Axios instance
 */
function axiosJwtCookie(req) {
    return create({
        baseURL: apiUrl,
        headers: {
            Cookie: `${jwt.cookieName}=${req.cookies[jwt.cookieName]}`
        }
    })
}

module.exports = {
    axiosJwtCookie
};