#! /app/bin/node
var nba = require('nba');
var _ = require('underscore');
var moment = require('moment');
var Promise = require( "es6-promise" ).Promise;
var service = require('./service');


function generate(start, end) {
    start = moment(start);
    end = moment(end);
    var date = moment(start);

    function callback() {
        date = moment(date).add(1, 'days');
        if (moment(date).isAfter(end) || moment(date).isAfter(moment())) {
            console.log("Complete", start.format("MM/DD/YYYY"), end.format("MM/DD/YYYY"));
            res.send("Generated data for all games between " + moment(start).format("MM/DD/YYYY") + ' and ' + moment(end).format('MM/DD/YYYY'));
        } else {
            getGamesDataForDate(date)
        }
    }

    getGamesDataForDate(date, callback, function(e) {console.log(e); callback();});
}



function getGamesDataForDate(date, callback, error) {
    getGamesForDate(date.toDate(), function(games) {
        if( games && games.length ) {
            var promisesForGames = [];
            _.each(games, function(game) {

                var homeTeam = _.findWhere(nba.teamsInfo, {teamId: game.homeTeamId});
                var visitorTeam = _.findWhere(nba.teamsInfo, {teamId: game.visitorTeamId});

                promisesForGames.push(service.getGameStatsFromApi(game, homeTeam, date));
                promisesForGames.push(service.getGameStatsFromApi(game, visitorTeam, date));
            });
            Promise.all(promisesForGames).then(callback, error);
        } else {
            callback();
        }
    })
}

function getGamesForDate(date, callback, error) {
    nba.api.scoreboard({ GameDate: moment(date).format('MM/DD/YYYY') }).then(function(resp) {
        callback(resp.gameHeader);
    }).catch(error);
}


var argLength = process.argv.length;
if ( argLength == 4 ) {
    var start = process.argv[2];
    var end = process.argv[3];
    start = moment(start);
    end = moment(end);
    var date = moment(start);


}
if (argLength < 4 ) {
    console.log("Please pass a start and end datename.  For instance 'Spurs'");
    throw "error";
}
var teamName = process.argv[2];
if ( !teamName ) {
    console.log("Please pass a team name");
    throw new Exception("Please pass a team name");
}

var date = null;
if ( process.argv.length > 3 ) {
    date = process.argv[3];
}


generate();

exit();