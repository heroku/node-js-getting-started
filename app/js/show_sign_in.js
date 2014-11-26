'use strict';

module.exports = function() {
  $('#login').slideDown('fast', function() {
    $('#email').focus();
  });
};
