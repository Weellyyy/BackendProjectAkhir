const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// Route login
router.post('/login', authController.login);

// Route register user
router.post('/register', authController.register);

module.exports = router;
