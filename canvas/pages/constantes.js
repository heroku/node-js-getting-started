define('constantes', function(){

    var constantes = {};

    // FONT ICONES
    constantes.icons = {};
    constantes.icons.FONT_NAME = "fontello";

    constantes.icons.FACEBOOK           = "N";
    constantes.icons.TWITTER            = "B";
    constantes.icons.GEEK_MOUSE         = "A";
    constantes.icons.ATHLETE_BASKETBALL = "Z";
    constantes.icons.HYPE_TIE           = "R";
    constantes.icons.WORKER_BRIEFCASE   = "E";
    constantes.icons.EXPLORER_ROCKET    = "T";
    constantes.icons.PARENT             = "Y";
    constantes.icons.SCIENTISTS         = "U";
    constantes.icons.STUDENT            = "I";
    constantes.icons.UNDISCLOSED        = "O";
    constantes.icons.CIRCLE_ARROW_DOWN  = "Q";
    constantes.icons.NOUN_ARTIST        = "P";
    constantes.icons.CIRCLE_CLOSE       = "S";
    constantes.icons.CLOSE              = "?";
    constantes.icons.LOGIN              = "C";
    constantes.icons.LOGOUT             = "V";
    constantes.icons.HELP               = "M";
    constantes.icons.SETTING_EDIT       = "G";
    constantes.icons.CAUTION            = "D";
    constantes.icons.COORDINATES        = "F";
    constantes.icons.USER               = "K";
    constantes.icons.HOME               = "J";
    constantes.icons.SEARCH             = "H";
    constantes.icons.SHARE              = "L";
    constantes.icons.ARROW_RIGHT        = "X";
    constantes.icons.ARROW_LEFT         = "W";

    // OCCUPATIONS
    constantes.occupations = {};
    constantes.occupations.GEEK        = constantes.icons.GEEK_MOUSE;
    constantes.occupations.ATHLETE     = constantes.icons.ATHLETE_BASKETBALL;
    constantes.occupations.HYPE        = constantes.icons.HYPE_TIE;
    constantes.occupations.WORKER      = constantes.icons.WORKER_BRIEFCASE;
    constantes.occupations.EXPLORER    = constantes.icons.EXPLORER_ROCKET;
    constantes.occupations.PARENT      = constantes.icons.PARENT;
    constantes.occupations.SCIENTIST   = constantes.icons.SCIENTISTS;
    constantes.occupations.STUDENT     = constantes.icons.STUDENT;
    constantes.occupations.UNDISCLOSED = constantes.icons.UNDISCLOSED;
    constantes.occupations.ARTIST      = constantes.icons.NOUN_ARTIST;

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

    // autoload font
    fontLoader(constantes.icons.FONT_NAME, constantes.icons.FACEBOOK);

    return constantes;
});