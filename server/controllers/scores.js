// This is where we setup controller actions which will be asociated with their respective routes later
var Score = require('../models').Score;

module.exports = {
  list: function(req, res) {
    return Score
      .all()
      .then(function(scores) {
        res.render('score/list', { scores: scores});
      })
      .catch(function(err) {
        res.status(400).send(err);
      })
  }
}
