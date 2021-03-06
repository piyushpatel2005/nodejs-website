const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');
const TutorialController = require('../controllers/TutorialController');
const RatingController = require('../controllers/RatingController');
const VideoController = require('../controllers/VideoController');

const isLoggedIn = require('../middlewares/isLoggedIn');
const isLoggedOut = require('../middlewares/isLoggedOut');
const haveSessionId = require('../middlewares/haveSessionId');
// router.all('*', haveSessionId);

/* GET home page actions. */
router.get('/', HomeController.index);

router.get('/signup', isLoggedOut, HomeController.signup);

router.get('/signin', isLoggedOut, HomeController.signin);

router.get('/tutorials', HomeController.getTutorials);


/** UserController routes */
router.post('/users/signup', UserController.createUser);

router.get('/users/logout', isLoggedIn, UserController.logout);

router.get('/users/:id', UserController.viewProfile);

router.put('/users/signin', UserController.login);


/** TutorialController routes */

router.get('/tutorials/add', isLoggedIn, TutorialController.showAddTutorialPage);

router.post('/tutorials', isLoggedIn, TutorialController.createTutorial);

router.get('/tutorials/:id', TutorialController.showTutorial);

router.get('/tutorials/:id/edit-tutorial', TutorialController.showEditTutorialPage);

router.put('/tutorials/:id', TutorialController.editTutorial);


/** VideoController routes */

router.post('/tutorials/:tutorialId/videos', VideoController.addVideo);

router.get('/tutorials/:tutorialId/videos/:id', VideoController.viewVideo);

router.delete('/tutorials/:tutorialId/videos/:id', VideoController.deleteVideo);

router.put('/tutorials/:tutorialId/videos/:id', VideoController.editVideo);

router.get('/tutorials/:tutorialId/videos/:id/edit-video', VideoController.showEditVideoPage);

/** RatingController routes */

router.post('/tutorials/:tutorialId/ratings', RatingController.rateTutorial);

module.exports = router;
