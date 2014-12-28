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
    getSeasonAverages: function(req,res,next) {
        var name = req.param('name');
        var refresh = req.param('refresh');

        try {
            var team = getTeam(name);
            console.log("Looking up last game for ", team.teamName);
            var options = {
                team: team,
                season: req.param("season") ? true : false,
                playoffs: req.param("playoffs") ? true : false
            };

            service.getTeamAverages(options).then(function(averages) {
                res.send(JSON.stringify(averages));
            }, onError);

        } catch(e) {
            onError(e, res);
        }
    },
    getGameStats: function(req,res,next) {
        var name = req.param('name');
        var date = req.param('date');
        var refresh = req.param('refresh');

        try {
            var team = getTeam(name);
            console.log("Looking up last game for ", team.teamName);

            if (date) {
                date = moment(date).toDate()
            } else {
                date = new Date();
            }

            getLastGameForTeam(team.teamId, date, function(game) {
                service.getGameStats(game, team, date, refresh, function(data) {
                    if (_.isObject(data) ){
                        var html = getTemplate('page')(data);
                    } else {
                        html = data;
                    }
                    res.send(html);
                }, onError);
            }, onError);

        } catch(e) {
            onError(e, res);
        }
    }
};

function getTeam(name) {
    if ( name.toUpperCase() == 'HORNETS' || name.toUpperCase() == 'BOBCATS') {
        var hornets = _.findWhere(nba.teamsInfo, {simpleName: 'Hornets'});
        if ( hornets ){
            name = 'hornets'
        } else {
            name = 'bobcats';
        }
    }
    var team = _.find(nba.teamsInfo, function(team) {
        return team.simpleName.toUpperCase().indexOf(name.toUpperCase()) >= 0
    });
    if ( !team ) {
        throw new Error("No team found for name " + name);
    }
    return team;
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

function onError(e, res) {
    console.log("Error", e);
    res.send('Error generating stats: ' + e);
}