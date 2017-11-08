define('components/services', ['cacheControl', 'messageBus'], function(CacheControl, messageBus) {

	var cache = new CacheControl();

    //var _xhr = {ranges: {limit: 5, xhr: []}};

	var Services = function() {

		this.getFacesByRange = function(range, callback) {
            var xhr;

			var serviceQuery = "/api/faces/range/" + range.toString();

			if( cache.checkFromCache(serviceQuery) ){
				callback(cache.getFromCache(serviceQuery));
			}else{

				xhr = $.getJSON(serviceQuery).done(function(json) {
					console.log('JSON', json);
					callback(json);

                    //doneXHR(_xhr.ranges, xhr);
					cache.cache(serviceQuery, json);
					messageBus.emit('main:hideLoader');
					console.log('------hideloader');
				}).fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					console.log("Request Failed: " + err);
					messageBus.emit('main:hideLoader');
					console.log('------hideloader');
				});

                //_xhr.ranges.xhr.push(xhr);
                //clearXHR(_xhr.ranges);
			}

		};

		this.getFaces = function(number, callback, id) {

			var serviceQuery = "/api/faces/number/" + number;

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
                console.log('from cache', cache.getFromCache(serviceQuery));
				callback(cache.getFromCache(serviceQuery), query);
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

        //function doneXHR(xhrObject, xhr){
        //    _.each(xhrObject.xhr, function(element, i){
        //        if( element === xhr ){
        //            xhrObject.xhr.splice(i,1);
        //        }
        //    });
        //
        //}
        //
        //function clearXHR(xhrObject){
        //    var limit = xhrObject.limit;
        //    var xhrList = xhrObject.xhr;
        //    var first;
        //
        //    if( xhrList.length > limit){
        //        first = xhrList.slice(0,1);
        //    }
        //
        //    if( first && first.length ){
        //        first[0].abort();
        //    }

        //}
	};

	return Services;

});
