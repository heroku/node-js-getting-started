define('mapCursor', function(){

    var _blurFilter;

    var MapCursor = function(){
        PIXI.DisplayObjectContainer.call(this);

        this.number = new PIXI.DisplayObjectContainer();
        this.cursor = new PIXI.DisplayObjectContainer();

        this.numberText = new PIXI.Text("1", {font : "40px Proxima", fill : "#000000"});
        this.numberText.scale.x = this.numberText.scale.y = 0.5;

        this.numberBackground =  new PIXI.Graphics();
        this.numberBackground.clear();
        this.numberBackground.beginFill(0xFFFF00, 1);
        this.numberBackground.drawRect(0, 0, 100, 30);
        this.numberBackground.endFill();

        this.cursorIcon = new PIXI.Graphics();
        this.cursorIcon.clear();
        this.cursorIcon.beginFill(0x00FFFF, 1);
        this.cursorIcon.drawRect(0, 0, 30, 50);
        this.cursorIcon.endFill();

        this.cursorIcon.interactive = this.cursorIcon.buttonMode = true;

        this.cursorShadow = new PIXI.Graphics();
        this.cursorShadow.clear();
        this.cursorShadow.beginFill(0x000000, 1);
        this.cursorShadow.drawCircle(0, 0, 30);
        this.cursorShadow.endFill();

        this.cursorShadow.position.x = 15;
        this.cursorShadow.position.y = 60;

        this.pivot.y = 90;
        this.numberBackground.pivot.x = 50;
        this.cursor.pivot.x = 15;

        this.unDragging();

        this.addChild(this.number);
        this.addChild(this.cursor);

        this.cursor.addChild(this.cursorShadow);
        this.cursor.addChild(this.cursorIcon);

        this.number.addChild(this.numberBackground);
        this.number.addChild(this.numberText);
    };

    MapCursor.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    MapCursor.constructor = MapCursor.prototype.constructor;

    MapCursor.prototype.dragging = function(){
        TweenLite.to(this.cursorShadow.scale, 0.25, {x:1, y:0.5});
        TweenLite.to(this.cursorShadow, 0.25, {opacity: 0.2});
        TweenLite.to(this.number, 0.25, {alpha:1});
        TweenLite.to(this.number.position, 0.25, {y:-40});
        TweenLite.to(this.cursor.position, 0.25, {y:-10});
    };

    MapCursor.prototype.unDragging = function(){
        TweenLite.to(this.cursorShadow.scale, 0.25, {x:0.3, y:0.15});
        TweenLite.to(this.cursorShadow, 0.25, {opacity: 0.5});
        TweenLite.to(this.number, 0.25, {alpha:0});
        TweenLite.to(this.number.position, 0.25, {y:-30});
        TweenLite.to(this.cursor.position, 0.25, {y:-0});
    };

    MapCursor.prototype.setNumber = function(number){
        this.numberFace = number;
        this.numberText.setText(this.numberFace);
        this.numberText.pivot.x = this.numberText.width/2;
        //this.numberText.position.x = -this.numberText.width/4;
        //this.numberBackground.position.x = -this.numberBackground.width/2;
    };

    return MapCursor;
});