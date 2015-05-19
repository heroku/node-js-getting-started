var VideoPlayer = VideoPlayer || {};
(function() {

	var _scope = this;

	VideoPlayer.player = function(src, loop, onStart, onEnd) {
		console.log("*** VideoPlayer ***");
		this.loop = loop;
		this.video = document.createElement("video");
		this.video.style.position = 'absolute';
		this.video.style.top = '0px';
		this.video.src = src;
		this.video.loop = loop;
		this.video.width = 1024; 
		this.video.height = 576; 
		if (onEnd) {
			this.video.addEventListener("ended", onEnd, false);
		}

		if (onStart) {
			this.video.addEventListener("play", onStart, false);
		}
		// this.video.controls = "controls";
		document.body.appendChild(this.video);
	};

	VideoPlayer.player.prototype.play = function() {
		this.video.play();
	};

	VideoPlayer.player.prototype.pause = function() {
		this.video.pause();
	};

	VideoPlayer.player.prototype.load = function() {
		this.video.load();
	};

	VideoPlayer.player.prototype.element = function() {
		return this.video;
	};

}).call(this);
