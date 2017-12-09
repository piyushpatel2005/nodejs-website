const User = require('../models/user');
const Tutorial = require('../models/tutorial');

exports.index = (req, res) => {
    if(!req.session.userId) {
        console.log('this route');
        return res.render('index', {
            title: 'Home'
        });
    }
    User.findById(req.session.userId)
    .then((user) => {
        if(!user) {
            req.session.userId = null;
            res.redirect('/signin');
        }
        return res.render('index', {
            user: {
                id: user._id,
                fullName: user.fullName,
                gravatarUrl: user.gravatarUrl
            },
            title: "Home"
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Something went wrong."
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
