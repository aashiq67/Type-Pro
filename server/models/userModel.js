const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    verified: {
        type: Boolean,
        default: false,
    },
    accuracy: {
        type: String,
        default: 0
    },
    wpm: {
        type: String,
        default: 0
    },
    score: {
        type: String,
        default: 0
    }
});

module.exports = mongoose.model("User", userSchema);