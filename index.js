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

    function generateDataForTeam(req,res,next) {
        var name = req.param('name');
        var date = req.param('date');

        try {
            generate.generateStats(name, date, function(pageHtml) {
                res.send(pageHtml);
                next();
            });
        } catch(e) {
            console.log("Error", e);
            res.send('Error generating', e);
        }
    }

    app.listen(app.get('port'), function() {
        console.log("Node app is running at localhost:" + app.get('port'));
    });

});