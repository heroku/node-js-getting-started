const Sequelize = require('sequelize');
const AuthToken = require('authtokens');

module.exports = function(sequelize, DataTypes){
    const User = sequelize.define('users', {
    	id: {
    		type: Sequelize.BIGINT,
    		primaryKey: true
    	},
  		firstName: { type: Sequelize.STRING, field: 'firstname' },
  		lastName: { type: Sequelize.STRING, field: 'lastname' },
		birthDate: { type: Sequelize.DATEONLY, field: 'birthdate' }, //Pass a string like 02-20-1972
		email: Sequelize.STRING
	},
	{
		timestamps: false,
	});
  User.hasMany(AuthTokens, {foreignKey: 'user_id', sourceKey: 'id'});
  return User;
};
