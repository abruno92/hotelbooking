module.exports = {
    port: process.env.PORT || 3001,
    locale: "da-DK",
    jwtExpirySeconds: 60 * 10,
    jwtTokenCookie: "JwtToken",
}