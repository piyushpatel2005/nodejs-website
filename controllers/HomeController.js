const User = require('../models/user'); 

exports.index = (req, res) => {
    if(!req.session.userId) {
        return res.render('index', {
            user: null,
            title: 'Home'
        });
    }
    User.findById(req.session.userId)
    .then((user) => {
        if(!user) {
            req.session.userId = null;
            res.redict('/signin');
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
    res.render('signup', {
        user: null,
        title: 'Sign up'
    });
};

exports.signin = (req, res) => {
    res.render('signin', {
        user: null,
        title: 'Login'
    })
};

exports.getTutorials = (req, res) => {
    if(!req.session.userId) {
        return res.render('partials/tutorials/view-tutorials', {
            title: 'List of Tutorials',
            user: null
        });
    }
    if(req.session.userId) {
        User.findById(req.session.userId)
        .then((user) => {
            return res.render('partials/tutorials/view-tutorials', {
                user: {
                    id: user._id,
                    email: user.email,
                    gravatarUrl: user.gravatarUrl,
                    admin: user.admin
                },
                title: "List of Tutorials"
            });
        })
        .catch((err) => {
            return res.redirect('/signin');
            
        });
    }
    
};
