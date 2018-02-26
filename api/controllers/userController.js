'use strict';

var util = require('util');
var db = require('../db')
var bcrypt = require('bcrypt');

module.exports = {
  usersPut: usersPut,
  usersLogin: usersLogin,
  usersSignup: usersSignup,
  usersLogout: usersLogout
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


function usersLogin(req, res) {
  var email    = req.swagger.params.userCredentials.value.email;
  var password = req.swagger.params.userCredentials.value.password;
  console.log("Username: " + email);
  console.log("Password: " + password);
  if (email && password) {
    db.users.findOne({ where: {email: email} })
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.hashword , function(error, result) {
            if (result === true) {
              //Create token
              var token = email + time + user.id;
              //Store token in auth_token table

              //Return token
              res.status(200).json({'token': `${token}`});
            } else {
              console.log('ERROR (email or) password is wrong');
              res.json({'message': 'ERROR (email or) password is wrong'}, 401);
            }
          });
        } else {
          res.json({'message': 'User not found'}, 400);
          //TODO go to /setup instead?
        }
    });
  } else {
    res.json({'message': 'ERROR email are password are required'}, 401);
  }
}

function usersSignup(req, res) {
  var email    = req.swagger.params.userInfo.value.email;
  var password = req.swagger.params.userInfo.value.password;
  console.log("Username: " + email);
  console.log("Password: " + password);
  if (email && password) {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        console.log(err);
        res.json({'message': 'ERROR (email or) password is wrong'}, 401);
      } else {
        user.hashword = hash;
        //Create user and store hash

        //Create token
        var token = email + time + user.id;
        //Store token in auth_token table

        //Return token
        res.status(200).json({'token': `${token}`});
      }
    });
  } else {
    res.json({'message': 'ERROR email and password are required'}, 401);
  }
  res.redirect('/login');
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
          res.json({'message': 'User not found'}, 400);
        }
    });
  } else {
    res.json({'message': 'ERROR email is required'}, 401);
  }
}
