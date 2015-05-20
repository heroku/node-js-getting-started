define('components/services', [], function() {

	var Services = function() {

		this.getFaces = function(x, y, callback, id) {

			$.getJSON("http://localhost:3000/api/faces", {'x' : x, 'y' : y, 'id' : id}).done(function(json) {
				// TODO binding "id"
				callback(json, id, x, y);
			}).fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err);
			});
		};
	};

	return Services;

});
