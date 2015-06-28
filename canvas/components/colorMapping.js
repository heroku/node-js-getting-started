define('colorMapping', function(){

    // @TODO: do color mapping !!!
    _mapping = {
        //'0':  0x555555
        // first line
        '0':  0xFF0000,
        '200':0x00FF00,
        '400':0x0000FF,
        '600':0xFF00FF,
        '800':0x00FFFF,
        '999':0xFFFF00,

        // second line
        '1000':0xFF0000,
        '1200':0x00FF00,
        '1400':0x0000FF,
        '1600':0xFF00FF,
        '1800':0x00FFFF,
        '1999':0xFFFF00,

        // third line
        '2000':0xFF0000,
        '2200':0x00FF00,
        '2400':0x0000FF,
        '2600':0xFF00FF,
        '2800':0x00FFFF,
        '2999':0xFFFF00,

        // fourth line
        '3000':0x999999,
        '3200':0x999999,
        '3400':0x999999,
        '3600':0x999999,
        '3800':0x999999,
        '3999':0x999999
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

    ColorMapping.prototype.getRgbByPosition = function(x, y, maxX, maxY){
        var r, g, b;

        r = g = b = 0;
        //var rgb = {
        //    r: 255,
        //    g: 255,
        //    b: 255
        //};
        //
        //var maxX = maxX/2;
        //var maxY = maxY/2;
        //
        //if( x > maxX ){
        //    x = maxX-x;
        //}
        //
        //if( y > maxY ){
        //    y = maxY-y;
        //}

        return this.rgbToHex(r, g, b);
    };

    ColorMapping.prototype.rgbToHex = function(r,g,b){
        return _rgbToHex(r,g,b);
    };

    function _componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function _rgbToHex(r, g, b) {
        return "#" + _componentToHex(r) + _componentToHex(g) + _componentToHex(b);
    }

    return new ColorMapping();
});