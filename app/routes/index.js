var express = require('express');
var router = express.Router();
var User = require('../models/user');	

var graph = require('fbgraph');

// Generates hash using bCrypt
function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(passport){

	// =====================================
    // ===LOCAL ROUTES =====================
    // =====================================
	router.get('/', function(req, res) {
	    res.render('index', { title: 'Floureer', message: req.app.locals.error });
	});

	router.post('/signup', 
		passport.authenticate('signup', {
			failureRedirect: '/',
			failureFlash : true
		}),
		function(req, res){
			console.log("sucess register");
			console.log(req.user);
			res.render('home', {title: "home", name: req.user.local.firstName});
	});

	router.post('/login',
		passport.authenticate('login', {failureRedirect: '/', failureFlash: true} ), //failureRedirect: '/',
		function(req, res) {
			console.log("let's see req.logOut()");
			console.log(req.logout);
	  		res.render('home', {title: "home", email: req.user.email, name: req.user.local.firstName});
	});

	router.get('/home', function(req, res){
		console.log(req);
		res.render('home', {title: "home", name: "test purpose"});//, email: req.user.email
	});

	// =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebookLogin', {scope: 'user_friends,user_posts,email,user_photos'}));

    router.get('/auth/facebook/callback',
    	passport.authenticate('facebookLogin',{
            failureRedirect : '/'
    	}),
    	function(req, res){
    		console.log("facebook login succeed");

    		//let's try to access the newly logged in user's info on facebook using api
    		console.log(req.user.facebook);
    		graph.setAccessToken(req.user.facebook.token);
    		
    		var params = { fields: "friends,picture,name,posts"};

    		graph.get(req.user.facebook.id, params, function(err, fb_res) {
    			console.log("aaaaaaaaaaaaaa");
  				console.log(fb_res.picture.data.url); // { id: '4', name: 'Mark Zuckerberg'... }
  				res.render('home', {title: "home", name: req.user.facebook.name, userProfileImg: fb_res.picture.data.url});
			});
    		
    });



	
	// router.post('/signup', function(req, res){
	// 		var firstName = req.body.firstName;
	// 		var lastName = req.body.lastName;
	// 		var email = req.body.email;
	// 		var password = req.body.password;
	// 		var confirmedPassword = req.body.confirmedPassword;

	// 		//Validation- empty not allowed are implemented at front-end
	// 		req.checkBody("firstName", "First Name is required").notEmpty();
	// 		req.checkBody('lastName', 'Email is required').notEmpty();
	// 		req.checkBody('email', 'Email is not valid').isEmail();
	// 		//req.checkBody('username', 'Username is required').notEmpty();
	// 		req.checkBody('password', 'Password is required').notEmpty();
	// 		req.checkBody('confirmedPassword', 'Passwords do not match').equals(req.body.password);


	// 		var errors = req.validationErrors();

	// 		if(errors){
	// 			res.render('index',{errors: errors});
	// 		}else{
	// 			var newUser = new User({
	// 				firstName: firstName,
	// 				lastName: lastName,
	// 				email:email,
	// 				phoneNumber: ''
	// 			});
	// 			newUser.password = createHash(password);
	// 			User.save(newUser, function(err, user){
	// 				if(err) throw err;
	// 				console.log(user);
	// 			});

	// 			req.flash('success_msg', 'You are registered and can now login');
	// 			res.render('home', {title: "home", email: email, firstName: firstName});
	// 		}


	// 		//res.render('home', {title: "home", email: req.user.email, firstName: req.user.firstName});
	// });

	return router;
}
