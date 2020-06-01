// Require modules
let bcrypt = require('bcrypt');
let UserModel = require('../models/users/user.model');

// Utils funcions
async function checkIfUserExists(email) {
    let user = await UserModel.findOne({ email: email});
    return user;
}

async function hashPassword(password) {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}

async function comparePasswordToHash(password, hash) {
    let isPasswordCorrect = await bcrypt.compare(password, hash);
    return isPasswordCorrect;
}

module.exports = {
    checkIfUserExists: checkIfUserExists,
    hashPassword: hashPassword,
    comparePasswordToHash: comparePasswordToHash
}