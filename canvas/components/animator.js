define('components/animator', function(){

	var _event = "animationend.animator";

	return { 
		prefix: 'anim-',

		play: function play(element, anim, callback, loop){
			var _this = this;

			$(element).on(_event, function(){

				$(this).removeClass(this.prefix+anim);

				callback && callback();

				setTimeout(function(){
					if( loop == -1 ){
						return play(element, anim, callback, loop);
					}

					if( loop > 0 ){
						return play(element, anim, callback, --loop);
					}

					return _this.stop(element, anim);
				}, 10);

			});

			$(element).addClass(this.prefix+anim);

		},
		stop: function stop(element, anim){
			element.off(_event).removeClass(this.prefix+anim);
		}
	};
});