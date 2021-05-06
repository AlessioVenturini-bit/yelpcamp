const express = require('express');
const router = express.Router();
const {
    isLoggedin
} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));


router.route('/login')
    .get(users.renderLogin)
    // !passport autheticate compare the original password with the hashed version save in the database and adds the user ID to the session
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), users.login);

router.get('/logout', users.logout);

module.exports = router;