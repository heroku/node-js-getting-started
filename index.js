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

var data;
function myRequest() {
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://mydbrestservice.herokuapp.com/orders',
  'headers': {
    'Prefer': 'resolution=ignore-duplicates'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
  data = (response.body);
});
return data;
}

var mydata = myRequest(); 
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/table', (req, res) => res.render('pages/table'))
  .get('/data', (req, res) => res.render('pages/table', {arequest: data}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
