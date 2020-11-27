/**
 * Object that represents a user of the system.
 */
class User {
    _id;
    privilegeLevel;
    firstName;
    lastName;
    email;
    passwordHash;
    pictureUrl;
}

module.exports = User;