'use strict';
// Require bcrypt for password hashing and checking
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    },
    email: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    },
    password: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    },
    gamesPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    gamesWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    gamesLost: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        // Association between a USER and its SCORE
        User.hasMany(models.Score, {
          foreignKey: 'userId',
          as: 'scores' // this will rename the asociation as SCORES so the asociation can be called as user.scores
        });
      }
    },
    instanceMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); // This will hash the given password and return that hash
      },
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password); // this will compare the given PASSWORD with this instance of USER's PASSWORD and return true or false
      },
      winLoseRatio: function() {
        var ratio = (this.gamesWon / (this.gamesWon+this.gamesLost));
        return ratio;
      }
    }
  });
  return User;
};
