'use strict';

var util = require('util');
var db = require('../db')

module.exports = {
  usersPut: usersPut
};

function usersPut(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.userId.value;
  console.log(req.swagger.params.userInfo);

  var firstName = req.swagger.params.userInfo.firstName;
  var lastName = req.swagger.params.userInfo.lastName;
  var birthMonth = req.swagger.params.userInfo.birthMonth;
  var birthDay = req.swagger.params.userInfo.birthDay;
  var birthYear = req.swagger.params.userInfo.birthYear;
  var birthDate = util.format('%d-%d-%d,', birthYear, birthMonth, birthDay);
  var email = req.swagger.params.userInfo.email;


  db.users.findById(id)
    .then(user => {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.birthDate = birthDate;
      user.save()
      res.json(200).json({'message': 'OK'})
    })
    .catch(err => {
      console.log(err);
      res.json(500).json({'message': 'ERROR'})
    });
}
