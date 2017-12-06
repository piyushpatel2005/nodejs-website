
const User = require('../models/user');
const _ = require('lodash');
const Passwords = require('machinepack-passwords');


exports.createUser = (req, res, next) => {

    let errors = {};
    
    if(_.isUndefined(req.body.firstName) || _.isEmpty(req.body.firstName)){
        errors.firstName = "First Name is required. ";
        errors.hasError = true;
    }

    if(_.isUndefined(req.body.lastName) || _.isEmpty(req.body.lastName)){
        errors.lastName = "Last Name is required. ";
    }

    if(_.isUndefined(req.body.email) || (_.trim(req.body.email)).length < 1){
        errors.email = "Email is required. ";
    }

    if(_.isUndefined(req.body.password) || _.isEmpty(_.trim(req.body.password))){
        errors.password = "Password is required. ";
    }

    let firstName = _.escape(_.trim(req.body.firstName));
    let lastName = _.escape(_.trim(req.body.lastName));
    let email = _.escape(_.trim(req.body.email));
    let password = _.escape(_.trim(req.body.password));
    let confirmation = _.escape(_.trim(req.body.confirmation));
    
    if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        errors.email = errors.email || "";
        errors.email +="It doesn't look like an email.";
    }

    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/)) {
        errors.password = errors.password || "";
        errors.password.invalid += "Password must contain at least one uppercase, one lowercase and a digit.";
    }

    if(password !== confirmation) {
        errors.confirmation = "";
        errors.confirmation.match += "Passwords didn't match.";
    }

    if(!_.isEmpty(errors)) {
        return res.status(400).json({
            message: "Please, fill up the form properly.",
            errors: errors
        });
    }

    User.findOne({email: email}, (err, user) => {
        if(err) {
            return res.status(500).json({
                message: "Error processing user data."
            });
        }
        if(user) {
            return res.status(409).json({
                message: "User with this email address already exists."
            });
        }

        Passwords.encryptPassword({
            password: password
        }).exec({
            error: (err) => {
                return res.status(500).json({err: err});
            },
            success: (result) => {
                let newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: result
                });
                newUser.save((err, createdUser) => {
                    if(err) {
                        return res.status(500).json({
                            message: "Error saving the record."
                        });
                    }
                    req.session.userId = createdUser._id;
                    return res.status(201).json({
                        errors: errors,
                        message: "User registration successful!"
                    });
                });
            }
        });        
    });
};

exports.viewProfile = (req, res, next) => {
    res.render('profile', {
        title: 'Profile'
    });
};