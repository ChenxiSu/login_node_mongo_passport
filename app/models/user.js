var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	local      		:{
		firstName	: String,
		lastName	: String,
		password	: String,
		email		: String,
		phoneNumber : String
	},

	facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
    
});

