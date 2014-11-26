'use strict';

module.exports = function(jwt, type, note, $editor) {
  var apiNote = require('./api_note');
  var showSignIn = require('./show_sign_in');

  apiNote(jwt, type, note).then(function(results) {
    var template = Handlebars.compile(
      $('#notes-template').html());

    $(template(results)).
    hide().
    appendTo($('#notes')).
    slideDown('fast');

    if ($editor) { $editor.text(''); }
  }).fail(function() {
    showSignIn();
  });

  if (jwt) {
    $('#post').removeClass('disabled');
  }
  else {
    $('#post').addClass('disabled');
  }
};
