const Sequelize = require('sequelize');
const usersModel = require('./models/user')

const sequelize = new Sequelize('clproject', 'user', 'password', {
  host: 'db',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

var users = usersModel(sequelize)

module.exports = {
  users: users 
}