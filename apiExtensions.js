var nba = require("nba-hack");
var ep = require("nba-hack/lib/endpoints");
var maps = require( "nba-hack/lib/maps" );
var util = require( "nba-hack/lib/util" );
var getJSON = require( "nba-hack/lib/get-json" );
var _ = require('underscore');

var twoWayMap = maps.twoWayMap();
_.extend(twoWayMap, {
    "showShots": "showShots",
    "mode": "mode",
    "showZones": "showZones",
    "showDetails": "showDetails",
    "endRange": "EndRange",
    "EndRange": "endRange"
});

var translate = util.partial( util.translateKeys, twoWayMap);

var extraEndpoints = {
    teamPlayerOnOff: {
        url: "http://stats.nba.com/stats/teamplayeronoffdetails",
        defaults: function(){return { "Season": "2014-15", "AllStarSeason": "", "SeasonType": "Regular Season", "LeagueID": "00", "MeasureType": "Base", "PerMode": "PerGame", "PlusMinus": "N", "PaceAdjust": "N", "Rank": "N", "Outcome": "", "Location": "", "Month": "0", "SeasonSegment": "", "DateFrom": "", "DateTo": "", "OpponentTeamID": "0", "VsConference": "", "VsDivision": "", "GameSegment": "", "Period": "0", "LastNGames": "0"} },
        transform: util.generalResponseTransform
    },
    shotChart: {
        url: "http://stats.nba.com/shotchart",
        defaults: function(){return {"TeamID":0,"GameID":0,"ContextMeasure":"FGA","Season":"2014-15","SeasonType":"Regular Season","RangeType":"2","StartPeriod":"1","EndPeriod":"10","StartRange":"0","EndRange":"28800","mode":"Advanced","showZones":"1","showDetails":"1","showShots":"1"} },
        transform: function(resp) {
            return resp;
        }
    }
};

_.extend(ep, extraEndpoints);

_.each(extraEndpoints, function(val, key) {
    nba.api[key] = function ( options ) {
        if ( options == null ) {
            options = {};
        }
        options = util.merge( ep[key].defaults(), translate( options ) );
        return getJSON( ep[key].url, options ).then( ep[key].transform );
    };
});



