define('btnSocial', function(){

    /**
     * Add interactive social button with glyph
     * @param glyph
     * @param color
     * @param clickCallback
     * @constructor
     */
    var BtnSocial = function(glyph, color, clickCallback, w, h, fontSize){
        PIXI.DisplayObjectContainer.call(this);

        var _btn, _text, _styles;

        fontSize = fontSize || 30;

        _btn = new PIXI.Graphics();
        _btn.beginFill(0xFF0000, 0);
        _btn.drawRect(0, 0, w || 30, h || 30);
        _btn.endFill();
        _btn.interactive = true;
        _btn.buttonMode = true;
        _btn.tap = _btn.click = clickCallback;

        _styles = {font : fontSize+"px fontello", fill : color || "#FFFFFF"};

        _text = new PIXI.Text(glyph, _styles);

        _text.resolution = _app.canvas.renderer.resolution;

        this.disabled = false;
        this.resolution = _text.resolution;
        this._btn = _btn;
        this._text = _text;
        this.styles = _styles;
        this.glyph = glyph;

        this.addChild(_btn);
        this.addChild(_text);

    };

    BtnSocial.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    BtnSocial.constructor = BtnSocial.prototype.constructor;

    /**
     * fadeIn with enable actions
     * @param speed
     * @param delay
     */
    BtnSocial.prototype.enable = function(speed, delay){

        speed = speed || 0.25;
        delay = delay || 0;

        this.visible = !this.disabled;
        this._btn.interactive = this._btn.buttonMode = true;
        TweenLite.to(this, speed, {alpha: 1, delay: delay});
    };

    /**
     * Hide button
     */
    BtnSocial.prototype.hideElement = function(){
        this.disabled = true;
        this.visible = false;
    };

    /**
     * Show button
     */
    BtnSocial.prototype.showElement = function(){
        this.disabled = false;
        this.visible = true;
    };

    /**
     * fadeOut with disable actions
     * @param speed
     * @param delay
     */
    BtnSocial.prototype.disable = function(speed, delay){

        var _this = this;

        speed = speed || 0.25;
        delay = delay || 0;

        this._btn.interactive = this._btn.buttonMode = false;
        TweenLite.to(this, speed, {alpha: 0, delay: delay, onComplete: function(){
            _this.visible = false;
        }});
    };

    return BtnSocial;

});