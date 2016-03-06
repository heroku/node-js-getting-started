var nba = require('nba-hack');
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
    generateStats: function(teamName, date, callback, error) {
        var team = _.find(nba.teamsInfo, function(team) {
            return team.simpleName.toUpperCase().indexOf(teamName.toUpperCase()) >= 0
        });
        console.log("Looking up last game for ", team.teamName);

        //TODO kill this
        global.team = team;

        if (date) {
            date = moment(date).toDate()
        } else {
            date = new Date();
        }
        getLastGameForTeam(team.teamId, date, function(game) {
            console.log("Retrieving " + game.gAMECODE + "...");
            var options = {gameId: game.gameId};
            Promise.all([nba.api.boxScoreFourFactors(options), nba.api.boxScoreAdvanced(options), nba.api.boxScoreUsage(options), nba.api.playByPlay(options)])
                .then(function(results) {
                    console.log("Stats retrieved - generating page for " + game.gAMECODE);
                    var fourFactors = results[0];
                    var boxScoreAdvanced = results[1];
                    var boxScoreUsage = results[2];
                    var playbyplay = results[3];

                    var teams = getTeamsObj(fourFactors.teamStats, team);
                    var playerTrackTeams = getTeamsObj(boxScoreUsage.playerTrackTeam, team);
                    var sqlTeamsAdvanced = getTeamsObj(boxScoreAdvanced.sqlTeamsAdvanced, team);

                    var players = fourFactors.playerStats;
                    var playersUsage = boxScoreUsage.sqlPlayersUsage;
                    //merge player ojbects with player usage objects
                    _.each(players, function (player) {
                        var playerUsage = _.findWhere(playersUsage, {playerId: player.playerId});
                        _.extend(player, playerUsage);
                    });

                    //merge all 3 into a single team stats object
                    teams.us = _.defaults(teams.us, playerTrackTeams.us, sqlTeamsAdvanced.us);
                    teams.us.minutes = getMinutes(teams.us.mIN);
                    teams.them = _.defaults(teams.them, playerTrackTeams.them, sqlTeamsAdvanced.them);
                    teams.them.minutes = getMinutes(teams.them.mIN);

                    var pageTemplate = getTemplate('page');

                    var pageHtml = pageTemplate({
                        game: game,
                        homeGame: game.homeTeamId == teams.us.teamId,
                        teams: teams,
                        fourFactors: getFourFactors(fourFactors, team),
                        teamStats: getTeamStats(teams),
                        players: getPlayers(players, teams.us),
                        spursIndex: getSpursIndex(teams.us),
                        gameFlowData: getGameFlowChartData(playbyplay.playByPlay, teams, game)
                    });
                    callback(pageHtml);
                }).catch(function(e) {
                    console.log("error: " + e, e);
                    error(e);
                    throw e;
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
    return html;
}

function getTeamStats(teams) {
    addAdvancedStats(teams.us, teams.them);
    addAdvancedStats(teams.them, teams.us);
    var template = getTemplate('teamStats');

    return template(teams);
}

function getMinutes(min) {
    if (_.isString(min) && min.length > 0 ) {
        var array = min.split(':');
        if ( array && array.length == 2) {
            return parseInt(array[0],10) + parseInt(array[1],10) / 60;
        }
    }
    return 0;
}

function adornPlayerStats(players, team) {
    players = _.where(players, {teamId: team.teamId});
    _.each(players, function(player){
        player.REB = player.oREB + player.dREB;
        var min = player.mIN;
        player.minutes = getMinutes(min);
    });
    _.each(players, addGameScore);
    //calculate adjusted game score to redistribute points actually scored
    var totalGameScore = _.reduce(players, function(memo, player) {
        return _.isNumber(player.gS) ? memo + player.gS : memo;
    }, 0);

    addPlayerAdvancedStats(players, team, totalGameScore);

    players = _.sortBy(players, function(player){return -player.gS});
    return players;
}

function getPlayers(players, team) {
    players = adornPlayerStats(players, team);
    var template = getTemplate('players');
    return template({players: players});
}

function addPlayerAdvancedStats(players, team, totalGameScore) {
    _.each(players, function(player) {
        player.adjGS = (player.gS / totalGameScore) * team.pTS;
        player.adjGSMin = player.minutes > 0 ? player.adjGS / player.minutes : 0;
        player.floorPercentage = getFloorPercentage(player, team);
    });
}


//taken from http://www.rawbw.com/~deano/hoopla/floorpct.html
function getFloorPercentage(player, team) {
    var Q = getQValue(player, team);
    var R = getRValue(player, team);
    var offensiveReboundPercent = team.oREB / ( team.fGA - team.fGM);
    if ( R == 0 ) {
        return null;
    } else {
        var scoringPossessions = player.fGM - 0.37 * player.fGM * (Q / R) + 0.37 * player.aST   + 0.5 * player.fTM;
        var possessions = player.fGA - (player.fGA - player.fGM) * offensiveReboundPercent + 0.37 * player.aST - 0.37 * player.fGM * Q / R + player.tO + 0.4 * player.fTA;
        var floorPercentage = scoringPossessions / possessions;
        return floorPercentage;
    }
}

function getQValue(player, team) {
    var Q = team.aST / team.minutes * 5 * player.minutes - player.aST;
    return Q;
}
function getRValue(player, team) {
    var R = team.fGM / team.minutes * 5 * player.minutes - player.aST;
    return R;
}

function addAdvancedStats(team, opp) {
    team.fG2A = team.fGA - team.fG3A;
    team.fG2M = team.fGM - team.fG3M;
    team.fg2Pct = team.fG2M / team.fG2A;

    team.tSA = team.fGA + 0.44 * team.fTA;
    team.tSPct = team.pTS / (2 * team.tSA);

    team.pPP = (team.pTS) / team.pACE;
    team.pPS = (team.pTS) / (team.fGA);
    team.bCI = (team.aST + team.sTL) / team.tO;

    team.oRR = team.oREB / (team.oREB + opp.dREB);
    team.expectedOREB = LEAGUE_AVERAGE_ORR * (team.oREB + opp.dREB);
    team.oREBDiff = team.oREB - team.expectedOREB;

    team.uncontestedFGAPerPossession = team.uFGA / team.pACE
    team.percentOfFGAUncontested = team.uFGA / team.fGA;
    team.percentOfFGAContested = team.cFGA / team.fGA;
    team.uFGPct = team.uFGM / team.uFGA;
    team.cFGPct = team.cFGM / team.cFGA;
}

function addGameScore(player) {
    player.gS = player.pTS + 0.4 * player.fGM - 0.7 * player.fGA - 0.4*(player.fTA - player.fTM) + 0.7 * player.oREB + 0.3 * player.dREB + player.sTL + 0.7 * player.aST + 0.7 * player.bLK - 0.4 * player.pF - player.tO;
}


function getSpursIndex(team) {
    //averages come from 2013-2014 season averages
    var factors = {
        efgPct: {
            name: "Shooting (eFG%)",
            title: "Effective Field Goal Percentage - Effective Field Goal Percentage is a field goal percentage that is adjusted for made 3 pointers being 1.5 times more valuable than a 2 point shot.",
            weight: 0.20,
            average: 0.537,
            goodThreshold: 0.57,
            badThreshold: 0.48,
            percent: true
        },
        astPct: {
            name: "Passing (AST%)",
            title: "Assist Percentage - Assist Percentage is the percent of team's field goals made that were assisted.",
            weight: 0.35,
            average: 0.621,
            goodThreshold: 0.68,
            badThreshold: 0.55,
            percent: true
        },
        drebPct: {
            name: "Defensive Rebounding (DReb%)",
            title: "Defensive Rebound Percentage - The percentage of defensive rebounds a team obtains.",
            weight: 0.15,
            average: 0.764,
            goodThreshold: 0.81,
            badThreshold: 0.705,
            percent: true
        },
        defRating: {
            name: "Defense (DefRtg)",
            title: "Defensive Rating - The number of points allowed per 100 possessions by a team. For a player, it is the number of points per 100 possessions that the team allows while that individual player is on the court.",
            weight: 0.15,
            average: 100.1,
            goodThreshold: 94,
            badThreshold: 106,
            percent: false,
            inverse: true
        },
        uncontestedFGAPerPossession: {
            name: "Uncontested FGA/Poss allowed",
            title: "Uncontested Field Goal Attempts allowed per opponent possession.  A measure of how many open looks an opponent is afforded per possession.",
            weight: 0.15,
            average:0.365, //see comment at bottom of file
            goodThreshold: 0.32,
            badThreshold: 0.41,
            percent: true,
            inverse: true
        }
    };

    var totalScore = 0;
    _.each(factors, function(factor, id) {
        var expected = factor.average;
        var actual = team[id];
        if ( factor.inverse ) {
            var score = 100 * factor.weight * (expected / actual);
            var good = 100 * factor.weight * (expected / factor.goodThreshold);
            var bad = 100 * factor.weight * (expected / factor.badThreshold);
        } else {
            score = 100 * factor.weight * (actual / expected);
            good = 100 * factor.weight * (factor.goodThreshold / expected);
            bad = 100 * factor.weight * (factor.badThreshold / expected);
        }
        //was it good?
        if (score >= good) {
            factor.good = true;
        } else if ( score <= bad ) {
            factor.bad = true;
        }

        totalScore+= score;
        factor.score = score;
        factor.actual = actual;
    });
    team.spursIndex = totalScore;
    team.spursIndexFactors = factors;

    var template = getTemplate('spursIndex');
    var html = template({factors: factors, score: totalScore});

    return html;
}

function getGameMinute(period, time) {
    var periodLength = period <= 4 ? 12 : 5;
    var gameMinute = 12 * (period - 1);
    if ( period > 4 ){
        gameMinute = 48 + 5 * (period - 5);
    }
    var minutesSeconds = time.split(':');
    var minute = parseInt(minutesSeconds[0], 10);
    var seconds = parseInt(minutesSeconds[1], 10);
    var periodMinutes = minute + seconds / 60;
    gameMinute = gameMinute + periodLength - periodMinutes;
    return gameMinute
}

function getGameFlowChartData(playByPlay, teams, game) {
    var gameTime = ['gameTime'];
    var us = [teams.us.teamName];
    var them = [teams.them.teamName];
    var playDesc = ["Play"];
    var usHomeTeam = game.homeTeamId == teams.us.teamId;
    var usIndex = usHomeTeam ? 1 : 0;
    var themIndex = usHomeTeam ? 0 : 1;
    _.each(playByPlay, function(play) {
        if ( play.sCORE ) {
            var scores = play.sCORE.split(' - ');
            us.push(scores[usIndex]);
            them.push(scores[themIndex]);
            gameTime.push(getGameMinute(play.pERIOD, play.pCTIMESTRING))
            playDesc.push(play.vISITORDESCRIPTION || play.hOMEDESCRIPTION);
        }
    });
    var columns = [
        gameTime,
        us,
        them,
        playDesc
    ];
    return columns;
}

function getTemplate(name) {
    return Handlebars.compile(fs.readFileSync('./templates/' + name + '.hbs', "utf8"));
}

function getTeamsObj(array, homeTeam) {
    var ourTeam = _.findWhere(array, {teamId: homeTeam.teamId});
    var theirTeam = _.without(array, ourTeam)[0];
    return {us: ourTeam, them: theirTeam};
}

/*

2013-2014 unconteste FGA/possession calculation


 2013-2014 opp FGA/game: 85.1 (http://stats.nba.com/team/#!/1610612759/stats/opponent/?Season=2013-14)

 possessions: 95.03 (http://stats.nba.com/team/#!/1610612759/stats/advanced/)

 contested FGA/poss = .53 (http://bigleagueinsights.com/contested-field-goal-data-finding-open-shot)


 .53 = cFGA/95.03

 cFGA = .53 * 95.03 = 50.37

 uFGA = 85.1 - 50.37 = 34.73

 uFGA/poss = 34.73 / 95.03 = .365
 */
