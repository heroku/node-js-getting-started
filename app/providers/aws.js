var AWS = require('aws-sdk');

var config = require('../config');

AWS.config.region = 'us-west-2';
AWS.config.update({
    Bucket: config.S3_BUCKET_NAME,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});


var s3bucket = new AWS.S3();

module.exports = s3bucket;