const User = require('../models/user');
const Tutorial = require('../models/tutorial');

exports.index = (req, res) => {
    Tutorial.find({})
    .sort({createdAt: -1})
    .populate('ratings')
    .populate('owner')
    .then((tutorials) => {
        if(!req.session.userId) {
            console.log('this route');
            return res.render('index', {
                title: 'Home',
                tutorials: tutorials
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            if(!user) {
                req.session.userId = null;
                res.redirect('/signin');
            }
            return res.render('index', {
                user: user,
                tutorials: tutorials,
                title: "Home"
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Something went wrong."
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Error occurred processing tutorials data."
        });
    });
};

exports.signup = (req, res) => {
    return res.render('signup', {
        user: null,
        title: 'Sign up'
    });
};

exports.signin = (req, res) => {
    return res.render('signin', {
        user: null,
        title: 'Login'
    })
};

exports.getTutorials = (req, res) => {
    Tutorial.find({})
    .populate('videos')
    .populate({path: 'owner', select: 'firstName'})
    .populate({path: 'ratings', select: 'stars'})
    .then((tutorials) => {
        if(!req.session.userId) {
            return res.render('partials/tutorials/view-tutorials', {
                user: null,
                tutorials: tutorials,
                title: 'List of Tutorials'
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            return res.render('partials/tutorials/view-tutorials', {
                user: user,
                tutorials: tutorials,
                title: 'List of Tutorials'
            });
        })
        .catch((err) => {
            req.session.userId = null;
            return res.status(500).json({
                message: 'Session doesn\'t belong to you.'
            });
        });
    })
    .catch((err) => {
        console.log('Error retrieving all tutorials');
        return res.redirect('/');
    });
};
