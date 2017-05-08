// Require User model from models
var User = require('../models').User;

// Require Strategy from passport-local to make new strategy
var LocalStrategy = require('passport-local').Strategy;

// export function to set PASSPORT config for EXPRESS SERVER
module.exports = (passport) => {
  // Set user id to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Destroy user session
  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    })
  });

  // Strategy for signup
  passport.use('local-signup', new LocalStrategy({ // this object is reassigning the usernameField for passport to look for in the req
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // this passes the req to the next callback so we have access to it.
  },
  function(req, email, password, done) {
    User.findOne({ // search database for user matching email
      where: {
        email: email
      }
    })
    .then((user) => {
      if(user) { // if user is found return flash message
        done(null, false, req.flash('signupMessage', 'That email already exists.'))
      } else {
        let newUser = User.build(); // Build empty user

        //  Start Constructing a user model
        newUser.email = email;
        newUser.username = req.body.username || "CommonUsername"; // if no username set to CommonUsername
        newUser.password = newUser.generateHash(password); // use instanceMethod to hash password

        // Save user
        newUser.save()
        .then(user => { // If user saved then return User for session
          done(null, user);
        })
        .catch(err => {console.log(err)}) // catch and log the error received
      }
    })
    .catch(err => {console.log(err)})// if error occurs log it.
  }));

  passport.use('local-signin', new LocalStrategy({ // same as signup options
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({
      where: {
        email: email
      }
    })
    .then(user => {
      if(!user) { // if no user return flash message
        return done(null, false, req.flash('signinMessage', 'No user found.'))
      }

      if(!user.validPassword(password)) {  // use instanceMethod validPassword to check if incoming password matches user password.
        return done(null, false, req.flash('signinMessage', 'Invalid password.'))
      }

      // if all goes well return user for session
      done(null, user);
    })
    .catch(err => {console.log(err)}) // if error catch and log.
  }));
};
