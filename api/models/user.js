const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    return sequelize.define('users', {
    	id: {
    		type: Sequelize.BIGINT,
    		primaryKey: true
    	},
  		firtName: Sequelize.STRING,
  		lastName: Sequelize.STRING,
		birthDate: Sequelize.DATEONLY, //Pass a string like 02-20-1972
		email: Sequelize.STRING
	},
	{
		timestamps: false,
	})
};
