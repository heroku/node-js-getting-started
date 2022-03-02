
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { status } = require('express/lib/response');
var app = express();
var router = express.Router();

app.get("/getData", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });


var port = 8000;
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log(`app listening at http://localhost:${port}`)
})
