
const User = require('../models/user');
const _ = require('lodash');
const Passwords = require('machinepack-passwords');
const Gravatar = require('machinepack-gravatar');


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
                let gravatarUrl= "";
                try {
                    gravatarUrl = Gravatar.getImageUrl({
                        emailAddress: email
                    }).execSync();
                } catch(err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Failed to get your gravatar"
                    })
                }

                let newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: result,
                    gravatarUrl: gravatarUrl
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
                        message: "User registration successful!",
                        id: createdUser._id
                    });
                });
            }
        });        
    });
};

exports.login = (req, res, next) => {
    let email = _.escape(req.body.email);
    let password = _.escape(req.body.password);

    User.findOne({
        email: email
    }, (err, foundUser) => {
        if(err) {
            return res.status(500).json({
                message: "Something went wrong!"
            });
        }

        if(!foundUser) {
            return res.status(404).json({
                message: 'User with this email address does not exist. Please, sign up!'
            });
        }

        Passwords.checkPassword({
            passwordAttempt: password,
            encryptedPassword: foundUser.password
        }).exec({
            error: (err) => {
                res.status(500).json({
                    message: "Something went wrong!"
                });
            },
            incorrect: () => {
                res.status(403).json({
                    message: "Password didn't match."
                });
            },
            success: () => {
                req.session.userId = foundUser._id;
                return res.json({
                    message: "Login Successful!",
                    id: foundUser._id
                });
            }
        });
    });
};

exports.viewProfile = (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/signin');
    }

    User.findById(req.session.userId, (err, loggedinUser) => {
        if(err) {
            return res.status(500).json({
                message: "Something went wrong!"
            });
        }
        if(!loggedinUser) {
            return res.redirect('/signin');
        }
        let user = {
            id: loggedinUser._id,
            email: loggedinUser.email
        };

        return res.render('partials/user/profile', {
            user: {
                id: loggedinUser._id,
                fullName: loggedinUser.fullName,
                email: loggedinUser.email,
                gravatarUrl: loggedinUser.gravatarUrl
            },
            title: "My Profile"
        });
    });
};

exports.logout = (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/signin');
    }

    User.findById(req.session.userId, (err, user) => {
        if(err) {
            return next(err);
        }

        if(!user) {
            res.status(404).json({
                message: "You shouldn't be here. Please login again!"
            });
        }

        req.session.userId = null;
        return res.redirect('/signin');
    })
};
