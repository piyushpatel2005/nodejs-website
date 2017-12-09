const Video = require('../models/video');
const Tutorial = require('../models/tutorial');

exports.addVideo = function (req, res) {
    if(!req.session.userId) {
        return res.render('/signin');
    }
    User.findById(req.session.userId)
    .then((user) => {
        if(!user) {
            req.session.userId = null;
            return res.render('/signin');
        }
        // make sure this user is the owner of the tutorial
        Tutorial.findById(req.params.tutorialId)
        .then((tutorial) => {
            if(!tutorial) {
                return res.status(404).json({
                    message: "This tutorial does not exist."
                });
            }
            if(tutorial.owner !== user._id) {
                return res.status(403).json({
                    message: "You are not authorized to perform this action."
                });
            }
            let videoRecord = {
                title: req.body.title,
                url: req.body.url,
                hour: req.body.hour,
                minutes: req.body.minutes,
                seconds: req.body.seconds
            }
            let validationResult = VideoServices.validateVideo(videoRecord);
            if(typeof validationResult === 'string') {
                return res.status(500).json({
                    message: validationResult
                });
            }
            let newVideo = new Video(validationResult);
            newVideo.tutorialId = tutorial._id;
            newVideo.save()
            .then((video) => {
                tutorial.videos.push(video._id);
                tutorial.videoOrder.push(video._id);
                // TODO: send data back with video added
                return res.json({
                    // send video so that front end framework can handle addition to the UI
                    message: "Video record added successfully.",
                    video: video
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Failed to add this video."
                });
            });
        })
        .catch((err) => {
            res.status(404).json({
                message: "This tutorial does not exist."
            });
        });
    })
    .catch((err) => {
        res.redirect('/signin');
    });
};