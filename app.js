'use strict';

var app = require('express')();
var SwaggerExpress = require('swagger-express-mw');
var SwaggerTools = require('swagger-tools');
var YAML = require('yamljs');
var SwaggerDoc = YAML.load('api/swagger/swagger.yaml');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerTools.initializeMiddleware(SwaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  console.log('View Swagger UI at: http://127.0.0.1:8080/docs');
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 5000;
  app.listen(port);
});
