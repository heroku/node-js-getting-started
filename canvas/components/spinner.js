define('components/spinner', function(){

    var Spinner = function(){
        PIXI.DisplayObjectContainer.call(this);

        var _this = this;
        var l;

        this.nbLines = 1;
        this.lines = [];

        for(var i = 0, l = this.nbLines; i<l; i++){
            l = new PIXI.Graphics();
            this.lines.push(l);
            this.addChild(l);
        }

        this.tw = new TweenLite.to(this, 1, {rotation: Math.PI*360/180, onComplete:function(){
            _this.tw.restart();
        }});

        this.hide();

    };

    Spinner.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Spinner.prototype.constructor = Spinner.constructor;

    Spinner.prototype.show = function(){
        this.visible = true;
        this.tw.resume();
    };

    Spinner.prototype.hide = function(){
        this.visible = false;
        this.tw.pause();
    };

    Spinner.prototype.updateColor = function(color){
        for(var i = 0, l = this.nbLines; i<l; i++){
            if( !this.lines[i] ) {
                continue;
            }
            this.lines[i].clear();
            this.lines[i].beginFill(color, 1);
            this.lines[i].drawRect(0, 0, 30, 3);
            this.lines[i].endFill();
            this.lines[i].pivot.x = 15;
            this.lines[i].pivot.y = 1.5;
        }
    };

    return Spinner;
});