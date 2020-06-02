// Require modules
let express = require('express');
let router = express.Router();
let {check, header} = require('express-validator');

let weightTrackerController = require('../controllers/weightTracker.controller');

// Define routes like /api/weight-tracker/...
router.post('/records', [check('weight').isFloat({ min: 10 })], (req, res) => {
    weightTrackerController.createRecord(req, res);
});

module.exports = router;