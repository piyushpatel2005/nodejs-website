const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "It doesn't look like an email."]   
    },
    password: {
        required: true,
        type: String
    },
    gravatarUrl: {
        type: String,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    tutorials: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutorial'
        }
    ],
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, {
    timestamps: true
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('toJSON').get(function () {
    let obj = this.toObject();
    delete obj.password;
    delete obj.confirmation;
    return obj;
});

userSchema.virtual('numberOfTutorials').get(function () {
    return this.tutorials.length;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);