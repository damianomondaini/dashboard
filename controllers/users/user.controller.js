// Require modules
let {checkIfUserExists, hashPassword, comparePasswordToHash, generateTokenForUser} = require('../../utils/users.utils');
let {check, validationResult} = require('express-validator');
let UserModel = require('../../models/users/user.model');

// Controllers
exports.userSignUp = async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(400).json(err);
    } else {
        let user = await checkIfUserExists(req.body.email);
        if (user) {
            res.status(400).json({
                'message': 'Email already used',
                'status': false
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
                'message': 'User added successfully',
                'status': true
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
                'message': 'Email or password is wrong',
                'status': false
            });
        } else {            
            let isPasswordCorrect = await comparePasswordToHash(req.body.password, user.password);
            if (isPasswordCorrect) {
                res.json({
                    'message': 'Email and password are correct',
                    'token': await generateTokenForUser(user._id, user.isAdmin),
                    'status': true
                });
            } else {
                res.status(400).json({
                    'message': 'Email or password is wrong',
                    'status': false
                });
            }
        }
    }
}