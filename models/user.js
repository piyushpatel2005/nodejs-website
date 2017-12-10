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
    ]
}, {
    timestamps: true
});

userSchema.pre('find', function (next) {
    this.populate('tutorials');
    next();
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('numberOfTutorials').get(function () {
    // need pre find hook before we have this.tutorials
    return this.tutorials.length;
});

// TODO: update _id in server code to use id
// userSchema.method('toJSON', function () {
//     var user = this.toObject();
//     delete user.password;
//     delete user.email;
//     user.id = user._id;
//     delete user._id;
//     delete user.__v;
//     delete user.createdAt;
//     delete user.updatedAt;
//     return user;
// })

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);