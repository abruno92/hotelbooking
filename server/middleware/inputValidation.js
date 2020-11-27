/**
 * This file contains various middleware functions
 * related to input validation and sanitization.
 */
const {locale} = require("../config");
const {validationResult} = require("express-validator");
const validator = require('express-validator'), ValidationChain = validator.ValidationChain;

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' parameter in the request URL
 * is a valid {@link ObjectId} string)
 * @param {string} field - Parameter to be validated, defaults to 'id'
 * @returns {function} - ValidationChain object
 */
function getParamIdValidation(field = 'id') {
    return getIdValidation(field, 'param');
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given context object
 * is a valid {@link ObjectId} string).
 * @param {string} field - Attribute to be validated, defaults to 'id'
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function getIdValidation(field = 'id', context = 'body') {
    return validator[context](field)
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
        // check if is a valid ObjectId string
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string");
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid string that matches given boundaries.
 * @param {string} field - Attribute to be validated
 * @param {Object} options - Object of 'min' and 'max' to set the length of the string
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function getStringValidation(field, options, context = 'body') {
    return validator[context](field)
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
        // check if length matches
        .isLength(options).withMessage(`must be between ${options.min} and ${options.max} characters`);
    // todo sanitize input against SQL, XSS and the like
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid number.
 * @param {string} field - Attribute to be validated
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function getDecimalValidation(field, context = 'body') {
    return validator[context](field)
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
        // check if the number format matches
        .isDecimal({locale: locale}).withMessage("must be a valid decimal number")
}

/**
 * Function that returns a {@link ValidationChain} used to
 * ensure the 'field' attribute in the given request object
 * is a valid date.
 * @param {string} field - Attribute to be validated
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function getDateValidation(field, context = 'body') {
    return validator[context](field)
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
        // check if the number format matches
        .isDate().withMessage("must be a valid date")
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
    getParamIdValidation: getParamIdValidation,
    getIdValidation: getIdValidation,
    getStringValidation: getStringValidation,
    getDecimalValidation: getDecimalValidation,
    getDateValidation: getDateValidation,
}