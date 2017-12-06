const mongoose = require('mongoose');
const User = require('../models/user');
const _ = require('lodash');

const expressValidator = require('express-validator');


exports.createUser = (req, res, next) => {
    let firstName = _.trim(req.body.firstName);
    let lastName = _.trim(req.body.lastName);
    let email = _.trim(req.body.email);
    let password = req.body.password;
    let confirmation = req.body.confirmation;

    console.log(lastName, firstName);
    
    if(_.isUndefined(firstName) || _.isEmpty(firstName)){
        return res.status(400).json({
            "message": "First Name is required."
        });
    }

    if(_.isUndefined(lastName) || _.isEmpty(lastName)){
        return res.status(400).json({
            "message": "Last Name is required."
        });
    }

    if(_.isUndefined(email) || (_.trim(email)).length < 1){
        return res.status(400).json({
            "message": "Email is required."
        });
    }
    
    if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        return res.status(400).json({
            "message": "It doesn't look like an email."
        });
    }

    if(_.isUndefined(password) || _.isEmpty(_.trim(password))){
        return res.status(400).json({
            "message": "Password is required."
        });
    }

    console.log(password, confirmation);
    if(password !== confirmation) {
        return res.status(500).json({
            message: "Passwords did not match."
        });
    }

    User.findOne({email: email}, (err, user) => {
        if(err) {
            return res.status(500).json({
                message: "Error in finding the record."
            });
        }
        if(user) {
            return res.status(403).json({
                message: "User with this email address already exists."
            });
        }

        let newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        newUser.save((err, createdUser) => {
            if(err) {
                return res.status(500).json({
                    message: "Error saving the record."
                });
            }
            // req.session.userId = user._id;
            return res.status(200).json({
                message: "User registration successful!"
            });
        });
    });
};

exports.viewProfile = (req, res, next) => {
    res.render('profile', {
        title: 'Profile'
    })
}