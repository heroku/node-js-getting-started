(function () {
	$( document ).ready(function() {
        $(document).bind('scroll',function(e){
            $('section').each(function(){
                if (
                $(this).offset().top < window.pageYOffset + 10
                //begins before top
                && $(this).offset().top + $(this).height() > window.pageYOffset + 10
                //but ends in visible area
                //+ 10 allows you to change hash before it hits the top border
                ) {
                    window.location.hash = $(this).attr('id');
                    activateSection ( $(this).attr('id') );
                }
            });
        });
		
		$('nav').on('click', 'li a',  function(){
			var section = $(this).parent().attr('class');
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                     scrollTop: target.offset().top
                }, 400);
            }
			activateSection ( section );
		});
		
		calculate();
		
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
		}
	});
	
})();
