// Require modules
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define new schema
let WeightSchema = new Schema({
    date: {type: Date, required: true},
    weight: {type: Number, required: true},
    _idxUser: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Weight', WeightSchema);