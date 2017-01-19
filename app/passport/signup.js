var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            var findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with the submitted email: '+ email);
                        //return done(null, false, req.flash('message', 'User Already Exists'));
                        return done(null, false, {message: 'User Already Exists'});
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.firstName = req.body.firstName;
                        newUser.local.lastName = req.body.lastName;
                        newUser.local.email = email;
                        newUser.local.password = createHash(password);
                        
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+ err);  
                                throw err;  
                            }
                            console.log('User Registration succesfully');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    function createHash(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}