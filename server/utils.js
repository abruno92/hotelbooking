/**
 * This file contains various utility functions.
 */
const {AxiosInstance, create} = require('axios');
const {port, jwt} = require("./config");

/**
 * Passes the JWT cookie from the provided request object
 * to the Axios instance.
 * @param req - The Request Object
 * @returns {AxiosInstance} - The modified Axios instance
 */
function axiosJwtCookie(req) {
    return create({
        baseURL: `http://localhost:${port}/`,
        headers: {
            Cookie: `${jwt.cookieName}=${req.cookies[jwt.cookieName]}`
        }
    })
}

module.exports = {
    axiosJwtCookie
};