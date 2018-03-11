const Sequelize = require('sequelize');
const AuthTokens = require('./authtokens.js');


module.exports = function(sequelize, DataTypes){
    var Users =  sequelize.define('users', {
    	id: {
    		type: Sequelize.BIGINT,
			autoIncrement: true,
    		primaryKey: true
    	},
  		firstName: { type: Sequelize.STRING, field: 'firstname' },
  		lastName: { type: Sequelize.STRING, field: 'lastname' },
		birthDate: { type: Sequelize.DATEONLY, field: 'birthdate' }, //Pass a string like 02-20-1972
		email: { type: Sequelize.STRING, field: 'email' },
		hashword: { type: Sequelize.STRING, field: 'hashword' }
	},
	{
		timestamps: false,
	});

  Users.hasMany(models.authtokens, {foreignKey: 'user_id', sourceKey: 'id'});

  return Users;
};
