var nba = require('nba');
var _ = require('underscore');
var moment = require('moment');
var Promise = require( "es6-promise" ).Promise;
var service = require('./service');
var dao = require('./dao');

console.log("Starting up...");


nba.ready(function() {
    getGames(function() {
        console.log("games retrieved")
        process.exit(0);
    });
});

function getGames(callback) {
    var date = new Date();
    console.log("Get games for date " + moment(date).format('MM/DD/YYYY'));
    nba.api.scoreboard({ GameDate: moment(date).format('MM/DD/YYYY') }).then(function(resp) {
        var games = resp.gameHeader;
        console.log("Games", games);
        if( games && games.length ) {
            var promisesForGames = [];
            _.each(games, function(game) {
                if ( game.gameStatusId == global.GAME_STATUS_FINAL) {
                    var homeTeam = _.findWhere(nba.teamsInfo, {teamId: game.homeTeamId});
                    var visitorTeam = _.findWhere(nba.teamsInfo, {teamId: game.visitorTeamId});

                    promisesForGames.push(getGameIfNotInDao(game, homeTeam, date));
                    promisesForGames.push(getGameIfNotInDao(game, visitorTeam, date));
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
        dao.getGame({gameId: game.gameId, teamId: team.teamId}, function(results, err) {
            if ( err ) {
                console.log("Error", err);
            } else if ( results && results.length ) {
                resolve();
            } else {
                service.getGameStatsFromApi(game, team, date).then(resolve, function(e) {
                    console.log(e);
                    resolve();
                });
            }
        })

    });
    return promise;
}

function error(e) {
    console.log(e);
    process.exit(1);
}

process.on('uncaughtException', error);