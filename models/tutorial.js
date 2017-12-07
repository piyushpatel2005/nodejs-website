const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Tutorial', tutorialSchema);