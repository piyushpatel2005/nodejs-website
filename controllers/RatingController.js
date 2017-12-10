const Rating = require('../models/rating');
const User = require('../models/user');
const Tutorial = require('../models/tutorial');

exports.rateTutorial = (req, res) => {
    // voting handled completely by UI so will send only JSON.
    if(!req.session.userId) {
        return res.status(403).json({
            message: "You need to login to vote the tutorial."
        });
    }
    Tutorial.findById(req.params.tutorialId)
    .then((tutorial) => {
        if(!tutorial) {
            return res.status(404).json({
                message: "The resource you were looking for does not exist."
            });
        }
        User.findById(req.session.userId)
        .then((user) => {
            if(!user) {
                return res.status(404).json({
                    message:"Session belongs to a user who does not exist. Please login again."
                });
            }
            if(!tutorial.owner.equals(user._id)) {
                return res.status(403).json({
                    message: "You cannot vote your own tutorial."
                });
            }
            let rating = {
                stars: req.params.stars,
                byUser: user._id,
                forTutorial: tutorial._id
            }
            let newRatings = new Rating(rating);
            newRating.save(req.params.stars)
            .then((rating) => {
                tutorial.ratings.push(req.params.stars)
                tutorial.save()
                .then((updatedTutorial) => {
                    return res.status(201).json({
                        message: "Thank you for rating this tutorial.",
                        tutorial: updatedTutorial
                    })
                })
                .catch((err) => {
                    return res.status(500).json({
                        message: "Error while saving updated Tutorial"
                    });
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while saving raing"
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error while getting user details."
            });
        });
    })
    .catch((err) => {
        return res.status(500).json({
            message: "Error getting the tutorial."
        });
    });
}