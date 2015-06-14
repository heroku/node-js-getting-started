define('components/services', ['cacheControl'], function(CacheControl) {

	var cache = new CacheControl();

	var Services = function() {

		this.getFacesByRange = function(range, callback) {
            var xhr;

			var serviceQuery = "/api/faces_by_range/" + range.toString();

			if( cache.checkFromCache(serviceQuery) ){
				callback(cache.getFromCache(serviceQuery));
			}else{

				xhr = $.getJSON(serviceQuery).done(function(json) {
					callback(json);

                    //doneXHR(_xhr.ranges, xhr);
					cache.cache(serviceQuery, json);
				}).fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					console.log("Request Failed: " + err);
				});
			}

		};

		this.getFaces = function(number, callback, id) {

			var serviceQuery = "/api/faces_by_number/" + number;

			if( cache.checkFromCache(serviceQuery) ){
				callback(cache.getFromCache(serviceQuery), id, number);
			}else{
				$.getJSON(serviceQuery, {'id' : id}).done(function(json) {
					// TODO binding "id"
					callback(json, id, number);

                    //@TODO: add result condition. No cache for unclaim boxes
					cache.cache(serviceQuery, json);
				}).fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					console.log("Request Failed: " + err);
				});
			}

		};

		//search faces by account name or number
		this.searchFaces = function(query, callback) {

			var serviceQuery = "/api/faces/search/" + query;

			if( cache.checkFromCache(serviceQuery) ){
				callback(query, cache.getFromCache(serviceQuery));
			}else{
				$.getJSON(serviceQuery).done(function(json) {
					// TODO binding "id"
					callback(json, query);

                    //@TODO: add result condition. No cache for unclaim boxes
					cache.cache(serviceQuery, json);
				}).fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					console.log("Request Failed: " + err);
				});
			}

		};
	};

	return Services;

});
