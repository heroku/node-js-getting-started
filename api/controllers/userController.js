'use strict';

var util = require('util');
var db = require('../db')
var bcrypt = require('bcrypt');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');

module.exports = {
  usersGet: usersGet,
  usersPut: usersPut,
  usersLogin: usersLogin,
  usersSignup: usersSignup,
  usersLogout: usersLogout
};

function usersGet(req, res) {
  db.users
    .findAll({
      attributes: [
        'firstName',
        'lastName',
        'birthDate',
        'email'
      ]
    })
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      console.log(err);
      res.json({'message': 'ERROR'}, 500);
    })
}

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
            res.json({'message': 'OK'}, 200);
          })
          .catch(err => {
            console.log(err);
            res.json({'message': 'ERROR'}, 500);
          });
        } else {
          res.json({'message': 'User not found'}, 401);
        }
      });
  } else {
    res.json({'message': 'Wrong date'}, 401);
  }
}
  
function usersLogin(req, res) {
  var email    = req.swagger.params.userCredentials.value.email;
  var password = req.swagger.params.userCredentials.value.password;
  if (email && password) {
    db.users.findOne({ where: {email: email} })
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.hashword)
            .then(result => {
             if (result) {
              //Create token
              var token = uuidV4();
              //Store token in auth_token table

              //Return token
              res.status(200).json({'token': `${token}`});
            } else {
              console.log('ERROR (email or) password is wrong');
              res.json({'message': 'ERROR (email or) password is wrong'}, 401);
            }
          });
        } else {
          res.json({'message': 'User not found'}, 401);
          //TODO go to /signup instead?
        }
    });
  } else {
    res.json({'message': 'ERROR email are password are required'}, 401);
  }
}

function usersSignup(req, res) {
  var firstName  = req.swagger.params.userInfo.value.firstName;
  var lastName   = req.swagger.params.userInfo.value.lastName;
  var birthMonth = req.swagger.params.userInfo.value.birthMonth;
  var birthDay   = req.swagger.params.userInfo.value.birthDay;
  var birthYear  = req.swagger.params.userInfo.value.birthYear;
  var birthDate  = util.format('%d-%d-%d,', birthYear, birthMonth, birthDay);
  var email      = req.swagger.params.userInfo.value.email;
  var password   = req.swagger.params.userInfo.value.password;
  //TODO add other profile fields

  if (email && password && firstName && lastName && ((birthDay>0 && birthDay<32) && (birthMonth>0 && birthMonth<13) && birthYear)) {
    //Create hash from password
    bcrypt.hash(password, 10)
      .then(hash => {
        //Find if already exists or create user and store hash
        db.users.findOrCreate({
            where: {email: email},
            defaults: {
              firstName: firstName,
              lastName: lastName,
              birthDate: Date.parse(birthDate),
              hashword: hash
            }
          })
          .spread(function(user, created){
            // this userId was either created or found depending upon whether the argment 'created' is true or false
            if (created) {
              if (user) {
                res.json({'message': 'User created.'}, 200);
              } else {
                console.log('User creation failed');
                res.json({'message': 'Server error.'}, 500);
              }
            } else {
              res.json({'message': 'Email already in use.'}, 400);
            }
          })
          .catch(err => {
            console.log(err);
            res.json({'message': 'Server error.'}, 500);
        });
      });
  } else {
    res.status(401).json({'message': 'ERROR email and password are required'});
  }
}

function usersLogout(req, res) {
  var email    = req.swagger.params.userCredentials.value.email;
  console.log("Username: " + email);
  if (email) {
    db.users.findOne({ where: {email: email} })
      .then(user => {
        if (user) {
          //Delete token from auth_token table
        } else {
          res.json({'message': 'User not found'}, 401);
        }
    });
  } else {
    res.json({'message': 'ERROR email is required'}, 401);
  }
}
function usersGet(req, res) {
  db.users
    .findAll({
      attributes: [
        'firstName',
        'lastName',
        'birthDate',
        'email'
      ]
    })
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      console.log(err);
      res.json({'message': 'ERROR'}, 500);
    })
}
