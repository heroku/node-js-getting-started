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
    getGameStats: function(teamName, date, callback, error) {
        var team = _.find(nba.teamsInfo, function(team) {
            return team.simpleName.toUpperCase().indexOf(teamName.toUpperCase()) >= 0
        });
        console.log("Looking up last game for ", team.teamName);

        if (date) {
            date = moment(date).toDate()
        } else {
            date = new Date();
        }
        getLastGameForTeam(team.teamId, date, function(game) {
            service.getGameStats(game, team, date, function(data) {
                var html = getTemplate('page')(data);
                callback(html);
            }, error);
        }, error);
    }
};


function getLastGameForTeam(teamId, date, callback, error) {
    if (!date) {
        date = new Date();
    }

    nba.api.scoreboard({ GameDate: moment(date).format('MM/DD/YYYY') }).then(function(resp) {
        var teamGame = _.find(resp.gameHeader, function(game){
            return game.homeTeamId == teamId || game.visitorTeamId == teamId
        });
        if ( !teamGame || teamGame.gameStatusId != GAME_STATUS_FINAL ) {
            date = moment(date).subtract(1, 'days').toDate();
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