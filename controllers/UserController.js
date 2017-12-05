const mongoose = require('mongoose');
const User = require('../models/user');
const validation = require('express-validation');

exports.createUser = (err, req, res, next) => {
    let password = req.body.password;
    let confirmation = req.body.confirmation;

    // Handle most of the errors using Joi
    if (err instanceof validation.ValidationError) {
        // return res.status(err.status).json(err);
        return res.render('signup', {
            err: err,
            title: 'Sign Up'
        });
    }

    if(password !== confirmation) {
        let err = error(500, 'Passwords did not match.');
        res.redirect('signup', {
            message: err.message
        });
    }
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password

    });

    user.save()
    .then((user) => {
        res.redirect('/signin');
    })
    .catch((err) => next(err));
}