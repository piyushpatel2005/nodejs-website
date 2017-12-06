const express = require('express');
const router = express.Router();


const UserController = require('../controllers/UserController');

/** UserController routes */
router.post('/signup', UserController.createUser);

router.get('/profile', UserController.viewProfile);

module.exports = router;
