var main = main || {};

define('main', ['map'], function(Map) {

	var _main = function(args) {

		console.log("<< Kamal::main >>");

		// CONFIG
		var _statEnabled = true;
		var _centerDesktop = false;
		var _widthDesktopView = 1280;
		var _heightDesktopView = 800;

		// CONST
		var RETINA_BASE_WIDTH = 2048;
		var RETINA_BASE_HEIGHT = 1536;

		var _container;
		var _stats;
		var _stage;
		var _rendererOptions;
		var _renderer;
		var _page;
		var _hcoef;
		var _vcoef;
		var _h;
		var _w;
		var _viewPosX;
		var _viewPosY;
		var _canvas = args[0];
		//

		function init() {
			_stage = new PIXI.Stage(0x000000);
			_rendererOptions = {view : _canvas, transparent : false, resolution : window.devicePixelRatio || 1};
			// _renderer = new PIXI.CanvasRenderer(0, 0, _rendererOptions);
			_renderer = PIXI.autoDetectRecommendedRenderer(0, 0, _rendererOptions);
			if (!_canvas) {
				document.body.appendChild(_renderer.view);
			}
			onReady();

		}

		function onReady() {
			// INIT STRUCTURE
			build();
			// LOAD FONTS AND START APP, ELSE CALL "start" FUNCTION
			Tools.loadFont(["Proxima"], start);

		}

		function build() {
			_container = new PIXI.DisplayObjectContainer();
			_stage.addChild(_container);
		}

		function initPages() {
			main.stage = _stage;
			main.view = _renderer.view;
			main.resolution = window.devicePixelRatio || 1;
			main.textResolution = 2;
			main.fonts = {Proxima : "Proxima"};
			main.martixRange = [];
			//

			// a new imported Main project Class //
			_page = new Map();
			_container.addChild(_page);
		}

		function initEvents() {
			window.addEventListener("resize", main.onResize);
			main.onResize(null);
		}

		main.onResize = function() {

			_h = window.innerHeight;
			_w = window.innerWidth;

			// CENTER DESKTOP NAVIGATOR
			if (_centerDesktop && Tools.getDevice() == "desktop") {
				if (_w >= _widthDesktopView) {
					_w = _widthDesktopView;
				}
				if (_h >= _heightDesktopView) {
					_h = _heightDesktopView;
				}

				_viewPosX = window.innerWidth - _w >> 1;
				_viewPosY = window.innerHeight - _h >> 1;

			}

			//
			_hcoef = _w / RETINA_BASE_WIDTH;
			_vcoef = _h / RETINA_BASE_HEIGHT;
			//
			if (_page && _page.resize) {
				_page.resize(_w, _h, _hcoef, _vcoef, _viewPosX, _viewPosY);
			}
			//
			_renderer.resize(_w, _h);
			_renderer.view.style.width = _w + "px";
			_renderer.view.style.height = _h + "px";
			//
			window.scrollTo(0, 0);

		};

		function start() {

			console.log("<< start >>");

			// INIT PAGES
			initPages();

			// INIT DOM EVENTS
			initEvents();

			requestAnimFrame(processFrame);
			if (_statEnabled) {
				stat();
			}
		}

		function processFrame() {
			requestAnimFrame(processFrame);
			_renderer.render(_stage);
			//
			if (_page && _page.process) {
				_page.process();
			}
			//
			if (_statEnabled) {
				_stats.update();
			}
		}

		function stat() {
			_stats = new Stats();
			_stats.domElement.style.position = 'absolute';
			_stats.domElement.style.top = '0px';
			_stats.domElement.style.left = '0px';
			document.body.appendChild(_stats.domElement);
		}

		init();
	};

	return _main;

});
