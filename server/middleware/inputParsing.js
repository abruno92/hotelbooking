/**
 * This file contains various middleware functions
 * related to input validation and sanitization.
 */
const {locale} = require("../config");
const {validationResult} = require("express-validator");
const {ValidationChain, check, body} = require('express-validator');
const {ObjectId} = require("mongodb");

const encodableHtmlChars = {
    "&": "&amp;",
    "<": "&lt;",
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
}

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
 * @param {DatabaseFunc} dbExistsFunc - Function called
 * @param {boolean} optional - Whether or not the field must be present, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseObjectId(field = 'id', dbExistsFunc = undefined, optional = false) {
    return parseField(field, optional)
        // Validation
        // check if is a valid ObjectId string
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string").bail()
        // check if the ObjectId references an existing item in a DB
        .custom(async value => {
            if (dbExistsFunc ? await dbExistsFunc(value) : true) {
                return true;
            } else {
                throw new Error("must be an existing database item");
            }
        }).bail()
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
        .isLength(options).withMessage(`must be between ${options.min} and ${options.max} characters`).bail()
        // ensure field is not empty, outside of whitespaces
        .not().isEmpty({ignore_whitespace: true}).withMessage("cannot be empty").bail()
        // Sanitization
        // trim leading and trailing whitespaces
        .trim()
        // encode HTML sensitive characters inside the string
        .customSanitizer(encodeHtml)
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
        .isFloat().withMessage("must be a valid float").bail()
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
        .isDate().withMessage("must be a valid date").bail()
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
        .isURL().withMessage("must be a valid URL").bail()
    // Sanitization
    // none
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid email string.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field is optional, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseEmail(field = "email", optional = false) {
    return parseString(field, {min: 10, max: 250}, optional)
        // Validation
        .isEmail({allow_utf8_local_part: false}).withMessage("must be a valid email").bail()
    // Sanitization
    // none
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid alphanumeric password.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field is optional, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parsePassword(field = 'password', optional = false) {
    return parseString(field, {min: 5, max: 50}, optional)
        // Validation
        .isAlphanumeric(locale).withMessage("must only contain letters and numbers").bail()
    // Sanitization
    // none
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid alphanumeric password.
 * @param {string} field - Attribute to be validated
 * @param {boolean} optional - Whether or not the field is optional, defaults to 'false'
 * @returns {function} - the current Validation chain instance
 */
function parseName(field = 'password', optional = false) {
    return parseString(field, {min: 5, max: 50}, optional)
        // Validation
        .isAlpha(locale).withMessage("must only contain letters").bail()
    // Sanitization
    // none
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure both 'first' and 'second' attributes in the given request object
 * are matching.
 * @param {string} first - First attribute to be compared
 * @param {string} second - Second attribute to be compared
 * @returns {function} - the current Validation chain instance
 */
function fieldsMatch(first, second) {
    return body(first)
        .custom((input, {req}) => input === req.body[second])
        .withMessage(`must match the '${second}' field`)
}

/**
 * Function that takes a string and
 * replaces HTML sensitive characters
 * with their encoded versions, as can be seen in {@link encodableHtmlChars}.
 * @param input - Value to be sanitized
 * @returns {function} - the current Validation chain instance
 */
function encodeHtml(input) {
    return [...input].map(char => encodableHtmlChars[char] ? encodableHtmlChars[char] : char).join('');
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
    inputValidator,
    parseObjectId,
    parseString,
    parseDecimal,
    parseDate,
    parseUrl,
    parseEmail,
    parsePassword,
    parseName,
    fieldsMatch,
}