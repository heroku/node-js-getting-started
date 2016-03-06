var nba = require('nba-hack');
var _ = require('underscore');
var Promise = require( "es6-promise" ).Promise;
var dao = require('./dao');
var moment = require('moment-timezone');
var queryString = require('query-string');
var Handlebars = require('handlebars');

global.GAME_STATUS_FINAL = 3;

var LEAGUE_AVERAGE_ORR = .25016666666666662;
var LEAGUE_AVERAGE_DRR = .7494666666666669;

var SHOT_CHART_OPTIONS_DEFAULT = {"TeamID":0,"GameID":0,"ContextMeasure":"FGA","Season":"2015-16","SeasonType":"Regular Season","RangeType":"2","StartPeriod":"1","EndPeriod":"10","StartRange":"0","EndRange":"28800","mode":"Advanced","showZones":"1","showDetails":"1","showShots":"1"};

//calculate rough season start/end dates
function getSeasonDates(year) {
    var dates = {};
    dates[SEASON_REGULAR] = {
        start: moment("10-25-" + (year - 1)),
        end: moment("04-15-" + year)
    };
    dates[SEASON_PLAYOFFS] = {
        start: moment("04-18" + year),
        end: moment("07-01-" + year)
    };
    return dates;
}

var SEASON_REGULAR = 'regular';
var SEASON_PLAYOFFS = 'playoffs';

var OUTCOME_WIN = 'win';
var OUTCOME_LOSS = 'loss';

var LOCATION_HOME = 'home';
var LOCATION_AWAY = 'away';

function getRatingData(games) {
    var columns = [];
    columns.push(getValues(games, "offRating", "Off Rating"));
    columns.push(getValues(games, "defRating", "Def Rating"));
    return columns
}

function getShootingData(games) {
    var columns = [];
    columns.push(getValues(games, "efgPct", "eFG%"));
    columns.push(getValues(games, "ftPct", "FT%"));
    columns.push(getValues(games, "fg2Pct", "2Pt FG%"));
    columns.push(getValues(games, "fg3Pct", "3Pt FG%"));
    return columns
}
function getBallhandlingData(games) {
    var columns = [];
    columns.push(getValues(games, "bCI", "BCI"));
    columns.push(getValues(games, "aST", "Ast"));
    columns.push(getValues(games, "tO", "TO"));
    columns.push(getValues(games, "sTL", "Steals"));
    return columns;
}
function getSpursIndexData(games) {
    var columns = [];
    columns.push(getValues(games, "spursIndexScore", "Spurs Index"));
    _.each(getSpursIndexFactors(), function(factor) {
        columns.push(getValues(games, factor.id, factor.name));
    });
    return columns;
}

function getValues(games, attr, name) {
    return [name].concat(_.map(games, function(game) {return game.us[attr];}));
}

function getGameTicks(games) {
    return _.map(games, function(game) {
        return (game.homeGame ? "vs " : "@ ") + game.them.teamName;
    });
}

function getRoster(games) {
    var roster = {};
    _.each(games, function(game) {
        _.each(game.us.players, function(player) {
            if ( !roster[player.playerId]) {
                roster[player.playerId] = _.pick(player, 'playerId', 'playerName')
            }
        });
    });
    return roster;
}
module.exports = {
    getPlayerOnOffStats: function(options) {
        var player = options.player;
        var team = options.team;
        var perMode = options.perMode || "Per48";
        return new Promise(function(resolve, reject) {
            var traditional = nba.api.teamPlayerOnOff({teamId:team.teamId, perMode:perMode});
            var advanced = nba.api.teamPlayerOnOff({teamId:team.teamId, perMode:perMode, measureType: "Advanced"});
            var misc = nba.api.teamPlayerOnOff({teamId:team.teamId, perMode:perMode, measureType: "Misc"});
            var fourFactors = nba.api.teamPlayerOnOff({teamId:team.teamId, perMode:perMode, measureType: "Four Factors"});
            var scoring = nba.api.teamPlayerOnOff({teamId:team.teamId, perMode:perMode, measureType: "Four Factors"});
            var opponent = nba.api.teamPlayerOnOff({teamId:team.teamId, perMode:perMode, measureType: "Opponent"});

            Promise.all([traditional, advanced, misc, fourFactors, scoring, opponent]).then(function(results) {
                traditional = results[0];
                advanced = results[1];
                misc = results[2];
                fourFactors = results[3];
                scoring = results[4];
                opponent = results[5];

                resolve(getPlayerOnOffStats(team, player, [traditional, advanced, misc, fourFactors, scoring], opponent));
            }).catch(reject);
        });
    },

    getPlayerSplits: function(options) {
        var player = options.player;
        var team = options.team;
        var perMode = options.perMode || "Per48";
        return new Promise(function(resolve, reject) {
            console.log("perMode", perMode);
            var traditional = nba.api.playerSplits({playerId:player.playerId, perMode:perMode});
            var advanced = nba.api.playerSplits({playerId:player.playerId, perMode:perMode, measureType: "Advanced"});
            //var shooting = nba.api.playerSplits({playerId:player.playerId, perMode:perMode, measureType: "Shooting"});
            var scoring = nba.api.playerSplits({playerId:player.playerId, perMode:perMode, measureType: "Scoring"});
            var usage = nba.api.playerSplits({playerId:player.playerId, perMode:perMode, measureType: "Usage"});
            //TODO misc, etc.?? Also, 2013-2014????

            /*
            var opponent = nba.api.playerSplits({playerId:player.playerId, perMode:perMode, measureType: "Opponent"});
*/
            Promise.all([traditional,advanced,scoring, usage]).then(function(results) {
                traditional = results[0];
                advanced = results[1];
                scoring = results[2];
                usage = results[3];

                console.log(usage);
                //misc = results[2];
                //shooting = results[3];
                //opponent = results[6];

                resolve(results)
            }).catch(reject);
        });
    },
    getPlayerCharts: function(options) {
        return new Promise(function(resolve, reject){resolve()});
    },

    getGameStats: function(game, team, date, refresh, callback, error) {
        console.log("Searching MongoDB for game " + game.gameId);
        if ( refresh ) {
            this.getGameStatsFromApi(game, team, date).then(callback, error);
        } else {
            dao.getGames({gameId: game.gameId, teamId: team.teamId}, _.bind(function(results) {
                if ( results.length ) {
                    console.log("Found game " + game.gameId + "in DB");
                    callback(results[0]);
                } else {
                    this.getGameStatsFromApi(game, team, date).then(callback, error);
                }
            }, this), function(err) {
                if ( err ) {
                    error(err);
                }
            });
        }
    },
    /**
     *
     * @param options
     * @param year  - 2015, 2016, etc.  The year of the playoffs
     * @returns {*|Promise}
     */
    getTeamAverages: function(options, year) {
        options = _.defaults(options, {
            season: SEASON_REGULAR,
            year: 2016
        });
        //TODO need season and year
        var team = options.team;

        var dates = getSeasonDates(year);
        var start = dates[options.season].start;
        var end = dates[options.season].end;

        var promise = new Promise(function(resolve, reject) {
            var dbOptions = {
                teamId:team.teamId,
                date: {
                    $gte: start.toDate(),
                    $lte: end.toDate()
                }
            };
            if ( options.location == LOCATION_HOME ) {
                dbOptions.homeGame = true;
            } else  if ( options.location == LOCATION_AWAY ) {
                dbOptions.homeGame = false;
            }
            dao.getGames(dbOptions, function(results, err) {
                if ( err ) {
                    reject(err);
                } else if ( results && results.length ) {
                    var games = results;
                    if ( options.with && options.with.length ) {
                        games = filterGamesByPlayersWith(games, options.with);
                    }
                    if ( options.without && options.without.length ) {
                        games = filterGamesByPlayersWithout(games, options.without);
                    }

                    if ( options.outcome == OUTCOME_WIN ) {
                        games = _.filter(games, function(game) {return game.us.pTS > game.them.pTS})
                    } else if ( options.outcome == OUTCOME_LOSS ) {
                        games = _.reject(games, function(game) {return game.us.pTS > game.them.pTS})
                    }

                    var averages = getAverages(games);
                    var ratingsColumns = getRatingData(games);

                    var hasOptions = (options.with && options.with.length) ||
                                     (options.without && options.without.length) ||
                                     options.location || options.outcome;
                    resolve({
                        team: team,
                        roster: getRoster(games),
                        averages: averages,
                        ratings: ratingsColumns,
                        shooting: getShootingData(games),
                        ballhandling: getBallhandlingData(games),
                        spursIndex: getSpursIndexData(games),
                        options: options,
                        hasOptions: hasOptions,
                        record: getRecord(games),
                        gameTicks: getGameTicks(games),
                        games: getGamesLine(games)
                    });
                } else {
                    console.log("No games found for options ", options);
                    resolve();
                }
            });
        });
        return promise
    },
    getGameStatsFromApi: function(game, team, date) {
        console.log("Calling NBA stats for game " + game.gameId + " " + game.gAMECODE);
        var options = {gameId: game.gameId};
        var promise = new Promise(function(resolve, reject) {
            Promise.all([nba.api.boxScoreFourFactors(options), nba.api.boxScoreAdvanced(options), nba.api.boxScoreUsage(options), nba.api.playByPlay(options)])
                .then(function(results) {
                    console.log("Stats retrieved for " + game.gameId);
                    var fourFactors = results[0];
                    var boxScoreAdvanced = results[1];
                    var boxScoreUsage = results[2];
                    var playbyplay = results[3];

                    var teams = getTeams([fourFactors.teamStats, fourFactors.sqlTeamsFourFactors, boxScoreUsage.playerTrackTeam, boxScoreAdvanced.sqlTeamsAdvanced, boxScoreUsage.otherStats], team, game, date);
                    teams.us.players = getPlayers([fourFactors.playerStats, boxScoreUsage.sqlPlayersUsage, boxScoreAdvanced.sqlPlayersAdvanced], teams.us, game, date);
                    teams.them.players = getPlayers([fourFactors.playerStats, boxScoreUsage.sqlPlayersUsage, boxScoreAdvanced.sqlPlayersAdvanced], teams.them, game, date);

                    if ( !teams.us.pTS) {
                        console.log("Game stats not available yet");
                        resolve("Game stats not available yet");
                        return;
                    }
                    var data = {
                        gameId: game.gameId,
                        teamId: team.teamId,
                        date: date,
                        game: game,
                        homeGame: game.homeTeamId == teams.us.teamId,
                        us: teams.us,
                        them: teams.them,
                        fourFactors: teams.us,
                        gameFlowData: getGameFlowChartData(playbyplay.playByPlay, teams, game)
                    };

                    dao.remove({gameId: game.gameId, teamId: team.teamId}).then(function() {
                        dao.saveGame(data, function() {resolve(data);}, reject);
                    })
                }).catch(function(e) {
                    reject(e);
                });
        });
        return promise;
    },

    getPlayerStats: function(options) {
        var service = this;
        return new Promise(function(resolve, reject) {
            var player = options.player;
            var team = options.team;
            var teamStatsWith = service.getTeamAverages(_.extend({}, options, {with: [player.playerId], without:[]}));
            var teamStatsWithout = service.getTeamAverages(_.extend({}, options, {without: [player.playerId], with:[]}));
            Promise.all([teamStatsWith, teamStatsWithout]).then(function(results) {
                var withStats = results[0];
                var withoutStats = results[1];
                var deltas = {us:{}, them:{}};
                _.each(withStats.averages.us, function(withVal, key) {
                    var withoutVal = withoutStats.averages.us[key];
                    deltas.us[key] = withVal - withoutVal;
                });
                _.each(withStats.averages.them, function(withVal, key) {
                    var withoutVal = withoutStats.averages.them[key];
                    deltas.them[key] = withVal - withoutVal;
                });


                var data = {
                    team: team,
                    player: player,
                    with: withStats,
                    without: withoutStats,
                    deltas: deltas
                };
                resolve(data);
            }).catch(reject)
        });
    },

    getGameIfNotInDao: function(game, team, date) {
        var service = this;
        var promise = new Promise(function(resolve, reject) {
            dao.getGames({gameId: game.gameId, teamId: team.teamId}, function(results, err) {
                if ( err ) {
                    console.trace(err);
                } else if ( results && results.length ) {
                    console.log("Game " + game.gAMECODE + " already present in DB");
                    resolve();
                } else {
                    service.getGameStatsFromApi(game, team, date).then(resolve, function(e) {
                        console.trace(e);
                        resolve();
                    });
                }
            })

        });
        return promise;
    }
};

function filterGamesByPlayersWith(games, withPlayers) {
    return _.filter(games, function(game) {
        var players = game.us.players;
        var playersPlayed = true;
        _.each(withPlayers, function(playerName) {
            var player = getPlayer(players, playerName);
            if ( !player || player.minutes < 1 ) {
                playersPlayed = false;
            }
        });
        return playersPlayed;
    });
}

function getPlayer(players, playerName) {
    return _.find(players, function(player) {
        if (_.isNumber(playerName) ) {
            return (player.playerId == playerName);
        }
        return (player.playerName.toUpperCase() == playerName.toUpperCase() || player.playerId == playerName);
    })
}

function getRecord(games) {
    var wins = 0;
    var losses = 0;
    _.each(games, function(game) {
        if ( game.us.pTS > game.them.pTS ) {
            wins++;
        } else {
            losses++;
        }
    });
    return wins + "-" + losses;
}
function getGamesLine(games) {
    return _.map(games, function(game) {
        var prefix = game.homeGame ? "vs " : "@ ";
        return {
            name: prefix + game.them.teamName,
            date: moment(game.date).format('M/D'),
            trueDate: game.date,
            result: game.us.pTS > game.them.pTS ? "W" : "L",
            usPts: game.us.pTS,
            themPts: game.them.pTS
        };
    });
}


function filterGamesByPlayersWithout(games, without) {
    return _.filter(games, function(game) {
        var players = game.us.players;
        var playersPlayed = false;
        _.each(without, function(playerName) {
            var player = getPlayer(players, playerName);
            if ( player && player.minutes > 1 ) {
                playersPlayed = true;
            }
        });
        return !playersPlayed;

    });

}

function sumValues(team, totals) {
    _.each(team, function (val, key) {
        if ( _.isNumber( val) ) {
            if ( totals[key] === undefined ) {
                totals[key] = val;
            } else {
                totals[key] += val;
            }
        }
    });
}

function getAverages(games) {
    if ( games.length ) {
        var usTotals = {};
        var themTotals = {};
        var spursIndexFactorsTotals = {};

        _.each(games, function(game) {
            sumValues(game.us, usTotals);
            sumValues(game.them, themTotals);
        });

        var usAverages = getTeamAverages(usTotals, themTotals, games);
        var themAverages = getTeamAverages(themTotals, usTotals, games);
        return {us: usAverages, them: themAverages};
    }
    return undefined;
}

function getTeamAverages(usTotals,themTotals, games) {
    var averages = {};
    _.each(usTotals, function(val, key) {
        averages[key] = val / games.length;
    });
    //the REAL averages for these stats are the total makes / total attempts
    averages.fgPct = usTotals.fGM / usTotals.fGA;
    averages.fg2Pct = usTotals.fG2M / usTotals.fG2A;
    averages.fg3Pct = usTotals.fG3M / usTotals.fG3A;
    averages.ftPct = usTotals.fTM / usTotals.fTA;

    var trueShootingAttempts = usTotals.fGA + 0.44 * usTotals.fTA;
    averages.tSPct = usTotals.pTS / (2 * trueShootingAttempts);
    averages.efgPct = (usTotals.fGM + 0.5 * usTotals.fG3M) / usTotals.fGA;

    averages.passesPerPoss = usTotals.pASS / usTotals.pACE;
    averages.percentOfFGAUncontested = usTotals.uFGA / usTotals.fGA;
    averages.percentOfFGAContested = usTotals.cFGA / usTotals.fGA;
    averages.uncontestedFGAPerPossession = usTotals.uFGA / usTotals.pACE;

    averages.pPP = (usTotals.pTS) / usTotals.pACE;
    averages.pPS = (usTotals.pTS) / (usTotals.fGA);
    averages.bCI = (usTotals.aST + usTotals.sTL) / usTotals.tO;

    averages.oRR = usTotals.oREB / (usTotals.oREB + themTotals.dREB);
    averages.expectedOREB = (LEAGUE_AVERAGE_ORR * (usTotals.oREB + themTotals.dREB)) / games.length;
    averages.oREBDiff = (usTotals.oREB - usTotals.expectedOREB) / games.length ;
    averages.oREBDiffAbs = Math.abs(averages.oREBDiff);
    return averages;
}

function getTeams(statsArrays, usTeam, game, date) {
    var us = {};
    var them = {};
    _.each(statsArrays, function(stats) {
        var usStats = _.findWhere(stats, {teamId: usTeam.teamId});
        us = _.defaults(us, usStats);
        them = _.defaults(them, _.without(stats, usStats)[0]);
    });

    us.minutes = getMinutes(us.mIN);
    them.minutes = getMinutes(them.mIN);

    us.shotChartUrl = getShotChartUrl(us, game, date);
    them.shotChartUrl = getShotChartUrl(them, game, date);

    addAdvancedStats(us, them);
    addAdvancedStats(them, us);

    _.extend(us, getSpursIndex(us, them));
    _.extend(them, getSpursIndex(them, us));

    return {us: us, them: them};
}

function getSeasonTypeFromDate(date) {
    date = moment(date);
    var year = date.get('year');
    var thisSeason = getSeasonDates(year);
    if ( date.between(thisSeason[SEASON_REGULAR].start, thisSeason[SEASON_REGULAR].end) ) {

    }
    var previousYear = moment(date).subtract(1, 'year').get('year');
}

function isPlayoffs(game, date) {
    var season = getSeasonDates(parseInt(game.sEASON, 10) + 1);
    return ( moment(date).isAfter(season[SEASON_PLAYOFFS].start) && moment(date).isBefore(season[SEASON_PLAYOFFS].end))
}

//TODO add shot chart links to each player in the players list
function getShotChartUrl(team, game, date, playerId) {
    var seasonType = isPlayoffs(game, date) ? "Playoffs" : "Regular Season";
    //game.sEASON is the first year, i.e. 2015 = 2015-2016
    //convert this to 2015-2016
    var season = game.sEASON + '-' + ((parseInt(game.sEASON, 10) + 1) + '').substr(2,4);
    var shotChartOptions = _.extend({}, SHOT_CHART_OPTIONS_DEFAULT, {SeasonType: seasonType, Season: season, GameID: game.gameId, TeamID: team.teamId, EndRange: team.minutes * 600})
    if (playerId) {
        _.extend(shotChartOptions, {PlayerID: playerId});
    }
    return "http://stats.nba.com/shotchart/#!/?" + queryString.stringify(shotChartOptions);
}

function getPlayers(playersArray, us, game, date) {
    var players = playersArray[0];
    _.each(players, function(player) {
        _.each(playersArray, function(playersStats) {
            var playerOtherStats = _.findWhere(playersStats, {playerId: player.playerId});
            _.extend(player, playerOtherStats);
        });
    });
    players = adornPlayerStats(players, us, game, date);

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

function adornPlayerStats(players, team, game, date) {
    players = _.where(players, {teamId: team.teamId});
    _.each(players, function(player){
        player.REB = player.oREB + player.dREB;
        var min = player.mIN;
        player.minutes = getMinutes(min);
        player.shotChartUrl = getShotChartUrl(team, game, date, player.playerId);
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
    //normalize some minor differences in naming
    var oppDreb = opp.dREB !== undefined ? opp.dREB : opp.oppDreb;
    var turnovers = team.tO !== undefined ? team.tO : team.tOV;

    team.fG2A = team.fGA - team.fG3A;
    team.fG2M = team.fGM - team.fG3M;
    team.fg2Pct = team.fG2M / team.fG2A;

    team.tSA = team.fGA + 0.44 * team.fTA;
    team.tSPct = team.pTS / (2 * team.tSA);
    team.efgPct = (team.fGM + 0.5 * team.fG3M) / team.fGA;


    team.pPP = (team.pTS) / team.pACE;
    team.pPS = (team.pTS) / (team.fGA);
    team.bCI = (team.aST + team.sTL) / turnovers;

    team.oRR = team.oREB / (team.oREB + oppDreb);
    team.expectedOREB = LEAGUE_AVERAGE_ORR * (team.oREB + oppDreb);
    team.oREBDiff = team.oREB - team.expectedOREB;
    team.oREBDiffAbs = Math.abs(team.oREBDiff);


    team.uncontestedFGAPerPossession = team.uFGA / team.pACE;
    team.percentOfFGAUncontested = team.uFGA / team.fGA;
    team.percentOfFGAContested = team.cFGA / team.fGA;
    team.uFGPct = team.uFGM / team.uFGA;
    team.cFGPct = team.cFGM / team.cFGA;

    team.passesPerPoss = team.pASS / team.pACE;
}

function addGameScore(player) {
    player.gS = player.pTS + 0.4 * player.fGM - 0.7 * player.fGA - 0.4*(player.fTA - player.fTM) + 0.7 * player.oREB + 0.3 * player.dREB + player.sTL + 0.7 * player.aST + 0.7 * player.bLK - 0.4 * player.pF - player.tO;
}


function getSpursIndex(team, opp) {
    //averages come from 2013-2014 season averages
    var factors = getSpursIndexFactors();
    var totalScore = 0;
    _.each(factors, function(factor) {
        var expected = factor.average;
        var actual = factor.opponentValue ? opp[factor.id] : team[factor.id];
        if ( factor.inverse ) {
            var score = 100 * factor.weight * (expected / actual);//TODO this could be infinite
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

    factors = _.sortBy(factors, function(factor){return -factor.weight});

    return {spursIndexFactors: factors, spursIndexScore: totalScore};
}

function getSpursIndexFactors() {
    return [
        {
            id: "efgPct",
            name: "Shooting (eFG%)",
            title: "Effective Field Goal Percentage - Effective Field Goal Percentage is a field goal percentage that is adjusted for made 3 pointers being 1.5 times more valuable than a 2 point shot.",
            weight: 0.20,
            average: 0.537,
            goodThreshold: 0.57,
            badThreshold: 0.48,
            percent: true
        },
        {
            id: "astPct",
            name: "Passing (AST%)",
            title: "Assist Percentage - Assist Percentage is the percent of team's field goals made that were assisted.",
            weight: 0.30,
            average: 0.621,
            goodThreshold: 0.68,
            badThreshold: 0.55,
            percent: true
        },
        {
            id: "drebPct",
            name: "Defensive Rebounding (DReb%)",
            title: "Defensive Rebound Percentage - The percentage of defensive rebounds a team obtains.",
            weight: 0.20,
            average: 0.764,
            goodThreshold: 0.81,
            badThreshold: 0.705,
            percent: true
        },
        {
            id: "defRating",
            name: "Defense (DefRtg)",
            title: "Defensive Rating - The number of points allowed per 100 possessions by a team. For a player, it is the number of points per 100 possessions that the team allows while that individual player is on the court.",
            weight: 0.20,
            average: 100.1,
            goodThreshold: 94,
            badThreshold: 106,
            percent: false,
            inverse: true
        },
        {
            id: "percentOfFGAUncontested",
            name: "Opponent % of FGA Uncontested",
            title: "The percentage of opponent's Field Goal Attempts which are uncontested.  A measure of how many open looks an opponent is afforded per possession.  A contested shot is one in which a defender is within 4 feet of the shooter",
            weight: 0.10,
            average:0.4081, //see comment at bottom of file
            goodThreshold: 0.35,
            badThreshold: 0.45,
            percent: true,
            inverse: true,
            opponentValue: true //get it from the opponent's stats - i.e. a defensive measure
        }
    ];
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

function getPlayerOnOffStats(team, player, onOffArray, opponent) {
    var playerOnCourt = {};
    var playerOffCourt = {};

    _.each(onOffArray, function(stats) {
        var playerOn = _.findWhere(stats.playersOnCourtTeamPlayerOnOffDetails, {vsPlayerId: player.playerId});
        var playerOff = _.findWhere(stats.playersOffCourtTeamPlayerOnOffDetails, {vsPlayerId: player.playerId});
        playerOnCourt = _.defaults(playerOnCourt, playerOn);
        playerOffCourt = _.defaults(playerOffCourt, playerOff);
    });

    var playerOffOpp = _.findWhere(opponent.playersOffCourtTeamPlayerOnOffDetails, {vsPlayerId:player.playerId})
    var playerOnOpp = _.findWhere(opponent.playersOnCourtTeamPlayerOnOffDetails, {vsPlayerId:player.playerId})

    addAdvancedStats(playerOnCourt, playerOnOpp);
    addAdvancedStats(playerOffCourt, playerOffOpp);

    var deltas = {};
    _.each(playerOnCourt, function(withVal, key) {
        var withoutVal = playerOffCourt[key];
        deltas[key] = withVal - withoutVal;
    });

    return {
        player: player,
        team: team,
        with: playerOnCourt,
        without: playerOffCourt,
        deltas: deltas
    }
}



/*

 2013-2014 opp FGA/game: 85.1 (http://stats.nba.com/team/#!/1610612759/stats/opponent/?Season=2013-14)

 possessions: 95.03 (http://stats.nba.com/team/#!/1610612759/stats/advanced/)

 contested FGA/poss = .53 (http://bigleagueinsights.com/contested-field-goal-data-finding-open-shot)


 .53 = cFGA/95.03

 cFGA = .53 * 95.03 = 50.37

 uFGA = 85.1 - 50.37 = 34.73

 uFGA/poss = 34.73 / 95.03 = .365

 uFGA/FGA = 34.73 /85.1

 */
