// Require our model's controllers
var usersController = require('../controllers/users');
var scoresController = require('../controllers/scores');
var gamesController = require('../controllers/game');

// Signin helper
var isSignedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    res.locals.current_user = req.user;
    res.locals.signedIn = true;
    next();
  } else {
    res.redirect('/signin');
  }
};

// Apply controller functions to correct routes
module.exports = function(app, passport) {
  // Root redirects to signin/signup
  app.get('/', isSignedIn, function(req, res) {
    res.redirect('/profile', { user: res.locals.current_user });
  });

  // ## SESSION ROUTES ##

  // Can't use signin helper here check if authenticated or render signin template
  app.get('/signin', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      var signInFlash = req.flash('signinMessage');
      var signUpFlash = req.flash('signupMessage');

      res.render('user/signin', { signUpMessage: signUpFlash, signInMessage: signInFlash });
    }
  });

  // Use passport as route function to signin user and handle redirect
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  // ## SIGN UP ROUTES ##

  // Use passport as route function to signup user and handle redirect
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  // ## USER ROUTES ##

  // User profile only accessable if logged in
  app.get('/profile', isSignedIn, function(req, res) {
    res.render('user/profile', { user: res.locals.current_user });
  });

  // User Signout
  app.get('/signout', isSignedIn, function(req, res) {
    req.logout();
    res.redirect('/signin');
  })

  // Get a user's profile -- not the current user
  app.get('/user/:id', isSignedIn, usersController.retrieve);

  //Update user attributes found with param :id
  app.put('/user/:id', isSignedIn, usersController.update);

  // Delete user subbed deactivate
  app.delete('/user/:id', isSignedIn, usersController.deactivate);

  // Add Score to User
  // app.post('/user/:id/score/new', usersController.addScore);

  // ## SCORES ROUTES ##

  // Get all scores
  app.get('/scores', isSignedIn, scoresController.list);


  // ## GAME ROUTES ##

  // Get Game menu
  app.get('/game', isSignedIn, gamesController.mainMenu);

  // Start a Game
  app.get('/game/play', isSignedIn, gamesController.start);

};
