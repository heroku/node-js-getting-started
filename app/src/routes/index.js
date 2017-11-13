var express = require("express");
var router = express.Router();

var faces = require('./faces');
var login = require('./login');
var auth = require('./auth');
var init = require('./init');
var scrap = require('./scrap');

router.use('/api/faces', faces);
router.use('/login',login);
router.use('/auth',auth);
router.use('/init',init);
router.use('/scrap',scrap);
module.exports = router;