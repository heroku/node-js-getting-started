var nba = require("nba");
var ep = require("nba/lib/endpoints");
var maps = require( "nba/lib/maps" );
var util = require( "nba/lib/util" );
var getJSON = require( "nba/lib/get-json" );

var translate = util.partial( util.translateKeys, maps.twoWayMap() );


var _ = require("underscore");

var extraEndpoints = {
    teamPlayerOnOff: {
        url: "http://stats.nba.com/stats/teamplayeronoffdetails",
        /* "MeasureType PerMode PlusMinus PaceAdjust Rank SeasonType The Outcome  The Location  Month The SeasonSegment  The DateFrom  The DateTo  OpponentTeamID The VsConference  The VsDivision  The GameSegment  Period LastNGames is required" */
        defaults: function(){return { "Season": "2014-15", "AllStarSeason": "", "SeasonType": "Regular Season", "LeagueID": "00", "MeasureType": "Base", "PerMode": "PerGame", "PlusMinus": "N", "PaceAdjust": "N", "Rank": "N", "Outcome": "", "Location": "", "Month": "0", "SeasonSegment": "", "DateFrom": "", "DateTo": "", "OpponentTeamID": "0", "VsConference": "", "VsDivision": "", "GameSegment": "", "Period": "0", "LastNGames": "0"} },
        transform: util.generalResponseTransform
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



