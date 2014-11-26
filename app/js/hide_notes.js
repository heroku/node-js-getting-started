'use strict';

module.exports = function() {
  var $notes = $('#notes .note');
  $notes.slideUp('fast', function() {
    $notes.remove();
  });
};
