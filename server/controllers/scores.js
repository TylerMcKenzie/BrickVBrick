// This is where we setup controller actions which will be asociated with their respective routes later
var Score = require('../models').Score;
var User = require('../models').User;

module.exports = {
  list: function(req, res) {
    return Score
      .all({
        include: User
      })
      .then(function(scores) {
        res.render('score/list', { scores: scores});
      })
      .catch(function(err) {
        res.status(400).send(err);
      })
  }
}
