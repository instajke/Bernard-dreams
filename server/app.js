'use strict';

// Set default environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_DIR = __dirname + '/config/';

var express = require('express');
var config = require('config');
var cors = require('cors');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var session      = require('express-session');
var flash    = require('connect-flash');

var session = require('express-session');



/**
 * MongoDB configurations
 */
var mongodbUrl = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME;

// Database options
// Option auto_reconnect is defaulted to true
var dbOptions = {
  server: {
    reconnectTries: -1, // always attempt to reconnect
    socketOptions: {
      keepAlive: 120
    }
  }
};

// Events on db connection
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error. Please make sure MongoDB is running. -> ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.error('MongoDB connection disconnected.')
});

mongoose.connection.on('reconnected', function() {
  console.error('MongoDB connection reconnected.')
});

// Connect to db
var connectWithRetry = function() {
  return mongoose.connect(mongodbUrl, dbOptions, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec. -> ' + err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};

connectWithRetry();

require('./src/passport')(passport); // pass passport for configuration

/**
 * Express app configurations
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// Enable CORS
app.use(cors());

// required for passport
app.use(session({
  secret: 'lookatmyhorsemyhorseishekarim', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Bootstrap routes
var routes = require('./src/routes')(app, passport);

// Static files
app.use('/', express.static(__dirname + '/../public'));

// Once database open, start server
mongoose.connection.once('open', function callback() {
  console.log('Connection with database succeeded.');
  app.listen(config.APP_PORT, function() {
    console.log('app listening on port %d in %s mode', this.address().port, app.settings.env);
  });
});

module.exports = app;
