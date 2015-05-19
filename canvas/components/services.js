define('components/services', [], function() {


  var Services = function(){

    this.getFaces = function(x, y, callback){

      $.getJSON( "http://localhost:3000/api/faces", {'x': x, 'y': y})
        .done(function( json ) {
          callback(json);
        })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log( "Request Failed: " + err );
      });
    };
  };

  return Services;

});
