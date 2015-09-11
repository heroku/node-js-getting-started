// Facebook app config for tests
module.exports = {
  facebook: {
    appId:      'YOUR APP ID',
    appSecret:  'YOUR APP SECRET',
    scope:      'email, user_about_me, user_birthday, user_location, publish_stream, read_stream, friends_location',
    callback:   'http://localhost:3000/'
  }
};
