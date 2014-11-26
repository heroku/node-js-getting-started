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
