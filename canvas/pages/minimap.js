define('minimap', ['constantes', 'messageBus', 'btnSocial', 'mapCursor', 'colorMapping'], function(constantes, messageBus, Button, MapCursor, colorMapping){

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

        this.icon = new Button(constantes.icons.COORDINATES, "#FFFFFF", _.bind(this.toggleMap, this));
        this.icon.x = 5;
        this.icon.y = 5;

        this.background = new PIXI.Graphics();

        this.home = new Button(constantes.icons.HOME, "#55acee", _.bind(this.goToMe, this));
        this.home.visible = !!_app.currentUser;

        this.cursor.cursorIcon.interactive = this.cursor.cursorIcon.buttonMode = true;
        this.cursor.cursorIcon.mousedown = this.cursor.cursorIcon.touchstart = _.bind(this.onDown, this);

        window.addEventListener('mouseup', _.bind(this.onUp, this));
        window.addEventListener('touchend', _.bind(this.onUp, this));
        window.addEventListener('mouseleave', _.bind(this.onUp, this));

        this.hideMap();
        this.updateBackgroundMap();

        this.background.interactive = true
        this.background.mousedown = this.background.touchstart = function(){};

        this.cursor.position.x = 0;
        this.cursor.position.y = 0;

        this.home.position = this.getHomePosition();
        this.home.pivot.x = this.home.width/2;
        this.home.pivot.y = this.home.height/2;

        this.mapContainer = new PIXI.DisplayObjectContainer();

        this.mapContainer.x = 40;
        this.mapContainer.y = 30;

        this.addChild(this.button);
        this.addChild(this.mapContainer);

        this.mapContainer.addChild(this.map);
        this.mapContainer.addChild(this.cursor);

        messageBus.on('all:colorChange', _.bind(this.updateBackgroundMap, this));
        messageBus.on('all:colorChange', _.bind(this.updateIconsColor, this));

        this.button.addChild(this.icon);
        this.map.addChild(this.background);
        this.map.addChild(this.home);

    };

    Minimap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Minimap.constructor = Minimap.prototype.constructor;

    Minimap.prototype.updateIconsColor= function(event){
        var color = event && event.data ? event.data.color : 0xFFFFFF;
        this.icon._text.tint = color;
    };

    Minimap.prototype.updateNumberColor = function(){

    };

    Minimap.prototype.updateBackgroundMap = function(event){
        var color = event && event.data ? event.data.color : 0x000000;

        this.background.clear();
        this.background.beginFill(0x000000, 0.5);
        this.background.lineStyle(1, color);
        this.background.drawRect(0, 0, _width, _height);
        this.background.endFill();
    };

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

        messageBus.emit('all:colorChange', {color:colorMapping.getColorByBoxNumber(number)});
        Backbone.history.navigate("/number/"+number, {trigger: false, replace: true});

        _lastNumber = number
    };

    /**
     * on handle cursor
     * @param event
     */
    Minimap.prototype.onDown = function(event){
        _event = event;

        messageBus.emit("blocItem:setUnselected");

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

        var x = Math.max(0, Math.round(_gridWidth/_ITEM_WIDTH*ratioX)-1);
        var y = Math.round(_gridHeight/_ITEM_HEIGHT*ratioY);

        var number = y > 0 ? (y * (_gridHeight/_ITEM_HEIGHT) + x) - _gridHeight/_ITEM_HEIGHT : x;

        number = Math.max(0, number);

        this.cursor.setNumber(number);

        messageBus.emit('all:colorChange', {color:colorMapping.getColorByBoxNumber(number)});
    };

    /**
     *
     * @param number
     */
    Minimap.prototype.setCursorPositionByNumber = function(number){
        var position = this.calcPositionByNumber(number);

        this.cursor.position.x = position.x;
        this.cursor.position.y = position.y;
    };

    Minimap.prototype.calcPositionByNumber = function(number){
        var position = {x:0, y:0};

        var xRatio = _gridWidth/_ITEM_WIDTH;
        var yRatio = _gridWidth/_ITEM_WIDTH;

        var y = Math.round(number/xRatio);
        var x = Math.round(number%yRatio);

        position.x = x/xRatio*_width;
        position.y = y/yRatio*_height;

        return position;

    };

    Minimap.prototype.getHomePosition = function(){
        if(_app.currentUser){
            return this.calcPositionByNumber(_app.currentUser.number);
        }else{
            return {x: 0, y:0};
        }
    };

    /**
     *
     */
    Minimap.prototype.goToMe = function(){
        messageBus.emit('map:gotoFaceNumber', {number: _app.currentUser.number, directly: false});
    };

    /**
     * display map
     */
    Minimap.prototype.displayMap = function(){
        this.mapDisplayed = true;
        TweenLite.to(this.map.scale, 0.25, {x: 1, y:1});
        TweenLite.to(this.map, 0.25, {alpha: 1});
        TweenLite.to(this.cursor, 0.25, {alpha:1, delay:0.15});
        //TweenLite.to(this.button, 0.25,{alpha:0});
        this.icon._text.setText(constantes.icons.CIRCLE_CLOSE);
    };

    /**
     * hide map
     */
    Minimap.prototype.hideMap = function(){
        this.mapDisplayed = false;
        TweenLite.to(this.map.scale, 0.25, {x: 0, y:0, delay:0.15});
        TweenLite.to(this.map, 0.25, {alpha: 0, delay:0.15});
        TweenLite.to(this.cursor, 0.25, {alpha:0});
        //TweenLite.to(this.button, 0.25,{alpha:1});
        //TweenLite.fromTo(this.cursor.position, 0.25, {y:-10});
        this.icon._text.setText(constantes.icons.COORDINATES);
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
