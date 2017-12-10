const Tutorial = require('../models/tutorial');
const User = require('../models/user');
const TutorialServices = require('../services/TutorialServices');
const DateTimeService = require('../services/DateTimeService');

exports.showAddTutorialPage = function (req, res) {
    if(!req.session.userId) {
        return res.redirect('/signin');
    }
    User.findById(req.session.userId)
    .then((user) => {
        return res.render('partials/tutorials/add-tutorial', {
            user: {
                id: user._id,
                fullName: user.fullName,
                admin: user.admin,
                gravatarUrl: user.gravatarUrl
            },
            title: 'Add Tutorial'
        })
    })
    .catch((err) => {
        return res.redirect('/signin');
    });
};

exports.createTutorial = function (req, res) {
    User.findById(req.session.userId)
    .then((user) => {
        let tutorial = {
            title: req.body.title,
            description: req.body.description
        }
        let validationResult = TutorialServices.validateTutorial(tutorial);
        if(typeof validationResult === 'string') {
            return res.status(500).json({
                message: validationResult
            });
        }        
        validationResult.owner = req.session.userId;
        let newTutorial = new Tutorial(validationResult)
        newTutorial.save()
        .then((tutorial) => {
            user.tutorials.push(newTutorial._id);
            user.save()
            .then((user) => {
                return res.status(201).json(newTutorial)
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error saving tutorial data"
            });
        });
    })
    .catch((err) => {
        res.status(404).json({
            message: "User not logged in!"
        });
    });
};

exports.showTutorial = function (req, res) {
    console.log("Inside showTuturial");
    console.log(req.params.id);
    Tutorial.findById(req.params.id)
    .populate('owner')
    .then((tutorial) => {
        
        if(!tutorial) {
            console.log("If !tutorial");
            return res.status(404).json({
                message: "This tutorial does not exist."
            });
        }
        if(!req.session.userId) {
            console.log("If !req.session.userId");
            return res.render('partials/tutorials/tutorial-details', {
                user: null,
                title: tutorial.title,
                tutorial: tutorial,
                owner: false
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            console.log("Inside findById");      
            if(!user) {
                return res.render('partials/tutorials/tutorial-details', {
                    user: null,
                    title: tutorial.title,
                    tutorial: tutorial,
                    owner: false 
                });
            }

            if(tutorial.owner._id.equals(user._id)) {
                return res.render('partials/tutorials/tutorial-details', {
                    user: {
                        id: user._id,
                        gravatarUrl: user.gravatarUrl,
                        fullName: user.fullName
                    },
                    title: tutorial.title,
                    tutorial: tutorial,
                    owner: true
                });
                
            }
            return res.render('partials/tutorials/tutorial-details', {
                user: user,
                title: tutorial.title,
                tutorial: tutorial,
                showAddVideo: false
            });
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            message: "Error processing tutorial data."
        });
    });
};

exports.showEditTutorialPage = (req, res) => {
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You are not authorized to perform this action."
        });
    }

    User.findById(req.session.userId)
    .then((user) => {
        if(!user) {
            return res.status(403).json({
                message: "You are not authorized to perform this action."
            });
        }
        Tutorial.findById(req.params.id)
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
            return res.render('partials/tutorials/edit-tutorial', {
                tutorial: tutorial,
                title: "Edit Tutorial",
                user: user
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "There was a problem serving your request."
            });
        })
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Server Error occurred."
        });
    });
};

exports.editTutorial = (req, res) => {
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You are not authorized to perform this action."
        });
    }
    User.findById(req.session.userId)
    .then((user) => {
        if(!user) {
            return res.status(404).json({
                message: "Session belongs to a user who does not exist."
            });
        }
        Tutorial.findById(req.params.id)
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
            let newTutorial = {
                title: req.body.title,
                description: req.body.description
            }
            let validationResult = TutorialServices.validateTutorial(newTutorial);
            if(typeof validationResult === 'string') {
                return res.status(500).json({
                    message: validationResult
                });
            }        
            Tutorial.findByIdAndUpdate(req.params.id, newTutorial, {new: true})
            .then((updatedTutorial) => {
                return res.status(201).json({
                    message: "Tutorial updated successfully.",
                    id: updatedTutorial._id
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Server Error occurred."
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Server Error occurred."
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Server error occurred."
        });
    });
};