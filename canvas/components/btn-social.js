define('btn-social', function(){

    /**
     *
     * @param glyph
     * @param color
     * @param clickCallback
     * @constructor
     */
    var BtnSocial = function(glyph, color, clickCallback, w, h){
        PIXI.DisplayObjectContainer.call(this);

        var _btn, _text;

        _btn = new PIXI.Graphics();
        _btn.beginFill(0xFF0000, 0);
        _btn.drawRect(0, 0, w || 30, h || 30);
        _btn.endFill();
        _btn.interactive = true;
        _btn.buttonMode = true;
        _btn.tap = _btn.click = clickCallback;

        _text = new PIXI.Text(glyph, {font : "60px fontello", fill : color || "#FFFFFF"});
        _text.x = _btn.width/2 - _text.width/2;
        _text.y = _btn.height/2 - _text.width/2;
        _text.pivot.x = _text.pivot.y = -_text.width/2;
        _text.scale.x = _text.scale.y = 0.5;

        this._btn = _btn;
        this._text = _text;

        this.addChild(_btn);
        this.addChild(_text);

    };

    BtnSocial.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    BtnSocial.constructor = BtnSocial.prototype.constructor;

    /**
     *
     * @param speed
     * @param delay
     */
    BtnSocial.prototype.enable = function(speed, delay){
        var speed, delay;

        speed = speed || 0.25;
        delay = delay || 0;

        this._btn.interactive = this._btn.buttonMode = true;
        TweenLite.to(this, speed, {alpha: 1, delay: delay});
    };

    /**
     *
     * @param speed
     * @param delay
     */
    BtnSocial.prototype.disable = function(speed, delay){
        var speed, delay;

        speed = speed || 0.25;
        delay = delay || 0;

        this._btn.interactive = this._btn.buttonMode = false;
        TweenLite.to(this, speed, {alpha: 0.1, delay: delay});
    };

    return BtnSocial;

});