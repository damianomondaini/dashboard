// Require modules
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define new schema
let UserSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true, unique: true},
    isAdmin: {type: Boolean, required: true}
});

module.exports = mongoose.model('User', UserSchema);