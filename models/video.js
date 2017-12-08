const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tutorialId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tutorial'
    },
    url: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

videoSchema.virtual('seconds').get(function () {
    return this.duration % 60;
});

videoSchema.virtual('minutes').get(function () {
    return Math.floor((this.duration / 60) % 60);
});

videoSchema.virtual('hours').get(function () {
    return Math.floor(this.duration / 60 / 60);
});


module.exports = mongoose.model('Video', videoSchema);