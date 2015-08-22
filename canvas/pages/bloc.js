define('bloc', ["blocIthem"], function(BlocIthem) {

	var _bloc = function(ITEM_WIDTH, ITEM_HEIGHT, c, l) {

		PIXI.DisplayObjectContainer.call(this);
		PIXI.EventTarget.call(this);

		// CONST
		var _scope;
		var _item;
		var _c = c;
		var _l = l;
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
			console.log('DATA', data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].number >= 0) {
					if( _items[i] ){
						var id = data[i].number;
						var blocData = main.martixRange[id];

						if( _items[i].currentNumber && _items[i].currentNumber === blocData.number){
							continue;
						}

						_items[i].update(blocData);
						//console.log('PICTURE', _app.static_files(blocData.picture));
						_items[i].updateImage(_app.static_files(blocData.picture));
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
