define('minimap', ['fontIcons', 'messageBus', 'btnSocial', 'mapCursor'], function(fontello, messageBus, Button, MapCursor){

    var _width, _height, _gridWidth, _gridHeight, _ITEM_WIDTH, _ITEM_HEIGHT, _event, _lastNumber;

    /**
     * Minimap class
     * @param width
     * @param height
     * @param ITEM_WIDTH
     * @param ITEM_HEIGHT
     * @param gridWidth
     * @param gridHeight
     * @constructor
     */
    var Minimap = function(width, height, ITEM_WIDTH, ITEM_HEIGHT, gridWidth, gridHeight){
        PIXI.DisplayObjectContainer.call(this);

        _width = width;
        _height = height;
        _gridWidth = gridWidth;
        _gridHeight = gridHeight;
        _ITEM_WIDTH = ITEM_WIDTH;
        _ITEM_HEIGHT = ITEM_HEIGHT;

        this.mapDisplayed = false;
        this.isDragging = false;
        this.canDrag = true;
        this.dragTimer = null;

        this.button = new PIXI.DisplayObjectContainer();
        this.map = new PIXI.DisplayObjectContainer();
        this.cursor = new MapCursor();

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

        this.map.interactive = true;
        this.cursor.cursorIcon.interactive = this.cursor.cursorIcon.buttonMode = true;
        this.cursor.cursorIcon.mousedown = this.cursor.cursorIcon.touchstart = _.bind(this.onDown, this);

        window.addEventListener('mouseup', _.bind(this.onUp, this));
        window.addEventListener('mouseleave', _.bind(this.onUp, this));

        this.hideMap();

        this.cursor.position.x = 0;
        this.cursor.position.y = 0;

        this.addChild(this.button);
        this.addChild(this.map);
        this.addChild(this.cursor);

        this.button.addChild(this.bgIcon);
        this.button.addChild(this.icon);
        this.map.addChild(this.background);

    };

    Minimap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Minimap.constructor = Minimap.prototype.constructor;

    /**
     *
     * @param number
     */
    Minimap.prototype.updateCursorPosition = function(number){

        if( !this.canDrag ){
            return;
        }

        if( _lastNumber !== number ){
            this.cursor.setNumber(number);
            this.setCursorPositionByNumber(number);
        }
        _lastNumber = number
    };

    /**
     * on handle cursor
     * @param event
     */
    Minimap.prototype.onDown = function(event){
        _event = event;

        this.isDragging = true;
        this.cursor.dragging();


    };

    /**
     * on release cursor
     * @param event
     */
    Minimap.prototype.onUp = function(event){
        if(! this.isDragging ){
            return;
        }

        this.isDragging = false;
        this.canDrag = false;
        this.cursor.unDragging();

        clearTimeout(this.dragTimer);
        this.dragTimer = setTimeout(_.bind(function(){
            this.canDrag = true;
        }, this), 5000);

        messageBus.emit('map:gotoFaceNumber', {number: this.cursor.numberFace, directly:false});
    };

    /**
     * on move event move cursor position
     * @param event
     */
    Minimap.prototype.onMove = function(event){
        if( !this.isDragging ){
            return;
        }

        var position = event.getLocalPosition(this.background);
        this.cursor.position.x = Math.min(_width, Math.max(0,position.x));
        this.cursor.position.y = Math.min(_height, Math.max(0,position.y));

        position = this.cursor.position;

        var ratioX = position.x/_width;
        var ratioY = position.y/_height;

        var x = Math.round(_gridWidth/_ITEM_WIDTH*ratioX);
        var y = Math.round(_gridHeight/_ITEM_HEIGHT*ratioY);

        var number = y > 0 ? (y * (_gridHeight/_ITEM_HEIGHT) + x) - _gridHeight/_ITEM_HEIGHT : x;

        this.cursor.setNumber(Math.max(0, number));
    };

    /**
     *
     * @param number
     */
    Minimap.prototype.setCursorPositionByNumber = function(number){
        var position = {x:0, y:0};

        var xRatio = _gridWidth/_ITEM_WIDTH;
        var yRatio = _gridWidth/_ITEM_WIDTH;

        var y = Math.round(number/xRatio);
        var x = Math.round(number%yRatio);

        position.x = x/xRatio*_width;
        position.y = y/yRatio*_height;

        this.cursor.position.x = position.x;
        this.cursor.position.y = position.y;
    };

    /**
     * display map
     */
    Minimap.prototype.displayMap = function(){
        this.mapDisplayed = true;
        TweenLite.to(this.map.scale, 0.25, {x: 1, y:1});
        TweenLite.to(this.map, 0.25, {alpha: 1});
        TweenLite.to(this.cursor, 0.25, {alpha:1, delay:0.15});
        //TweenLite.to(this.cursor.position, 0.25, {y:0, delay:0.15});
    };

    /**
     * hide map
     */
    Minimap.prototype.hideMap = function(){
        this.mapDisplayed = false;
        TweenLite.to(this.map.scale, 0.25, {x: 0, y:0, delay:0.15});
        TweenLite.to(this.map, 0.25, {alpha: 0, delay:0.15});
        TweenLite.to(this.cursor, 0.25, {alpha:0});
        //TweenLite.fromTo(this.cursor.position, 0.25, {y:-10});
    };

    /**
     * display/hide map
     */
    Minimap.prototype.toggleMap = function(){
        this[this.mapDisplayed ? 'hideMap' : 'displayMap']();
    };

    /**
     * update frame callback
     */
    Minimap.prototype.process = function(){
        this.onMove(_event);
    };

    /**
     * resize viewport callback
     */
    Minimap.prototype.resize = function(){};

    return Minimap;
});