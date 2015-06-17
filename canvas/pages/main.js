var main = main || {};

define('main', ['map', 'messageBus', 'searchBar'], function(Map, messageBus, SearchBar) {

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
		var _data = args[1];

        main.currentUser = _data.currentUser;

		function init() {
			_stage = new PIXI.Stage(0x000000);
			_rendererOptions = {view : _canvas, transparent : false, resolution : window.devicePixelRatio || 1};
			// _renderer = new PIXI.CanvasRenderer(0, 0, _rendererOptions);
			_renderer = PIXI.autoDetectRecommendedRenderer(0, 0, _rendererOptions);
			if (!_canvas) {
				document.body.appendChild(_renderer.view);
			}
			onReady();

			_renderer.view.addEventListener('mouseleave', function(event){
				 //trigger only on window leave
				//if( event.toElement === null || event.toElement === document.getElementsByTagName('html')[0] ){
					messageBus.emit('renderer:mouseleave');
				//}
			});
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
			console.log('INIT PAGES');
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
			console.log('INIT EVENTS');
			window.addEventListener("resize", main.onResize);
			main.onResize(null);
		}
		//EDIT MODAL FACE

		function initEditFace(){
			$('.modal').on('hide.bs.modal', function (e) {
			  // do something...
			});
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

			var loader = $('.loading-container').get(0);
			TweenLite.to(loader, 0.25, {opacity:0, onComplete: function(){
				TweenLite.set(loader, {display:'none'});
			}});

            new SearchBar({blurAfterSubmit:true});

			console.log("<< start >>");

			// DATA ARG
			console.log("DATA:", _data);

			// INIT PAGES
			initPages();

			// INIT DOM EVENTS
			initEvents();
			requestAnimFrame(processFrame);

			if(_data.editedFace){
				editFace();
			}
			initSearch();

			initRouter();

			if (_statEnabled) {
				stat();
			}
		}

		function initSearch(){

		}

		function initRouter(){
			//create router
			var OmhRouter = Backbone.Router.extend({

			  routes: {
			    "edit":"edit",  // #search/kiwis
			    "number/:number": "number",   // #search/kiwis/p7
					"login": "login"   // #search/kiwis/p7
			  },

			  edit: function(number) {
					console.log('BACKBONE EDIT', number);
					editFace();
			  },
			  login: function(number) {
					console.log('BACKBONE LOGIN', number);
					showLoginPopin();
			  },
			  logout: function(number) {
					console.log('BACKBONE EDIT', number);

			  },

			  number: function(number) {
					console.log('BACKBONE NUMBER', number);
					messageBus.emit('map:gotoFaceNumber', {'number': number, directly: false});
			  }

			});

			var omhRouter = new OmhRouter();
			$('.modal').on('hide.bs.modal', function (e) {
				omhRouter.navigate("", {trigger: false, replace: true});
			});
			//start listening routes
			console.log('ROUTER START', Backbone.history.start);
			Backbone.history.start({pushState: false});
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
			_stats.domElement.style.opacity = '0.5';
			document.body.appendChild(_stats.domElement);
		}

		/*** Login functions ***/
		function showLoginPopin(){
			$('.modal-login').modal('show');
		}

		function editFace(){
			$('.modal-edit').modal('show');
		}

		/***********************/

		init();
	};

	return _main;

});
