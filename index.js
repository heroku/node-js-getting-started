'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');
require('./routes/notes_routes')(app);
app.listen(app.get('port'));
