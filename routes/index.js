const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');
const TutorialController = require('../controllers/TutorialController');
const RatingController = require('../controllers/RatingController');
const VideoController = require('../controllers/VideoController');

const isLoggedIn = require('../middlewares/isLoggedIn');

/* GET home page actions. */
router.get('/', HomeController.index);

router.get('/signup', HomeController.signup);

router.get('/signin', HomeController.signin);

router.get('/tutorials', HomeController.getTutorials);


/** UserController routes */
router.post('/users/signup', UserController.createUser);

router.get('/users/profile', UserController.viewProfile);

router.put('/users/signin', UserController.login);

router.get('/users/logout', UserController.logout);

/** TutorialController routes */

router.get('/tutorials/add', TutorialController.showAddTutorialPage);

router.post('/tutorials/add', isLoggedIn, TutorialController.createTutorial);

module.exports = router;
