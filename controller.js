var fs = require('fs');
var nba = require('nba');
var _ = require('underscore');
var Handlebars = require('handlebars');
var moment = require('moment');
var Promise = require( "es6-promise" ).Promise;
var service = require('./service');
require('./helpers');

var GAME_STATUS_FINAL = 3;


module.exports = {
    getGameStats: function(req,res,next) {
        var name = req.param('name');
        var date = req.param('date');
        var refresh = req.param('refresh');

        try {
            var team = _.find(nba.teamsInfo, function(team) {
                return team.simpleName.toUpperCase().indexOf(name.toUpperCase()) >= 0
            });
            console.log("Looking up last game for ", team.teamName);

            if (date) {
                date = moment(date).toDate()
            } else {
                date = new Date();
            }

            getLastGameForTeam(team.teamId, date, function(game) {
                service.getGameStats(game, team, date, refresh, function(data) {
                    var html = getTemplate('page')(data);
                    res.send(html);
                }, onError);
            }, onError);

        } catch(e) {
            onError(e, res);
        }
    },
    generate: function(req, res, next) {
        var start = req.param("start");
        var end = req.param("end");
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
};

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


function getLastGameForTeam(teamId, date, callback, error) {
    if (!date) {
        date = new Date();
    }

    nba.api.scoreboard({ GameDate: moment(date).format('MM/DD/YYYY') }).then(function(resp) {
        var teamGame = _.find(resp.gameHeader, function(game){
            return game.homeTeamId == teamId || game.visitorTeamId == teamId
        });
        if ( !teamGame || teamGame.gameStatusId != GAME_STATUS_FINAL ) {
            date = moment(date).add(1, 'days').toDate();
            getLastGameForTeam(teamId, date, callback);
        } else {
            global.date = date;
            callback(teamGame);
        }
    }).catch(error);
}


function getTemplate(name) {
    return Handlebars.compile(fs.readFileSync('./templates/' + name + '.hbs', "utf8"));
}

function onError(e, res) {
    console.log("Error", e);
    res.send('Error generating stats: ' + e);
}