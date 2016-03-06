var nba = require('nba-hack');
var _ = require('underscore');
var moment = require('moment');
var Promise = require( "es6-promise" ).Promise;
var service = require('./service');
var templates = require('./templates');

var GAME_STATUS_FINAL = 3;

module.exports = {
    index: function(req,res) {
        res.send(templates.get('index')({
            teams: nba.teamsInfo
        }));
    },
    getSeasonAverages: function(req,res) {
        var name = req.param('name');

        try {
            var team = getTeam(name);
            console.log("Looking up season averages for " + team.teamName);
            var options = _.extend(req.query, {team: team});

            service.getTeamAverages(options).then(function(data) {
                var html = templates.get('teamAverages')(data);
                res.send(html);
            }, onError);
        } catch(e) {
            onError(e, res);
        }
    },

    player: function(req, res) {
        var teamName = req.param('team');
        var team = getTeam(teamName);
        var playerName = req.param('player');
        var player = getPlayer(playerName);

        var options = _.extend(req.query, {team: team, player: player});
        service.getPlayerStats(options).then(function(data) {
            var html = templates.get('playerAverages')(data);
            res.send(html);
        }).catch(function(e){onError(e, res)});
    },

    playerImpact: function(req,res) {
        var teamName = req.param('team');
        var team = getTeam(teamName);
        var playerName = req.param('player');
        var player = getPlayer(playerName);

        var options = _.extend(req.query, {team: team, player: player});
        var onOff = service.getPlayerOnOffStats(options);
        var playerSplits = service.getPlayerSplits(options);
        var playerCharts = service.getPlayerCharts(options);
        Promise.all([onOff, playerSplits, playerCharts]).then(function(results) {
            onOff = results[0];
            playerSplits = results[1];
            playerCharts = results[2];

            var html = templates.get('playerImpact')({
                player: player,
                team: team,
                onOff: onOff,
                options: options,
                playerSplits: playerSplits,
                playerCharts: playerCharts
            });
            res.send(html);
        }).catch(function(e){onError(e, res)});


    },
    /*getPlayerImpact: function(req,res) {
        var name = req.param('name');
        var playerName = req.param('playerName');
        var player = nba.playerIdFromName(playerName);
        if ( !player ) {
            var msg = "Could not find player " + playerName;
            console.log(msg);
            res.send(msg);
        }
        try {
            var team = getTeam(name);
            console.log("Looking up player impact for " + playerName);

            var options = {
                team: team,
                player: player,
                season: req.param("season") ? true : false,
                playoffs: req.param("playoffs") ? true : false
            };

            Øservice.getTeamAverages(options).then(function(data) {
                var html = templates.get('teamAverages')(data);
                res.send(html);
            }, onError);

        } catch(e) {
            onError(e, res);
        }
    },*/
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
                        var html = templates.get('page')(data);
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

function getPlayer(player) {
    var player = _.find(nba.playersInfo, function(p) {
        return p.playerId == player || p.fullName.toUpperCase() == player.toUpperCase();
    });
    if ( !player ) {
        throw new Error("No player found for " + player);
    }
    return player;
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

function onError(e, res) {
    console.log("Error", e);
    res.send('Error generating stats: ' + e);
}
