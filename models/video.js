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
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

videoSchema.pre('remove', function (next) {
    Tutorial.update({_id: this.tutorialId}, { $pull: {videos: this._id, videoOrder: this._id }});
});

videoSchema.virtual('seconds').get(function () {
    return this.duration % 60;
});

videoSchema.virtual('minutes').get(function () {
    return Math.floor((this.duration / 60) % 60);
});

videoSchema.virtual('hour').get(function () {
    return Math.floor(this.duration / 60 / 60);
});

videoSchema.virtual('createdOn').get(function () {
    const DateTime = require('machinepack-datetime');
    let timeAgoString = "";
    try {
        timeAgoString = DateTime.timeFrom({
            toWhen: DateTime.parse({
                datetime: this.createdAt
            }).execSync(),
            fromWhen: new Date().getTime()
        }).execSync();
    } catch(err) {
        console.log('error getting createdon', err);
    }
    return timeAgoString;
});

videoSchema.virtual('youtubeId').get(function () {
    let endOfId = this.url.length;
    let youtubeId = this.url.substring(this.url.indexOf('=') + 1, endOfId);
    console.log(youtubeId);
    return youtubeId;
});

videoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Video', videoSchema);