'use strict';

var util = require('util');
var db = require('../db')

module.exports = {
  usersPut: usersPut,
  users_database: users_database
};

function usersPut(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.userId.value;
  var firstName = req.swagger.params.userInfo.firstName || 'John';
  var lastName = req.swagger.params.userInfo.lastName || 'Doe';
  var birthMonth = req.swagger.params.userInfo.birthMonth || 1;
  var birthDay = req.swagger.params.userInfo.xbirthDay || 1;
  var birthYear = req.swagger.params.userInfo.birthYear || 1970;
  var email = req.swagger.params.userInfo.email || 'john.doe@users.com';
  var response = util.format('User ID:%d,', id);
  response += util.format('firstName:%s,', firstName);
  response += util.format('lastName:%s,', lastName);
  response += util.format('birthDate:%d-%d-%d,', birthMonth, birthDay, birthYear);
  response += util.format('email:%s', email);

  res.json({'message': response});
}

function users_database(req, res) {
  db.users
    .findOne({ where: {name: 'Code Louisville Student One'} })
    .then(s => {
      res.json(util.format('Found this student in DB: %s', s.name));
    })
}
