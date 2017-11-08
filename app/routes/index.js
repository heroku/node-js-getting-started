var express = require("express");
var router = express.Router();

var faces = require('./faces');

router.use('/api/faces', faces);

module.exports = router;