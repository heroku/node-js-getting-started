'use strict';

module.exports = function(signedIn) {
  var expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = 'SignedIn=' + signedIn +
  '; path=/; expires=' + expires.toGMTString();

  document.cookie = '';
};
