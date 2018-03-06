const Sequelize = require('sequelize');
const User = require('./users');


module.exports = function(sequelize, DataTypes){
  const AuthToken = sequelize.define('authtokens', {
    token: { type: Sequelize.STRING},
    expiration: { type: Sequelize.DATE},
  },
  {
    timestamps: false
  });

  AuthToken.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
  return AuthToken;
};
