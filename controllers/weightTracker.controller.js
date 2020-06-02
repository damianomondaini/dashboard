// Require modules
let {check, validationResult} = require('express-validator');
let {verifyToken} = require('../utils/users.utils');
let {validateData} = require('../utils/validation.utils');
let WeightModel = require('../models/weightTracker/weight.model');

// Controllers
exports.createRecord = async (req, res) => {
    let isDataValid = await validateData(req, res);
    let token = await verifyToken(req, res)
    if(isDataValid && token) {
        let weight = new WeightModel({
            date: new Date(),
            weight: req.body.weight,
            _idxUser: token.userId
        });
        let result = await weight.save().catch(err => {
            if (err) {
                res.status(400).json(err);
            }
        });
        res.json(result);
        res.end();
    }    
}