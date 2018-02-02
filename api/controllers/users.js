'use strict';

var util = require('util');
var db = require('../db')

module.exports = {
  usersPut: usersPut,
  usersGet: usersGet,
  users_database: users_database
};

function usersPut(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.userId.value;
  var firstName = req.swagger.params.userInfo.firstName;
  var lastName = req.swagger.params.userInfo.lastName;
  var birthDate = req.swagger.params.userInfo.birthDate;
  var email = req.swagger.params.userInfo.email;
  var response = util.format('User %d!', id);

  res.json({'message': response});
}

function users_database(req, res) {
  db.codeLouisvilleStudents
    .findOne({ where: {name: 'Code Louisville Student One'} })
    .then(s => {
      res.json(util.format('Found this student in DB: %s', s.name));
    })
}

function usersGet(req, res) {
  //define variables expected in users object
}
