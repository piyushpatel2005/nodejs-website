const mongoose = require('mongoose');
const Rating = require('./rating');
const Video = require('./video');

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
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

tutorialSchema.pre('findOne', function (next) {
    console.log('in findon');
    this.populate('ratings');
    this.populate('videos');
    next();
});


tutorialSchema.virtual('stars').get(function () {
    let stars = this.ratings.map((rating) => {
        return rating.stars;
    });
    if(stars.length === 0) return 0;
    return stars.reduce((sum, val) => {
        return sum + val;
    }) / stars.length;
});

tutorialSchema.virtual('createdOn').get(function () {
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

tutorialSchema.virtual('modifiedOn').get(function () {
    const DateTime = require('machinepack-datetime');
    let timeAgoString = DateTime.timeFrom({
        toWhen: DateTime.parse({
            datetime: this.updatedAt
        }).execSync(),
        fromWhen: new Date().getTime()
    }).execSync();
    return timeAgoString;
});

tutorialSchema.virtual('totalTime').get(function () {
    let times = [];
    times = this.videos.map((v) => {
        return v.duration;
    });
    if(times.length === 0) return 0;
    let totalTime = times.reduce((sum, time) => {
        return sum + time;
    });
    return totalTime;
});

module.exports = mongoose.model('Tutorial', tutorialSchema);