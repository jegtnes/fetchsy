// config/passport.js
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('signup', new LocalStrategy({
	  usernameField: 'email',
	  passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {

    // If already signed up
		User.findOne({
			'email': email
		}, function(err, user) {
			if (err) {
        return done(err);
      }

			if (user) {
        console.log('email already taken');
				return done(null, false, req.flash('message', 'That email is already taken.'));
			} else {

				var newUser = new User();

				newUser.email = email;
				newUser.password = newUser.generateHash(password);

				newUser.save(function(err) {
					if (err) {
						return done(err);
					}
					return done(null, newUser);
				});
			};
		});
	}));

	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {

		User.findOne({
			'email': email
		}, function(err, user) {
			if (err) {
        return done(err);
      }

			if (!user) {
        return done(null, false, req.flash('message', 'No user found.'));
      }

			if (!user.validPassword(password)) {
        return done(null, false, req.flash('message', 'Oops! Wrong password.'));
      }

			return done(null, user);
		});
	}));
};
