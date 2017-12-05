const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = {
  signup: require('../validations/signup.js')
};

const UserController = require('../controllers/UserController');

/** UserController routes */
router.post('/signup', validate(validation.signup), UserController.createUser);

router.get('/profile', UserController.viewProfile);

module.exports = router;
