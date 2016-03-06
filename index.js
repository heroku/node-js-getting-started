var express = require('express');
var app = express();
require('./apiExtensions');
var nba = require('nba-hack');
var controller = require('./controller');
var Promise = require( "es6-promise" ).Promise;


nba.ready(function() {
    nba.api.playersInfo({season: "2015-16"}).then( function (resp) {
        nba.playersInfo = resp;

        app.set('port', (process.env.PORT || 5000));
        app.use(express.static(__dirname + '/public'));

        app.get('/', controller.index);
        app.get('/team/averages/:name', controller.getSeasonAverages);
        app.get('/playerImpact', controller.playerImpact);
        app.get('/player', controller.player);
        app.get('/team/:name/:date', controller.getGameStats);
        app.get('/team/:name', controller.getGameStats);

        app.listen(app.get('port'), function() {
            console.log("Node app is running at localhost:" + app.get('port'));
        });
    });
});
