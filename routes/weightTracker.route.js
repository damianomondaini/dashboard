// Require modules
let express = require('express');
let router = express.Router();
let {check, header} = require('express-validator');

let weightTrackerController = require('../controllers/weightTracker.controller');

// Define routes like /api/weight-tracker/...
router.post('/records', [check('weight').isFloat({ min: 10 })], (req, res) => {
    weightTrackerController.createRecord(req, res);
});

router.get('/records/:id', [check('id').isMongoId()], (req, res) => {
    weightTrackerController.getRecordById(req, res);
});

router.get('/records', (req, res) => {
    weightTrackerController.getRecords(req, res);
});

router.delete('/records/:id', [check('id').isMongoId()], (req, res) => {
    weightTrackerController.deleteRecordById(req, res);
});

router.put('/records/:id', [check('id').isMongoId(), check('weight').isFloat({ min: 10}), check('date').isRFC3339()], (req, res) => {
    weightTrackerController.updateRecordById(req, res);
});

module.exports = router;