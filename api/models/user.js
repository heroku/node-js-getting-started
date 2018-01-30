const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    return sequelize.define('users', {
    	id: {
    		type: Sequelize.BIGINT,
    		primaryKey: true
    	},
  		name: Sequelize.STRING
	},
	{
		timestamps: false,
	})
};