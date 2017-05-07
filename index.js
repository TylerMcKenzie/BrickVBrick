// App
var express = require('express');

// Sessions
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');

// Flash to send messages to client
var flash = require('connect-flash');

// Body parser parses xhr request data to req.body for easy usage
var bodyParser = require('body-parser');

// Use Path to locate static assets and config files
var path = require('path');


// For Route Logging
var morgan = require('morgan');

// Set PORT based on environment Production or local
var PORT = process.env.PORT || 3000,

// SESSION OPTIONS under SESSION managment
var sessionOptions = {
  secret: 'surehopethecanadianslikethis',
  resave: false,
  saveUninitialized: false
};

// Initialize EXPRESS APP -- Was going to use basic http routing but Express is faster to setup --
var app = express();

// ## DEV ##

// Log routing to console
app.use(morgan('dev'));

// ## XHR managment ##

// Handle body parsing for xhr requests from app -- mostlikely Game data and such
app.use(bodyParser.json());

// If there were more config I need to pass to BODYPARSER I would move it to an easier to see variable
app.use(bodyParser.urlencoded({ extended: false }));

// ## Session management ##

// Use cookie parser to parse cookise for express-session
app.use(cookieParser());

// Set express-session secret with SESSION OPTIONS
app.use(session(sessionOptions));

// Import and run PASSPORT CONFIG
require('./server/config/passport')(passport);

// Initialize PASSPORT
app.use(passport.initialize());

// Take over session management from EXPRESS SESSION
app.use(passport.session())

// ## PUBLIC STATIC folder client will read from ##

// Set static directory to public which will be compiled by Webpack
app.use(express.static(path.join(__dirname, 'public')));

// Here I run the exported function from the routing section of the server folder and pass it the EXPRESS APP and the configured PASSPORT variable
require('./server/routes')(app, passport);

// Start server listening on the PORT variable
app.listen(PORT);
