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
