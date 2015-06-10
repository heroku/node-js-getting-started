define('cacheControl', function(){

    //@TODO: à tester

    /**
     * Request cached holder
     * @type {{}}
     * @private
     */
    _cached = {};

    /**
     * Simple Cache control no params implementation
     * @constructor
     */
    var CacheControl = function(){

    };

    /**
     *
     * @param key
     * @returns {boolean}
     */
    CacheControl.prototype.checkFromCache = function(key){
        return key in _cached;
    };

    /**
     *
     * @param key
     * @returns {*}
     */
    CacheControl.prototype.getFromCache = function(key){
        //console.log('fromCache', key);
        return _cached[key];
    };

    /**
     *
     * @param key
     * @param result
     */
    CacheControl.prototype.cache = function(key, result){
        //console.log('push to cache', key);
        _cached[key] = result;
    };

    return CacheControl;

});