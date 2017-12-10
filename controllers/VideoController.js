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
            let newVideo = new Video(validationResult);
            console.log('validation success');
            newVideo.tutorialId = tutorial._id;
            newVideo.save()
            .then((video) => {
                tutorial.videos.push(video._id);
                console.log(tutorial);
                tutorial.videoOrder.push(video._id);
                tutorial.save()
                .then((updatedTutorial) => {
                    console.log('vidoe saved');
                    return res.json({
                        // send video so that front end framework can handle addition to the UI
                        message: "Video record added successfully.",
                        video: video
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        message: "Error saving updated tutorial"
                    });
                });
                
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Failed to add this video."
                });
            });
        })
        .catch((err) => {
            return res.status(404).json({
                message: "Error finding tutorial by id"
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Error getting user data."
        });
    });
};

exports.deleteVideo = function (req, res) {
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You are not authorized to perform this action."
        });
    }
    
    User.findById(req.session.userId)
    .then((user) => {
        if(!user) {
            return res.redirect('/signin');
        }
        
        Tutorial.findById(req.params.tutorialId)
        .then((tutorial) => {
            if(!tutorial) {
                return res.status(404).json({
                    message: "This tutorial does not exist."
                });
            }
            console.log('in delete vide');
            
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
                    message: "Video deleted successfully!",
                    video: video
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
        return res.status(500).json({
            message: "Something went wrong"
        });
    });
};

exports.viewVideo = (req, res) => {
    Video.findById(req.params.id) 
    .then((video) => {
        if(!video) {
            return res.status(404).json({
                message: "The resource you were looking for does not exist."
            });
        }
        if(!req.session.userId) {
            return res.render('partials/tutorials/view-video', {
                video: video,
                title: video.title
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            
            if(!user) {
                return res.render('partials/tutorials/view-video', {
                    video: video,
                    title: video.title
                });
            }
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

exports.showEditVideoPage = (req, res) => {
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You are not authorized to perform this action."
        });
    }
    Tutorial.findById(req.params.tutorialId)
    .then((tutorial) => {
        if(!tutorial) {
            return res.status(404).json({
                message: "This tutorial does not exist."
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            if(!user) {
                return res.status(404).json({
                    message: "The user does not exist."
                });
            }
            if(!tutorial.owner.equals(user.id)) {
                return res.status(403).json({
                    message: "You are not authorized to perform this action."
                });
            }
           
            Video.findById(req.params.id)
            .then((video) => {
                if(!video) {
                    return res.status(404).json({
                        message: "This video does not exist."
                    });
                }
                return res.render('partials/tutorials/edit-video', {
                    user: user,
                    video: video,
                    title: 'Edit Video',
                    tutorial: tutorial
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error getting user video data."
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error getting user data."
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Error occurred processing this tutorial."
        });
    });
};

exports.editVideo = (req, res) => {
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You are not authorized to perform this action."
        });
    }
    Tutorial.findById(req.params.tutorialId)
    .then((tutorial) => {
        if(!tutorial) {
            return res.status(404).json({
                message: "This tutorial does not exist."
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            if(!user) {
                return res.status(404).json({
                    message: "The user does not exist."
                });
            }
            if(!tutorial.owner.equals(user.id)) {
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
            Video.findByIdAndUpdate(req.params.id, validationResult, {new: true})
            .then((video) => {
                if(!video) {
                    return res.status(404).json({
                        message: "This video does not exist."
                    });
                }
                return res.json({
                    message: "Video record updated successfully!"
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error getting user video data."
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error getting user data."
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Error occurred processing this tutorial."
        });
    });
};