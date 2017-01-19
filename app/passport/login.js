var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) { 
            console.log("in passport login");
            // check in mongo if a user with username exists or not
            User.findOne({ 'local.email' :  email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with email address' + email);
                        // return done(null, false, req.flash('message', 'User Not found.'));  
                        return done(null, false, {message: 'User Not found.'});               
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, 
                        	{message: 'Invalid Password'}
                        ); 
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    console.log("valid user!");
                    console.log(user);
                    return done(null, user);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
    	console.log(password);
    	console.log(user.local.password);
        return bCrypt.compareSync(password, user.local.password);
    }
    
}