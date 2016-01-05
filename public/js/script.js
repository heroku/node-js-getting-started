(function () {
	$( document ).ready(function() {
        var top = null;
        var changed = false;
        var currentHash = null;
        
        calculate();
        
        var section = $.map($("section"), function (e) {
            var $e = $(e);
            var pos = $e.position();
            return {
                top: pos.top,
                bottom: pos.top + $e.height(),
                hash: $e.attr('id')
            };
        });
        window.section = section;
        
        $(document).bind('scroll',function(e){
            var newTop = $(document).scrollTop(); 
            changed = newTop != top;
            if (changed) {
                top = newTop;
            }
        });
		
		$('nav').on('click', 'li a',  function(){
			var section = $(this).parent().attr('class');
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                     scrollTop: target.offset().top
                }, 'slow');
                return false; 
            }
			//activateSection ( section );
		});
		
		
		
		function calculate() {
			if (!window.location.hash) {
				window.location.hash = 'home';
			}
			activateSection (window.location.hash.slice(1));
			$('section').css('height', $(window).height() - $('nav').height());
		}
		
		function activateSection ( section ) {
			$('section.page_section').removeClass('active');
			$('section#' + section ).addClass('active');
			$('nav li').removeClass('active');
			$('nav li.' + section).addClass('active');
            window.location.hash = section;
		}
        function step() {
            if (!changed) {
                // Top did not change
                return setTimeout(step, 200);
            }
            var count = section.length;
            var p;

            while (p = section[--count]) {
                if (p.top >= top + 20 || p.bottom <= top) {
                    continue;
                }
                if (currentHash == p.hash) {
                    break;
                }
                var scrollTop = $(document).scrollTop();
                //window.location.hash = currentHash = p.hash;
                activateSection ( p.hash );
                // prevent browser to scroll
                $(document).scrollTop(scrollTop);
            }
            setTimeout(step, 200);
        }
        setTimeout(step, 200);
	});
	
})();
