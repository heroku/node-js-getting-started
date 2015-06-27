define('map', ["ScrollContainer", "bloc", "components/services", 'messageBus', 'minimap', 'mapBlur'], function(ScrollContainer, Bloc, Services, messageBus, Minimap, MapBlur) {

	var _map = function() {

		var _scope;
		var _blocs = [];
		var _bloc;
		var _scrollObject;
		var _scrollObjectContainer = new PIXI.DisplayObjectContainer();
		var _minimap;
		var _w;
		var _h;
		var _coefPage = window.screen.width > 1600 ? 0.5 :  (Tools.getDevice() == "desktop")  ? 1 : 2;
        var ITEM_WIDTH = Tools.getDevice() === 'desktop' ? 180 : 190;
        var ITEM_HEIGHT = Tools.getDevice() === 'desktop' ? 180 : 190;
        var MIN_SPEED = 1;
        var MAX_SPEED = 13;
        var MIN_FACES = 1-1;
        var MAX_FACES = 1000000-1;
		// nb col to display
		// Must be modified with screen size
		var _c = 2;
		// nb line to display
		// Must be modified with screen size
		var _l = window.screen.width > 1600 ? 8 : window.screen.width > 1024 ? 5 : 4;
		var _id = 0;
		var _maxWidth = 0;
		var _maxHeight = 0;
		var _lastItemX = 0;
		var _lastItemY = 0;
		var _rangeLinge = 1000;
		var _rangeColonne = 100*_coefPage;
		var _rangePage = 10/_coefPage;
		var nbItemByLine = 1;
		var nbItemByCol = 10/_coefPage;
		var maxGridWidth  = _rangeColonne*_rangePage*ITEM_WIDTH; // only if 1 page per line
		var maxGridHeight = _rangeLinge*ITEM_HEIGHT; // only if 1 page per line
		var _minimapWidth  = ITEM_WIDTH; // only if 1 page per line
		var _minimapHeight = ITEM_HEIGHT; // only if 1 page per line
		var _ranges = [];
		var _ID = 0;
		var _hideTimer = null;
		var _services = new Services();
		var _mapMoved = false;
		var _mapBlur;

		var thottleUpdateMinimap = _.throttle(function(){
				_minimap.updateCursorPosition(getCenterNumber());
			}, 1000);

		var thottleUpdateGrid = _.throttle(function(){
				updateGrid();
			}, 1000);

		messageBus.on('ScrollContainer:StartMoving', function(){
			_mapMoved = true;
		});
		messageBus.on('ScrollContainer:StopMoving', function(){
			_mapMoved = false;
		});

		PIXI.DisplayObjectContainer.call(this);
		_scope = this;
		build();

		function build() {

			var i;
			var j;


			for (i = 0; i < _rangeLinge; i++) {
				for (j = 0; j < _rangeColonne; j++) {
					var _tmp = [];
					for (var k = 0; k < _rangePage; k++) {
						//_tmp.push({number : _ID, picture : "img/" + ((_ID === 0) ? "logo.jpg" : parseInt(MathUtils.randomMinMax(0, 15)) + ".jpg")});
						_tmp.push({number : _ID, picture : "img/" + parseInt(MathUtils.randomMinMax(1, 10)) + ".jpg"});
						main.martixRange[_ID] = {number : _ID, picture : "/img/"+parseInt(MathUtils.randomMinMax(1, 10))+".jpg"};
						_ID++;
					}
					// _ranges => "getFaces(x,y) => [12]"
					_ranges[j + "," + i] = _tmp;
				}
			}


			_scrollObject = new ScrollContainer(ScrollContainerType.SCROLL, main.stage);
			_mapBlur = new MapBlur(_scrollObjectContainer, ITEM_WIDTH, ITEM_HEIGHT);
			_minimap = new Minimap(_minimapWidth, _minimapHeight, ITEM_WIDTH, ITEM_HEIGHT, maxGridWidth, maxGridHeight);
			_scrollObject.addEventListener("down", onScrollMouseDown);
			_scrollObject.addEventListener("up", onScrollMouseUp);

			_scope.addChild(_scrollObjectContainer);
			_scope.addChild(_mapBlur);
			_scope.addChild(_minimap);
			_scrollObjectContainer.addChild(_scrollObject);

			updateMinimapPosition();

			var _posx = 0;
			var _posy = 0;
			var rangesPos = [];

			for (i = 0; i < _l; i++) {
				for (j = 0; j < _c; j++) {
					_bloc = new Bloc(ITEM_WIDTH, ITEM_HEIGHT, nbItemByCol, nbItemByLine);
					_blocs[_id] = _bloc;
					_bloc.idX = _bloc.initidX = j;
					_bloc.idY = _bloc.initidY = i;
					_bloc.lock0 = _bloc.lock1 = true;

					rangesPos.push({blocId: _id, range: getRange(j,i)});
					//(getFaces(_id, j, i));

					_bloc.x = _posx;
					_bloc.y = _posy;
					_scrollObject.addChild(_bloc);
					_posx += _bloc._width;

					if (_posx >= _maxWidth) {
						_maxWidth = _posx;
					}
					_id++;
				}
				_posx = 0;
				_posy += _blocs[_id - 1]._height;
				if (_posy > _maxHeight) {
					_maxHeight = _posy;
				}
			}

			_lastItemX = _bloc._width;
			_lastItemY = _bloc._height;

			initPosItems();

			getFacesByRanges(rangesPos);
			thottleUpdateMinimap();


            messageBus.on('map:gotoFaceNumber', gotoFaceNumber);
            //messageBus.on('map:updateGrid', updateGrid);

		}

		function onScrollMouseDown(event) {
			initPosItems();

			clearTimeout(_hideTimer);
			_hideTimer = setTimeout(function(){
				messageBus.emit('ScrollContainer:StartMoving');
			}, 250);
		}

		function updateMinimapPosition(){
			var x, y;

			x = 20;

			y = window.innerHeight-_minimapHeight-20;

			_minimap.position.x = x;
			_minimap.position.y = y;
		}

        function getIdUriSegment(){
            var id;

            var uri = location.href;
            var regexp = /^[0-9]*$/;
            var segments = uri.split('/');
            var lastSegment = segments[segments.length-1];

            id = !!lastSegment.match(regexp) ? lastSegment : null;

            return id;
        }

		function onScrollMouseUp() {
			clearTimeout(_hideTimer);
		}

		function replaceItem() {

			var _tempY, _tempX, moved= false;
			var rangesPos = [];

			// Y
			for (var i = 0; i < _blocs.length; i++) {

				_tempY = _scrollObject.y + _blocs[i].y;
				if (_tempY > _h) {
					_blocs[i].y -= _maxHeight;
					if (_blocs[i].idY >= _l) {
						_blocs[i].idY -= _l;
					} else {
						_blocs[i].idY = _rangeLinge + _blocs[i].initidY - _l;
					}

					rangesPos.push({blocId: i, range: getRange(_blocs[i].idX, _blocs[i].idY)});
                    moved = true;
					//(getFaces(i, _blocs[i].idX, _blocs[i].idY));

				} else if (_tempY < -_lastItemY) {
					if (_scrollObject.y + (_blocs[i].y + _maxHeight) <= _h) {
						_blocs[i].y += _maxHeight;
						if (_blocs[i].idY <= _rangeLinge - 1 - _l) {
							_blocs[i].idY += _l;
						} else {
							_blocs[i].idY = _blocs[i].initidY;
						}

						rangesPos.push({blocId: i, range: getRange(_blocs[i].idX, _blocs[i].idY)});
                        moved = true;
						//(getFaces(i, _blocs[i].idX, _blocs[i].idY));

					}
				}

				// X
				_tempX = _scrollObject.x + _blocs[i].x;
				if (_tempX > _w) {
					_blocs[i].x -= _maxWidth;
					if (_blocs[i].idX >= _c) {
						_blocs[i].idX -= _c;
					} else {
						_blocs[i].idX = _rangeColonne + _blocs[i].initidX - _c;
					}

					rangesPos.push({blocId: i, range: getRange(_blocs[i].idX, _blocs[i].idY)});
                    moved = true;
					//(getFaces(i, _blocs[i].idX, _blocs[i].idY));

				} else if (_tempX < -_lastItemX) {
					if (_scrollObject.x + (_blocs[i].x + _maxWidth) <= _w) {
						_blocs[i].x += _maxWidth;
						if (_blocs[i].idX <= _rangeColonne - 1 - _c) {
							_blocs[i].idX += _c;
						} else {
							_blocs[i].idX = _blocs[i].initidX;
						}

						rangesPos.push({blocId: i, range: getRange(_blocs[i].idX, _blocs[i].idY)});
                        moved = true;
						//(getFaces(i, _blocs[i].idX, _blocs[i].idY));

					}
				}

			}

            if(moved){
                getFacesByRanges(rangesPos);
            }

			if( _mapMoved ){
				thottleUpdateMinimap();
			}

		}

		function initPosItems() {

			for (var i = 0; i < _blocs.length; i++) {
				_blocs[i].oldPos = {x : _blocs[i].position.x, y : _blocs[i].position.y};
			}
		}

        /**
         * Move grid to x,y position.
         * @param x place on grid (not pixels)
         * @param y place on grid (not pixels)
         * @param directly set speed to 0
         */
        function setGridPosition(x, y, directly){

            // @TODO: determiner le chemin le plus court vers une case

            var distance, speed, path, isTooFar, timeline, decal={x:0,y:0};

            var windowDecalX = Math.round(-window.innerWidth/2)+Math.round(ITEM_WIDTH/2);
            var windowDecalY = Math.round(-window.innerHeight/2)+Math.round(ITEM_HEIGHT/2);

            x = (x*-ITEM_WIDTH)-windowDecalX;
            y = (y*-ITEM_HEIGHT)-windowDecalY;

            if(directly === true ){
                speed = 0;
            }else{
                path = findSmallerPath(x,y);
                distance = MathUtils.distance(_scrollObject, path);

                speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, distance/(1000/1)));
            }

            isTooFar = speed === MAX_SPEED;

            // skip if to far
            if( isTooFar ){
                decal.x = (path.x-_scrollObject.position.x)*0.05;
                decal.y = (path.y-_scrollObject.position.y)*0.05;

                timeline = new TimelineLite();
                timeline
                    .to(_scrollObject, 0.5, {alpha: 0}, 0)
                    //.to(_blurFilter, 0.5, {blur: 10}, 0)
                    .to(_scrollObject.position, 1, {x: "+="+decal.x, y: "+="+decal.y, ease: Cubic.easeOut}, 0)
                    .to(_scrollObject, 0, {x:path.x-decal.x,y:path.y-decal.y, ease: Cubic.easeOut})
                    .to(_scrollObject, 2, {x:path.x,y:path.y, delay:1, ease: Cubic.easeOut})
                    //.to(_blurFilter, 0.5, {blur: 0}, "-=1")
                    .to(_scrollObject, 0.5, {alpha: 1}, "-=1");

            }else{
                TweenLite.to(_scrollObject, speed, {x:path.x,y:path.y, ease: Cubic.easeOut});
            }

        }

        function findSmallerPath(x, y){

            var iterate = {x:{n:0}, y:{n:0}};

            iterate.x.n = Math[x>=0 ? "floor" : "ceil"](x/maxGridWidth);
            iterate.y.n = Math[y>=0 ? "floor" : "ceil"](x/maxGridWidth);

            var minx = Math.min(
                x+(iterate.x.n)*maxGridWidth-maxGridWidth,
                x+(iterate.x.n)*maxGridWidth,
                x+(iterate.x.n+1)*maxGridWidth
            );

            var miny = Math.min(
                y+(iterate.y.n)*maxGridHeight-maxGridHeight,
                y+(iterate.y.n)*maxGridHeight,
                y+(iterate.y.n+1)*maxGridHeight
            );

            if(Math.abs(x+(iterate.x.n-1)*maxGridWidth) < Math.abs(x+(iterate.x.n)*maxGridWidth)){
                minx = x+(iterate.x.n-1)*maxGridWidth;
            }else if(Math.abs(x+(iterate.x.n)*maxGridWidth) < Math.abs(x+(iterate.x.n+1)*maxGridWidth)){
                minx = x+(iterate.x.n)*maxGridWidth;
            }else{
                minx = x+(iterate.x.n+1)*maxGridWidth;
            }

            if(Math.abs(y+(iterate.y.n-1)*maxGridHeight) < Math.abs(y+(iterate.y.n)*maxGridHeight)){
                miny = y+(iterate.y.n-1)*maxGridHeight;
            }else if(Math.abs(y+(iterate.y.n)*maxGridHeight) < Math.abs(y+(iterate.y.n+1)*maxGridHeight)){
                miny = y+(iterate.y.n)*maxGridHeight;
            }else{
                miny = y+(iterate.y.n+1)*maxGridHeight;
            }

            return {x: minx, y: miny};

        }

        /**
         * Go to face number, can go directly
         * args could be number face or event object with data
         * @param arg (number|object) object is : {number: 1, directly: false}
         */
        function gotoFaceNumber(arg){
            var directly = false;
            var number = arg;

            if(typeof arg === "object"){
                number = arg.data.number;
                directly = arg.data.directly;
            }

            var x, y;

            number = Math.max(MIN_FACES, Math.min(MAX_FACES, number));

            //number-=1;

            x = Math.round(number%1000);

            y = Math.floor(number/1000);

            setGridPosition(x,y, numberIsVisible(number) ? false : directly);

        }

        /**
         * Get state of the number, if is currently on the grid
         * @param number
         * @returns {boolean}
         */
        function numberIsVisible(number){
            var isOnGrid = false;

            _.each(_blocs, function(bloc){
                var faces = getRange(bloc.idX, bloc.idY);
                _.each(faces, function(face){
                    if( face.number === number ){
                        isOnGrid = true;
                    }
                });
            });

            return isOnGrid;
        }

        /**
         * Get a range from the matrix
         * @param x
         * @param y
         * @returns {*}
         */
		function getRange(x, y){
			return _ranges[x + "," + y];
		}

        /**
         * Get faces numbers by a range
         * @param ranges
         */
		function getFacesByRanges(ranges){
			var rangeIndex, rangeLength, faceIndex, faceLength;
			var range = [], faces, id;

            if( !ranges.length){
                return;
            }

			for(rangeIndex = 0, rangeLength = ranges.length; rangeIndex<rangeLength; rangeIndex++){
                id = ranges[rangeIndex].blocId;
                faces = ranges[rangeIndex].range;
                for(faceIndex = 0, faceLength = faces.length; faceIndex<faceLength; faceIndex++){
                    range.push(faces[faceIndex].number);
                }
			}

            if( range.length ){
				//updateGrid();
				thottleUpdateGrid();
                _services.getFacesByRange(range, onGetFacesByRange);
            }

		}

		/**
		 * get face on the screen
		 * @returns {number}
		 */
		function getCenterNumber(){
			var number;

			var xDecal = Math.round(window.innerWidth/ITEM_WIDTH/2);
			var yDecal = Math.round(window.innerHeight/ITEM_HEIGHT/2);

			var xRatio = maxGridWidth/ITEM_WIDTH;
			var yRatio = maxGridHeight/ITEM_HEIGHT;

			var x = Math.round(Math.abs((_scrollObject.position.x)%maxGridWidth/ITEM_WIDTH));
			var y = Math.round(Math.abs((_scrollObject.position.y)%maxGridHeight/ITEM_HEIGHT));

			x = _scrollObject.position.x > 0 ? xRatio-x : x;
			y = _scrollObject.position.y > 0 ? yRatio-y : y;

			x+=xDecal;
			y+=yDecal;

			x = x >= xRatio ? x-xRatio : x;
			y = y >= yRatio ? y-yRatio : y;

			number = y*yRatio+x;

			return number;
		}

        /**
         * Callback on services requests getFacesByRange
         * @param data
         */
        function onGetFacesByRange(data){
            updateMatrix(data);
            updateGrid();
        }

        /**
         * Update faces grid
         */
        function updateGrid(){
            _.each(_blocs, function(blocId){
                blocId.setValue(getRange(blocId.idX, blocId.idY));
            });
        }

        /**
         * Update matrix with services data
         * @param data
         */
        function updateMatrix(data){
            for (var i = 0; i < data.length; i++) {
                if (data[i].picture) {
					main.martixRange[data[i].number] = data[i];
                }
            }
        }

        /**
         * Get faces by position on the grid
         * @param id
         * @param x
         * @param y
         */
		//function getFaces(id, x, y) {
        //
         //   var ranges = _ranges[x + "," + y];
         //   var number = ranges[0].number;
        //
		//	_blocs[id].setValue(ranges);
		//	_services.getFaces(number, onGetFacesByRange, id);
		//}

        /**
         * Callback on services requests getFaces
         * @param data
         * @param id
         */
		//function onGetFaces(data, id) {
         //   updateMatrix(data);
         //   updateGrid();
		//}

		this.process = function() {
			if (_scrollObject) {
				_scrollObject.scroll();
				_minimap.process();
				_mapBlur.process();
				replaceItem();
			}
		};

		this.resize = function(w, h) {

			_mapBlur.resize();
			updateMinimapPosition();
			_w = w;
			_h = h;

		};

	};

	_map.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

	_map.prototype.process = function() {
		this.process();
	};

	_map.prototype.resize = function(w, h) {
		this.resize(w, h);
	};

	return _map;
});
