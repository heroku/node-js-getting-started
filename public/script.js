'use strict';

$(function() {
  var $cmds = $('#cmds');
  var jwt = null;

  var apiUser = function(type, email, password) {
    var dfd = $.Deferred();
    var url = '/api/users';
    var data = email && password && {email: email, password: password};

    $.ajax({
      type: type,
      data: data && JSON.stringify(data),
      contentType: data && 'application/json; charset=utf-8',
      url: url,
      dataType: 'json',
      success: dfd.resolve,
      error: dfd.reject
    });

    return dfd.promise();
  };

  var apiNote = function(type, note, id) {
    var dfd = $.Deferred();
    var data = {noteBody: note, jwt: jwt};
    var url = '/api/notes';
    url += (type ? '' : '/get');
    url += (id ? '/' + id : '');
    type = type || 'POST';

    $.ajax({
      type: type,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      url: url,
      dataType: 'json',
      success: dfd.resolve,
      error: dfd.reject
    });

    return dfd.promise();
  };

  var showNotes = function(type, note, $editor) {
    apiNote(type, note).then(function(results) {
      var template = Handlebars.compile(
        $('#notes-template').html());

      $(template(results)).
        hide().
        appendTo($('#notes')).
        slideDown('fast');

      if ($editor) { $editor.text(''); }
    }).fail(function() {
      $('#login').slideDown('fast', function() {
        $('#email').focus();
      });
    });

    if (jwt) {
      $('#post').removeClass('disabled');
    }
    else {
      $('#post').addClass('disabled');
    }
  };

  var fixEditorWidth = function() {
    var $editors = $('.editor');
    var cs = window.getComputedStyle(document.body, null);

    var bodyWidth = $(document.body).width() -
      parseInt(cs.marginLeft) - parseInt(cs.marginRight);

    $editors.removeAttr('style');

    if ($('#editor').width() >= bodyWidth) {
      $editors.width(bodyWidth);
    }
  };

  apiUser('GET').then(function(results) {
    jwt = results.jwt;
  }).fail(function() {
    $('#login').slideDown('fast', function() {
      $('#email').focus();
    });
  }).always(function() {
    showNotes();
  });

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
        showNotes('POST', note, $editor);
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

    apiNote('DELETE', null, $note.attr('id')).then(function() {
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
      apiNote('PUT', note, $note.attr('id')).done(function() {
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
      apiUser('POST', $('#email').val(), $('#password').val()).
        then(function(results) {
          jwt = results.jwt;

          $('#login').slideUp('fast', function() {
            showNotes();
          });
        });
    }
  });

  fixEditorWidth();
});
