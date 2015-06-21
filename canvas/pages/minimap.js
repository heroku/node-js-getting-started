define('minimap', ['fontIcons', 'messageBus', 'btnSocial'], function(fontello, messageBus, Button){

    var _width, _height, _gridWidth, _gridHeight, _ITEM_WIDTH, _ITEM_HEIGHT;

    var Minimap = function(width, height, ITEM_WIDTH, ITEM_HEIGHT, gridWidth, gridHeight){
        PIXI.DisplayObjectContainer.call(this);

        _width = width;
        _height = height;
        _gridWidth = gridWidth;
        _gridHeight = gridHeight;
        _ITEM_WIDTH = ITEM_WIDTH;
        _ITEM_HEIGHT = ITEM_HEIGHT;

        this.mapDisplayed = false;

        this.button = new PIXI.DisplayObjectContainer();
        this.map = new PIXI.DisplayObjectContainer();

        this.button.x = 0;
        this.button.y = _height-40;

        this.map.x = 0;
        this.map.y = ITEM_HEIGHT-40;
        this.map.pivot.y = ITEM_HEIGHT;

        this.bgIcon = new PIXI.Graphics();
        this.bgIcon.clear();
        this.bgIcon.beginFill(0x0000FF, 1);
        this.bgIcon.drawRect(0, 0, 40, 40);
        this.bgIcon.endFill();

        this.icon = new Button(fontello.MAP_1, "#FFFFFF", _.bind(this.toggleMap, this));
        this.icon.x = 5;
        this.icon.y = 5;

        this.background = new PIXI.Graphics();
        this.background.clear();
        this.background.beginFill(0x00FF00, 1);
        this.background.drawRect(0, 0, _width, _height);
        this.background.endFill();

        this.map.interactive = this.map.buttonMode = true;
        this.map.mousedown = this.map.touchstart = _.bind(this.onDown, this);

        this.hideMap();

        this.addChild(this.button);
        this.addChild(this.map);

        this.button.addChild(this.bgIcon);
        this.button.addChild(this.icon);
        this.map.addChild(this.background);

    };

    Minimap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Minimap.constructor = Minimap.prototype.constructor;

    Minimap.prototype.onDown = function(event){

        var position = event.getLocalPosition(this.background);
        var ratioX = position.x/_width;
        var ratioY = position.y/_height;

        var x = Math.round(_gridWidth/_ITEM_WIDTH*ratioX);
        var y = Math.round(_gridHeight/_ITEM_HEIGHT*ratioY);

        var number = y * (_gridHeight/_ITEM_HEIGHT) + x;

        messageBus.emit('map:gotoFaceNumber', {number: number, directly:false});

    };

    Minimap.prototype.displayMap = function(){
        this.mapDisplayed = true;
        TweenLite.to(this.map.scale, 0.25, {x: 1, y:1});
        TweenLite.to(this.map, 0.25, {alpha: 1});
    };

    Minimap.prototype.hideMap = function(){
        this.mapDisplayed = false;
        TweenLite.to(this.map.scale, 0.25, {x: 0, y:0});
        TweenLite.to(this.map, 0.25, {alpha: 0});
    };

    Minimap.prototype.toggleMap = function(){
        this[this.mapDisplayed ? 'hideMap' : 'displayMap']();
    };

    Minimap.prototype.process = function(){};

    Minimap.prototype.resize = function(){};

    return Minimap;
});