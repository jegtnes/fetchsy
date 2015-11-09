var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    message: req.flash('message')
  });
});

router.get('/shop/:shop', function() {
  var rssURL = "https://www.etsy.com/shop/" + req.shop + "/rss";
});

router.get('/register', function(req, res) {
  res.render('register', {
      title: 'Register',
      message: req.flash('message')
  });
});

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login',
    message: req.flash('message')
  });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', { title: 'Profile', user: req.user });
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

// Middleware function to chuck you away if you're not logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('message', 'You must be logged in to view this page.')
    res.redirect('/');
  }
}


module.exports = router;
