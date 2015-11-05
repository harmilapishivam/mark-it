//required packeges
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '423338834538362';
var FACEBOOK_APP_SECRET = '1da8a9a3a796cc6de1fa4ab10444cdba';

//initialize app
var app = express();
//initialize app ends
app.use(passport.initialize());
app.use(passport.session());

//public directory
app.use(express.static(path.join(__dirname, 'public')));

//routes
var user = require('./routes/user');
var routes = require('./routes/index');
//routes end


app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/home'
}));

//routes
app.use('/user', user);
app.use('/', routes);
//routes end

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:8080/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
    //Assuming user exists
    console.log(profile);
    done(null, profile);
  });
}));
//required packeges end

//db manager
//var db = require('./tools/database/database').db;
//db manager ends

//fevicon
app.use(favicon(__dirname + '/public/favicon.ico'));

//logger
app.use(logger('dev'));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//body parser ends

//coockie parser
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({response:res});
});

//create server
var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app is listening to http://%s:%s', host, port);
});

module.exports = app;