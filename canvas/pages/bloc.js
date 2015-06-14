define('bloc', ["blocIthem"], function(BlocIthem) {

	var _bloc = function() {

		PIXI.DisplayObjectContainer.call(this);
		PIXI.EventTarget.call(this);

		// CONST
		var ITEM_WIDTH = 154;
		var ITEM_HEIGHT = 154;

		var _scope;
		var _item;
		var _c = 10;
		var _l = 1;
		var _width = _c * ITEM_WIDTH;
		var _height = _l * ITEM_HEIGHT;
		var _id = 0;
		var _items = [];

		_scope = this;
		_scope._width = _width;
		_scope._height = _height;

		build();

		function build() {
			var _posx = 0;
			var _posy = 0;
			for (var i = 0; i < _l; i++) {
				for (var j = 0; j < _c; j++) {
					_item = new BlocIthem(ITEM_WIDTH, ITEM_HEIGHT);
					_item.x = _posx;
					_item.y = _posy;
					_scope.addChild(_item);
					_items[_id] = _item;
					_id++;
					_posx += ITEM_WIDTH;
				}
				_posx = 0;
				_posy += ITEM_HEIGHT;
			}

		}

		this.setValue = function(data) {

			for (var i = 0; i < data.length; i++) {
				if (data[i].number >= 0) {
					var id = data[i].number;
					// console.log(main.martixRange[id]);
					var img = main.martixRange[id].picture || "/img/noimage.jpg";// + "?n=" +
					// Math.random() *
					// 1000000;

					if( _items[i] ){
						_items[i].setSocials(typeof main.martixRange[id].claim === 'undefined');
						_items[i].setClaim(main.martixRange[id].claim === false);
						_items[i].update(id);
						_items[i].updateImage(img);
					}

				}
			}
		};

		this.process = function() {

		};

		this.resize = function(w, h) {

		};

	};

	_bloc.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

	_bloc.prototype.process = function() {
		this.process();
	};

	_bloc.prototype.resize = function(w, h) {
		this.resize(w, h);
	};

	return _bloc;
});
