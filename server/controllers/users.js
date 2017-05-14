// Logic for signup and sign in are in PASSPORT CONFIG
var User = require('../models').User;
var Score = require('../models').Score;

module.exports = {
  addScore: function(req, res) {
    console.log('__________USER____________');
    return User.findById(req.user.id)
               .then(function(user) {
                 if(!user) {
                   return res.status(404).send({ message: 'User Not Found.' })
                 }

                 var score = Score.build();

                 score.score = req.body.score
                 score.date = new Date()

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
  addGameWon: function(req, res) {
    return User.findById(req.params.id)
        .then(function(user) {
          if(!user) {
            return res.status(404).send({ errorMessage: 'User Not Found.' })
          }

          return user.update({
                        gamesWon: user.gamesWon++,
                        gamesPlayed: user.gamesPlayed++
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
  addGameLost: function(req, res) {
    return User.findById(req.params.id)
        .then(function(user) {
          if(!user) {
            return res.status(404).send({ errorMessage: 'User Not Found.' })
          }

          return user.update({
                        gamesLost: user.gamesLost++,
                        gamesPlayed: user.gamesPlayed++
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
  addGamePlayed: function(req, res) {
    return User.findById(req.params.id)
        .then(function(user) {
          if(!user) {
            return res.status(404).send({ errorMessage: 'User Not Found.' })
          }

          return user.update({
                        gamesPlayed: user.gamesPlayed++
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
  retrieve: function(req, res) {
    if(req.user.id == req.params.id) {
      res.redirect('/profile');
    } else {
      return User.findById(req.params.id)
                 .then(function(user) {
                   if(user) {
                     res.render('user/profile', { user: user });
                   } else {
                     res.status(404).send({ message: "User does not exits."})
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
            if(!user) {
              return res.status(404).send({ errorMessage: 'User Not Found.' })
            }

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
    return User.findById(req.params.id)
          .then(function(user) {
            if(!user) {
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
