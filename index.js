var express = require('express');
var app = express();
var generate = require('./generate');
var nba = require('nba');

nba.ready(function() {

    app.set('port', (process.env.PORT || 5000));
    app.use(express.static(__dirname + '/public'));

    app.get('/', function(request, response) {
        response.send('Hello World!');
    });

    app.get('/team/:name/:date', generateDataForTeam);
    app.get('/team/:name', generateDataForTeam);

    app.get('/stats/:name/', function(req, res, next) {
        var name = req.param('name');
        generate.getUncontestedStats(name, function(html) {

            res.send(html);
        });
    });

    function generateDataForTeam(req,res,next) {
        var name = req.param('name');
        var date = req.param('date');

        try {
            generate.generateStats(name, date, function(pageHtml) {
                res.send(pageHtml);
                next();
            }, function(e){
                onError(e, res);
            });
        } catch(e) {
            onError(e, res);
        }
    }

    function onError(e, res) {
        console.log("Error", e);
        res.send('Error generating stats: ' + e);
    }

    app.listen(app.get('port'), function() {
        console.log("Node app is running at localhost:" + app.get('port'));
    });

});