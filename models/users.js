var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
  }
});

userSchema.methods.generateHash = function(password, next) {
  return bcrypt.hash(password, bcrypt.genSaltSync(8), null, next);
};

// checking if password is valid
userSchema.methods.validPassword = function(password, next) {
  return bcrypt.compare(password, this.local.password, next);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
