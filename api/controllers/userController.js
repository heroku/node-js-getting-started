'use strict';

var util = require('util');
var db = require('../db')

module.exports = {
  usersPut: usersPut,
  usersGet: usersGet,
  users_database: users_database
};

function usersPut(req, res) {
  var id = req.swagger.params.userId.value;
  var firstName = req.swagger.params.userInfo.value.firstName;
  var lastName = req.swagger.params.userInfo.value.lastName;
  var birthMonth = req.swagger.params.userInfo.value.birthMonth;
  var birthDay = req.swagger.params.userInfo.value.birthDay;
  var birthYear = req.swagger.params.userInfo.value.birthYear;
  var birthDate = util.format('%d-%d-%d,', birthYear, birthMonth, birthDay);
  var email = req.swagger.params.userInfo.value.email;

  if ((birthDay>0 && birthDay<32) && (birthMonth>0 && birthMonth<13) && birthYear) {

    db.users.findById(id)
      .then(user => {
        if (user) {
          user.update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            birthDate: Date.parse(birthDate)
          })
          .then(() => {
            res.json({'message': 'OK'});
          })
          .catch(err => {
            console.log(err);
            res.json({'message': 'ERROR'}, 500);
          });
        } else {
          res.json({'message': 'User not found'}, 400);
        }
      });
  } else {
    res.json({'message': 'Wrong date'}, 400);
  }
}

function usersGet(req, res) {
  db.users
    .findAll()
    .then(users => {
      res.json(users)
    })
}
