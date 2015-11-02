var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.get('/profile', function(req, res) {
  res.render('profile', { title: 'Profile' });
});

// process the signup form
router.post('/signup', passport.authenticate('signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));

router.post('/login', passport.authenticate('login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));


module.exports = router;
