// Require modules
let {check, validationResult} = require('express-validator');
let {verifyToken} = require('../utils/users.utils');
let {validateData} = require('../utils/validation.utils');
let WeightModel = require('../models/weightTracker/weight.model');

// Controllers
exports.createRecord = async (req, res) => {
    let isDataValid = await validateData(req, res);
    let token = await verifyToken(req, res);
    if(isDataValid && token) {
        let weight = new WeightModel({
            date: new Date(),
            weight: req.body.weight,
            _idxUser: token.userId
        });
        let result = await weight.save();
        res.json(result);
        res.end();
    }    
}

exports.getRecordById = async (req, res) => {
    let isDataValid = await validateData(req, res);
    let token = await verifyToken(req, res);
    if (isDataValid && token) {
        let record = await WeightModel.findById(req.params.id);
        if (record._idxUser == token.userId) {
            res.json(record);
            res.end();
        } else {
            res.status(403).json({
                message: "You are not authorized to access that information",
                status: false
            });
            res.end();
        }
    }
}

exports.getRecords = async (req, res) => {
    let token = await verifyToken(req, res);
    if (token) {
        let records = await WeightModel.find({_idxUser: token.userId});
        res.json(records);
    }
}

exports.deleteRecordById = async (req, res) => {
    let isDataValid = await validateData(req, res);
    let token = await verifyToken(req, res);
    if (isDataValid && token) {
        let record = await WeightModel.findById(req.params.id);
        if (record._idxUser == token.userId) {
            let deletedRecord = await WeightModel.findByIdAndRemove(req.params.id);
            res.json(deletedRecord);
        } else {
            res.status(403).json({
                message: "You are not authorized to access that information",
                status: false
            });
            res.end();
        }
    }
}

exports.updateRecordById = async (req, res) => {
    let isDataValid = await validateData(req, res);
    let token = await verifyToken(req, res);
    if (isDataValid && token) {
        let record = await WeightModel.findById(req.params.id);
        if (record._idxUser == token.userId) {
            let updatedRecord = await WeightModel.findByIdAndUpdate(req.params.id,
                {
                    $set: {
                        date: req.body.date,
                        weight: req.body.weight
                    }
                },
                { new: true });
            res.json(updatedRecord);
            res.end();
        } else {
            res.status(403).json({
                message: "You are not authorized to access that information",
                status: false
            });
            res.end();
        }
    }
}