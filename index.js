'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/test');

var app = express();
app.set('port', (process.env.PORT || 3000));
app.set('jwtTokenSecret', process.env.JWT_SECRET || 'developmentsecret');

app.use(passport.initialize());
require('./lib/passport')(passport);

var jwtauth = require('./lib/jwtauth')(app);
var expired = require('./lib/expired')(app);
app.use(bodyparser.json());
require('./routes/user-routes')(app, passport);
require('./routes/notes_routes')(app, jwtauth.auth, expired);

app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'));
