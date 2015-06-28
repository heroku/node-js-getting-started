define('mapBlur', ['messageBus'], function(messageBus){

    /**
     *
     * @param objectToBlur
     * @constructor
     */
    var MapBlur = function(objectToBlur, itemWidth, itemHeight){
        PIXI.DisplayObjectContainer.call(this);

        this.toBlur = new PIXI.DisplayObjectContainer();

        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.itemWidth = itemWidth;
        this.itemHeight = itemHeight;

        this.visible = false;

        this.objectToBlur = objectToBlur;

        this.renderTexture = new PIXI.RenderTexture(this.innerWidth, this.innerHeight);

        this.sprite = new PIXI.Sprite(this.renderTexture);

        this.tint = new PIXI.Graphics();

        this.tintBlack = new PIXI.Graphics();

        this.tint.blendMode = PIXI.blendModes.MULTIPLY;

        this.blurMask = new PIXI.Graphics();

        //this.mask = new PIXI.Graphics();
        //this.mask.clear();
        //this.mask.beginFill(0x000000, 1);
        //this.mask.drawRect(0, 0, this.width/2, this.height/2);
        //this.mask.endFill();

        //this.mask.position.x = this.width/2;
        //this.mask.position.y = this.height/2;

        this.resize();

        this.position.x = 0;
        this.position.y = 0;

        //this.toBlur.filters = [new PIXI.BlurFilter()];
        this.toBlur.mask = this.blurMask;

        //console.log('blur filter',  this.filterBlur);
        //this.scale.x = 1;
        //this.scale.y = 1;


        messageBus.on('map:blur', _.bind(this.blurMap, this));
        messageBus.on('map:unblur', _.bind(this.unBlurMap, this));
        messageBus.on('all:colorChange', _.bind(this.updateBlurColor, this));

        this.addChild(this.toBlur);
        this.toBlur.addChild(this.sprite);
        this.toBlur.addChild(this.tint);
        this.toBlur.addChild(this.tintBlack);

    };

    MapBlur.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    MapBlur.prototype.constructor = MapBlur.constructor;

    MapBlur.prototype.updateBlurColor = function(event) {
        var color = event && event.data ? event.data.color : 0xFF0000;
        this.tint.clear();
        this.tint.beginFill(color, 1);
        this.tint.drawRect(0, 0, this.innerWidth, this.innerHeight);
        this.tint.endFill();
    };

    /**
     *
     */
    MapBlur.prototype.blurMap = function() {
        this.visible = true;
        TweenLite.fromTo(this, 0.5, {alpha: 0}, {alpha:1});
    };

    /**
     *
     */
    MapBlur.prototype.unBlurMap = function(){
        TweenLite.fromTo(this, 0.5, {alpha:1}, {alpha:0, onComplete: function(){
            this.visible = false;
        }});
    };

    /**
     * refresh render texture
     */
    MapBlur.prototype.process = function(){
        if( this.visible ){
            this.renderTexture.render(this.objectToBlur);
        }
    };

    /**
     * resize sprite
     */
    MapBlur.prototype.resize = function(){
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.renderTexture.resize(this.innerWidth, this.innerHeight);

        this.sprite.width = this.innerWidth;
        this.sprite.height = this.innerHeight;

        this.tint.clear();
        this.tint.beginFill(0xFF0000, 1);
        this.tint.drawRect(0, 0, this.innerWidth, this.innerHeight);
        this.tint.endFill();

        this.tintBlack.clear();
        this.tintBlack.beginFill(0x000000, 1);
        this.tintBlack.drawRect(0, 0, this.itemWidth, this.itemHeight);
        this.tintBlack.endFill();

        this.tintBlack.position.x = this.innerWidth/2-this.itemWidth/2;
        this.tintBlack.position.y = this.innerHeight/2-this.itemHeight/2;

        this.blurMask.clear();
        this.blurMask.beginFill(0x000000, 1);
        this.blurMask.moveTo(0, 0);
        this.blurMask.lineTo(this.tintBlack.position.x, 0);
        this.blurMask.lineTo(this.tintBlack.position.x, this.tintBlack.position.y+this.tintBlack.height);
        this.blurMask.lineTo(this.tintBlack.position.x+this.tintBlack.width, this.tintBlack.position.y+this.tintBlack.height);
        this.blurMask.lineTo(this.tintBlack.position.x+this.tintBlack.width, this.tintBlack.position.y);
        this.blurMask.lineTo(this.tintBlack.position.x, this.tintBlack.position.y);
        this.blurMask.lineTo(this.tintBlack.position.x, 0);
        this.blurMask.lineTo(this.innerWidth, 0);
        this.blurMask.lineTo(this.innerWidth, this.innerHeight);
        this.blurMask.lineTo(0, this.innerHeight);
        this.blurMask.lineTo(0, 0);
        this.blurMask.endFill();

        this.process();

    };

    return MapBlur;

});