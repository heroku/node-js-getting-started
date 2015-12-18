var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 80));
app.use(express.static(__dirname + '/public'));

app.get('/about', function(request, response) {
  res.sendfile('public/about.html');
});

app.get('/contact', function(request, response) {
  res.sendfile('public/contact.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});
