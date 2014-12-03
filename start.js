var generate = require('./generate');

process.on('uncaughtException', function (error) {
    console.log(error);
});


var argLength = process.argv.length;
if (argLength < 3 ) {
    console.log("Please pass a team name.  For instance 'Spurs'");
    throw "error";
}
var teamName = process.argv[2];
if ( !teamName ) {
    console.log("Please pass a team name");
    throw new Exception("Please pass a team name");
}

var date = null;
if ( process.argv.length > 3 ) {
    date = process.argv[3];
}

generate.generateStats(teamName, date);