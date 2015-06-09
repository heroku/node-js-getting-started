// app/config.js

var config   = {

  mongodb : 'mongodb://admin:omf123@ds037622.mongolab.com:37622/omf',
  FACEBOOK_APP_ID: '350563135133896',
  FACEBOOK_APP_SECRET: '56248b58d8e962d336f1825c2ba726a5',
  FACEBOOK_CALLBACK_URL: 'http://localhost:3000/auth/facebook/callback',
  TWITTER_CONSUMER_KEY: 'BOI0ViSz3O8uDOucsrr04EB60',
  TWITTER_CONSUMER_SECRET: 'H8FSNG6RGMNU3u2gFuAUipWRUfIjbKOKqsPM2rfSLzqelI17Eg',
  TWITTER_CALLBACK_URL: 'http://localhost:3000/auth/twitter/callback',
  TWITTER_ACCESS_TOKEN_KEY: '12637422-ODXi8fY4g6PmVr9Qfdn32U5Gtd3F0EwK1fs7A6gb3',
  TWITTER_ACCESS_TOKEN_SECRET: 'psjwfUMzfIlrA5IWWyGOoADp6cypyrO5EAJn8deKbTLbz',
  faces_by_request: 12,
  faces_by_search: 20

};

module.exports = config;
