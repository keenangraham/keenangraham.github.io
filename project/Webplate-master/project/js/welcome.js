

$(document).ready(function()
{
// ------------------------------------------------ Some variables

	var $window_width					= $(window).width();


// ------------------------------------------------ Functions

	// Screen width value
	function fc_screen_width()
	{	
		$('.screen-width').text($window_width);
		
		$(window).resize(function()
		{	
			$window_width				= $(window).width();
			$('.screen-width').text($window_width);
		});
	}


// ------------------------------------------------ Execute
	
	fc_screen_width();


});