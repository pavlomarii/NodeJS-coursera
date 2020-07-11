// Modules needed
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('../authenticate');
const User = require('../models/user');

// JSON-parsing
router.use(bodyParser.json());

// GET users listing
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// Route for register new users
router.post('/signup', (req, res, next) => {

    // Register user
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {

        // Error handler
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }

        // Successful registration
        else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration Successful!'})});
        }
    });
});

// Route for login users using local passport
router.post('/login', passport.authenticate('local'), (req, res) => {

    // Creating token for user
    var token = authenticate.getToken({_id: req.user._id});

    // Response with the token
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'})
});

// Route for logout users
router.get('/logout', (req, res, next) => {

    // Clear all info about session, logout and redirect to main route
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }

    // Error for user which is not logined yet
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

// Export this router to app.js
module.exports = router;