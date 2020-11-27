/**
 * This file contains various middleware functions
 * related to input validation and sanitization.
 */
const {locale} = require("../config");
const {validationResult} = require("express-validator");
const validator = require('express-validator'), ValidationChain = validator.ValidationChain;
const {ObjectId} = require("mongodb");

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given context object
 * is a valid {@link ObjectId} string). The field is then
 * cast to an {@link ObjectId} instance.
 * @param {string} field - Attribute to be validated, defaults to 'id'
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - the current Validation chain instance
 */
function parseObjectId(field = 'id', context = 'body') {
    return validator[context](field)
        // Validation
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
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
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - the current Validation chain instance
 */
function parseString(field, options, context = 'body') {
    return validator[context](field)
        // Validation
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
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
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function parseDecimal(field, context = 'body') {
    return validator[context](field)
        // Validation
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
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
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function parseDate(field, context = 'body') {
    return validator[context](field)
        // Validation
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
        // check if the number format matches
        .isDate().withMessage("must be a valid date")
        // Sanitization
        .toDate()
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
}