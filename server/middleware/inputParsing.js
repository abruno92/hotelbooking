/**
 * This file contains various middleware functions
 * related to input validation and sanitization.
 */
const {validationResult} = require("express-validator");
const {ValidationChain, check} = require('express-validator');
const {ObjectId} = require("mongodb");

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the request object
 * exists if it is not optional.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field must be present
 * @returns {ValidationChain} - the current Validation chain instance
 */
function parseField(field, optional) {
    const parser = check(field);
    return optional ?
        // only run parsing if field is provided
        parser.if(check(field).exists()) :
        // ensure field is provided
        parser.exists().withMessage("must be provided").bail();
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the request object
 * is a valid {@link ObjectId} string. The field is then
 * cast to an {@link ObjectId} instance.
 * @param {string} field - Attribute to be validated, defaults to 'id'
 * @param {boolean} optional - Whether or not the field must be present, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseObjectId(field = 'id', optional = false) {
    return parseField(field, optional)
        // Validation
        // check if is a valid ObjectId string
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string").bail()
        // Sanitization
        // convert to ObjectId (same as value => ObjectId(value) )
        .customSanitizer(ObjectId)
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid string that matches given boundaries. The field is then
 * trimmed of whitespaces.
 * @param {string} field - Attribute to be validated
 * @param {Object} options - Object of 'min' and 'max' to set the length of the string
 * @param {boolean} optional - Whether or not the field must be present, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseString(field, options, optional = false) {
    return parseField(field, optional)
        // Validation
        // check if length matches
        .isLength(options).withMessage(`must be between ${options.min} and ${options.max} characters`)
        // Sanitization
        // trim leading and trailing whitespaces
        .trim()
    // todo sanitize input against SQL, XSS and the like
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid number. The field is then
 * cast to a float.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field is optional, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseDecimal(field, optional = false) {
    return parseField(field, optional)
        // Validation
        // check if the number format matches
        .isFloat().withMessage("must be a valid float")
        // Sanitization
        .toFloat()
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid date. The field is then
 * cast to a JavaScript {@link Date}.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field is optional, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseDate(field, optional = false) {
    return parseField(field, optional)
        // Validation
        // check if length matches
        .isDate().withMessage("must be a valid date")
        // Sanitization
        .toDate()
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid URL.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field is optional, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseUrl(field, optional = false) {
    return parseString(field, {min: 2, max: 2000})
        // Validation
        // check if valid URL
        .isURL().withMessage("must be a valid URL")
    // Sanitization
    // none
}

/**
 * Router-level middleware function that check for input validation
 * errors in the request body/params.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function inputValidator(req, res, next) {
    // check if errors have been generated during field validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // errors have been generated, send them in the response body
        res.status(400).json({errors: errors.array()});
    } else {
        // no errors, go to the next middleware
        next();
    }
}

module.exports = {
    inputValidator: inputValidator,
    parseObjectId: parseObjectId,
    parseString: parseString,
    parseDecimal: parseDecimal,
    parseDate: parseDate,
    parseUrl: parseUrl,
}