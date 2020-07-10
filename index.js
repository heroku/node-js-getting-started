const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const request = require('request');

request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/table', (req, res) => res.render('pages/table'))
  .get('/data', function(req, res){
var https = require('follow-redirects').https;
var fs = require('fs');

var qs = require('querystring');

var options = {
  'method': 'POST',
  'hostname': 'mycorsprox.herokuapp.com',
  'path': '/https://oauth.izettle.com/token?',
  'headers': {
    'X-Requested-With': '*',
    'Origin': 'null',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    res.send(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = qs.stringify({
  'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  'client_id': 'a0a378da-a98c-11ea-91ee-01dae521f2fa',
  'assertion': 'eyJraWQiOiIwIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJpWmV0dGxlIiwiYXVkIjoiQVBJIiwiZXhwIjoyNTM4MzMwOTgwLCJzdWIiOiI0MjQzNjNkZS0zNmMwLTExZWEtYjNkYi1iMzAwN2NjNDc0ZTMiLCJpYXQiOjE1OTE2MjMyMDQsInJlbmV3ZWQiOmZhbHNlLCJzY29wZSI6WyJXUklURTpQQVlNRU5UIiwiUkVBRDpQUk9EVUNUIiwiUkVBRDpQVVJDSEFTRSIsIlJFQUQ6Q1VTVE9NRVIiLCJSRUFEOlBBWU1FTlQiLCJXUklURTpGSU5BTkNFIiwiV1JJVEU6UkVGVU5EMiIsIlJFQUQ6VVNFUklORk8iLCJXUklURTpQVVJDSEFTRSIsIldSSVRFOkNVU1RPTUVSIiwiV1JJVEU6T05MSU5FUEFZTUVOVCIsIlJFQUQ6RklOQU5DRSIsIldSSVRFOlBST0RVQ1QiLCJXUklURTpVU0VSSU5GTyIsIldSSVRFOlJFRlVORCIsIlJFQUQ6T05MSU5FUEFZTUVOVCJdLCJ1c2VyIjp7InVzZXJUeXBlIjoiVVNFUiIsInV1aWQiOiI0MjQzNjNkZS0zNmMwLTExZWEtYjNkYi1iMzAwN2NjNDc0ZTMiLCJvcmdVdWlkIjoiNDI0MWIzZjQtMzZjMC0xMWVhLTg5ZjEtMDRmZGFiN2FkMjhmIiwidXNlclJvbGUiOiJPV05FUiJ9LCJ0eXBlIjoidXNlci1hc3NlcnRpb24iLCJjbGllbnRfaWQiOiJhMGEzNzhkYS1hOThjLTExZWEtOTFlZS0wMWRhZTUyMWYyZmEifQ.rC8gc5LHSA4u1l2n2K0pOzMtdLRtzJQQCriAexOtlpKJyQxcj0uTKqYySscMXGg3mqbnHSrARCdbFsZXdj6JQ7CO4-BpP_WO_n0Mrd4RvrrJ6ooGS-uO6TMsTkEJrY_JpJVyMAm_G2rB6_vZsqjgg4btBlCT4n4hvznpgRrX2_eOElXGWmkV0BaaTkxBsQedttU_ZP14NCVQ85W6tMvtndD5J5k5nme45a5oo8Mj_FoCOciQG4g4JUhL4kcKcT0dO7jJYKsrQVa9uk5D24ieVQF8vsjmjTkIt8vacJzPtntW9y3wyQV4IojH29yxKUzJsJDRCbBLTBn7JGJCI2CCqg',
  '': ''
});

req.write(postData);

req.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
