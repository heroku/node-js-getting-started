'use strict';

$(function() {
  var $cmds = $('#cmds');
  var jwt = null;

  var apiUser = require('./api_user');
  var apiNote = require('./api_note');
  var showSignIn = require('./show_sign_in');
  var showNotes = require('./show_notes');
  var hideNotes = require('./hide_notes');
  var fixEditorWidth = require('./fix_editor_width');
  var setSignedIn = require('./set_signed_in');
  var getSignedIn = require('./get_signed_in');

  if (getSignedIn()) {
    apiUser('GET').then(function(results) {
      jwt = results.jwt;
    }).fail(function() {
      showSignIn();
    }).always(function() {
      showNotes(jwt);
    });
  }
  else {
    showSignIn();
  }

  $(document.body).on('keydown', '.editor', function(event) {
    if ($(this).text().length >= 140 && event.which !== 8) {
      event.preventDefault();
    }
  });

  $('#post').on('click', function() {
    if (jwt) {
      var $editor = $('#editor');
      var note = $editor.text();

      if (note) {
        showNotes(jwt, 'POST', note, $editor);
      }
    }
  });

  $('#notes').on('click', '.note', function() {
    var $this = $(this);

    $('.note').
      removeClass('editor').
      removeAttr('contenteditable');

    $this.
      attr('contenteditable', true).
      focus().
      addClass('editor');

    $cmds.insertAfter($this).slideDown('fast');
    fixEditorWidth();
  });

  $('#delete').on('click', function() {
    var $note = $('#notes .editor');

    apiNote(jwt, 'DELETE', null, $note.attr('id')).then(function() {
      $cmds.slideUp('fast', function() {
        $note.slideUp('fast', function() {
          $note.remove();
        });
      });
    });
  });

  $('#update').on('click', function() {
    var $note = $('#notes .editor');
    var note = $note.text();

    if (note) {
      apiNote(jwt, 'PUT', note, $note.attr('id')).done(function() {
        $cmds.slideUp('fast', function() {
          $note.
            removeClass('editor').
            removeAttr('contenteditable');
        });
      });
    }
  });

  $(window).on('resize', function() {
    fixEditorWidth();
  });

  $('.input').on('keydown', function(event) {
    if (13 === event.which) {
      apiUser('POST', $('#email').val(), $('#password').val(),
        $('#confirm').val()).then(function(results) {
          jwt = results.jwt;

          $('#login').slideUp('fast', function() {
            showNotes(jwt);
            setSignedIn(true);
          });
        });
    }
  });

  $('#signout').on('click', function(event) {
    setSignedIn(false);
    showSignIn();
    hideNotes();
    event.preventDefault();
  });

  fixEditorWidth();
});
