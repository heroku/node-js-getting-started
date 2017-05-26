var express = require('express');
var cool = require('cool-ascii-faces');

var app = express();
var net = require('net');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	var client = new net.Socket();
	client.connect(10000, 'localhost', function() {
		console.log('Conneted here on socket');
		client.write('Hello, server! Love, Client.');
	});

	client.on('data', function(data) {
		console.log('Received: ' + data);
		//client.destroy(); // kill client after server's response
	});

	client.on('close', function() {
		console.log('Connection closed');
	});

	response.render('pages/index');
});

app.get('/get_pumps', function(request, response) {
	  console.log('User:', 'get pumps called');
	  response.send(cool());
	});


app.get('/cool', function(request, response) {
	  console.log('User:', 'just accessed the /dashboard page!');
	  response.send(cool());
	});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


