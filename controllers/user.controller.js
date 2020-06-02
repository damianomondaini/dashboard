// Require modules
let {checkIfUserExists, hashPassword, comparePasswordToHash, generateTokenForUser, verifyToken} = require('../utils/users.utils');
let {validateData} = require('../utils/validation.utils');
let {validationResult} = require('express-validator');
let UserModel = require('../models/users/user.model');

// Controllers
exports.userSignUp = async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(400).json(err);
    } else {
        let user = await checkIfUserExists(req.body.email);
        if (user) {
            res.status(400).json({
                message: 'Email already used',
                status: false
            });
        } else {
            let hash = await hashPassword(req.body.password);
            let user = new UserModel({
                email: req.body.email,
                password: hash,
                isAdmin: false
            });
            await user.save();
            res.json({
                message: 'User added successfully',
                status: true
            });
        }
    }
}

exports.userSignIn = async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(400).json(err);
    } else {
        let user = await checkIfUserExists(req.body.email);
        if (!user) {
            res.status(400).json({
                message: 'Email or password is wrong',
                status: false
            });
        } else {            
            let isPasswordCorrect = await comparePasswordToHash(req.body.password, user.password);
            if (isPasswordCorrect) {
                res.json({
                    message: 'Email and password are correct',
                    token: await generateTokenForUser(user._id),
                    status: true
                });
            } else {
                res.status(400).json({
                    message: 'Email or password is wrong',
                    status: false
                });
            }
        }
    }
}

exports.userGrantAdminById = async (req, res) => {
    let isDataValid = await validateData(req, res);
    let token = await verifyToken(req, res);
    if (isDataValid && token) {
        if (token.isAdmin) {
            let user = await UserModel.findById(req.params.id);
            if (user != null && user.isAdmin === false) {
                let updatedUser = await UserModel.findByIdAndUpdate(req.params.id,
                    {
                        $set: {
                            isAdmin: true
                        }
                    },
                    { new: true }
                );
                res.json(updatedUser);
                res.end();
            } else {
                res.status(400).json({
                    message: 'Unable to grant admin',
                    status: false
                });
                res.end();
            }
        } else {
            res.status(400).json({
                message: 'You are unauthorized to grant a user as admin',
                status: false
            });
            res.end();
        }
    }
}

exports.refreshToken = async (req, res) => {
    let token = await verifyToken(req, res);
    if (token) {
        let newToken = await generateTokenForUser(token.userId);
        res.json({
            message: 'Token refreshed',
            token: newToken,
            status: true
        });
        res.end();
    }
}