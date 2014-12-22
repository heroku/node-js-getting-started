var nba = require('nba');
var _ = require('underscore');
var Promise = require( "es6-promise" ).Promise;
var dao = require('./dao');

var LEAGUE_AVERAGE_ORR = .25016666666666662;
var LEAGUE_AVERAGE_DRR = .7494666666666669;

module.exports = {
    getGameStats: function(game, team, date, callback, error) {
        console.log("Searching MongoDB for game " + game.gameId);
        dao.getGame({gameId: game.gameId, teamId: team.teamId}, function(results) {
            if ( results.length ) {
                console.log("Found game " + game.gameId + "in DB");
                callback(results[0]);
            } else {
                getGameStatsFromApi(game, team, date, callback, error)
            }
        }, function(err) {
            if ( err ) {
                error(err);
            }
        });
    }
};

function getGameStatsFromApi(game, team, date, callback, error) {
    console.log("Calling NBA stats for game " + game.gameId + "...");
    var options = {gameId: game.gameId};
    Promise.all([nba.api.boxScoreFourFactors(options), nba.api.boxScoreAdvanced(options), nba.api.boxScoreUsage(options), nba.api.playByPlay(options)])
        .then(function(results) {
            console.log("Stats retrieved for " + game.gameId);
            var fourFactors = results[0];
            var boxScoreAdvanced = results[1];
            var boxScoreUsage = results[2];
            var playbyplay = results[3];


            var teams = getTeams([fourFactors.teamStats, fourFactors.sqlTeamsFourFactors, boxScoreUsage.playerTrackTeam, boxScoreAdvanced.sqlTeamsAdvanced], team);
            var players = getPlayers(fourFactors.playerStats, boxScoreUsage.sqlPlayersUsage, teams.us);

            var data = {
                game: game,
                date: date,
                gameId: game.gameId,
                teamId: team.teamId,
                homeGame: game.homeTeamId == teams.us.teamId,
                teams: teams,
                us: teams.us,
                them: teams.them,
                fourFactors: teams.us,
                players: players,
                spursIndex: getSpursIndex(teams.us),
                gameFlowData: getGameFlowChartData(playbyplay.playByPlay, teams, game)
            };

            dao.saveGame(data, callback, error);
        }).catch(function(e) {
            console.log("error: " + e, e);
            error(e);
            throw e;
        });
}

function getTeams(statsArrays, usTeam) {
    var us = {};
    var them = {};
    _.each(statsArrays, function(stats) {
        var usStats = _.findWhere(stats, {teamId: usTeam.teamId});
        us = _.defaults(us, usStats);
        them = _.defaults(them, _.without(stats, usStats)[0]);
    });

    us.minutes = getMinutes(us.mIN);
    them.minutes = getMinutes(them.mIN);

    addAdvancedStats(us, them);
    addAdvancedStats(them, us);

    _.extend(us, getSpursIndex(us));
    _.extend(them, getSpursIndex(them));

    return {us: us, them: them};
}

function getPlayers(players, playersUsage, us) {
    _.each(players, function (player) {
        var playerUsage = _.findWhere(playersUsage, {playerId: player.playerId});
        _.extend(player, playerUsage);
    });
    players = adornPlayerStats(players, us)

    return players;
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
        return scoringPossessions / possessions;
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

    return {spursIndexFactors: factors, spursIndexScore: totalScore};
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
    return [
        gameTime,
        us,
        them,
        playDesc
    ];
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