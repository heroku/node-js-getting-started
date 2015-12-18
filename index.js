var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 80));
app.use(express.static(__dirname + '/public'));

app.get('/about', function(request, response) {
  response.send('About');
});

app.get('/contact', function(request, response) {
  response.send('Contact');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/', function(req, res){

  res.sendfile('public/index.html');
});
