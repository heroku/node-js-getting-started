var express = require('express');
var app = express();
var generate = require('./generate');
var nba = require('nba');
var controller = require('./controller');

nba.ready(function() {

    app.set('port', (process.env.PORT || 5000));
    app.use(express.static(__dirname + '/public'));

    app.get('/', function(request, response) {
        response.send('Hello World!');
    });

    app.get('/team/:name/:date', controller.getGameStats);
    app.get('/team/:name', controller.getGameStats);

    app.listen(app.get('port'), function() {
        console.log("Node app is running at localhost:" + app.get('port'));
    });

});