const Sequelize = require('sequelize');

model.exports = function(sequelize, DataTypes){
  return sequelize.define('authtokens', {
    token: { type: Sequelize.STRING},
    expiration: { type: Sequelize.DATE},
  },
  {
    timestamps: false
  });
};
