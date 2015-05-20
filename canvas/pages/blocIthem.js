define('blocIthem', [], function() {

	var _blocIthem = function() {

		// CONST
		var ITEM_WIDTH = 256;
		var ITEM_HEIGHT = 256;

		var _scope;
		var _item;
		var _itemText;
		var _txt;

		PIXI.DisplayObjectContainer.call(this);
		_scope = this;

		build();

		this.process = function() {

		};

		this.resize = function(w, h) {

		};

		function build() {

			var _rect = new PIXI.Graphics();
			_rect.beginFill(0x000000, 1);
			_rect.lineStyle(1, 0xFFFFFF);
			_rect.drawRect(2, 2, ITEM_WIDTH - 4, ITEM_HEIGHT - 4);
			_rect.endFill();
			_scope.addChild(_rect);

			_item = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture()));
			_itemText = new PIXI.Text("#", {font : "25px Proxima", fill : "#ffffff"});
			_scope.addChild(_item);
			_scope.addChild(_itemText);
			// _itemText.visible = false;
		}

		this.update = function(txt) {
			_txt = txt;
			_itemText.setText(_txt);
			_item.texture.destroy();
			_item.texture = new PIXI.Texture(new PIXI.BaseTexture());
		};

		this.updateImage = function(img) {
			_item.texture.destroy();
			_item.texture = new PIXI.Texture(PIXI.Texture.fromImage(img));
			// _item.visible = false;
			// console.log(((_scope !== null)? _scope.x:"") + "," + (
			// (_scope.parent !==null) ? _scope.parent.x: "" )+ "," +(
			// (_scope.parent.parent !==null) ? _scope.parent.parent .x: ""));
		};

	};

	_blocIthem.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

	_blocIthem.prototype.process = function() {
		this.process();
	};

	_blocIthem.prototype.resize = function(w, h) {
		this.resize(w, h);
	};

	return _blocIthem;
});