(function () {
	$( document ).ready(function() {
		
		$('nav').on('click', 'li a',  function(){
			var sectionId = $(this).attr('href').slice(1);
			$('section.page_section').removeClass('active');
			$('section' + sectionId).addClass('active');
		});
		
		calculate();
		
		function calculate() {
			if (!window.location.hash) {
				window.location.hash = 'home';
				$('section#home').addClass('active');
			}
			$('section').css('height', $(window).height());
		}
		
		/* function activateSection ( section ) {
			$('section.page_section').removeClass('active');
			$('section#' + section ).addClass('active');
		} */
	});
	
	
	
})();