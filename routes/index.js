const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');

/* GET home page actions. */
router.get('/', HomeController.index);

router.get('/users/signup', HomeController.signup);

router.get('/signin', HomeController.signin);

router.get('/tutorials', HomeController.getTutorials);


module.exports = router;
