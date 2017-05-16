// ## Logic for signup and sign in are in PASSPORT CONFIG ##
var User = require('../models').User;
var Score = require('../models').Score;

module.exports = {
  showHighScores: function(req, res) {
    // Find all users whose highscore is not equal to 0
    return User.all({ where: {
                  highScore: {
                    $ne: 0
                  }
                 }
               })
               .then(function(users) {
                //  Sort highScores high to low
                users.sort(function(a, b) {
                  return b.highScore - a.highScore
                })

                res.render('user/highscores', { users: users })
               })
               .catch(function(err) {
                 return res.status(400).send(err)
               })
  },
  addScore: function(req, res) {
    return User.findById(req.user.id)
               .then(function(user) {
                 if(!user) { // If no user 404
                   return res.status(404).send({ message: 'User Not Found.' })
                 }

                //  Build empty score and add data
                 var score = Score.build();

                 score.score = req.body.score
                 score.date = new Date()

                 if(user.highScore < req.body.score) { // If this score is new highscore update user
                   user.update({highScore: req.body.score})
                 }

                 // If score saves then associate it with the current user in session and catch all errs for debug
                 score.save()
                      .then(function(score) {
                        user.addScore(score)
                            .then(function(user) {
                              return res.status(200).send({ message: "Score saved."})
                            })
                            .catch(function(err) {
                              return res.status(400).send(err)
                            })
                      })
                      .catch(function(err) {
                        return res.status(400).send(err)
                      })
               })
  },
  retrieve: function(req, res) {
    if(req.user.id == req.params.id) {
      res.redirect('/profile');
    } else {
      return User.findById(req.params.id)
                 .then(function(user) {
                   if(!user) { // If no user 404
                     res.status(404).send({ message: "User does not exits."})
                   } else {
                     user.getScores()
                         .then(function(scores) {
                           res.render('user/profile', { user: user, userScores: scores });
                         })
                         .catch(function(err) {
                           return res.status(400).send(err)
                         })
                   }
                 })
                 .catch(function(err) {
                   res.status(400).send(err);
                 });
    }
  },
  update: function(req, res) {
    return User.findById(req.params.id)
          .then(function(user) {
            if(!user) { // If no user 404
              return res.status(404).send({ errorMessage: 'User Not Found.' })
            }

            // This update only updates username and email
            return user.update({
                          username: req.body.username || user.username,
                          email: req.body.email || user.email,
                        })
                        .then(function(user) {
                          return res.status(200).send(user);
                        })
                        .catch(function(err) {
                          return res.status(400).send(err);
                        });
          })
          .catch(function(err) {
            return res.status(400).send(err);
          })
  },
  deactivate: function(req, res) {
    // Find user and delete it
    return User.findById(req.params.id)
          .then(function(user) {
            if(!user) { // If no user 404
              return res.status(404).send({ errorMessage: 'User Not Found.' })
            }

            return user.destroy()
                       .then(function() {
                         return res.status(204).send({ successMessage: 'User Deactivated.' });
                       })
                       .catch(function(err) {
                         return res.status(400).send(err);
                       });
          })
          .catch(function(err) {
            return res.status(400).send(err);
          })
  }
}
