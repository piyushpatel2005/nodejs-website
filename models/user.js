const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    gravatarUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', userSchema);