var express = require("express");
var router = express.Router();

var faces = require('./faces');
var login = require('./login');
var auth = require('./auth');

router.use('/api/faces', faces);
router.use('/login',login);
router.use('/auth',auth);
module.exports = router;