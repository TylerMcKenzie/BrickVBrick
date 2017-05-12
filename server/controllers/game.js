module.exports = {
  mainMenu: function(req, res) {
    res.render('game/mainMenu');
  },
  start: function(req, res) {
    res.render('game/play');
  }
}
