define('colorMapping', function(){

    // @TODO: do color mapping !!!
    _mapping = {
        '0':0xFF0000,
        '50000':0x00FF00,
        '100000':0x0000FF
    };

    var ColorMapping = function(){

    };

    ColorMapping.prototype.getColorByBoxNumber = function(box){
        var color = 0x555555;

        for(var attr in _mapping ){
            if( box > attr*1){
                color = _mapping[attr];
            }
        }

        return color;
    };

    return new ColorMapping();
});