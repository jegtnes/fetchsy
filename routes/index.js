var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    message: req.flash('message')
  });
});

router.post('/shop/', function(req, res, next) {
  var rssURL = "https://www.etsy.com/shop/" + req.body.shopName + "/rss";

  request({
    uri: rssURL,
    followRedirect: false
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
    else if (response.statusCode == 404) {
      console.log("Canny find the seller mate. You sure they've a shop?");
    }
    else {
      console.log('here pal. unknown error. sorry and that');
    }
  });
})

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
