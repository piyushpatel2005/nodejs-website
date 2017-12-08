const mongoose = require('mongoose');
const Passwords = require('machinepack-passwords');
const Gravatar = require('machinepack-gravatar');
const User = require('./models/user');
const Tutorial = require('./models/tutorial');
const Video = require('./models/video');
const Rating = require('./models/rating');

const Id = mongoose.Schema.Types.ObjectId;


const users = [
    {
        firstName: "xyz123",
        lastName: "Unknown",
        email: "xyz@example.com",
        password: "Xyz12345",
        admin: false,
        _id: Id("1"),
    },
    {
        firstName: 'abc123',
        lastName: 'Patel',
        email: 'abc@example.com',
        password: 'Abc12345',
        admin: false,
        _id: Id("2")
    },
    {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: 'Admin12345',
        admin: true,
        _id: Id("3")
    }
];

const videos =  [

    {
        title: "Javascript Introduction",
        src: "https://www.youtube.com/watch?v=yQaAGmHNn9s",
        duration: 401,
        tutorialId: "1",
        _id: Id("1")
    },
    {
        title: "Inline vs External Javascript",
        src: "https://www.youtube.com/watch?v=GeOSQcmLAtw",
        duration: 1123,
        tutorialId: "1",
        _id: Id("2")
    },
    {
        title: "What is NodeJS",
        src: "https://www.youtube.com/watch?v=nZRbnBBupBI",
        duration: 903,
        tutorialId: "1",
        _id: "3"
    },
    {
        title: "ExpressJS crash course",
        src: "https://www.youtube.com/watch?v=gnsO8-xJ8rs",
        duration: 42354,
        tutorialId: "1",
        _id: "4"
    },
    {
        title: "Dependency Injection",
        src: "https://www.youtube.com/watch?v=yQaAGmHNn9s",
        duration: 401,
        tutorialId: "1",
        _id: "6"
    },
    {
        title: "Application Context",
        src: "https://www.youtube.com/watch?v=GeOSQcmLAtw",
        duration: 1123,
        tutorialId: "1",
        _id: "5"
    },
    {
        title: "Create a simple console app with Spring",
        src: "https://www.youtube.com/watch?v=nZRbnBBupBI",
        duration: 903,
        tutorialId: "1",
        _id: "7"
    },
    {
        title: "Spring WebMVC features",
        src: "https://www.youtube.com/watch?v=gnsO8-xJ8rs",
        duration: 42354,
        tutorialId: "1",
        _id: "8"
    }

];
const tutorials = [
    {
        _id: Id("1"),
        title: "JavaScript - The awesome language",
        description: "This is a course about JavaScript. Learn the basics and the most advanceed features of JavaScript and master the field of Full stack web development. In this course, we cover the fundamentals of loops, variables, functions, strings and collections. Then we delve into the field of object oriented Javascript and at the end we build a simple project using NodeJS and ExpressJS.",
        email: 'abc@example.com'
    },
    {
        _id: Id("2"),
        title: "Spring Framework",
        description: "This is a tutorial about Spring Framework. Before you embark on the journey to Spring, you need to learn Java Core and some Java EE features so that your journey will be smooth.",
        email: 'xyz@example.com'
        
    }
];

const ratings = [
    {
        stars: 4,
        byUser: "1",
        forTutorial: "2",
        _id: "1"
    },
    {
        stars: 3,
        byUser: "2",
        forTutorial: "1",
        _id: "2"
    },
    {
        stars: 1,
        byUser: "1",
        forTutorial: "2",
        _id: "3"
    },
    {
        stars: 2,
        byUser: "3",
        forTutorial: "1",
        _id: "4"
    }
];

exports.seeddata = function () {
    // Insert three users
    users.forEach(function(user) {
        Passwords.encryptPassword({
            password: user.password
        }).exec({
            error: (err) => {
                console.log('error encrypting: ', err);
            },
            success: (result) => {
                let gravatarUrl= "";
                try {
                    gravatarUrl = Gravatar.getImageUrl({
                        emailAddress: user.email
                    }).execSync();
                } catch(err) {
                    console.log('error getting gravatar: ', err);
                }

                let newUser = new User({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: result,
                    gravatarUrl: gravatarUrl
                });
                newUser.save((err, createdUser) => {
                    if(err) {
                        console.log('error creating user: ', err);
                    }
                    console.log('user created');
                });
            }
        });  
    });

    // Remove all tutorials
    // Tutorial.remove()
    // .then((done) => {
    //     console.log(done.result.n + " tutorials removed.");
    // })
    // .catch((err) => {
    //     console.log("Error removing tutorial ", err);
    // });
    // // Add two tutorials
    // tutorials.forEach((tutorial) => {
    //     var tut = tutorial;
    //     User.findOne({email: tutorial.email})
    //     .then((user) => {
    //         tut.owner = user._id;
    //         var newTutorial = new Tutorial(tut);
    //         newTutorial.save()
    //         .then((tutorial) => {
    //             console.log("Tutorial saved");
    //             // now link to 
    //             User.findById(tutorial.owner)
    //             .then((user) => {
    //                 user.tutorials.push(tutorial._id);
    //                 user.save()
    //                 .then((user) => {
    //                     if(!user) console.log('no user');
    //                     console.log("relationship established");
    //                 })
    //                 .catch(err => {
    //                     console.log('something went wrong establishing relations', err);
    //                 });
    //             });
    //         })
    //         .catch((err) => {
    //             console.log("Error saving tutorial" , err);
    //         });
    //     })
    //     .catch(err => {
    //         console.log('error occurred in finding user for tutorial', err);
    //     });
        
    // });

    // Add 


}