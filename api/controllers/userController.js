'use strict';

var util = require('util');
var db = require('../db')

module.exports = {
  usersPut: usersPut
};

function usersPut(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var id = req.swagger.params.userId.value;
  var firstName = req.swagger.params.userInfo.schema.firstName;
  var lastName = req.swagger.params.userInfo.schema.lastName;
  var birthMonth = req.swagger.params.userInfo.schema.birthMonth;
  var birthDay = req.swagger.params.userInfo.schema.birthDay;
  var birthYear = req.swagger.params.userInfo.schema.birthYear;
  var birthDate = util.format('%d-%02d-%02d,', birthYear, birthMonth, birthDay);
  var email = req.swagger.params.userInfo.schema.email;

  db.users.findById(id)
    .then(user => {
      if (user) {
        user.update({
          firstName: firstName,
          lastName: lastName,
          email: email,
          //birthDate: Date.parse(birthDate)
        })
        .then(() => {
          
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({'message': 'ERROR'})
        });
      } else {
        res.status(400).send({'message': 'User not found'})
      }

      user.save()
      res.json({'message': 'OK'})
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({'message': 'ERROR'})
    });
}
