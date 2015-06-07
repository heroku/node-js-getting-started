var ScrollContainerType = ScrollContainerType || {};
ScrollContainerType.SCROLL = "scroll";
ScrollContainerType.SLIDER = "slider";

define('ScrollContainer', ['Gesture', 'messageBus'], function(Gesture, messageBus) {

	var ScrollContainer = function(type, stage, rect, viewPort, constraintAxe) {

		var SPEED_SPRINGNESS = 0.4;
		var DECAY = 0.95;// speed
		var MOUSE_DOWN_DEC = 0.7;
		var BOUNCING_SPRINGESS = 0.25;// back speed
		var MAX = 5000;
		var moved = false;

		var _type = type;
		var _constraintAxe;
		var _maxWidth;
		var _maxHeight;
		var _min = 0;
		var _y = 0;
		var _x = 0;
		var _rect;
		var _bouncingy = 0;
		var _bouncingx = 0;
		var _velocity = 0;
		var _velocitx = 0;
		var _oldY, _pos, _bg, _gesture;
		var __slides = 0;
		var _ID = 0;
		var __currentID = 0;
		var _onChangeCB;
		var _onAfterChangeCB;
		var __transitionTime = 0.5;
		var __margeToSlide = 1.5;
		var _movePt = {};
		var _move;
		var _event;
		var __viewPort;
		var _oldPos;
		var _isDown = false;
		var _scope;
		var _stage;

		PIXI.DisplayObjectContainer.call(this);
		PIXI.EventTarget.call(this);

		_stage = stage;
		_rect = rect;
		__viewPort = viewPort || new PIXI.Rectangle();
		_scope = this;
		_constraintAxe = constraintAxe;
		_maxWidth = (rect) ? rect.width : 0;
		_maxHeight = (rect) ? rect.height : 0;
		_min = (_maxWidth === 0 || _maxHeight === 0) ? 0 : 0;
		_bg = new PIXI.Graphics();
		_bg.beginFill(0xFF0000, 0);
		_bg.drawRect(0, 0, 1, 1);
		_bg.endFill();
		_scope.addChild(_bg);

		if (_type == ScrollContainerType.SLIDER) {
			this._slides = function(val) {
				__slides = val;
			};

			this._next = function(force) {
				if (_ID < __slides.length - 2) {
					_ID++;
				} else {
					_ID = __slides.length - 1;
				}
				this._goto(_ID, __transitionTime, force);
			};

			this._prev = function(force) {
				if (_ID > 0) {
					_ID--;
				} else {
					_ID = 0;
				}
				this._goto(_ID, __transitionTime, force);
			};

			this._goto = function(id, time, force) {
				if (__currentID !== id || force) {
					_pos = -__slides[id].x + (__viewPort.width >> 1);
					__currentID = _ID = id;
					TweenLite.to(this, time || __transitionTime, {x : _pos, onCompleteParams : [__currentID], onComplete : function(arg) {
						if (_onAfterChangeCB) {
							_onAfterChangeCB(arg);
						}
					}});

					if (_onChangeCB) {
						_onChangeCB(__currentID);
					}
				}
			};

			this._viewPort = function(val) {
				__viewPort = val;
				this._goto(__currentID, 0.25, true);
			};

		}

		this._viewRect = function(val) {
			_bg.scale.x = _maxWidth = val.width;
			_bg.scale.y = _maxHeight = val.height;

			if (_type == ScrollContainerType.SLIDER) {
				this._goto(__currentID, 0.25, true);
			}
		};

		this._update = function(rect) {

			_pos = _gesture.update(rect);

			_velocity += ((_pos.y - this._lastMouseDownPoint.y) * SPEED_SPRINGNESS);
			_velocitx += ((_pos.x - this._lastMouseDownPoint.x) * SPEED_SPRINGNESS);
			this._lastMouseDownPoint = _pos;

			_velocity *= MOUSE_DOWN_DEC;
			_velocitx *= MOUSE_DOWN_DEC;

			if (_type === ScrollContainerType.SLIDER) {
				_move = MathUtils.getMovement(_movePt, _event.getLocalPosition(_stage));
			}

			return _pos;
		};

		this._back = function() {

			_y = this.position.y;
			_x = this.position.x;

			_bouncingy = 0;
			_bouncingx = 0;

			if (_rect) {
				if (_y > _min || _maxHeight <= __viewPort.height) {
					_bouncingy = -_y * BOUNCING_SPRINGESS;
				} else if (_y + _maxHeight < __viewPort.height) {
					_bouncingy = (__viewPort.height - _maxHeight - _y) * BOUNCING_SPRINGESS;
				}

				if (_x > _min || _maxWidth <= __viewPort.width) {
					_bouncingx = -_x * BOUNCING_SPRINGESS;
				} else if (_x + _maxWidth < __viewPort.width) {
					_bouncingx = (__viewPort.width - _maxWidth - _x) * BOUNCING_SPRINGESS;
				}
			}

			if (Math.abs(_velocity) <= 0.2) {
				_velocity = 0;
			}
			if (Math.abs(_velocitx) <= 0.2) {
				_velocitx = 0;
			}

			_velocity *= DECAY;
			_velocitx *= DECAY;
			if (_constraintAxe != "y") {
				this.position.y += Math.round(_velocity + _bouncingy);
			}

			if (_constraintAxe != "x") {
				this.position.x += Math.round(_velocitx + _bouncingx);
			}

			if( ( Math.abs(_velocitx) !== 0 || Math.abs(_velocity) !== 0 ) && moved === false ){
				messageBus.emit('ScrollContainer:StartMoving');
				moved = true;
			}

			if( Math.abs(_velocitx) <= 0 && Math.abs(_velocity) <= 0 && moved === true ){
				messageBus.emit('ScrollContainer:StopMoving');
				moved = false;
			}
		};

		this._onChange = function(val) {
			_onChangeCB = val;
		};

		this._onAfterChange = function(val) {
			_onAfterChangeCB = val;
		};

		function initEvents() {
			_scope.interactive = true;
			_scope.mousedown = _scope.touchstart = onDown;
			_scope.mouseup = _scope.touchend = onUp;
		}

		this.isDown = function() {
			return _isDown;
		};

		this.type = function() {
			return _type;
		};

		this._currentID = function() {
			return __currentID;
		};

		this._transitionTime = function(val) {
			__transitionTime = val;
		};

		this._touchable = function(val) {
			_scope.interactive = val;
			_gesture.drag(_stage, this);
		};

		this._margeToSlide = function(val) {
			__margeToSlide = val;
		};

		this.progress = function() {
			var _val = -((this.position.y) / (_maxHeight - __viewPort.height));
			_val = (_val <= 0) ? 0 : (_val >= 1) ? 1 : _val;
			if (this.progressCallBack) {
				this.progressCallBack(_val);
			}
		};

		function onDown(event) {
			_event = event;
			_isDown = true;
			_oldPos = _gesture.update(rect);
			TweenLite.killTweensOf(this);
			_scope.dispatchEvent({type : "down"});

		}

		function onUp() {
			_isDown = false;
			if (_type == ScrollContainerType.SLIDER) {
				var _newPos = _event.getLocalPosition(_stage);
				var _delta = (_oldPos.x - _newPos.x);
				var _direction = (_delta > 0) ? 1 : -1;

				if (_move.x > 10 || (Math.abs(_delta) > __viewPort.width * __margeToSlide && _direction < 0)) {
					this._prev(true);
				} else if (_move.x < -10 || (Math.abs(_delta) > __viewPort.width * __margeToSlide && _direction > 0)) {
					this._next(true);
				} else {
					this._goto(__currentID, __transitionTime, true);
				}
			}
		}

		_gesture = new Gesture(_constraintAxe);
		_gesture.drag(_stage, this);

		this.position.x = 0;
		this.position.y = 0;

		initEvents();

	};

	// public
	ScrollContainer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

	ScrollContainer.prototype.onChange = function(val) {
		this._onChange(val);
	};

	ScrollContainer.prototype.onAfterChange = function(val) {
		this._onAfterChange(val);
	};

	ScrollContainer.prototype.next = function() {
		this._next();
	};

	ScrollContainer.prototype.prev = function() {
		this._prev();
	};

	ScrollContainer.prototype.goTo = function(id) {
		this._goto(id);
	};

	ScrollContainer.prototype.setSlides = function(val) {
		this._slides(val);
	};

	ScrollContainer.prototype.viewRect = function(val) {
		this._viewRect(val);
	};

	ScrollContainer.prototype.viewPort = function(val) {
		this._viewPort(val);
	};

	ScrollContainer.prototype.setTransitionTime = function(val) {
		this._transitionTime(val);
	};

	ScrollContainer.prototype.touchable = function(val) {
		this._touchable(val);
	};

	ScrollContainer.prototype.setMargeToSlide = function(val) {
		this._margeToSlide(val);
	};

	ScrollContainer.prototype.upDate = function(rect) {
		return this._update(rect);
	};

	ScrollContainer.prototype.back = function() {
		this._back();
	};

	ScrollContainer.prototype.scroll = function(rect) {

		if (this.isDown()) {
			this.upDate(rect);
		} else {
			if (this.type() == ScrollContainerType.SCROLL) {
				this.back();
			}
		}

		if (this.progressCallBack) {

			if (_oldY !== this.position.y) {
				this.progress();
			}
			_oldY = this.position.y;

		}

	};

	ScrollContainer.prototype.progress = function() {
		this.progress();
	};

	ScrollContainer.prototype.onProgress = function(callBack) {
		this.progressCallBack = callBack;
	};

	ScrollContainer.prototype.dispose = function() {
		this._dispose();
	};

	return ScrollContainer;
});
