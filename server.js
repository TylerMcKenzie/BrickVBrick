// App
var express = require('express');

// Sessions
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Handles auth signin and signout
var passport = require('passport');

// Flash to send messages to client
var flash = require('connect-flash');

// Body parser parses xhr request data to req.body for easy usage
var bodyParser = require('body-parser');

// Use Path to locate static assets and config files
var path = require('path');

// ENV
var env = 'dev';

// For Route Logging
var morgan = require('morgan');

// Set PORT based on environment Production or local
var PORT = process.env.PORT || 3000;

// SESSION OPTIONS under SESSION managment
var sessionOptions = {
  secret: 'surehopethecanadianslikethis',
  resave: false,
  saveUninitialized: false
};

// Initialize EXPRESS APP -- Was going to use basic http routing but Express is faster to setup --
var app = express();

// Import and run PASSPORT CONFIG
require('./server/config/passport')(passport);

// ## DEV ##

console.log(' ___--- ENV ---___ ');
console.log(process.env.NODE_ENV);
console.log(' ___------___ ');
if(env === 'dev') {
  // Asset compiler and middleware for Express compatability
  var webpack = require('webpack');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackConfig = require('./webpack.dev.config');

  var compiler = webpack(webpackConfig);

  app.use(webpackHotMiddleware(compiler));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { color: true }
  }));

  // Log routing to console
  app.use(morgan('dev'));
} else {
  // ## PUBLIC STATIC folder client will read from in production ##

  // Set static directory to public which will be compiled by Webpack

  app.use(express.static(path.join(__dirname, 'public')));
}


// ## XHR managment ##

// Handle body parsing for xhr requests from app -- mostlikely Game data and such
app.use(bodyParser.json());

// If there were more config I need to pass to BODYPARSER I would move it to an easier to see variable
app.use(bodyParser.urlencoded({ extended: false }));

// ## VIEW ENGINE ##
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'server/views'));

// ## Session management ##

// Use cookie parser to parse cookise for express-session
app.use(cookieParser());

// Set express-session secret with SESSION OPTIONS
app.use(session(sessionOptions));


// Initialize PASSPORT
app.use(passport.initialize());

// Take over session management from EXPRESS SESSION
app.use(passport.session());

// Flash for messages sent from server
app.use(flash())


// Here I run the exported function from the routing section of the server folder and pass it the EXPRESS ROUTER and the configured PASSPORT variable for authentication
require('./server/routes')(app, passport);


// Start server listening on the PORT variable
app.listen(PORT);