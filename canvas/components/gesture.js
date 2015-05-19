define('Gesture', [], function() {

	var Gesture = function(constraintAxe) {
		var _scope = this;
		_scope._constraintAxe = constraintAxe;
		_scope._isDown = false;
		_scope._target = null;
		_scope._domElement = null;
		_scope._inc = {x : 0, y : 0};
		_scope._pos = {x : 0, y : 0};
		_move = {x : 0, y : 0};
		_mouse = {x : 0, y : 0};

		_scope.onMove = function(event) {
			_mouse = event.getLocalPosition(this);
			_scope._pos = _mouse;
		};

		_scope.onDown = function(event) {
			_mouse = event.getLocalPosition(this);
			_scope.initPosItem();
			_scope._isDown = true;
		};

		_scope.onUp = function(event) {
			_mouse = event.getLocalPosition(this);
			_scope._isDown = false;

			if (!this._target) {
				return;
			}

			_scope._target.oldx = _scope._target.position.x;
			_scope._target.oldy = _scope._target.position.y;

		};

		_scope.initPosItem = function() {

			if (!this._target) {
				return;
			}

			_scope._pos = _mouse;

			_scope._target.oldPos.x = _scope._target.position.x;
			_scope._target.oldPos.y = _scope._target.position.y;

			_scope._target.startPoint.x = _scope._pos.x;
			_scope._target.startPoint.y = _scope._pos.y;

			_scope._target._lastMouseDownPoint = _scope._pos;

		};

	};

	function getMove(startPt, movePt) {
		return {x : (movePt.x - startPt.x >= 0) ? movePt.x - startPt.x : movePt.x - startPt.x, y : (movePt.y - startPt.y >= 0) ? movePt.y - startPt.y : movePt.y - startPt.y};
	}

	Gesture.prototype.drag = function(stage, target, moveCallBack) {

		stage.mousedown = stage.touchstart = this.onDown;
		stage.mouseup = stage.touchend = this.onUp;
		stage.mousemove = stage.touchmove = this.onMove;
		//
		this._target = target;
		this._moveCallBack = moveCallBack;

		if (!this._target)
			return;

		this._target.oldPos = {x : this._target.position.x, y : this._target.position.y};

		this._target.startPoint = {x : 0, y : 0};

		this.initPosItem();
		this._isDown = true;

	};

	Gesture.prototype.update = function(rect) {

		if (!this._target)
			return;

		if (this._isDown) {
			this._inc.x = this._pos.x;
			this._inc.y = this._pos.y;

			_move = getMove(this._target.startPoint, this._inc);

			var _x = Math.round(_move.x + this._target.oldPos.x);

			if (this._constraintAxe != "x") {
				if (rect) {
					if (_x <= 0) {
						this._target.position.y = 0;
					} else if (_x >= rect.width - this._target.width) {
						this._target.position.x = rect.width - this._target.width;
					} else {
						this._target.position.x = _x;
					}
				} else {
					this._target.position.x = _x;
				}

			//	if (this._oldx !== this._target.position.x) {
					if (this._moveCallBack) {
						this._moveCallBack();
					}
			//	}
				this._oldx = this._target.position.x;
			}

			var _y = Math.round(_move.y + this._target.oldPos.y);

			if (this._constraintAxe != "y") {
				if (rect) {
					if (_y <= 0) {
						this._target.position.y = 0;
					} else if (_y >= rect.height - this._target.height) {
						this._target.position.y = rect.height - this._target.height;
					} else {
						this._target.position.y = _y;
					}
				} else {
					this._target.position.y = _y;
				}

			//	if (this._oldy !== this._target.position.y) {
					if (this._moveCallBack) {
						this._moveCallBack();
					}
			//	}
				this._oldy = this._target.position.y;

			}

		}

		return this._pos;
	};

	return Gesture;
});