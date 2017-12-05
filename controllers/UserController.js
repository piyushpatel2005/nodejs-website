const mongoose = require('mongoose');
const User = require('../models/user');
const validation = require('express-validation');


exports.createUser = (err, req, res, next) => {
    let password = req.body.password;
    let confirmation = req.body.confirmation;
    console.log("in createuser");

    // Handle most of the errors using Joi
    // if (err instanceof validation.ValidationError) {
    //     console.log("Error occurred");
    //     return res.status(err.status).json(err);
    //     // return res.json(200, 'success');
    // }
    // if(err) {
    //     return res.status(404).json(err);
    // }
    console.log(req.body);
    if(err) {
        console.log('in error block');
        return res.status(400).json({
            "message": 'Worn'
        });
    }

    // if(password !== confirmation) {
    //     let err = error(500, 'Passwords did not match.');
    //     // res.redirect('signup', {
    //     //     message: err.message
    //     // });
    //     console.log("passwords didn't match");
    //     return res.status(500).json({
    //         message: "Passwords did not match."
    //     });
    // }
    console.log('here');
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password

    });

    user.save()
    .then((err,user) => {
        req.session.userId = user._id;
        return res.json({
            "success": true
        });
    })
    .catch((err) => {
        console.log("Promise error");
        return res.send(400, err);
    });
};

exports.viewProfile = (req, res, next) => {
    res.render('profile', {
        title: 'Profile'
    })
}