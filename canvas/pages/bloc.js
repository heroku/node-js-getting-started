define('bloc', ["blocIthem"], function(BlocIthem) {

	var _bloc = function() {

		PIXI.DisplayObjectContainer.call(this);
		PIXI.EventTarget.call(this);

		// CONST
		var ITEM_WIDTH = 256;
		var ITEM_HEIGHT = 256;

		var _scope;
		var _item;
		var _c = 4;
		var _l = 3;
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
					_item = new BlocIthem();
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

		this.setValue = function(val) {

	
			// _worker.removeEventListener("message", fromWorker, false);
			// _worker.addEventListener("message", fromWorker, false);

			for (var i = 0; i < val.length; i++) {
				var id = val[i].txt;
				var img = val[i].img + "?n=" + Math.random() * 1000000;
				_items[i].update("ID:" + id);
				_items[i].updateImage(img);
				// _worker.postMessage({id : id, img : img, i : i});
			}
		};

		function fromWorker(event) {
			console.log("fromWorker:" + event.data.id + "," + event.data.img + "," + event.data.i);
			_items[parseInt(event.data.i)].updateImage(event.data.img);
		}

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