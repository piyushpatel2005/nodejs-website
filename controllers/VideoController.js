const Video = require('../models/video');
const Tutorial = require('../models/tutorial');
const User = require('../models/user');
const VideoServices = require('../services/VideoServices');

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
                console.log('tutorial not found', req.params.tutorialId);
                return res.status(404).json({
                    message: "This tutorial does not exist."
                });
            }
            if(!tutorial.owner.equals(user._id)) {
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
            };
            let validationResult = VideoServices.validateVideo(videoRecord);
            if(typeof validationResult === 'string') {
                return res.status(500).json({
                    message: validationResult
                });
            }
            console.log('validation success');
            let newVideo = new Video(validationResult);
            newVideo.tutorialId = tutorial._id;
            console.log(newVideo);
            newVideo.save()
            .then((video) => {
                tutorial.videos.push(video._id);
                tutorial.videoOrder.push(video._id);
                tutorial.save()
                .then((updatedTutorial) => {
                    return res.json({
                        // send video so that front end framework can handle addition to the UI
                        message: "Video record added successfully.",
                        tutorial: updatedTutorial
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        message: "Error saving updated tutorial"
                    });
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
                message: "Error finding tutorial by id"
            });
        });
    })
    .catch((err) => {
        res.redirect('/signin');
    });
};

exports.deleteVideo = function (req, res) {
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You are not authorized to perform this action."
        });
    }
    User.findById(req.sesion.userId)
    .then((user) => {
        if(!user) {
            return res.redirect('/signin');
        }
        Tutorial.findById(tutorialId)
        .then((tutorial) => {
            if(!tutorial) {
                return res.status(404).json({
                    message: "This tutorial does not exist."
                });
            }
            if(!tutorial.owner.equals(user._id)) {
                return res.status(403).json({
                    message: "You are not authorized to perform this action."
                });
            }
            Video.findByIdAndRemove(req.params.id)
            .then((video) => {
                if(!video) {
                    return res.json(404).json({
                        message: "The resource you were looking for does not exist."
                    });
                }
                return res.json({
                    message: "Video deleted successfully!"
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error retrieving video resource."
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error retrieving tutorial resource."
            });
        });
    })
    .catch((err) => {
        res.status(500).json({
            message: "Something went wrong"
        });
    });
};

exports.viewVideo = (req, res) => {
    console.log('inside viewVide');
    Video.findById(req.params.id) 
    .then((video) => {
        if(!video) {
            console.log('video not ofund');
            return res.status(404).json({
                message: "The resource you were looking for does not exist."
            });
        }
        if(!req.session.userId) {
            console.log('session doesnt');
            return res.render('partials/tutorials/view-video', {
                video: video,
                title: video.title
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            
            if(!user) {
                console.log('user not found');
                return res.render('partials/tutorials/view-video', {
                    video: video,
                    title: video.title
                });
            }
            console.log('user found');
            // return res.json({
            //     message: "Done"
            // });
            return res.render('partials/tutorials/view-video', {
                video: video,
                title: video.title,
                user: user
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error finding user data"
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Error getting video data"
        });
    });
};