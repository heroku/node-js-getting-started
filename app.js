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
config.swaggerSecurityHandlers = {
  bearerAuth: function securityHandler1(req, authOrSecDef, scopesOrApiKey, callback) {
    // your security code
    console.log('bearerAuth:req.headers.authorization:' + req.headers.authorization);
    console.log("bearerAuth:token: " + scopesOrApiKey);
    // Look-up the token table
    // If the token, get the user object.
    // add the user object to the request.
    callback();
  }
};
//Alternate implementation
SwaggerTools.initializeMiddleware(SwaggerDoc, function (middleware) {
  // Setup security handlers
  app.use(middleware.swaggerSecurity({
    bearerAuth: function(req, def, scopes, callback) {
      // API KEY LOGIC HERE
      console.log("IT IS THE API KEY!!!");
      // IF SUCCESSFUL
      callback();
    }
  }));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  console.log('View Swagger UI at: http://127.0.0.1:8080/docs');
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  app.listen(port);
});
