(function () {
	$( document ).ready(function() {
		
		$('nav').on('click', 'li a',  function(){
			var sectionId = $(this).attr('href').slice(1);
			$('section.page_section').removeClass('active');
			$('section' + sectionId).addClass('active');
			$('nav li').removeClass('active');
			$(this).parent().addClass('active');;
		});
		
		calculate();
		
		function calculate() {
			if (!window.location.hash) {
				window.location.hash = 'home';
				$('nav li:first-child').addClass('active');
			}
			activateSection (window.location.hash.slice(1));
			$('section').css('height', $(window).height());
		}
		
		function activateSection ( section ) {
			$('section.page_section').removeClass('active');
			$('section#' + section ).addClass('active');
			$('nav li.' + section).addClass('active');
		}
	});
	
	
	
})();