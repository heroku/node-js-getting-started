/**
 * @license pixi-multistyle-text - v0.2.0 Copyright (c) 2014, Tommy Leunen
 *          <tommy.leunen@gmail.com> (http://tommyleunen.com/) Released under
 *          the MIT license See https://github.com/tleunen/pixi-multistyle-text
 *          for more details
 */
(function() {
	var root = this;
	var PIXI = root.PIXI;

	if (!PIXI)
		return;

	/**
	 * A Multi-Style Text Object will create a line or multiple lines of text,
	 * using tags to specify different styles. A tag is similar to an html tag,
	 * except you can use whatever keyword you want. (e.g. <myTag>My text</myTag>)
	 * 
	 * @class MultiStyleText
	 * @extends Text
	 * @constructor
	 * @param text
	 *            {String} The copy that you would like the text to display
	 * @param [textStyles]
	 *            {Object.<string, Style>} The text styles object parameters. A
	 *            key of this object is a tag name, and the content must be a
	 *            style object. The key `def` specifies the default styles. The
	 *            style object is the same as the one in Pixi.Text.
	 * @param [lineStyle]
	 *            {Object} The global style parameters
	 * @param [lineStyle.align='left']
	 *            {String} Alignment for multiline text ('left', 'center' or
	 *            'right'), does not affect single line text
	 * @param [lineStyle.wordWrap=false]
	 *            {Boolean} Indicates if word wrap should be used
	 * @param [lineStyle.wordWrapWidth=100]
	 *            {Number} The width at which text will wrap, it needs wordWrap
	 *            to be set to true
	 */
	var MultiStyleText = function(text, textStyles, lineStyle) {
		PIXI.Text.call(this, text, lineStyle);

		this.setTextStyles(textStyles);
	};

	// constructor
	MultiStyleText.prototype = Object.create(PIXI.Text.prototype);
	MultiStyleText.prototype.constructor = MultiStyleText;

	/**
	 * Set the global alignment style of the text
	 * 
	 * @method setAlignmentStyle
	 * @param [style]
	 *            {Object} The global alignment style parameters
	 * @param [style.align='left']
	 *            {String} Alignment for multiline text ('left', 'center' or
	 *            'right'), does not affect single line text
	 * @param [style.wordWrap=false]
	 *            {Boolean} Indicates if word wrap should be used
	 * @param [style.wordWrapWidth=100]
	 *            {Number} The width at which text will wrap
	 */
	MultiStyleText.prototype.setAlignmentStyle = MultiStyleText.prototype.setStyle = function(style) {
		style = style || {};
		style.align = style.align || 'left';
		style.wordWrap = style.wordWrap || true;
		style.wordWrapWidth = style.wordWrapWidth || 1000;

		this.style = style;
		this.dirty = true;
	};

	function setDefaultTextStyle(style) {
		style = style || {};
		style.font = style.font || 'bold 20pt Arial';
		style.fill = style.fill || 'black';
		style.stroke = style.stroke || 'black'; // provide a default, see:
		// https://github.com/GoodBoyDigital/pixi.js/issues/136
		style.strokeThickness = style.strokeThickness || 0;

		style.dropShadow = style.dropShadow || false;
		style.dropShadowAngle = style.dropShadowAngle || Math.PI / 6;
		style.dropShadowDistance = style.dropShadowDistance || 4;
		style.dropShadowColor = style.dropShadowColor || 'black';
	}

	/**
	 * Set the text styles for each tag Use the key `def` to specify the default
	 * styles
	 * 
	 * @method setTextStyles
	 * @param [styles]
	 *            {Object.<string,Style>} The style map where the key is the
	 *            tag name.
	 */
	MultiStyleText.prototype.setTextStyles = function(styles) {
		for ( var styleId in styles) {
			if (styles.hasOwnProperty(styleId)) {
				setDefaultTextStyle(styles[styleId]);
			}
		}

		// we need a `def` style
		if (!styles.def) {
			styles.def = {};
			setDefaultTextStyle(styles.def);
		}

		this.textStyles = styles;
		this.dirty = true;
	};

	function createTextData(text, style) {
		return {text : text, style : style, width : 0, height : 0, fontProperties : null};
	}

	/**
	 * Get the text data with each text group using specific styles
	 * 
	 * @private
	 * @method _getTextDataPerLine
	 * @param [lines]
	 *            {Array} The lines of text
	 */
	MultiStyleText.prototype._getTextDataPerLine = function(lines) {
		var outputTextData = [];

		var tags = Object.keys(this.textStyles).join('|');
		var re = new RegExp("<\/?(" + tags + ")>", "g");

		var currentStyle = this.textStyles.def;

		// determine the group of word for each line
		for (var i = 0; i < lines.length; i++) {
			var lineTextData = [];

			// find tags inside the string
			var matches = [];
			var matchArray;
			while ((matchArray = re.exec(lines[i])) !== null && matches.push(matchArray));

			// if there is no match, we still need to add the line with the
			// default style
			if (!matches.length) {
				lineTextData.push(createTextData(lines[i], currentStyle));
			} else {
				// We got a match! add the text with the needed style
				var currentSearchIdx = 0;
				for (var j = 0; j < matches.length; j++) {

					// if index > 0, it means we have characters before the
					// match,
					// so we need to add it with the default style
					if (matches[j].index > currentSearchIdx) {
						lineTextData.push(createTextData(lines[i].substring(currentSearchIdx, matches[j].index), currentStyle));
					}

					// reset the style if end of tag
					if (matches[j][0][1] == '/')
						currentStyle = this.textStyles.def;
					// set the current style
					else
						currentStyle = this.textStyles[matches[j][1]] || this.textStyles.def;

					// update the current search index
					currentSearchIdx = matches[j].index + matches[j][0].length;
				}

				// is there any character left?
				if (currentSearchIdx < lines[i].length) {
					lineTextData.push({text : lines[i].substring(currentSearchIdx), style : this.textStyles.def});
				}
			}

			outputTextData.push(lineTextData);
		}

		return outputTextData;
	};

	/**
	 * Renders text and updates it when needed
	 * 
	 * @method updateText
	 * @private
	 */
	MultiStyleText.prototype.updateText = function() {
		this.texture.baseTexture.resolution = this.resolution;
		var outputText = this.text;
		var textStyles = this.textStyles;
		var i, j;

		// word wrap
		// preserve original text
		if (this.style.wordWrap)
			outputText = this.wordWrap(this.text);

		// split text into lines
		var lines = outputText.split(/(?:\r\n|\r|\n)/);

		// get the text data with specific styles
		var outputTextData = this._getTextDataPerLine(lines);

		// calculate text width and height
		var lineWidths = [];
		var lineHeights = [];
		var maxLineWidth = 0;
		for (i = 0; i < lines.length; i++) {
			var lineWidth = 0;
			var lineHeight = 0;
			for (j = 0; j < outputTextData[i].length; j++) {
				this.context.font = outputTextData[i][j].style.font;

				// save the width
				outputTextData[i][j].width = this.context.measureText(outputTextData[i][j].text).width;
				lineWidth += outputTextData[i][j].width;

				// save the font properties
				outputTextData[i][j].fontProperties = this.determineFontProperties(outputTextData[i][j].style.font);

				// save the height
				outputTextData[i][j].height = outputTextData[i][j].fontProperties.fontSize + outputTextData[i][j].style.strokeThickness;
				lineHeight = Math.max(lineHeight, outputTextData[i][j].height + (outputTextData[i][j].style.interligne || 0));
			}

			lineWidths[i] = lineWidth;
			lineHeights[i] = lineHeight;
			maxLineWidth = Math.max(maxLineWidth, lineWidth);
		}

		// transform styles in array
		var stylesArray = Object.keys(textStyles).map(function(k) {
			return textStyles[k];
		});

		var maxStrokeThickness = stylesArray.reduce(function(prev, curr) {
			return Math.max(prev, curr.strokeThickness);
		}, 0);
		var maxDropShadowDistance = stylesArray.reduce(function(prev, curr) {
			var value = curr.dropShadow ? curr.dropShadowDistance : 0;
			return Math.max(prev, value);
		}, 0);

		// define the right width and height
		var width = maxLineWidth + maxStrokeThickness + maxDropShadowDistance;
		var height = (Math.max.apply(null, lineHeights) * lines.length) + maxDropShadowDistance;

		this.canvas.width = (width + this.context.lineWidth) * this.resolution;
		this.canvas.height = height * this.resolution;

		this.context.scale(this.resolution, this.resolution);

		if (navigator.isCocoonJS)
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.textBaseline = 'alphabetic';
		this.context.lineJoin = 'round';

		// Draw the text
		var linePositionX;
		var linePositionY;
		for (i = 0; i < outputTextData.length; i++) {
			var line = outputTextData[i];
			linePositionX = 0;
			
			for (j = 0; j < line.length; j++) {
				var textStyle = line[j].style;
				var text = line[j].text;
				var fontProperties = line[j].fontProperties;

				this.context.font = textStyle.font;
				this.context.strokeStyle = textStyle.stroke;
				this.context.lineWidth = textStyle.strokeThickness;

				linePositionX += maxStrokeThickness / 2;
				linePositionY = (maxStrokeThickness / 2 + i * lineHeights[i]) + fontProperties.ascent + (textStyle.bottom || 0);

				if (this.style.align === 'right') {
					linePositionX += maxLineWidth - lineWidths[i];
				} else if (this.style.align === 'center') {
					linePositionX += (maxLineWidth - (lineWidths[i])) / 2;
				}

				if (textStyle.valign === 'bottom') {
					linePositionY += lineHeights[i] - line[j].height - (maxStrokeThickness - textStyle.strokeThickness) / 2;
				} else if (textStyle.valign === 'middle') {
					linePositionY += (lineHeights[i] - line[j].height) / 2 - (maxStrokeThickness - textStyle.strokeThickness) / 2;
				}

				// draw shadow
				if (textStyle.dropShadow) {
					this.context.fillStyle = textStyle.dropShadowColor;

					var xShadowOffset = Math.sin(textStyle.dropShadowAngle) * textStyle.dropShadowDistance;
					var yShadowOffset = Math.cos(textStyle.dropShadowAngle) * textStyle.dropShadowDistance;

					if (textStyle.fill) {
						this.context.fillText(text, linePositionX + xShadowOffset, linePositionY + yShadowOffset);
					}
				}

				// set canvas text styles
				this.context.fillStyle = textStyle.fill;

				// draw lines
				if (textStyle.stroke && textStyle.strokeThickness) {
					this.context.strokeText(text, linePositionX, linePositionY);
				}

				if (textStyle.fill) {
					this.context.fillText(text, linePositionX, linePositionY);
				}

				// set Position X to the line width
				// remove the strokeThickness otherwise the text will be to far
				// from the previous group
				linePositionX += line[j].width;
				linePositionX -= maxStrokeThickness / 2;

			}
		}

		this.updateTexture();
	};

	PIXI.MultiStyleText = MultiStyleText;

}).call(this);