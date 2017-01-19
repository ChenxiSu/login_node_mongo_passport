var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var flash = require('connect-flash');

var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.url);

//Routing
var routes = require('./routes/index')(passport);

//app is an instance of express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set public folder for stylesheets/images
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(expressSession({secret: 'mySecretKey', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//Passport and passport strategy initilization
app.use(passport.initialize());
app.use(passport.session());
require('./passport/init')(passport);

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());

//global vars for flash messages
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});


// // Initialize Passport
// var initPassport = require('./passport/init');
// initPassport(passport);

app.use('/', routes);

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
  console.log("Server started on port"+ app.get('port'));
});




// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found....');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//  module.exports = app;