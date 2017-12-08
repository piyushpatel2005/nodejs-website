const Tutorial = require('../models/tutorial');
const User = require('../models/user');
const TutorialServices = require('../services/TutorialServices');

exports.showAddTutorialPage = function (req, res) {
    if(!req.session.userId) {
        res.render('partials/tutorials/add-tutorial', {
            
        });
    }
    User.findById(req.session.userId)
    .then((user) => {
        console.log(user); // TODO: remove
        res.render('partials/tutorials/add-tutorial', {
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
        let newTutorial = new Tutorial(valiationResult)
        newTutorial.save()
        .then((tutorial) => {
            user.tutorials.push(newTutorial._id)
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
        req.session.userId = null;
        res.status(404).json({
            message: "User not logged in!"
        });
    });
}