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
