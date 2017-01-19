var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
// load the auth variables
var configAuth = require('../config/auth').facebookAuth;

module.exports = function(passport){
	passport.use(
		'facebookLogin', 
		new FacebookStrategy(
			{
				clientID: configAuth.clientID,
    			clientSecret: configAuth.clientSecret,
    			callbackURL: configAuth.callbackURL
			},
			// facebook will send back the token and profile
			function(token, refreshToken, profile, done){
				console.log("Feedback from facebook");
				console.log(profile);
				// asynchronous
        		process.nextTick(function(){
        			User.findOne({'facebook.id': profile.id} , function(err, user){
        				if(err) return done(err);
        				if(user){
        					console.log('User has been found');
        					return done(null, user);//user has been found, return
        				}else{
        					var newUser = new User();
        					newUser.facebook.id = profile.id;//set the user facebook id
        					newUser.facebook.token = token;
        					newUser.facebook.name = profile.displayName;

        					newUser.save(function(err){
        						if(err){
        							throw err;
        						}
        						return done(null, newUser);
        					})
        				}
        			})
        		});
			}
		)
	)
}