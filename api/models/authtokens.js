const Sequelize = require('sequelize');
const User = require('./user');



module.exports = function(sequelize, DataTypes){
    var AuthTokens = sequelize.define('authtokens', {
        token: { type: Sequelize.STRING, primaryKey: true, field: 'token' },
        expiration: { type: Sequelize.DATE, primaryKey: true, field: 'expiration' },
    	  user_id: { type: Sequelize.BIGINT, primaryKey: true, field: 'user_id' },
	},
	{
		timestamps: false,
	});
  AuthTokens.associate = function(models){
    models.AuthTokens.belongsTo(models.Users, {
      foreignKey: 'user_id',
      targetKey: 'id'});
  };
  return AuthTokens;
};
