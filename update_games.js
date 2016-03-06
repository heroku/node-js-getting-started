var nba = require('nba-hack');
var _ = require('underscore');
var moment = require('moment-timezone');
var Promise = require( "es6-promise" ).Promise;
var service = require('./service');
var dao = require('./dao');

dao.onConnect(function() {
    nba.ready(function() {
        getGames(function() {
            console.log("games retrieved")
            process.exit(0);
        });
    });
});

function getGames(callback) {
    var date = moment().tz("America/New_York");
    console.log("Get games for date " + date.format('MM/DD/YYYY'));
    nba.api.scoreboard({ GameDate: date.format('MM/DD/YYYY') }).then(function(resp) {
        var games = resp.gameHeader;
        if( games && games.length ) {
            var promisesForGames = [];
            _.each(games, function(game) {
                if ( game.gameStatusId == global.GAME_STATUS_FINAL) {
                    var homeTeam = _.findWhere(nba.teamsInfo, {teamId: game.homeTeamId});
                    var visitorTeam = _.findWhere(nba.teamsInfo, {teamId: game.visitorTeamId});

                    promisesForGames.push(getGameIfNotInDao(game, homeTeam, date.toDate()));
                    promisesForGames.push(getGameIfNotInDao(game, visitorTeam, date.toDate()));
                }
            });
            Promise.all(promisesForGames).then(callback, error);
        } else {
            callback();
        }
    }).catch(error);
}

function getGameIfNotInDao(game, team, date) {
    var promise = new Promise(function(resolve, reject) {
        dao.getGames({gameId: game.gameId, teamId: team.teamId}, function(results, err) {
            if ( err ) {
                console.log("Error", err, err.stack);
            } else if ( results && results.length ) {
                console.log("Game " + game.gAMECODE + " already present in DB");
                resolve();
            } else {
                service.getGameStatsFromApi(game, team, date).then(resolve, function(e) {
                    console.log(e, e.stack);
                    resolve();
                });
            }
        })

    });
    return promise;
}

function error(e) {
    console.log(e, e.stack);
    process.exit(1);
}

process.on('uncaughtException', error);
