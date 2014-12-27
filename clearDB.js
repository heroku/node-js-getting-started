#! /app/bin/node
var _ = require('underscore');
var moment = require('moment');
var dao = require('./dao');

dao.remove({}).then(function(count, result){
    if ( result && !result.ok) {
        console.log("Error", result);
        process.exit(1);
    } else if (result) {
        console.log("Emptied DB",result);
        process.exit(0);
    }
});