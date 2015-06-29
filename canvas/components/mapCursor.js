define('mapCursor', ['btnSocial', 'constantes', 'messageBus'], function(Button, constantes, messageBus){

    var _blurFilter;

    var MapCursor = function(){
        PIXI.DisplayObjectContainer.call(this);

        this.number = new PIXI.DisplayObjectContainer();
        this.cursor = new PIXI.DisplayObjectContainer();

        // Stop event propagation
        this.stopPropagation = new PIXI.Graphics();
        this.stopPropagation.clear();
        this.stopPropagation.beginFill(0x000000, 0);
        this.stopPropagation.drawRect(0, 0, 30, 50);
        this.stopPropagation.endFill();
        this.stopPropagation.x = -15;

        this.stopPropagation.interactive = true;
        this.stopPropagation.mousedown = this.stopPropagation.touchstart = function(){};

        this.numberText = new PIXI.Text("1", {font : "22px montserrat-light", fill : "#FFFFFF"});
        this.numberText.scale.x = this.numberText.scale.y = 0.5;

        this.cursorIcon = new Button(constantes.icons.COORDINATES, "#FFFFFF");
        this.cursorIcon.interactive = this.cursorIcon.buttonMode = true;

        this.pivot.y = 65;
        this.cursor.pivot.x = 15;
        this.number.position.y = -15;

        this.unDragging();

        this.addChild(this.number);
        this.addChild(this.cursor);

        this.cursor.addChild(this.cursorIcon);

        messageBus.on('all:colorChange', _.bind(this.updateCursorColor, this));
        messageBus.on('all:colorChange', _.bind(this.updateNumberColor, this));

        this.number.addChild(this.stopPropagation);
        this.number.addChild(this.numberText);
    };

    MapCursor.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    MapCursor.constructor = MapCursor.prototype.constructor;

    MapCursor.prototype.updateNumberColor = function(event){
        var color = event && event.data ? event.data.color : 0xFFFFFF;
        this.numberText.tint = color;
    };

    MapCursor.prototype.updateCursorColor = function(event){
        var color = event && event.data ? event.data.color : 0xFFFFFF;
        this.cursorIcon._text.tint = color;
    };

    MapCursor.prototype.dragging = function(){
        //TweenLite.to(this.number, 0.25, {alpha:1});
        //TweenLite.to(this.number.position, 0.25, {y:-15});
        //TweenLite.to(this.cursor.position, 0.25, {y:-5});
    };

    MapCursor.prototype.unDragging = function(){
        //TweenLite.to(this.number, 0.25, {alpha:0});
        //TweenLite.to(this.number.position, 0.25, {y:-10});
        //TweenLite.to(this.cursor.position, 0.25, {y:-0});
    };

    MapCursor.prototype.setNumber = function(number){
        this.numberFace = number;
        this.numberText.setText(this.numberFace);
        this.numberText.pivot.x = this.numberText.width/(2*this.numberText.scale.x);
    };

    return MapCursor;
});