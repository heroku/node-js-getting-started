define('components/scrollLoader', ["messageBus"], function(messageBus){

	var img = "base64Image";

    var ScrollLoader = function(){
        PIXI.DisplayObjectContainer.call(this);

        this.background = new PIXI.Graphics();
        this.loader = document.getElementById('scrollLoader');

        this.addChild(this.background);

        messageBus.on('scrollLoader:showLoader', this.show.bind(this));
        messageBus.on('scrollLoader:hideLoader', this.hide.bind(this));
        messageBus.on('global:resize', this.resize.bind(this));

        this.resize();
        this.hide();

    };

    ScrollLoader.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    ScrollLoader.prototype.constructor = ScrollLoader.constructor;

    ScrollLoader.prototype.show = function(time){
        new TweenLite.to(this, (time|| 0.5), {alpha:1});
        new TweenLite.fromTo(this.loader, (time|| 0.5), {display:"block"}, {opacity:1});
    };

    ScrollLoader.prototype.hide = function(time){
        new TweenLite.to(this, (time|| 0.5), {alpha:0});
        new TweenLite.to(this.loader, (time|| 0.5), {opacity:0, onComplete:function(){
        	this.loader.style.display = "none";
        }.bind(this)});
    };

    ScrollLoader.prototype.toggle = function(time){
        this[this.loader.alpha === 0 ? "show" : "hide"](time);
    };

    ScrollLoader.prototype.resize = function(){
    	this.drawBackground();
    };

    ScrollLoader.prototype.drawBackground = function(w, h){
        this.background.clear();
        this.background.beginFill(0x262626, 1);
        this.background.drawRect(0, 0, (w||window.innerWidth), (h||window.innerHeight));
        this.background.endFill();
    };

    return ScrollLoader;
});