'use strict';

var util = require('util');
var db = require('../db')

module.exports = {
  hello: hello,
  hello_database: hello_database
};

function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  res.json({'message': hello});
}

function hello_database(req, res) {
  db.codeLouisvilleStudents
    .findOne({ where: {name: 'Code Louisville Student One'} })
    .then(s => {
      res.json(util.format('Found this student in DB: %s', s.name));
    })
}
