// App
var express = require('express');

// Sessions
var session = require('express-session');
// var cookieParser = require('cookie-parser');

// Handles auth signin and signout
var passport = require('passport');

// Flash to send messages to client
var flash = require('connect-flash');

// Body parser parses xhr request data to req.body for easy usage
var bodyParser = require('body-parser');

// Use Path to locate static assets and config files
var path = require('path');

// ENV
var env = process.env.NODE_ENV;


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

if(env === 'development') {
  // Asset compiler and middleware for Express compatability
  // For Route Logging
  var morgan = require('morgan');
  var webpack = require('webpack');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackConfig = require('./webpack.dev.config');

  var compiler = webpack(webpackConfig);

  app.use(webpackHotMiddleware(compiler));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
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
// app.use(cookieParser());

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

// ## SOCKETS ##

// SocketIo for WebSockets
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// Games List
var gameList = []


io.on('connection', function(socket) {
  // console.log('Client -- %s -- connected to the server', socket.id);

  socket.on('make game', function() {
    var gameId = (Math.random()+1).toString(32).slice(2,18);

    var game = {
        gameId: gameId,
        playerOne: socket.id,
        playerTwo: null
    }

    gameList.push(game)

    io.emit('waiting for opponent')
  })

  socket.on('join game', function(playerId) {
    if(gameList.length) {
      for(var i=0; i<gameList.length;i++) {
        if(!gameList[i].playerTwo) {
          gameList.playerTwo = socket.id

          io.emit('start game', gameList[i])

          break;
        }
      }
    } else {
      socket.emit('make game')
    }
  })

  socket.on('disconnect', function() {
    io.sockets.in('room-'+roomNum).emit('playerDisconnect');
  })
})


// Start server listening on the PORT variable
server.listen(PORT);
