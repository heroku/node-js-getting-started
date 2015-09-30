define('blocIthem', ['constantes', 'btnSocial', 'messageBus', 'colorMapping', 'components/spinner'], function(constantes, BtnSocial, messageBus, colorMapping, Spinner) {

    var _lastSelected;

	var _blocIthem = function(ITEM_WIDTH, ITEM_HEIGHT) {

		var _this = this;
		// CONST
		var _margin = 25;
		var PICTURE_WIDTH = ITEM_WIDTH-_margin;
		var PICTURE_HEIGHT = ITEM_HEIGHT-_margin;

		var _scope;
		var _container;
		var _item;
		var _itemText;
		var _bgPicture;
		var _txt;
		var _fb;
		var _tw;
        var _share;
		var _claim;
		var _decline;
		var _id;
		var _rect;
		var _data;
		var _interactive;
		var _timer;
		var _timerBeforeClickAction = 500;
		var _isSelected = false;
		var _canClick = true;
		var _pictureLoader;
		var _timerPictureUpdate;
		var _maskPicture;
		var _spinner = new Spinner();
		var _itemBorder;
		var _itemBorderImage = new Image();

		_itemBorderImage.src = _app.config.root_url+"/images/itemBorder@2x.png";

		PIXI.DisplayObjectContainer.call(this);
		_scope = this;

		this.currentNumber;

		this.process = function() {

		};

		this.resize = function(w, h) {

		};

		function build() {


			_container = new PIXI.DisplayObjectContainer();

			_rect = new PIXI.Graphics();
			_rect.clear();
			_rect.beginFill(0x262626, 1);
			_rect.drawRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT);
			_rect.endFill();

			_bgPicture = new PIXI.Graphics();

			_item = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture()));
			_item.x = Math.round((ITEM_WIDTH-PICTURE_WIDTH)/2);
			_item.y = Math.round((ITEM_HEIGHT-PICTURE_HEIGHT)/2);

			_maskPicture = new PIXI.Graphics();
			_maskPicture.clear();
			_maskPicture.beginFill(0x000000, 1);
			_maskPicture.drawRect(0, 0, PICTURE_WIDTH, PICTURE_HEIGHT);
			_maskPicture.endFill();
			_maskPicture.x = _item.x;
			_maskPicture.y = _item.y;

			_itemBorder = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(_itemBorderImage)));
			_itemBorder.x = _item.x;
			_itemBorder.y = _item.y;
			_itemBorder.scale.x = 0.5;
			_itemBorder.scale.y = 0.5;

			_item.mask = _maskPicture;

			_itemText = new PIXI.Text("#", {font : "11px montserrat-regular", fill : "#666666"});
			_itemText.rotation = Math.PI*90/180;
			_itemText.x = ITEM_WIDTH+2;
			_itemText.y = _margin/2;

			_fb = new BtnSocial(constantes.icons.FACEBOOK, "#7F7F7F", onFBCLick, null, null, 30);
			_fb.x = Math.round(20);
			_fb.y = Math.round(ITEM_HEIGHT-20-_fb.height/_fb.resolution);

			_tw = new BtnSocial(constantes.icons.TWITTER, "#7F7F7F", onTWCLick, null, null, 30);
			_tw.x = Math.round(ITEM_WIDTH-20-_tw.width/_tw.resolution);
			_tw.y = Math.round(ITEM_HEIGHT-20-_tw.height/_tw.resolution);

			_share = new BtnSocial(constantes.icons.SHARE, "#00FFFF", onShareCLick);
            _share.x = Math.round(ITEM_WIDTH/2-15);
            _share.y = Math.round((ITEM_HEIGHT+30)/2-15);

			_claim = new BtnSocial(constantes.icons.CIRCLE_ARROW_DOWN, "#00EE00", onClaimCLick);
            _claim.x = Math.round(ITEM_WIDTH/2-35);
            _claim.y = Math.round((ITEM_HEIGHT+30)/2-15);

			_decline = new BtnSocial(constantes.icons.CIRCLE_CLOSE, "#EE0000", onDeclineCLick);
            _decline.x = Math.round(ITEM_WIDTH/2+5);
            _decline.y = Math.round((ITEM_HEIGHT+30)/2-15);

			_spinner.position.x = ITEM_WIDTH/2;
			_spinner.position.y = ITEM_HEIGHT/2;

			messageBus.addEventListener('ScrollContainer:StartMoving', function(){
				_tw.disable(0.25, 0);
				_fb.disable(0.25, 0);
                _claim.disable(0.25, 0);
                _decline.disable(0.25, 0);
				_canClick = false;
			});

			messageBus.addEventListener('ScrollContainer:StopMoving', function(){
				var delay = Math.random()/3;
				_tw.enable(0.25, delay);
				_fb.enable(0.25, delay);
                _claim.enable(0.25, delay);
                _decline.enable(0.25, delay);
				_canClick = true;
			});


			messageBus.on('map:endSkipAnimation', _.bind(showBackgroundColor, this));
			messageBus.on('map:startSkipAnimation', _.bind(hideBackgroundColor, this));
			messageBus.on('blocItem:setUnselected', _.bind(setUnselected, _this));
			messageBus.on('ScrollContainer:StartMoving', clearTimer);

			_container.mousedown = _container.touchstart = onFaceClick;


			updateRectColor(0);

			_scope.addChild(_rect);
			_scope.addChild(_container);
			_scope.addChild(_itemText);

			_container.addChild(_bgPicture);
			_container.addChild(_spinner);

			_container.addChild(_item);
			_container.addChild(_maskPicture);
			_container.addChild(_fb);
			_container.addChild(_tw);
			_container.addChild(_share);
			_container.addChild(_claim);
			_container.addChild(_decline);
			_container.addChild(_itemBorder);
		}

		/**
		 *
		 * @param event
		 */
		function onShareCLick(event) {
			Backbone.history.navigate("/share/"+_id, {trigger: true});
		}

		/**
		 *
		 * @param event
		 */
		function onTWCLick(event) {
			parent.location = "/auth/twitter/register/" + _id;
		}

		/**
		 *
		 * @param event
		 */
		function onFBCLick(event) {
			parent.location = "/auth/facebook/register/" + _id;
		}

		/**
		 *
		 */
		function onFaceClick(){
			if( !_canClick ){
				return;
			}

			clearTimer();

			_timer = setTimeout(function(){
				if( _interactive){
					if( _isSelected ){
						Backbone.history.navigate('/', {trigger:true});
						setUnSelected();
					}else{
						Backbone.history.navigate('profile/'+_data.accountname, {trigger:true});
						_.bind(setSelected, _this)(_data.number);
						messageBus.emit('map:gotoFaceNumber', {number: _data.number, directly: false});
					}
				}
			}, _timerBeforeClickAction);

		}

		function showBackgroundColor(){
			TweenLite.to(_bgPicture, 0.5, {alpha:1});
		}

		function hideBackgroundColor(){
			TweenLite.to(_bgPicture, 0.1, {alpha:0});
		}

		/**
		 *
		 */
		function clearTimer(){
			clearTimeout(_timer);
            messageBus.emit('blocItem:setUnselected');
		}

		/**
		 *
		 */
		function setUnselected(){

			_isSelected = false;

		}

		/**
		 *
		 * @param event
		 */
		function setSelected(event){

			if( _isSelected ){
				return;
			}

			var number = event;
			if( typeof event === 'object'){
				number = event.data.number;
			}

			if( number === _data.number ){
				messageBus.emit('all:colorChange', {color:_data.faceColor});
		        Backbone.history.navigate('/view/'+_data.number, {trigger: true});
			}
		}

		function pad(n){
			n = ""+n;
			var pad = "000000";
			return pad.substring(0, pad.length- n.length)+n;
		}

		function updateRectColor(number){
			if( !_data || !_bgPicture.visible ){
				return;
			}

			_data.faceColor = colorMapping.getColorByBoxNumber(number);
      console.log(_data.faceColor);
			_bgPicture.clear();
			_bgPicture.beginFill(_data.faceColor, 1);
			_bgPicture.drawRect(0, 0, PICTURE_WIDTH-6, PICTURE_HEIGHT-6);
			_bgPicture.endFill();
			_bgPicture.position.x = _item.position.x+3;
			_bgPicture.position.y = _item.position.y+3;

			_spinner.updateColor(_data.faceColor);

		}

        /**
         * Claim button callback
         * @param event
         */
		function onClaimCLick(event) {
			parent.location = "/auth/twitter/claim/" + _data.accountname;
		}

        /**
         * Decline button callback
         * @param event
         */
		function onDeclineCLick(event) {
			parent.location = "/auth/twitter/decline/" + _data.accountname;
		}

		this.updateColors = function(event) {
			var color = event && event.data ? event.data.color : 0xFFFFFF;
		};

        /**
         * Hide social buttons
         */
		this.hideSocials = function() {
            _fb.hideElement();
            _tw.hideElement();
        };

        /**
         * Show social buttons
         */
		this.showSocials = function() {
            _fb.showElement();
            _tw.showElement();
        };

        /**
         * Hide share buttons
         */
		this.hideShare = function() {
            _share.hideElement();
        };

        /**
         * Show share buttons
         */
		this.showShare = function() {
            _share.showElement();
        };

        /**
         * Hide claim/decline buttons
         */
		this.hideClaims = function() {
            _claim.hideElement();
            _decline.hideElement();
        };

        /**
         * Show claim/decline buttons
         */
		this.showClaims = function() {
            _claim.showElement();
            _decline.showElement();
        };

		/**
		 *
		 */
		this.setInteractive = function(isInteractive){
			_interactive = isInteractive;
			_container.interactive = isInteractive;
			_container.buttonMode = isInteractive;
		};

        /**
         *
         */
        this.setShare = function(show){
            this[show ? 'showShare' : 'hideShare']();
        };

        /**
         * Switch show/hide social buttons
         * @param show
         */
        this.setSocials = function(show){
            this[show ? 'showSocials' : 'hideSocials']();
        };

        /**
         * Switch show/hide claim/decline buttons
         * @param isClaimed
         */
        this.setClaim = function(isClaimed){
            this[isClaimed ? 'showClaims' : 'hideClaims']();
        };

		// this.setLangs = function(langs){
		// 	var slot = 1, lang, s, icon;

		// 	_slotLang1.visible = false;
		// 	_slotLang2.visible = false;
		// 	_slotLang3.visible = false;

		// 	for(var i = 0, l = langs.length;i<l; i++){
		// 		lang = langs[i];

		// 		lang = lang.substr(0, 2).toUpperCase();

		// 		switch(slot){
		// 			case 1:
		// 				s = _slotLang1;
		// 				break;
		// 			case 2:
		// 				s = _slotLang2;
		// 				break;
		// 			case 3:
		// 				s = _slotLang3;
		// 				break;
		// 			default:
		// 				return;
		// 		}

		// 		if( s ){
		// 			icon = _app.static_files("img/lang/"+lang+".png");

		// 			if( typeof icon === "undefined"){
		// 				console.log('Unknown flag in constante langs : '+icon+" - "+ lang.toUpperCase());
		// 				return;
		// 			}

		// 			s.setTexture(new PIXI.Texture(PIXI.Texture.fromImage(icon)));
		// 			s.visible = true;
		// 		}

		// 		slot++;
		// 	}
		// };

		// this.setOccupations = function(occupations){
		// 	var slot = 1, occupation, s, icon;

		// 	_slotOccupation1.visible = false;
		// 	_slotOccupation2.visible = false;
		// 	_slotOccupation3.visible = false;

		// 	for(var i = 0, l = occupations.length;i<l; i++){
		// 		occupation = occupations[i];

		// 		switch(slot){
		// 			case 1:
		// 				s = _slotOccupation1;
		// 				break;
		// 			case 2:
		// 				s = _slotOccupation2;
		// 				break;
		// 			case 3:
		// 				s = _slotOccupation3;
		// 				break;
		// 			default:
		// 			return;
		// 		}

		// 		if( s ){
		// 			icon = constantes.occupations[occupation.toUpperCase()];

		// 			if( typeof icon === "undefined"){
		// 				console.log('Unknown icon in constante occupations : '+icon+ " - "+occupation);
		// 				return;
		// 			}
		// 			s.setText(icon);
		// 			s.visible = true;
		// 		}

		// 		slot++;
		// 	}
		// };

		this.update = function(data) {

			_data = data;


			_id = _txt = _data.number;

			this.currentNumber = _id;

			var interactiveEnable = !!(_data.accountname && window._app.claimNumber !== _data.number);
			var socialEnable = !!(typeof _data.claim === 'undefined' && !main.currentUser);
			var claimEnable = !!(_data.claim === false && !main.currentUser);
			var shareEnable = !!(main.currentUser && !_data.accountname);

			this.setInteractive(interactiveEnable);
			this.setSocials(socialEnable);
			this.setClaim(claimEnable && window._app.claimNumber === _data.number);
			this.setShare(shareEnable);

			// _itemBorder.visible = !!socialEnable;
			_bgPicture.visible = !(_data.accountname);
			_itemText.setText(pad(_txt*1));
			_item.texture.destroy();
			_item.texture = new PIXI.Texture(new PIXI.BaseTexture());

			updateRectColor(_id);

		};

		this.updateImage = function(img) {
			// Methode 2
			//var texture = new PIXI.Texture(PIXI.Texture.fromImage(img));
			//_item.texture.destroy();
			//_item.texture = texture;

			// @TODO: display loader while image loading

			(function(saveId){

				// Methode 3 slow fps ???
				var loader = new PIXI.ImageLoader(img);
				_spinner.show();
				loader.onLoaded = function(){
						if( saveId !== _id ){
							return;
						}

						var texture = new PIXI.Texture(PIXI.Texture.fromImage(img));

						_item.texture.destroy();
						_item.setTexture(texture);


						_spinner.hide();

						//_item.width = PICTURE_WIDTH; // @TODO : remove - fps optimisation
						//_item.height = PICTURE_HEIGHT; // @TODO : remove - fps optimisiation

						//if( _data.accountname ){
						//	TweenLite.fromTo(_item, 0.25, {alpha: 0}, {alpha: 1});
						//}
				};
				loader.load();

			})(_id);

		};

		build();

	};


	_blocIthem.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

	_blocIthem.prototype.process = function() {
		this.process();
		_spinner.process();
	};

	_blocIthem.prototype.resize = function(w, h) {
		this.resize(w, h);
	};

	return _blocIthem;
});
