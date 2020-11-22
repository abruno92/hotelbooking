/**
 * This file contains database-related functions for the users of the system.
 * @todo migrate to mongodb
 */
const {getHashedPassword, confirmPassword} = require("../auth");

/**
 * Temporary list of users.
 * @type {User[]}
 */
const users = [
    {
        id: '00000000',
        privilegeLevel: '0',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        // hash salted value of `password`
        passwordHash: '$2b$10$qMDjDFvFfAKJ9r45pSVuje2ZZN3Ji3c8FvEuGf7kKol7r5QShZcge',
    },
    {
        id: '00000001',
        privilegeLevel: '1',
        firstName: 'John',
        lastName: 'Admin',
        email: 'johnadmin@email.com',
        // hash salted value of `admin`
        passwordHash: '$2y$10$7YPwdul99iSqAWKMyaYUVuPoLCzz.KRAPSaE0QbXmcRAOVdRWv/Ju',
    }
];

/**
 *  Searches and verifies a {@link User} based on provided
 *  email and password.
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {User|undefined} - The found and confirmed user
 */
function getAndValidateUser(email, password) {
    return users.find(u => {
        return u.email === email && confirmPassword(password, u.passwordHash);
    });
}

/**
 *  Searches a {@link User} using the provided
 *  email.
 * @param {string} email - The email of the user
 * @returns {User|undefined} - The found user
 */
function getUser(email) {
    return users.find(u => {
        return u.email === email;
    })
}

/**
 * Creates a {@link User} using the provided first name, last name,
 * email and password.
 * @param {string} firstName - The first name of the user
 * @param {string} lastName - The last name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 */
function createUser(firstName, lastName, email, password) {
    users.push({
        id: crypto.randomBytes(8).toString('hex'),
        privilegeLevel: '0',
        firstName: firstName,
        lastName: lastName,
        email: email,
        passwordHash: getHashedPassword(password)
    });
}

module.exports = {
    getAndValidateUser: getAndValidateUser,
    getUser: getUser,
    createUser: createUser
};