const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const PROD_URI = 'mongodb://victor:victor1@ds239911.mlab.com:39911/back-end-lambda-notes';


module.exports = {
    connectTo: function (database = 'back-end-lambda-notes', host = 'localhost') {
        return mongoose.connect(PROD_URI);
    },
};
