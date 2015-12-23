var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// set the favicon
app.use(favicon(__dirname + '/public/favicon.jpg'));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  //response.redirect('/home');
	response.render('index', {meta: {section: 'index'}});
});

//Partial views
app.get('/:page', function(request, response){
	var page = request.params.page;
	response.render('pages/'+page, {meta: {section: page}});
});

//All else redirect to home
app.get('*', function(request, response, next) {
  response.redirect('/');
})

app.use(function(request, response, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handlers */

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, request, response, next) {
    response.status(err.status || 500);
    response.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, request, response, next) {
  response.status(err.status || 500);
  response.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


