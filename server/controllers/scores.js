// This is where we setup controller actions which will be asociated with their respective routes later
var Score = require('../models').Score;
var User = require('../models').User;

module.exports = {
  list: function(req, res) {
    return Score
      .all({
        include: User // Include associated User
      })
      .then(function(scores) {

        // Sort Array Highest to lowest
        scores.sort(function(a, b) {
          return b.score - a.score
        });

        // Render list page passing the sorted scores
        res.render('score/list', { scores: scores});
      })
      .catch(function(err) {
        // If err send it for debug
        res.status(400).send(err);
      })
  }
}
