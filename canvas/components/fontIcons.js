define('fontIcons', function(){

    /**
     * Simple font loader useful for canvas
     * @param name
     * @param glyph
     */
    var fontLoader = function fontLoader(name, glyph){
        var canvasFontLoader = document.createElement('div');
        canvasFontLoader.style.fontFamily = name;
        canvasFontLoader.innerHTML = glyph;
        document.body.appendChild(canvasFontLoader);
        setTimeout(function(){
            document.body.removeChild(canvasFontLoader);
        }, 100);
    };

    /**
     * Mapping font icon with fontello
     * @type {{}}
     */
    var icons = {};

    icons.load = function(){ fontLoader(icons.FONT_NAME, icons.FACEBOOK); };
    // troubleshooting with Tools.loadFont on first load after changing style.css content
    // Font display squares instead font characters
    //icons.load = function(){ Tools.loadFont(icons.FONT_NAME); };

    icons.FONT_NAME = "fontello";

    icons.FACEBOOK          = Tools.hexDecode("\e802");
    icons.FACEBOOK_1        = Tools.hexDecode("\e809");
    icons.FACEBOOK_SQUARED  = Tools.hexDecode("\e800");
    icons.FACEBOOK_CIRCLED  = Tools.hexDecode("\e801");

    icons.TWITTER           = Tools.hexDecode("\e803");
    icons.TWITTER_1         = Tools.hexDecode("\e806");
    icons.TWITTER_2         = Tools.hexDecode("\e807");
    icons.TWITTER_SQUARED   = Tools.hexDecode("\e804");
    icons.TWITTER_CIRCLED   = Tools.hexDecode("\e805");
    icons.TWITTER_RECT      = Tools.hexDecode("\e808");

    icons.HOME              = Tools.hexDecode("\e80a");

    icons.MAIL              = Tools.hexDecode("\e80c");
    icons.MAIL_ALT          = Tools.hexDecode("\e80b");
    icons.MAIL_1            = Tools.hexDecode("\e80d");
    icons.MAIL_2            = Tools.hexDecode("\e80e");

    icons.RIGHT_OPEN_BIG    = Tools.hexDecode("\e80f");
    icons.LEFT_OPEN_BIG     = Tools.hexDecode("\e810");
    icons.UP_OPEN_BIG       = Tools.hexDecode("\e811");
    icons.DOWN_OPEN_BIG     = Tools.hexDecode("\e812");

    icons.RIGHT_OPEN        = Tools.hexDecode("\e815");
    icons.LEFT_OPEN         = Tools.hexDecode("\e814");
    icons.UP_OPEN           = Tools.hexDecode("\e816");
    icons.DOWN_OPEN         = Tools.hexDecode("\e813");

    icons.RIGHT             = Tools.hexDecode("\e819");
    icons.LEFT              = Tools.hexDecode("\e818");
    icons.UP                = Tools.hexDecode("\e81a");
    icons.DOWN              = Tools.hexDecode("\e817");

    icons.RIGHT_CIRCLE      = Tools.hexDecode("\e81d");
    icons.LEFT_CIRCLE       = Tools.hexDecode("\e81c");
    icons.UP_CIRCLE         = Tools.hexDecode("\e81e");
    icons.DOWN_CIRCLE       = Tools.hexDecode("\e81b");
    icons.RIGHT_CIRCLE_1    = Tools.hexDecode("\e821");
    icons.LEFT_CIRCLE_1     = Tools.hexDecode("\e820");
    icons.UP_CIRCLE_1       = Tools.hexDecode("\e822");
    icons.DOWN_CIRCLE_1     = Tools.hexDecode("\e81f");

    icons.SEARCH            = Tools.hexDecode("\e823");
    icons.SEARCH_1          = Tools.hexDecode("\e824");
    icons.SEARCH_2          = Tools.hexDecode("\e825");
    icons.SEARCH_3          = Tools.hexDecode("\e827");
    icons.SEARCH_4          = Tools.hexDecode("\e828");
    icons.SEARCH_OUTLINE    = Tools.hexDecode("\e826");

    icons.FOOD              = Tools.hexDecode("\e829");

    icons.OK_SQUARED        = Tools.hexDecode("\e82a");
    icons.CANCEL_SQUARED    = Tools.hexDecode("\e82b");

    // autoload font
    icons.load();

    return icons;
});