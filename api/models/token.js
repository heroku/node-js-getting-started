const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    return sequelize.define('authtokens', {
        token: { type: Sequelize.STRING, primaryKey: true, field: 'token' },
        expiration: { type: Sequelize.DATE, primaryKey: true, field: 'expiration' },
    	user_id: { type: Sequelize.BIGINT, primaryKey: true, field: 'user_id' },
	},
	{ 
		timestamps: false,
	})
};
