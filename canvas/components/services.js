define('components/services', [], function() {

	var Services = function() {

		this.getFaces = function(number, callback, id) {

			$.getJSON("http://localhost:3000/api/faces_by_number/" + number, {'id' : id}).done(function(json) {
				// TODO binding "id"
				callback(json, id, number);
			}).fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err);
			});
		};

		//search faces by account name or number
		this.searchFaces = function(query, callback) {

			$.getJSON("http://localhost:3000/api/faces/search/" + query).done(function(json) {
				// TODO binding "id"
				callback(json, query);
			}).fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err);
			});
		};
	};

	return Services;

});
