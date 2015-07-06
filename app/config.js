// app/config.js

var config   = {

  mongodb : 'mongodb://admin:omf123@ds037622.mongolab.com:37622/omf',
  ROOT_URL: '',
  FACEBOOK_APP_ID: '350563135133896',
  FACEBOOK_APP_SECRET: '56248b58d8e962d336f1825c2ba726a5',
  FACEBOOK_CALLBACK_URL: 'http://onemillionhumans.com/auth/facebook/callback',
  TWITTER_CONSUMER_KEY: 'BOI0ViSz3O8uDOucsrr04EB60',
  TWITTER_CONSUMER_SECRET: 'H8FSNG6RGMNU3u2gFuAUipWRUfIjbKOKqsPM2rfSLzqelI17Eg',
  TWITTER_CALLBACK_URL: 'http://onemillionhumans.com/auth/twitter/callback',
  TWITTER_ACCESS_TOKEN_KEY: '12637422-ODXi8fY4g6PmVr9Qfdn32U5Gtd3F0EwK1fs7A6gb3',
  TWITTER_ACCESS_TOKEN_SECRET: 'psjwfUMzfIlrA5IWWyGOoADp6cypyrO5EAJn8deKbTLbz',
  AWS_ACCESS_KEY_ID: 'AKIAJGKBEORSU7NCL3PA',
  AWS_SECRET_ACCESS_KEY: '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',
  S3_BUCKET_NAME: 'files.onemillionhumans.com',
  faces_by_request: 10,
  faces_by_search: 20,
  mock: false,
  PORT: 80

};

module.exports = config;
