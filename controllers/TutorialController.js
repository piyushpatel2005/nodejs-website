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
}

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
                showAddVideo: false
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
                    showAddVideo: false 
                });
            }
            if(tutorial.owner._id !== user._id) {
                return res.render('partials/tutorials/tutorial-details', {
                    user: user,
                    title: tutorial.title,
                    tutorial: tutorial,
                    showAddVideo: false
                });
            }
            return res.render('partials/tutorials/tutorial-details', {
                user: {
                    id: user._id,
                    gravatarUrl: user.gravatarUrl,
                    fullName: user.fullName
                },
                title: tutorial.title,
                tutorial: tutorial,
                showAddVideo: true
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
