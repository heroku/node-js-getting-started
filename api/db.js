const Sequelize = require('sequelize');
const url = require('url');;
const usersModel = require('./models/user');
const tokensModel = require('./models/token')

var hostname = 'db';
var username = 'user';
var password = 'password';
var database = 'clproject';
var port = 5432;

databaseUrl = process.env.DATABASE_URL || '';
if (databaseUrl != '') {
  const parsedDatabaseUrl = url.parse(databaseUrl);
  hostname = parsedDatabaseUrl.hostname;
  username = parsedDatabaseUrl.username;
  password = parsedDatabaseUrl.password;
  database = parsedDatabaseUrl.pathname;
  port = parsedDatabaseUrl.port;
}

const sequelize = new Sequelize(database, username, password, {
  port: port,
  host: hostname,
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

var users = usersModel(sequelize);
var tokens = tokensModel(sequelize);
 
module.exports = {
  users: users,
  tokens: tokens
}
