$(function() {
  var getNotes = function() {
    var dfd = $.Deferred();

    $.ajax({
      url: '/api/notes',
      dataType: 'json',
      success: dfd.resolve,
      error: dfd.reject
    });

    return dfd.promise();
  };

  getNotes().then(function(results) {
    var template = Handlebars.compile(
      $('#notes-template').html());

    $(template(results)).
      hide().
      appendTo($('#notes')).
      slideDown('fast');
  });
});
