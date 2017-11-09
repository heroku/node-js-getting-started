var express = require("express");
var router = express.Router();

var faces = require('./faces');
var login = require('./login');

var prefix_url = '/api';

router.use( prefix_url + '/faces', faces);
router.use( prefix_url + '/login',login);

module.exports = router;