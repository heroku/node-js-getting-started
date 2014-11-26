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
