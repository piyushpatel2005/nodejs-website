const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');

/* GET home page actions. */
router.get('/', HomeController.index);

router.get('/signup', HomeController.signup);

router.get('/signin', HomeController.signin);

router.get('/tutorials', HomeController.getTutorials);


/** UserController routes */
router.post('/users/signup', UserController.createUser);

router.get('/users/profile', UserController.viewProfile);

router.put('/users/signin', UserController.login);


module.exports = router;
