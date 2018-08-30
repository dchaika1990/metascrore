var down = false;
var wrapSlid = $('.pr-slider-wrap');
var currSlid = $('.pr-slider-wrap .slick-current');
var LastActSlid = $('.pr-slider-wrap .slick-active:last');
var FirstActSlid = $('.pr-slider-wrap .slick-active:first');
var slideback;
var slidego;
var lastIndex;
var firstIndex;
var pr_slid_timer;
var pr_resize_time;
var pr_odds_timer;
/*================================================*/
/*                  Switch button                 */
/*================================================*/
function pr_switch_btn() {
	if ($('.pr-switch').length) {
		$('.pr-switch').on('click', function (e) {
			e.stopPropagation();
			if ($(this).find('.pr-switch-circle').hasClass('pr-switch-circle-active')) {
				clearTimeout(pr_odds_timer);
				$(this).find('.pr-switch-circle').removeClass('pr-switch-circle-active');
				// hide row with odds
				// hide row with odds type
				pr_odds_timer = setTimeout(function () {
					$('.pr-odds-row').hide(300);
					$('.pr-main-odds').slideUp(200);
					// make less max-width for team name
					$('.pr-match-team-name').removeClass('pr-match-team-name-open');
					$('.pr-cup-link').removeClass('pr-cup-link-open');
					$('.pr-cup-link').removeClass('pr-cup-link-open');
					$('.pr-title-score-row').removeClass('pr-title-score-row-open');
					// add class for top border above odds
					$('.pr-main-content-row').find('.pr-match-row-right-wrap:first').removeClass('pr-match-row-right-wrap-active');
				}, 200);
			} else {
				clearTimeout(pr_odds_timer);
				$(this).find('.pr-switch-circle').addClass('pr-switch-circle-active');
				// show row with odds
				// hide row with odds type
				pr_odds_timer = setTimeout(function () {
					$('.pr-main-odds').slideDown(200);
					$('.pr-odds-row').delay(200).show(300);
					// make more max-width for team name
					$('.pr-match-team-name').addClass('pr-match-team-name-open');
					$('.pr-cup-link').addClass('pr-cup-link-open');
					$('.pr-title-score-row').addClass('pr-title-score-row-open');
					// remove class for top border above odds
					$('.pr-main-content-row').find('.pr-match-row-right-wrap:first').addClass('pr-match-row-right-wrap-active');
				}, 200)

				odds_click();
			}
		});
	}
}

function odds_click() {
	$('.pr-main-odds *').on('click', 'label', function () {
		if ($('.pr-main-odds input').is(':checked')) {
			$('.pr-main-odds').slideUp(200);
		}
	});
}

function oddsToggleShow() {
	if ($('.pr-match-row').length) {
		/*if(window.innerWidth >= 620){
		  $('.pr-match-row').find('.pr-match-row-right.active').removeClass('active');
		}
		if(window.innerWidth <= 620){
		  $('.pr-match-row').on('click', function(e){
		    if (e.target != this) {
		     return true;
		    }
		    $(this).find('.pr-match-row-right').addClass('active');
		  })
		}*/
	}
}


$('.pr-match-rows-wrap').on('click', '*', function (e) {
	if (e.target.nodeName.toLowerCase() !== 'i' && e.target.nodeName.toLowerCase() !== 'a') {
		var aside = $('.aside-right:not(.aside-right-default)');
		
		//open odds
		if (window.innerWidth <= 620) {
			$('.pr-match-row-right').removeClass('active');
			if (!$('.pr-match-row-right.active').length) {
				if ($(this).hasClass('pr-match-row-wrap')) {
					$(this).find('.pr-match-row-right').addClass('active');
				} else {
					$(this).closest('.pr-match-row').find('.pr-match-row-right').addClass('active');
				}
			}
			return false;
		}

		//open sidebar
		if (window.innerWidth <= 920 && window.innerWidth > 620) {
			aside.addClass('open');
			$(".nm-content-overlay").stop().fadeIn(200);
		}
	}

})

$(document).on("click", "*", function (e) {
	if ($('.pr-match-row-right.active').length) {
		$('.pr-match-row-right').removeClass('active');
	}
})

/* sidebar mob hide*/
$(".nm-content-overlay").on("click", function(){
	$(".nm-content-overlay").fadeOut(200);
	$('.aside-right:not(.aside-right-default)').removeClass('open');
})


$('.favorites-match-row').on('click', '*', function (e) {
	if (e.target.nodeName.toLowerCase() !== 'i' && e.target.nodeName.toLowerCase() !== 'a') {
		var aside = $('.pr-favorites-right:not(.pr-favorites-right-default)');

		//open sidebar
		if (window.innerWidth <= 920 && window.innerWidth > 620) {
			aside.addClass('open');
			$(".nm-content-overlay").stop().fadeIn(200);
		}
	}

})

/* sidebar mob hide*/
$(".nm-content-overlay").on("click", function(){
	$(".nm-content-overlay").fadeOut(200);
	$('.pr-favorites-right:not(.pr-favorites-right-default)').removeClass('open');
})

/*================================================*/
/*                Arrow for match row             */
/*================================================*/

function matchRow_arrow() {
	$('.pr-main-content-row .pr-arrow').on('click', function () {
		if ($('.pr-main-content-row').length && window.innerWidth <= 620) {
			$(this).toggleClass('active');
			$(this).closest('.pr-main-content-row').find('.pr-match-rows-wrap').slideToggle(200);
		}
	})
}

/*================================================*/
/*                Favorite button                 */
/*================================================*/
$('body').on('click', '.pr-favorite-btn, .pr-favorite-btn i', function (e) {
	e.stopPropagation();
	if ($(this).is("a")){
		if (!($(this).hasClass('pr-favorite-btn-active'))) {
			$(this).addClass('pr-favorite-btn-active');
			$(this).removeClass('pr-fvr-muted');
			$(this).siblings('.pr-dropdown-favorite').hide();
		}
	}
	if ($(this).is("i")){
		var nm_a = $(this).parent("a");
		if (!nm_a.hasClass('pr-favorite-btn-active')) {
			nm_a.addClass('pr-favorite-btn-active');
			nm_a.removeClass('pr-fvr-muted');
			nm_a.siblings('.pr-dropdown-favorite').hide();
		}
	}
})

$('.pr-dropdown-favorite .pr-remove').on('click', function () {
	$(this).closest('.pr-dropdown-favorite').hide();
	$(this).closest('.pr-dropdown-favorite').siblings('.pr-favorite-btn').removeClass('pr-favorite-btn-active');
});
$('.pr-dropdown-favorite .pr-mute').on('click', function () {
	$(this).closest('.pr-dropdown-favorite').hide();
	$(this).closest('.pr-dropdown-favorite').siblings('.pr-favorite-btn').addClass('pr-fvr-muted').removeClass('pr-favorite-btn-active');
});

/*================================================*/
/*              Redraw Blure sections             */
/*================================================*/
function newsRedraw() {
	if (window.innerWidth > 1200) {
		wrapSlid.find(currSlid).addClass('pr-blur-slide pr-left-blur');
		wrapSlid.find(LastActSlid).addClass('pr-blur-slide pr-right-blur');
	}
	if (window.innerWidth <= 1200 && window.innerWidth >= 998) {
		wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide pr-right-blur pr-left-blur');
		wrapSlid.find(FirstActSlid).prev().addClass('pr-blur-slide pr-left-blur');
		wrapSlid.find(LastActSlid).next().addClass('pr-blur-slide pr-right-blur');
	}
	if (window.innerWidth < 998) {
		wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide pr-right-blur pr-left-blur');
	}
};


/*================================================*/
/*            Action on click blur slide          */
/*================================================*/
function blurClick() {
	lastIndex = $('.slick-slide:last').data('slick-index');
	firstIndex = $('.slick-slide:first').data('slick-index');
	$('body').on('click', '.pr-left-blur', function () {
		if (window.innerWidth >= 998) {
			clearTimeout(pr_slid_timer);
			wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide pr-right-blur pr-left-blur');
			if (window.innerWidth > 1200) {
				slidego = $('.pr-slider-wrap .slick-current').data('slick-index') - 4;
			} else if (window.innerWidth <= 1200) {
				slidego = $('.pr-slider-wrap .slick-current').data('slick-index') - 2;
			}

			if (slidego <= (firstIndex + 1)) {
				$('.pr-slider-wrap').slick('slickGoTo', (lastIndex - 6));
			} else {
				$('.pr-slider-wrap').slick('slickGoTo', slidego);
			}

			pr_slid_timer = setTimeout(function () {
				wrapSlid = $('.pr-slider-wrap');
				wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide pr-right-blur pr-left-blur');
				currSlid = $('.pr-slider-wrap .slick-current');
				LastActSlid = $('.pr-slider-wrap .slick-active:last');
				FirstActSlid = $('.pr-slider-wrap .slick-active:first');
				if (window.innerWidth > 1200) {
					slidego = $('.pr-slider-wrap .slick-current').data('slick-index') - 4;
				} else {
					slidego = $('.pr-slider-wrap .slick-current').data('slick-index') - 2;
				}
				newsRedraw();
			}, 300)
		}
	});

	$('body').on('click', '.pr-right-blur', function () {
		if (window.innerWidth >= 998) {
			clearTimeout(pr_slid_timer);
			wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide pr-right-blur pr-left-blur');
			if (window.innerWidth > 1200) {
				slidego = $('.pr-slider-wrap .slick-current').data('slick-index') + 4;
			} else if (window.innerWidth <= 1200) {
				slidego = $('.pr-slider-wrap .slick-current').data('slick-index') + 2;
			}
			if (slidego >= lastIndex) {
				$('.pr-slider-wrap').slick('slickGoTo', firstIndex);
			} else {
				$('.pr-slider-wrap').slick('slickGoTo', slidego);
			}
			pr_slid_timer = setTimeout(function () {
				wrapSlid = $('.pr-slider-wrap');
				wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide pr-right-blur pr-left-blur');
				currSlid = $('.pr-slider-wrap .slick-current');
				LastActSlid = $('.pr-slider-wrap .slick-active:last');
				FirstActSlid = $('.pr-slider-wrap .slick-active:first');
				if (window.innerWidth > 1200) {
					slidego = $('.pr-slider-wrap .slick-current').data('slick-index') + 4;
				} else {
					slidego = $('.pr-slider-wrap .slick-current').data('slick-index') + 2;
				}
				newsRedraw();
			}, 300)
		}
	})
};

// Animate scroll to top button
$("a.pr-to-top").click(function () {
	$("html, body").animate({
		scrollTop: 0
	}, "slow");
	return false;
});

$(document).ready(function () {
	pr_switch_btn();
	oddsToggleShow();
	matchRow_arrow();

	/*================================================*/
	/*                      Slider                    */
	/*================================================*/
	if ($('.pr-slider-wrap').length) {
		$('.pr-slider-wrap').slick({
			infinite: true,
			slidesToShow: 6,
			slidesToScroll: 1,
			dots: false,
			arrows: false,
			speed: 300,
			swipeToSlide: true,
			responsive: [
				{
					breakpoint: 1600,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 1,
						infinite: true,
					}
      },
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
						centerPadding: '105px',
						centerMode: true,
					}
      },
				{
					breakpoint: 998,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
						centerPadding: '100px',
					}
      },
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
						centerMode: false,
					}
      },
				{
					breakpoint: 620,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true
					}
      },
    ]
		});
		down = false;
		wrapSlid = $('.pr-slider-wrap');
		currSlid = $('.pr-slider-wrap .slick-current');
		LastActSlid = $('.pr-slider-wrap .slick-active:last');
		FirstActSlid = $('.pr-slider-wrap .slick-active:first');
		$('.pr-slider-wrap').on('swipe', function (event, slick, direction) {
			wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide');
			wrapSlid = $('.pr-slider-wrap');
			currSlid = $('.pr-slider-wrap .slick-current');
			LastActSlid = $('.pr-slider-wrap .slick-active:last');
			FirstActSlid = $('.pr-slider-wrap .slick-active:first');
			newsRedraw();
		});

		newsRedraw();
		/*================================================*/
		/*                 Drag and drop slider           */
		/*================================================*/
		$('.pr-slider-wrap *').on('mousedown touchstart', function (e) {
			down = true;
		})
		$('.pr-slider-wrap *').on('mouseup touchend', function (e) {
			down = false;
			newsRedraw();
		})
		$('.pr-slider-wrap *').on('mousemove touchmove', function (e) {
			if (down) {
				wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide');
			}
		})
		if ($('.pr-new-wrap').length > 6) {
			blurClick();
		}
	}
})

/*================================================*/
/*                     Resize                     */
/*================================================*/

$(window).resize(function () {
	oddsToggleShow();
	clearTimeout(pr_resize_time);
	pr_resize_time = setTimeout(function () {
		wrapSlid = $('.pr-slider-wrap');
		currSlid = $('.pr-slider-wrap .slick-current');
		LastActSlid = $('.pr-slider-wrap .slick-active:last');
		FirstActSlid = $('.pr-slider-wrap .slick-active:first');
		wrapSlid.find('.pr-new-wrap').removeClass('pr-blur-slide');
		newsRedraw();
	}, 300);
});


/*================================================*/
/*                  Read more button              */
/*================================================*/
$('body').on('click', '.sr-more-btn', function (e) {
    e.stopPropagation();
    if ($(this).is("a")){
        if (!($(this).hasClass('sr-more-btn-active'))) {
            $(this).addClass('sr-more-btn-active');
        } else {
        	$(this).removeClass('sr-more-btn-active')
		}
    }
})

/*================================================*/
/*                 Search result tabs             */
/*================================================*/
$(function() {

	$('ul.sr-tabs__caption').on('click', 'li:not(.active)', function() {
		$(this)
			.addClass('active').siblings().removeClass('active')
			.closest('div.sr-mobile-tabs').find('div.sr-tabs__content').removeClass('active').eq($(this).index()).addClass('active');
	});

});