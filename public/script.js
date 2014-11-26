(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function(jwt, type, note, id) {
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

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function(type, email, password, confirm) {
  var dfd = $.Deferred();
  var url = '/api/users';

  var data = email && password && confirm && {
    email: email,
    password: password,
    confirm: confirm
  };

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

},{}],3:[function(require,module,exports){
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

},{"./api_note":1,"./api_user":2,"./fix_editor_width":4,"./get_signed_in":5,"./hide_notes":6,"./set_signed_in":7,"./show_notes":8,"./show_sign_in":9}],4:[function(require,module,exports){
'use strict';

module.exports = function() {
  var $editors = $('.editor');
  var cs = window.getComputedStyle(document.body, null);

  var bodyWidth = $(document.body).width() -
  parseInt(cs.marginLeft) - parseInt(cs.marginRight);

  $editors.removeAttr('style');

  if ($('#editor').width() >= bodyWidth) {
    $editors.width(bodyWidth);
  }
};

},{}],5:[function(require,module,exports){
'use strict';

module.exports = function() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i] === 'SignedIn=true') {
      return true;
    }
  }

  return false;
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function() {
  var $notes = $('#notes .note');
  $notes.slideUp('fast', function() {
    $notes.remove();
  });
};

},{}],7:[function(require,module,exports){
'use strict';

module.exports = function(signedIn) {
  var expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = 'SignedIn=' + signedIn +
  '; path=/; expires=' + expires.toGMTString();

  document.cookie = '';
};

},{}],8:[function(require,module,exports){
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

},{"./api_note":1,"./show_sign_in":9}],9:[function(require,module,exports){
'use strict';

module.exports = function() {
  $('#login').slideDown('fast', function() {
    $('#email').focus();
  });
};

},{}]},{},[1,2,3,4,5,6,7,8,9]);
