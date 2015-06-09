define('blocIthem', ['fontIcons', 'btnSocial', 'messageBus', 'colorMapping'], function(fontello, BtnSocial, messageBus, colorMapping) {

	var _blocIthem = function(ITEM_WIDTH, ITEM_HEIGHT) {

		// CONST
		//var ITEM_WIDTH = 154;
		//var ITEM_HEIGHT = 154;
		var PICTURE_WIDTH = ITEM_WIDTH-4;
		var PICTURE_HEIGHT = ITEM_HEIGHT-4;

		var _scope;
		var _item;
		var _itemText;
		var _txt;
		var _fb;
		var _tw;
		var _claim;
		var _decline;
		var _id;
		var _rect;

		PIXI.DisplayObjectContainer.call(this);
		_scope = this;

		build();

		this.process = function() {

		};

		this.resize = function(w, h) {

		};

		function build() {

			_rect = new PIXI.Graphics();
			updateRectColor(0);

			_item = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture()));
			_item.x = Math.round((ITEM_WIDTH-PICTURE_WIDTH)/2);
			_item.y = Math.round((ITEM_HEIGHT-PICTURE_HEIGHT)/2);

			_itemText = new PIXI.Text("#", {font : "25px Proxima", fill : "#ffffff"});

			_fb = new BtnSocial(fontello.FACEBOOK_SQUARED, "#3a5795", onFBCLick);
			_fb.x = ITEM_WIDTH/2-35;
			_fb.y = (ITEM_HEIGHT+30)/2-15;

			_tw = new BtnSocial(fontello.TWITTER_SQUARED, "#55acee", onTWCLick);
			_tw.x = ITEM_WIDTH/2+5;
			_tw.y = (ITEM_HEIGHT+30)/2-15;

			_claim = new BtnSocial(fontello.FACEBOOK_SQUARED, "#00FF00", onClaimCLick);
            _claim.x = ITEM_WIDTH/2-35;
            _claim.y = (ITEM_HEIGHT+30)/2-15;

			_decline = new BtnSocial(fontello.TWITTER_SQUARED, "#FF0000", onDeclineCLick);
            _decline.x = ITEM_WIDTH/2+5;
            _decline.y = (ITEM_HEIGHT+30)/2-15;


			messageBus.addEventListener('ScrollContainer:StartMoving', function(){
				_tw.disable(0.25, 0);
				_fb.disable(0.25, 0);
                _claim.disable(0.25, 0);
                _decline.disable(0.25, 0);
			});

			messageBus.addEventListener('ScrollContainer:StopMoving', function(){
				var delay = Math.random()/3;
				_tw.enable(0.25, delay);
				_fb.enable(0.25, delay);
                _claim.enable(0.25, delay);
                _decline.enable(0.25, delay);
			});


			_scope.addChild(_rect);
			_scope.addChild(_item);
			_scope.addChild(_itemText);
			_scope.addChild(_fb);
			_scope.addChild(_tw);
			_scope.addChild(_claim);
			_scope.addChild(_decline);
			// _itemText.visible = false;
		}

		function onTWCLick(event) {
			console.log(">>" + "/auth/twitter/register/" + _id);
			parent.location = "/auth/twitter/register/" + _id;
		}

		function onFBCLick(event) {
			console.log(">>"+"/auth/facebook/register/" + _id);
			parent.location = "/auth/facebook/register/" + _id;
		}

		function updateRectColor(id){
			var color = colorMapping.getColorByBoxNumber(id);
			console.log(color);
			_rect.beginFill(color, 1);
			//_rect.lineStyle(1, 0xFFFFFF);
			_rect.drawRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT);
			_rect.endFill();
		}

        /**
         * Claim button callback
         * @param event
         */
		function onClaimCLick(event) {
            alert('claim');
		}

        /**
         * Decline button callback
         * @param event
         */
		function onDeclineCLick(event) {
            alert('decline');
		}

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

		this.update = function(id) {
			_id = _txt = id;
			updateRectColor(id);
			_itemText.setText(_txt);
			_item.texture.destroy();
			_item.texture = new PIXI.Texture(new PIXI.BaseTexture());
		};

		this.updateImage = function(img) {

			// Methode 2
			//var texture = new PIXI.Texture(PIXI.Texture.fromImage(img));
			//_item.texture.destroy();
			//_item.texture = texture;

			// @TODO: display loader while image loading

			// Methode 3
			var loader = new PIXI.ImageLoader(img);
			loader.onLoaded = function(){
				var texture = PIXI.TextureCache[img];
				_item.texture = texture;

				_item.width = PICTURE_WIDTH;
				_item.height = PICTURE_HEIGHT;
			};
			loader.load();

			// _item.visible = false;
			// console.log(((_scope !== null)? _scope.x:"") + "," + (
			// (_scope.parent !==null) ? _scope.parent.x: "" )+ "," +(
			// (_scope.parent.parent !==null) ? _scope.parent.parent .x: ""));
		};


	};


	_blocIthem.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

	_blocIthem.prototype.process = function() {
		this.process();
	};

	_blocIthem.prototype.resize = function(w, h) {
		this.resize(w, h);
	};

	return _blocIthem;
});