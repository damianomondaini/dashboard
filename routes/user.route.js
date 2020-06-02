// Require modules
let express = require('express');
let router = express.Router();
let {check} = require('express-validator');

let userController = require('../controllers/user.controller');

// Define routes like /api/users/...
router.post('/signup', [check('email').isEmail(), check('password').isLength({min: 10})], (req, res) => {
    userController.userSignUp(req, res);
});

router.post('/signin', [check('email').isEmail(), check('password')], (req, res) => {
    userController.userSignIn(req, res);
});

router.put('/admin/:id', [check('id').isMongoId()], (req, res) => {
    userController.userGrantAdminById(req, res);
});

router.get('/refresh', (req, res) => {
    userController.refreshToken(req, res);
});

module.exports = router;