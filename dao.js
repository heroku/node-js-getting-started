var _ = require('underscore');
var Promise = require( "es6-promise" ).Promise;
var http = require ('http');	     // For serving a basic web page.
var mongoose = require ("mongoose"); // The reason for this demo.
var Schema = mongoose.Schema;

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});


// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var gameSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    gameId: {
        type: String
    },
    teamId: {
        type: String
    },

    game: {type:Schema.Types.Mixed},
    homeGame: {type:Schema.Types.Mixed},
    teams: {type:Schema.Types.Mixed},
    us: {type:Schema.Types.Mixed},
    them: {type:Schema.Types.Mixed},
    fourFactors: {type:Schema.Types.Mixed},
    players: {type:Schema.Types.Mixed},
    spursIndex: {type:Schema.Types.Mixed},
    gameFlowData: {type:Schema.Types.Mixed}
});

//gameSchema.index({ date: 1, type: -1 });


//disable for prod
//gameSchema.set('autoIndex', false);

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'PowerUsers' collection in the MongoDB database
var GameModel = mongoose.model('Game', gameSchema);

GameModel.remove({}).exec(function(err) {
    if (err) {
        console.log(err);
    }
})

module.exports = {
    getGame: function(options, callback, error) {
        GameModel.find(options).exec(function(err, result) {
            if ( err )  {
                error(err);
            } else {
                callback(result);
            }
        })
    },
    saveGame: function (data) {
        var game = new GameModel(data);
        game.save(function(err) {
            if ( err ) {
                console.log("MONGO: Error saving game", data);
            }
        });
    }

};


/*
GameModel.find({}).exec(function(err, result) {
    if (!err) {
        res.write(html1 + JSON.stringify(result, undefined, 2) +  html2 + result.length + html3);
        // Let's see if there are any senior citizens (older than 64) with the last name Doe using the query constructor
        var query = GameModel.find({'name.last': 'Doe'}); // (ok in this example, it's all entries)
        query.where('age').gt(64);
        query.exec(function(err, result) {
            if (!err) {
                res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
            } else {
                res.end('Error in second query. ' + err)
            }
        });
    } else {
        res.end('Error in first query. ' + err)
    }
});

*/
