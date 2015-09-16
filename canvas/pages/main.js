var main = main || {};

define('main', ['map', 'messageBus', 'searchBar', 'components/checkbox-limiter', 'pages/modalView'], function(Map, messageBus, SearchBar, CheckboxLimiter, modalView) {

	var _main = function(args) {

		console.log("<< Kamal::main >>");

		var _this = this;

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
		var _loaded = false;
		var _loader = $('.loading-container').get(0);
		var checkboxLimiter = new CheckboxLimiter(".js-checkbox-limiter");

		this.config = _data.config;
		this.currentUser = _data.currentUser;

		this.static_files = function(path){
			if( _app.config.mock ){
				return path;
			}
			var baseUrl = "http://"+_data.config.S3_BUCKET_NAME+"/";

			if( path.match(/^\//)){
				path = path.substr(1, path.length-1);
			}

			return path.indexOf(baseUrl) > -1 ? path : baseUrl+path;
		};


		function init() {
			// @TODO: fps optimize
			var resolution = window.devicePixelRatio ? 2 : 1;
			_stage = new PIXI.Stage(0x262626);
			_rendererOptions = {view : _canvas, transparent : false, resolution : resolution};

			if( isWebglRecommand() ){
				_renderer = PIXI.autoDetectRecommendedRenderer(0, 0, _rendererOptions);
			}else{
				 _renderer = new PIXI.CanvasRenderer(0, 0, _rendererOptions);
			}
			if (!_canvas) {
				document.body.appendChild(_renderer.view);
			}
			onReady();

			messageBus.on('main:hideLoader', hideLoader);
			messageBus.on('main:showLoader', showLoader);

			_renderer.view.addEventListener('mouseleave', function(event){
				 //trigger only on window leave
				//if( event.toElement === null || event.toElement === document.getElementsByTagName('html')[0] ){
					messageBus.emit('renderer:mouseleave');
				//}
			});

			_this.canvas = {
				stage: _stage,
				renderer: _renderer,
				rendererOptions: _rendererOptions
			};
		}

		function hideLoader(){
			if( _loaded ){
				return;
			}

			TweenLite.to(_loader, 0.25, {opacity:0, delay: 1, onComplete: function(){
				TweenLite.set(_loader, {display:'none'});
				_loaded = true;
			}});

		}

		function showLoader(){
			if( !_loaded ){
				return;
			}

			TweenLite.fromTo(_loader, 0.25, {display: 'block', opacity: 0}, {opacity:1, onComplete: function(){
				_loaded = false;
			}});

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

		function isWebglRecommand(){
            return false; // force canvas renderer
			//return navigator.userAgent.match(/ipad|iphone/i) ? false : true;
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

            new SearchBar({blurAfterSubmit:false});

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
			    "edit/": "edit",  // #search/kiwis
			    "view/:number": "view",  // #search/kiwis
					"success/": "success",  // #search/kiwis
			    "share/:number": "share",   // #search/kiwis/p7
			    "number/:number(/:claim)": "number",   // #search/kiwis/p7
					"login/": "login"   // #search/kiwis/p7
			  },

			  edit: function(number) {
					console.log('BACKBONE EDIT', number);
					showEditFace();
			  },
			  view: function(number) {
					console.log('BACKBONE EDIT', number);
					showViewFace(number);
			  },
			  success: function(number) {
					console.log('BACKBONE EDIT', number);
					showSuccessFace();
			  },
			  login: function(number) {
					console.log('BACKBONE LOGIN', number);
					showLoginPopin();
			  },
			  share: function(number) {
					console.log('BACKBONE SHARE', number);
					showSharePopin(number);
			  },
			  logout: function(number) {
					console.log('BACKBONE EDIT', number);
			  },

			  number: function(number, claim) {
					console.log('BACKBONE NUMBER', number, claim);
					if(claim && claim == 'claim'){
						claim = true;
					}
					messageBus.emit('map:gotoFaceNumber', {number: number, directly: false, showClaim: claim});
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

		/*** modal functions ***/
		function showLoginPopin(){
			$('.modal-login').modal('show');
		}

		function showSharePopin(number){
			$('.js-share-url').val(_data.config.root_url + '/number/' + number);
			$('.js-share-iframe').attr('src', '/share/'+ number);
			$('.modal-share').modal('show');
		}

		function showEditFace(){
			$('.modal-edit').modal('show');
		}

		function showViewFace(number){
			if( number >= 0 ){
				modalView.show(number);
			}
		}

		function showSuccessFace(){
			$('#edit-user').data('register', 'true');
			$('.modal-edit').modal('show');
		}


		init();
	};

	return _main;

});
