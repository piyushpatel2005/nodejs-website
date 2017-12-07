const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    stars: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
        required: true
    },
    byUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    forTutorial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutorial'
    }
});

module.exports = mongoose.model('Rating', ratingSchema);