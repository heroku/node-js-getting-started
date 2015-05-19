var Tools = {};


Tools.ieInnerHTML = function ieInnerHTML(obj, convertToLowerCase) {
    var zz = obj.innerHTML ? String(obj.innerHTML) : obj
    	       ,z  = zz.match(/(<.+[^>])/g);    

    	    if (z) {
    	     for ( var i=0;i<z.length;(i=i+1) ){
    	      var y
    	         ,zSaved = z[i]
    	         ,attrRE = /\=[a-zA-Z\.\:\[\]_\(\)\&\$\%#\@\!0-9\/]+[?\s+|?>]/g
    	      ;

    	      z[i] = z[i]
    	              .replace(/([<|<\/].+?\w+).+[^>]/,
    	                 function(a){return a;
    	               });
    	      y = z[i].match(attrRE);

    	      if (y){
    	        var j   = 0
    	           ,len = y.length
    	        while(j<len){
    	          var replaceRE = 
    	               /(\=)([a-zA-Z\.\:\[\]_\(\)\&\$\%#\@\!0-9\/]+)?([\s+|?>])/g
    	             ,replacer  = function(){
    	                  var args = Array.prototype.slice.call(arguments);
    	                  return '="'+(convertToLowerCase 
    	                          ? args[2]
    	                          : args[2])+'"'+args[3];
    	                };
    	          z[i] = z[i].replace(y[j],y[j].replace(replaceRE,replacer));
    	          j+=1;
    	        }
    	       }
    	       zz = zz.replace(zSaved,z[i]);
    	     }
    	   }
    	  return zz;
    	} 

Tools.print2digits = function(str, val) {
	var delta = val - (str + "").length;
	var string = "";
	if (delta > 0) {
		for (var i = 0; i < delta; i++) {
			string += "0";
		}
	}
	return string + str;
};



Tools.getDevice = function() {
	
	if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
		if (((window.innerWidth > 480) && (window.innerHeight > 800)) || ((window.innerWidth > 800) && (window.innerHeight > 480)) || navigator.userAgent.match(/ipad/gi)) {
			
			return ("tablet");
		} else {
			return ("mobile");
		}
	} else {
		return ("desktop");
	}
};



Tools.iOSversion = function() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	}
	return [];
};



Tools.getCssText = function (text, style, resolution, callback) {
	
	var sprite =  new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture()));
	sprite.scale.x = sprite.scale.y = 1 / resolution;
	
	var el = document.createElement("div");
	var tpm = document.createElement("div");
	tpm.style.position = "absolute";
	tpm.style.left = "0px";
	tpm.style.top = "0px";
	tpm.style.width = "10px";
	tpm.style.overflow = "hidden";
	document.body.appendChild(tpm);
	
	for ( var _style in style) {
		if (typeof style[_style] === "number") {
			el.style[_style] = style[_style] * resolution + "px";
		} else {
			el.style[_style] = style[_style];
		}
		
	}
	
	el.style.position = "absolute";

	el.innerHTML = text;
	tpm.appendChild(el);

	sprite.width = el.offsetWidth/resolution;
	sprite.height = el.offsetHeight/resolution;
	
	html2canvas(el, {letterRendering : true, onrendered : function(canvas) {
		document.body.removeChild(tpm);
		sprite.width = 0.5;
		sprite.height = 0.5;
		sprite.setTexture(PIXI.Texture.fromCanvas(canvas));
	
		if(callback){
			callback(canvas);
		}
	}});
	
	return sprite;
	
};

Tools.getCanvasElement = function (element, width, height, resolution, callback) {
	
	var _resolution = resolution || 1;
	var sprite =  new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture()));
	sprite.scale.x = sprite.scale.y = 1 / _resolution;
	sprite.width = width || element.offsetWidth/_resolution;
	sprite.height = height || element.offsetHeight/_resolution;
	
	html2canvas(element, {width : width, height : height, letterRendering : true, onrendered : function(canvas) {
		sprite.width = 0.5;
		sprite.height = 0.5;
		sprite.setTexture(PIXI.Texture.fromCanvas(canvas));
		if(callback){
			callback(canvas);
		}
	}});
	
	return sprite;
}


/**
 * @property fonts
 * @type Array
 */
/**
 * @property callback
 * @type Function
 */
Tools.loadFont = function (fonts, callback) {
	var _noFont = new PIXI.Text("A", {font : "100px nofont"});
	var _myFont;
	var _access = true;

	requestAnimFrame(tryLoad);
	
	function tryLoad() {
		if (_access) {
			_access = false;
			var _fontsNotLoaded = 0;
			var i = 0;
			while (i <= fonts.length) {
				_myFont = new PIXI.Text("A", {font : "100px " + fonts[i]});
				if (_noFont.width == _myFont.width) {
					_fontsNotLoaded++;
				} else {
					fonts.splice(i, 1);
				}
				i++;
			}
			//
			if (_fontsNotLoaded > 0) {
				requestAnimFrame(tryLoad);
			} else {
				if (callback) {
					TweenLite.delayedCall(1, callback);
				}
			}
			_access = true;
		}
	}
};

Tools.getTextElement = function(id) {
	return (document.getElementById(id).innerHTML);
};

Tools.getPropertyElement = function(id , property) {
	return document.getElementById(id).getAttribute(property);
};

Tools.clone = function(displayObject, width, height) {
	var renderTexture = new PIXI.RenderTexture(width, height);
	renderTexture.render(displayObject);
	return renderTexture;
};



//////////////////////

/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2014
  */

Tools.bowser = ('bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , result

    if (/opera|opr/i.test(ua)) {
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/windows phone/i.test(ua)) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      , msie: t
      , version: getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (/sailfish/i.test(ua)) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (/silk/i.test(ua)) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
      , version: versionIdentifier
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/(web|hpw)os/i.test(ua)) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/tizen/i.test(ua)) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/safari/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      , version: versionIdentifier
      }
    }
    else result = {}

    // set webkit or gecko flag for browsers based on these engines
    if (/(apple)?webkit/i.test(ua)) {
      result.name = result.name || "Webkit"
      result.webkit = t
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (android || result.silk) {
      result.android = t
    } else if (iosdevice) {
      result[iosdevice] = t
      result.ios = t
    }

    // OS version extraction
    var osVersion = '';
    if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = osVersion.split('.')[0];
    if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
      result.tablet = t
    } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if ((result.msie && result.version >= 10) ||
        (result.chrome && result.version >= 20) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')


  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});


Tools.PIXITextOverwided = function(){
	PIXI.Text.prototype.setStyle = function(style)
	{
	    style = style || {};
	    style.font = style.font || 'bold 20pt Arial';
	    style.fill = style.fill || 'black';
	    style.align = style.align || 'left';
	    style.stroke = style.stroke || 'black'; // provide a default, see:
												// https://github.com/GoodBoyDigital/pixi.js/issues/136
	    style.strokeThickness = style.strokeThickness || 0;
	    style.wordWrap = style.wordWrap || false;
	    style.wordWrapWidth = style.wordWrapWidth || 100;
	    style.interligne = style.interligne || 0; 
	    
	    style.dropShadow = style.dropShadow || false;
	    style.dropShadowAngle = style.dropShadowAngle || Math.PI / 6;
	    style.dropShadowDistance = style.dropShadowDistance || 4;
	    style.dropShadowColor = style.dropShadowColor || 'black';

	    this.style = style;
	    this.dirty = true;
	};

	PIXI.Text.prototype.setText = function(text) {
		this.text = text.toString() || ' ';
		this.dirty = true;
	};

	/**
	 * Renders text and updates it when needed
	 * 
	 * @method updateText
	 * @private
	 */
	PIXI.Text.prototype.updateText = function() {
		this.texture.baseTexture.resolution = this.resolution;

		this.context.font = this.style.font;

		var outputText = this.text;

		// word wrap
		// preserve original text
		if (this.style.wordWrap)
			outputText = this.wordWrap(this.text);

		// split text into lines
		var lines = outputText.split(/(?:\r\n|\r|\n)/);

		// calculate text width
		var lineWidths = [];
		var maxLineWidth = 0;
		var fontProperties = this.determineFontProperties(this.style.font);
		for (var i = 0; i < lines.length; i++) {
			var lineWidth = this.context.measureText(lines[i]).width;
			lineWidths[i] = lineWidth;
			maxLineWidth = Math.max(maxLineWidth, lineWidth);
		}

		var width = maxLineWidth + this.style.strokeThickness;
		if (this.style.dropShadow)
			width += this.style.dropShadowDistance;

		this.canvas.width = (width + this.context.lineWidth) * this.resolution;

		// calculate text height
		var lineHeight = fontProperties.fontSize + this.style.strokeThickness + this.style.interligne;

		var height = lineHeight * lines.length;
		if (this.style.dropShadow)
			height += this.style.dropShadowDistance;

		this.canvas.height = height * this.resolution;

		this.context.scale(this.resolution, this.resolution);

		if (navigator.isCocoonJS)
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.font = this.style.font;
		this.context.strokeStyle = this.style.stroke;
		this.context.lineWidth = this.style.strokeThickness;
		this.context.textBaseline = 'alphabetic';
		// this.context.lineJoin = 'round';

		var linePositionX;
		var linePositionY;

		if (this.style.dropShadow) {
			this.context.fillStyle = this.style.dropShadowColor;

			var xShadowOffset = Math.sin(this.style.dropShadowAngle) * this.style.dropShadowDistance;
			var yShadowOffset = Math.cos(this.style.dropShadowAngle) * this.style.dropShadowDistance;

			for (i = 0; i < lines.length; i++) {
				linePositionX = this.style.strokeThickness / 2;
				linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

				if (this.style.align === 'right') {
					linePositionX += maxLineWidth - lineWidths[i];
				} else if (this.style.align === 'center') {
					linePositionX += (maxLineWidth - lineWidths[i]) / 2;
				}

				if (this.style.fill) {
					this.context.fillText(lines[i], linePositionX + xShadowOffset, linePositionY + yShadowOffset);
				}

				// if(dropShadow)
			}
		}

		// set canvas text styles
		this.context.fillStyle = this.style.fill;

		// draw lines line by line
		for (i = 0; i < lines.length; i++) {
			linePositionX = this.style.strokeThickness / 2;
			linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

			if (this.style.align === 'right') {
				linePositionX += maxLineWidth - lineWidths[i];
			} else if (this.style.align === 'center') {
				linePositionX += (maxLineWidth - lineWidths[i]) / 2;
			}

			if (this.style.stroke && this.style.strokeThickness) {
				this.context.strokeText(lines[i], linePositionX, linePositionY);
			}

			if (this.style.fill) {
				this.context.fillText(lines[i], linePositionX, linePositionY);
			}

			// if(dropShadow)
		}

		this.updateTexture();
	};
};



