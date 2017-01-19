var login = require('./login');
var signup = require('./signup');
var facebookLogin = require('./facebookLogin');
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/user');

module.exports = function(passport){
    
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log("in serialize user");
        // this is a callback function, all the user data have been saved into 
        // req.user or req.passport.session.user, just like what 
        //you can see when you print out user
        //console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("in deserialize user");
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // pass passport as an argument to set up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    facebookLogin(passport);
    
}