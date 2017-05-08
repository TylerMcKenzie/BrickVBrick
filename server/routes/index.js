// Require our model's controllers
var usersController = require('../controllers/users');
var scoresController = require('../controllers/scores');

// Signin helper
function isSignedIn(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/signin');
  }
};

// View url cuz Im lazy
var views = function(url) {
  return '../views/'+url;
}

// Apply controller functions to correct routes
module.exports = function(app, passport) {
  // Root redirects to signin/signup
  app.get('/', isSignedIn, function(req, res) {
    res.redirect('/profile');
  });

  // ## SESSION ROUTES ##

  // Can't use signin helper here check if authenticated or render signin template
  app.get('/signin', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      var signInFlash = req.flash('signinMessage');
      var signUpFlash = req.flash('signupMessage');

      res.render(views('signin'), { signUpMessage: signUpFlash, signInMessage: signInFlash });
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
  app.post('signup', passport.authenticate('local-signup', {
    successRedirect: '/activate',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  // ## USER ROUTES ##

  // User profile only accessable if logged in
  app.get('/profile', isSignedIn, function(req, res) {
    res.render(views('user/profile'), { user: req.user })
  });

  //Update user attributes found with param :id
  app.put('user/:id', usersController.update);

  // Delete user subbed deactivate
  app.delete('user/:id', usersController.deactivate);

  // 


};
