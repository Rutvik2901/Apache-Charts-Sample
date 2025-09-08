const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String },
    registrationDate: { type: Date, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
