module.exports = {
  mainMenu: function(req, res) {
    // Render Game Main Menu layout
    res.render('game/mainMenu');
  },
  start: function(req, res) {
    // Render Game Play layout
    res.render('game/play', { token: req.csrfToken(), email: req.user.email });
  },
  multiplayer: function(req, res) {
    // Render Multiplayer Layout
    res.render('game/multiplayer');
  }
}
