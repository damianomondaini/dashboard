// Require modules
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
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

async function generateTokenForUser(userId, isAdmin) {
    let token = await jwt.sign({
        userId: userId,
        isAdmin: isAdmin
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '1h'
    });
    return token;
}

async function verifyToken(req, res) {
    let rawToken = req.headers.authorization.split(' ')[1]
    if (rawToken === undefined) {
        res.status(400).json({
            message: 'Token is invalid',
            status: false
        });
        res.end();
        return false;
    } else {
        try {
            let decodedToken = await jwt.verify(rawToken, process.env.JWT_SECRET);
            return decodedToken;
        } catch (err) {
            res.status(400).json({
                message: 'Token is invalid',
                status: false
            });
            res.end();
            return false;
        }
    }
}

module.exports = {
    checkIfUserExists: checkIfUserExists,
    hashPassword: hashPassword,
    comparePasswordToHash: comparePasswordToHash,
    generateTokenForUser: generateTokenForUser,
    verifyToken: verifyToken
}