const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    return sequelize.define('code_louisville_students', {
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