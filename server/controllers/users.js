// Logic for signup and sign in are in PASSPORT CONFIG
var User = require('../models').User;

module.exports = {
  addGameWon: function(req, res) {
    User.findById(req.params.id)
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
    User.findById(req.params.id)
        .then(function(user) {
          if(!user) {
            return res.status(404).send({ errorMessage: 'User Not Found.' })
          }

          return user.update({
                        gamesLost: user.gamesLost++
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
    User.findById(req.params.id)
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
  update: function(req, res) {
    User.findById(req.params.id)
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
    User.findById(req.params.id)
        .then(function(user) {
          if(!user) {
            return res.status(404).send({ errorMessage: 'User Not Found.' })
          }

          return user.destroy()
                     .then(function() {
                       return res.status(204).send({ successMessage: 'User Deactivated.' });
                     })
                     .catch(funciton(err) {
                       return res.status(400).send(err);
                     });
        })
        .catch(function(err) {
          return res.status(400).send(err);
        })
  }
}
