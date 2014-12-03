var nba = require('nba');
var fs = require('fs');
var _ = require('underscore');
var Handlebars = require('handlebars');
var moment = require('moment');
var mkdirp = require('mkdirp');
var Promise = require( "es6-promise" ).Promise;
require('./helpers');

var GAME_STATUS_FINAL = 3;

var LEAGUE_AVERAGE_ORR = .25016666666666662;
var LEAGUE_AVERAGE_DRR = .7494666666666669;

module.exports = {
    generateStats: function(teamName, date, callback) {
        nba.ready(function() {
            var team = _.find(nba.teamsInfo, function(team) {
                return team.simpleName.toUpperCase() == teamName.toUpperCase()
            });
            console.log("Looking up last game for ", team.teamName);
            global.team = team;

            if (date) {
                date =moment(date).toDate()
            } else {
                date = new Date();
            }
            getLastGameForTeam(team.teamId, date, function(game) {
                var options = {gameId: game.gameId};
                Promise.all([nba.api.boxScoreFourFactors(options), nba.api.boxScoreScoring(options), nba.api.boxScoreAdvanced(options), nba.api.boxScoreUsage(options)])
                    .then(function(results){ //fourFactors, teamStats, boxScoreAdvanced, boxScoreUsage) {
                        var fourFactors = results[0];
                        var boxScoreScoring = results[1];
                        var boxScoreAdvanced = results[2];
                        var boxScoreUsage = results[3];

                        var teams = getTeamsObj(fourFactors.teamStats, team);
                        var playerTrackTeams = getTeamsObj(boxScoreUsage.playerTrackTeam, team);
                        var sqlTeamsAdvanced = getTeamsObj(boxScoreAdvanced.sqlTeamsAdvanced, team);
                        //merge all 3 into a single team stats object
                        teams.us = _.defaults(teams.us, playerTrackTeams.us, sqlTeamsAdvanced.us);
                        teams.them = _.defaults(teams.them, playerTrackTeams.them, sqlTeamsAdvanced.them);

                        var pageTemplate = getTemplate('page');

                        var pageHtml = pageTemplate({
                            game: game,
                            teams: teams,
                            fourFactors: getFourFactors(fourFactors, team),
                            teamStats: getTeamStats(teams),
                            players: getPlayers(fourFactors.playerStats, teams.us)
                        });
                        callback(pageHtml);
                    });
            });
        });

    }
};


function getLastGameForTeam(teamId, date, callback) {
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
    });
}


function getFourFactors(resp, homeTeam) {
    var template = getTemplate('fourFactors');
    var fourFactors = resp.sqlTeamsFourFactors;

    var teams = getTeamsObj(fourFactors, homeTeam);
    var data = teams.us;
    data.opponentName = teams.them.teamName;
    var html = template(data);

    mkdirp(getDirectoryName(), function(err) {
        fs.writeFile(getDirectoryName() + 'fourFactors.html', html);
    });
    return html;
}

function getTeamStats(teams) {
    addAdvancedStats(teams.us, teams.them);
    addAdvancedStats(teams.them, teams.us);
    var template = getTemplate('teamStats');


    var html = template(teams);
    mkdirp(getDirectoryName(), function(err) {
        fs.writeFile(getDirectoryName() + 'teamStats.html', html);
    });
    return html;
}

function getPlayers(players, team) {
    players = _.where(players, {teamId: global.team.teamId});
    _.each(players, function(player){
        player.REB = player.oREB + player.dREB;
        var min = player.mIN;
        if (_.isString(min) && min.length > 0 ) {
            var array = min.split(':');
            if ( array && array.length == 2) {
                player.minutes = parseInt(array[0],10) + parseInt(array[1],10) / 60;
            }
        }
    });
    _.each(players, addGameScore);
    //calculate adjusted game score to redistribute points actually scored
    var totalGameScore = _.reduce(players, function(memo, player) {
        return _.isNumber(player.gS) ? memo + player.gS : memo;
    }, 0);
    _.each(players, function(player) {
        player.adjGS = (player.gS / totalGameScore) * team.pTS;
        player.adjGSMin = player.minutes > 0 ? player.adjGS / player.minutes : 0;
    });

    players = _.sortBy(players, function(player){return -player.gS});
    var count = 1;
    _.each(players, function(player) {
        count++;
        player.isOdd = count % 2 == 1;
    });

    var template = getTemplate('players');
    var html = template({players: players});
    mkdirp(getDirectoryName(), function(err) {
        fs.writeFile(getDirectoryName() + 'players.html', html);
    });
    return html;
}

function addAdvancedStats(team, opp) {
    team.fG2A = team.fGA - team.fG3A;
    team.fG2M = team.fGM - team.fG3M;
    team.fg2Pct = team.fG2M / team.fG2A;

    team.tSA = team.fGA + 0.44 * team.fTA;
    team.tSPct = team.pTS / (2 * team.tSA);


    //TODO possessions: see http://www.basketball-reference.com/about/glossary.html "Poss" - formula is rather complicated it would seem.

    team.pPP = (team.pTS) / team.pACE;
    team.pPS = (team.pTS) / (team.fGA);
    team.bCI = (team.aST + team.sTL) / team.tO;

    team.oRR = team.oREB / (team.oREB + opp.dREB);
    team.expectedOREB = LEAGUE_AVERAGE_ORR * (team.oREB + opp.dREB);
    team.oREBDiff = team.oREB - team.expectedOREB;

    team.percentOfFGAUncontested = team.uFGA / team.fGA;
    team.percentOfFGAContested = team.cFGA / team.fGA;
    team.uFGPct = team.uFGM / team.uFGA;
    team.cFGPct = team.cFGM / team.cFGA;
}

function addGameScore(player) {
    player.gS = player.pTS + 0.4 * player.fGM - 0.7 * player.fGA - 0.4*(player.fTA - player.fTM) + 0.7 * player.oREB + 0.3 * player.dREB + player.sTL + 0.7 * player.aST + 0.7 * player.bLK - 0.4 * player.pF - player.tO;
}


function getTemplate(name) {
    return Handlebars.compile(fs.readFileSync('./templates/' + name + '.hbs', "utf8"));
}

function getTeamsObj(array, homeTeam) {
    var ourTeam = _.findWhere(array, {teamId: homeTeam.teamId});
    var theirTeam = _.without(array, ourTeam)[0];
    return {us: ourTeam, them: theirTeam};
}

function getDirectoryName() {
    return './output/' + global.team.teamName + '/' + moment(global.date).format('MM-DD-YYYY') + '/';
}