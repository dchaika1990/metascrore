
(function (){
	setInterval(function(){
		$('.details__timer').toggleClass('details__timer-blink');
	}, 1000);
})();


$('.aside-slider__wrap').slick({
	dots: true,
	arrows: false,
	autoplay: true,
	autoplaySpeed: 5000
});

$(window).on('load resize', function() {
	var oldWidth = $(window).data("oldwidth");
	var newWidth = $(window).outerWidth();
	var lgWidth = 1201;
	if (newWidth != oldWidth) {
		if (newWidth < lgWidth && (!oldWidth || oldWidth >= lgWidth)) {
		} else if (newWidth >= lgWidth && (!oldWidth || oldWidth < lgWidth)) {
			$(".leagues-overwrap").removeClass("show").removeClass("hide");
			$(".datepicker-block").removeClass("show").removeClass("hide");
		}
		$(window).data("oldwidth", newWidth);
	}
});

$(window).on('load resize', function () {
	$(document).mouseup(function (e) {
		if (window.innerWidth < 1201) {
			var container = $(".leagues-overwrap, .datepicker-block");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				container.removeClass("show").addClass("hide");
			}
		}
	});
	$(".leagues__all .s-title").on("click", function () {
		if (window.innerWidth < 1201) {
			$(".leagues-overwrap").removeClass("show").addClass("hide");
		}
	});
});


$(document).on("click", ".ma_button.favorite", function() {
	$(this).toggleClass("active");
});


$(document).on("focus", ".leagues__filter input", function() {
	$(".leagues__filter").addClass("focus");
});
$(document).on("focusout", ".leagues__filter input", function() {
	$(".leagues__filter").removeClass("focus");
});


$(document).on("click", ".filter__open", function() {
	$(".leagues__filter").addClass("active");
});
$(document).on("click", ".filter__close", function() {
	$(".leagues__filter").removeClass("active");
});