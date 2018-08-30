var lastWindowWidth;
var actual_scroll; //current scroll from top position
var mob = 620; //mob version start
var minisearch = 920; //start tabbed search dropdown
var jump = false; //swith between desktop and mobile
var jump_search = false; //swith betweendull and tabbed searh dropdown

window.addEventListener("touchmove", Scroll);
window.addEventListener("scroll", Scroll);


/* Define is device touchable */
function is_touch_device() {
	return 'ontouchstart' in window || navigator.maxTouchPoints
}

/* detect IE */
function detectIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
	}
	var trident = ua.indexOf("Trident/");
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf("rv:");
		return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
	}
	var edge = ua.indexOf("Edge/");
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
	}
	// other browser
	return false
}

/* mozilla detect */
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/* MacOs detect */
var is_MacOs = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

/* Define is device on iOS */
function is_iOS() {
	var iDevices = [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	];
	while (iDevices.length) {
		if (navigator.platform === iDevices.pop()) {
			return true
		}
	}
	return false
}


/* Add touch for jquery-ui on mobile devices */
! function (a) {
	function f(a, b) {
		if (!(a.originalEvent.touches.length > 1)) {
			a.preventDefault();
			var c = a.originalEvent.changedTouches[0],
				d = document.createEvent("MouseEvents");
			d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(d)
		}
	}
	if (a.support.touch = "ontouchend" in document, a.support.touch) {
		var e, b = a.ui.mouse.prototype,
			c = b._mouseInit,
			d = b._mouseDestroy;
		b._touchStart = function (a) {
			var b = this;
			!e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, "mouseover"), f(a, "mousemove"), f(a, "mousedown"))
		}, b._touchMove = function (a) {
			e && (this._touchMoved = !0, f(a, "mousemove"))
		}, b._touchEnd = function (a) {
			e && (f(a, "mouseup"), f(a, "mouseout"), this._touchMoved || f(a, "click"), e = !1)
		}, b._mouseInit = function () {
			var b = this;
			b.element.bind({
				touchstart: a.proxy(b, "_touchStart"),
				touchmove: a.proxy(b, "_touchMove"),
				touchend: a.proxy(b, "_touchEnd")
			}), c.call(b)
		}, b._mouseDestroy = function () {
			var b = this;
			b.element.unbind({
				touchstart: a.proxy(b, "_touchStart"),
				touchmove: a.proxy(b, "_touchMove"),
				touchend: a.proxy(b, "_touchEnd")
			}), d.call(b)
		}
	}
}(jQuery)


//disable default page scroll on ie and edge
if (detectIE()) {
	/*if ($(".aside-right-scrollable").length) {
		$('body').on("mousewheel", function () {
			event.preventDefault(); 
			var wd = event.wheelDelta;
			var csp = window.pageYOffset;
			window.scrollTo(0, csp - wd);
		})
	}*/
}


/* Instructions for page scrolling and swiping */
function Scroll() {
	//fixed scrillable aside
	if ($(".aside-right-scrollable").length) {
		var container = $(".nm-grow"),
			elem = $(".aside-right-scrollable-wrapper");
        
		//if element can be visible
		if (window.innerWidth > mob) {
			//reset aside height
            elem.css("height", "");
			
			var header_height = 60,
				pos = container.offset().top,
				bot_pos = container.offset().top + container.outerHeight(),
				w_scrool = $(window).scrollTop(),
				w_height = window.innerHeight,
				calc_h = "auto",
				calc_top = "auto",
				calc_bottom = "auto",
				calc_pos = "static";
			
			//if element position x -> 100%
			if ( w_scrool < (pos - header_height)) {
				console.log("1");
				calc_pos = "relative";
				calc_top = "auto";
				calc_h = w_height - pos + w_scrool;
				calc_bottom = "auto";
			}

			//if element position 0% -> 100%
			if ( (w_scrool >= (pos - header_height)) && ((w_scrool + w_height) < (bot_pos) ) ) {
				calc_pos = "fixed";
				calc_top = header_height + "px";
				calc_bottom = "0";
			}

			//if element position 0% -> x
            if (window.innerWidth > minisearch) {
				if ( (w_scrool >= (pos - header_height)) && ((w_scrool + w_height) >= (bot_pos) ) ) {
					calc_pos = "absolute";
					//calc_top = header_height + "px";
					calc_top = "auto";
					calc_h = bot_pos - w_scrool - header_height;
					//calc_bottom = w_height - bot_pos + w_scrool + "px";
					calc_bottom = "0";
				}
            } else {
				if ( (w_scrool >= (pos - header_height)) && ((w_scrool + w_height) >= (bot_pos) ) ) {
					calc_pos = "fixed";
					calc_top = header_height + "px";
					calc_bottom = "0";
				}
				
			}
			
			//apply calculated parameters
			elem.css({
				"position": calc_pos,
				"top": calc_top,
				"bottom": calc_bottom,
				"height": calc_h
			});
			
			
		} else {
			elem.css("position", "static").css("height","")
		}
	}
}


/* Closing all dropdowns and popups */
function close_opened() {
	$(".nm-toggler").removeClass("open");
	$(".nm-dropdown").fadeOut(200);

}


/* Getting width of browser's scrollbar */
function getScrollBarWidth() {
	var inner = document.createElement('p');
	inner.style.width = "100%";
	inner.style.height = "200px";
	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild(inner);
	document.body.appendChild(outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = inner.offsetWidth;
	if (w1 == w2) w2 = outer.clientWidth;
	document.body.removeChild(outer);
	return (w1 - w2);
}


$(document).ready(function () {
	lastWindowWidth = window.innerWidth;
    
	//add fixes for macos
	if (is_MacOs) {
		$("html").addClass("pr-macos");
	}
    
	//add fixes for ios
	if (is_iOS() && is_touch_device() && window.innerWidth < 1000) {
		$("html").addClass("nm-ios");
		$("body, .nm-main-overlay").css("cursor", "pointer")
	}

	//add fixes for Internet Explorer
	if (detectIE()) {
		$("html").addClass("nm-ie")
	}

	//add fixes for Mozilla Firefox
	if (isFirefox) {
		$("html").addClass("nm-moz")
	}

	//draggable init
	if (!is_touch_device()) {
		debiki.Utterscroll.enable()
	}

	//selects init
	if ($(".nm-select").length) {
		$(".nm-select").SumoSelect({
			placeholder: '',
			csvDispCount: 0,
			floatWidth: 0
		})
	}
	
	//textareas autoresize init
	if ($("textarea").length) {
		autosize($('textarea'))
	}

	//remodal popups init
	if ($(".nm-modal").length) {
		$(".nm-modal").remodal({
			hashTracking: false
		})
	}
    if ($(".leagues-overwrap").length) {
		var jq_leagues = $(".leagues-overwrap").clone();
		
		jq_leagues.removeClass("leagues-overwrap").addClass("nm-leagues-modal").appendTo("body").remodal({
            hashTracking: false
        })
		
		jq_leagues.on('click', '.leagues__list a', function(){
			$(this).parent().toggleClass("leagues__item-active");
		})
    }
    
    if ($(".datepicker-block").length) {
        $(".datepicker-block").clone().removeClass("datepicker-block nm-block").addClass("nm-datepicker-modal").appendTo("body").remodal({
            hashTracking: false
        })
        //datepicker
        $(".pr-leftside-calendar").datepicker({
            showOtherMonths: true,
            firstDay: 1
        })
    }
    
    //scroll areas init
	if ($(".nm-scroll-area").length) {
		$(".nm-scroll-area").scrollbar({
			disableBodyScroll: true
		})
	}
    
	//hide search result tabs on tablet
	if (window.innerWidth <= minisearch) {
		if ($(".nm-search-results .nm-result-col").length) {
			$(".nm-search-results .nm-result-col").not($(".nm-suggestions-block, .active")).hide();
			$(".nm-search-results .nm-result-col.active").show()
		}
	}
})


window.onload = function () {
	//datepicker
	(function () {
        if ($(".datepicker-block").length) {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if ($('.calendar__time').length) {
                $('.calendar__time').html(hours + ':' + minutes);
                window.setTimeout(arguments.callee, 1000);
            }
        }
    })()
	
	Scroll();
}


$(window).resize(function () {
	////////////////////////////////////////
	//.. changes between desktop/mobile ..//
	//....................................//
	if (window.innerWidth > mob) {
		if (!jump) {
			close_opened();
			if (!$(".nm-header-top").hasClass("nm-search-opened")) {
				$(".nm-main-overlay").stop().fadeOut(200)
			}
		}
		jump = true
	}
	if (window.innerWidth <= mob) {
		if (jump) {
			close_opened();
			if (!$(".nm-header-top").hasClass("nm-search-opened")) {
				$(".nm-main-overlay").stop().fadeOut(200)
			}
		}
		jump = false
	}
	////////////////////////////////////////



	////////////////////////////////////////
	//..... search dropdown changing .....//
	//....................................//
	if (window.innerWidth > minisearch) {
		if (!jump_search) {
			$(".nm-search-results .nm-result-col").removeAttr("style")
		}
		jump_search = true
	}
	if (window.innerWidth <= minisearch) {
		$(".nm-search-results .nm-result-col").not($(".nm-suggestions-block, .active")).hide();
		$(".nm-search-results .nm-result-col.active").show();
		jump_search = false
	}
	////////////////////////////////////////

	if (window.innerWidth !== lastWindowWidth) {
		lastWindowWidth = window.innerWidth
	}
    
    Scroll();
})


//close all opened elements on page click
$(document).on("click", "*", function (e) {
	e.stopPropagation();
	if (!$(".remodal-is-opened").length) {
		if ((!$(this).closest(".nm-toggler").length) && (!$(this).closest(".nm-dropdown").length) && (!$(this).hasClass(".nm-toggler"))) {
			close_opened();
			if (!$(".nm-header-top").hasClass("nm-search-opened") && (!$(".nm-menu-toggler").hasClass("open"))) {
				$(".nm-main-overlay").stop().fadeOut(200)
			}
		}

		//close togglers in mobile header dropdown by outside click
		if ($(this).closest(".nm-menu-burger").length && (!$(this).closest(".nm-toogle-div").length) && !$(this).hasClass(".nm-toggler")) {
			$(".nm-dropdowns-row-mob .nm-toggler").removeClass("open");
			$(".nm-dropdowns-row-mob .nm-dropdown").fadeOut(200);
		}
		
		//close leagues search
		if (!$(this).closest(".leagues__title-wrap").length) {
			$(".leagues__filter").removeClass("active");
		}
	}
    
    //close leagues search
    if (!$(this).closest(".leagues__title-wrap").length) {
        $(".leagues__filter").removeClass("active");
    }
})

//symbol counters in textareas
$(".nm-textarea-counted").on("keydown keyup paste mousemove", function(){
	var count = $(this).val().length;
	var max = 1000;
	$(this).next(".nm-text-counter").text(count + '/' + max);
	if (count >= max) {
		$(this).next(".nm-text-counter").css("color", "#ed334d");
	}
	else {
		$(this).next(".nm-text-counter").css("color", "");
	}
})

//datepicker reset
$(document).on('click', '.calendar__today-btn', function () {
    $(this).closest(".pr-leftside-calendar-wrap").find(".pr-leftside-calendar").datepicker("setDate", null);
})


////////////////////////////////////////
//............. TOGGLERS .............//
//....................................//
$(".nm-toggler").on("click", function (e) {
	var target = $(this);
	var drop = target.next(".nm-dropdown");
	e.preventDefault();

	if (!$(this).closest(".nm-menu-burger").length > 0) {
		$(".nm-toggler").not(target).removeClass("open");
		$(".nm-dropdown").not(drop).stop().hide();
	} else {
		$(".nm-dropdowns-row-mob .nm-toggler").not(target).removeClass("open");
		$(".nm-dropdowns-row-mob .nm-dropdown").not(drop).stop().hide();
	}

	target.toggleClass("open");
	drop.stop().fadeToggle(200);

	if ($(this).hasClass("nm-menu-toggler")) {
		if ($(this).hasClass("open")) {
			$(".nm-main-overlay").stop().fadeIn(200)
		} else {
			$(".nm-main-overlay").stop().fadeOut(200)
		}
	}
})

//togglers corner color on hover
$(".nm-dropdown > ul > li:first-child a").on("mouseenter", function () {
	if (!$(this).closest(".pr-favorite-container").find(".nm-top-position").length) {
		$(this).closest("ul").addClass("first-hover")
	}
})
$(".nm-dropdown > ul > li:first-child a").on("mouseleave", function () {
	if (!$(this).closest(".pr-favorite-container").find(".nm-top-position").length) {
		$(this).closest("ul").removeClass("first-hover")
	}
})

//togglers corner color on hover for vertically flipped dropdowns
$(".nm-dropdown > ul > li:last-child a").on("mouseenter", function () {
	if ($(this).closest(".pr-favorite-container").find(".nm-top-position").length) {
		$(this).closest("ul").addClass("first-hover")
	}
})
$(".nm-dropdown > ul > li:last-child a").on("mouseleave", function () {
	if ($(this).closest(".pr-favorite-container").find(".nm-top-position").length) {
		$(this).closest("ul").removeClass("first-hover")
	}
})

//above tabs
$(document).on("click", ".nm-above-tabs a", function (e) {
	e.preventDefault();
	if (!$(this).hasClass("active")) {
		$(this).siblings("a").removeClass("active");
		$(this).addClass("active")
	}
})

//search dropdown tabs
$(document).on("click", ".nm-search-tabs a", function (e) {
	e.preventDefault();
	var cur = 0;
	var count = $(".nm-search-tabs a").length;
	if (!$(this).hasClass("active")) {
		$(this).siblings("a").removeClass("active");
		$(this).addClass("active");

		for (i = 0; i < count; i++) {
			if ($(".nm-search-tabs a").eq(i).hasClass("active")) {
				cur = (i + 1)
			}
		}

		$(".nm-search-results .nm-result-col").not($(".nm-suggestions-block")).removeClass("active").hide();
		$(".nm-search-results .nm-result-col").eq(cur).addClass("active").show()
	}
})

//share buttons toggler
$(document).on("click", ".nm-share-toggle", function(e) {
	$(this).closest(".nm-share-block").toggleClass("open")
})

//autoclose share zone
$(document).on("mouseleave", ".nm-share-block", function() {
	$(this).removeClass("open")
})

//aside tabs
$(document).on("click", ".nm-tabs-list a", function (e) {
	e.preventDefault();
	var list = $(this).closest(".nm-tabs-list");
	var container = $(this).closest(".nm-tabs-wrapper").find(".nm-tabs-content:first");
	var cur = 0;
	var count = list.find("a").length;
	if (!$(this).closest("li").hasClass("active")) {
		$(this).closest("li").siblings("li").removeClass("active");
		$(this).closest("li").addClass("active");

		for (i = 0; i < count; i++) {
			if (list.find("li").eq(i).hasClass("active")) {
				cur = i
			}
		}

		container.children(".nm-tab-content").removeClass("active");
		container.children(".nm-tab-content").eq(cur).addClass("active");
		
		//lineups field swipe
		if ($(this).closest(".nm-tabs-list").hasClass("nm-lineups-tabs")) {
			$(this).closest(".nm-tabs-wrapper").find(".nm-field-wrap").toggleClass("left-side")
		}
	}
})

//fix for aside dropdown overflowing
$(".aside-right .pr-favorite-btn.nm-toggler").on("click", function(){
	var aside = $(".aside-right");
	var distance_this = $(this).position().top + $(this).offset().top + $(this).outerHeight();
	var distance_aside = aside.position().top + aside.offset().top + aside.outerHeight();
	if ((distance_aside-distance_this) < 97) {
		$(this).addClass("nm-top-position")
	} else {
		$(this).removeClass("nm-top-position")
	}
})

//leagues togglers
$(".leagues__link").on("click", function() {
	$(this).parent().toggleClass("leagues__item-active");
})
////////////////////////////////////////



////////////////////////////////////////
//.............. SEARCH ..............//
//....................................//
$(".nm-search-form .nm-search-toggle").on("click", function (e) {
	var form = $(this).closest(".nm-search-form");
	var input = $(this).closest(".nm-search-form").find(".nm-input");
	var trim_val;
	$("html").addClass("remodal-is-locked");
	//if search form closed
	if (form.hasClass("nm-search-closed")) {
		e.preventDefault()
	}

	//toggle open/close search form
	if (input.val()) {
		trim_val = input.val().trim()
	}
	if (!trim_val) {
		e.preventDefault();
		form.toggleClass("nm-search-closed");
		$(".nm-header-top").toggleClass("nm-search-opened");

		if ($(".nm-header-top").hasClass("nm-search-opened")) {
			$(".nm-main-overlay").stop().fadeIn(200);
			$(".nm-search-form .nm-btn-close").stop().fadeIn(200)
		} else {
			$(".nm-main-overlay").stop().fadeOut(200);
			$(".nm-search-form .nm-btn-close").stop().hide()
		}
	}
})

//clear search btn showing
$(".nm-search-form .nm-input").on("keydown keyup paste mousemove", function (e) {
	var trim_val;
	if ($(this).val()) {
		trim_val = $(this).val().trim();
		if (trim_val) {
			$("header").addClass("nm-searching")
		} else {
			$("header").removeClass("nm-searching")
		}
	} else {
		$("header").removeClass("nm-searching")
	}
})

//clear search btn click
$(".nm-search-form .nm-btn-clear").on("click", function (e) {
	var input = $(".nm-search-form").find(".nm-input");
	e.preventDefault();
	input.val("");
	$("header").removeClass("nm-searching")
})

//close search btn click
$(".nm-search-form .nm-btn-close, .nm-main-overlay").on("click", function (e) {
	e.preventDefault();
	$(".nm-search-form .nm-input").val("");
	$("header").removeClass("nm-searching");
	$(".nm-header-top").removeClass("nm-search-opened");
	$(".nm-search-form").addClass("nm-search-closed");
	$(".nm-main-overlay").stop().fadeOut(200);
	$(this).stop().hide();
	$("html").removeClass("remodal-is-locked");

})
////////////////////////////////////////



////////////////////////////////////////
//.............. POPUPS ..............//
//....................................//
//fix for page width
$(document).on('opening', '.remodal', function () {
	if (($("body").height() > $(window).height()) & ($(window).width() < (1920 + getScrollBarWidth()))) {
		$(".nm-header-top, .nm-search-results, .pr-top-footer-wrap, .pr-bot-footer-wrap").css("padding-right", getScrollBarWidth() + "px");
		$(".pr-top-footer-wrap, .pr-bot-footer-wrap").css("margin-right", -getScrollBarWidth() + "px");
		$(".main-wrapper").css("padding-right", getScrollBarWidth() + "px");
	} else if (($("body").height() > $(window).height()) & ($(window).width() > (1920 + getScrollBarWidth()))) {
		$(".nm-header-top, .nm-search-results, .pr-top-footer-wrap, .pr-bot-footer-wrap").css("padding-right", getScrollBarWidth() + "px");
		$(".main-wrapper").css("margin-right", $(".main-wrapper").offset().left + getScrollBarWidth() / 2 + "px");
		console.log("if you see this, you're very lucky")
	}
})
$(document).on('closed', '.remodal', function () {
	$(".nm-header-top, .nm-search-results, .pr-top-footer-wrap, .pr-bot-footer-wrap, .main-wrapper").removeAttr("style")
})

//closing popup by btn click
$(document).on("click", ".nm-modal-close", function () {
	$(this).closest(".remodal").remodal().close()
})

//textareas updating inside popups
if ($("textarea").length) {
	var ta = document.querySelector('textarea');
	ta.style.display = 'none';
	autosize(ta);
	ta.style.display = '';
	$(document).on('opening', '.remodal', function () {
		autosize.update(ta)
	})
}

//fix for iOs
$(document).on("opening", ".nm-modal", function () {
	actual_scroll = $(window).scrollTop()
})
$(document).on("opened", ".nm-modal", function () {
	//add screen lock with positioning for ios
	if (is_iOS() && is_touch_device() && window.innerWidth < 1000) {
		$("body").scrollTop(actual_scroll)
	}
})
$(document).on("closed", ".nm-modal", function () {
	//scroll back on ios
	if (is_iOS() && is_touch_device() && window.innerWidth < 1000) {
		$(window).scrollTop(actual_scroll)
	}
})

//leagues mobile popup
$(document).on("click", ".nm-link-all-leagues", function() {
    if (window.innerWidth > mob) {
        $(".leagues-overwrap").removeClass("hide").addClass("show");
    } else {
        $(".nm-leagues-modal").remodal().open();
    }
})

//datepicker mobile popup
$(document).on("click", ".nm-link-datepicker", function() {
    if (window.innerWidth > mob) {
        $(".datepicker-block").removeClass("hide").addClass("show");
    } else {
        $(".nm-datepicker-modal").remodal().open();
    }
})
////////////////////////////////////////



////////////////////////////////////////
//............ VALIDATION ............//
//....................................//
function isValidEmail(emailAddress) {
	var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,10}\.)?[a-z]{2,10}$/i;
	return pattern.test(emailAddress)
}

//remove error state on popup close
$(document).on('closed', '.nm-modal', function () {
	$(".nm-modal .nm-input-block").removeClass("nm-error");
	$(".nm-modal .nm-form-error").removeClass("error-active")
})

//clear error state on focus
$(".nm-input-block .nm-input, .nm-input-block .nm-textarea").on("keydown keyup paste focus", function () {
	$(this).closest(".nm-input-block").removeClass("nm-error");
	if (!$(this).closest("form").find(".nm-error").length) {
		$(this).closest("form").find(".nm-form-error").removeClass("error-active")
	}
})

//email validation on focus
$(".nm-input-email").on("keydown keyup paste change", function () {
	var err_field = $(this).closest("form").find(".nm-form-error");

	$(this).removeClass("nm-valid");

	if (isValidEmail($(this).val())) {
		$(this).addClass("nm-valid");
		if (!$(this).closest("form").find(".nm-error").length) {
			err_field.removeClass("error-active")
		}
	}
})
$(".nm-input-email").on("focusout", function () {
	var err_field = $(this).closest("form").find(".nm-form-error");

	if (!isValidEmail($(this).val())) {
		$(this).closest(".nm-input-block").addClass("nm-error")
		err_field.addClass("error-active")
	} else {
		$(this).addClass("nm-valid");
		if (!$(this).closest("form").find(".nm-error").length) {
			err_field.removeClass("error-active")
		}
	}
})

//password validation on focus
$(".nm-input-password").on("keydown keyup paste change focus", function () {
	var err_field = $(this).closest("form").find(".nm-form-error");

	if ($(this).val().length > 3) {
		if (!$(this).closest("form").find(".nm-error").length) {
			err_field.removeClass("error-active")
		}
	}
})
$(".nm-input-password").on("focusout", function () {
	var err_field = $(this).closest("form").find(".nm-form-error");

	if (!$(this).val().length > 3) {
		$(this).closest(".nm-input-block").addClass("nm-error")
		err_field.addClass("error-active")
	} else {
		if (!$(this).closest("form").find(".nm-error").length) {
			err_field.removeClass("error-active")
		}
	}
})

//show password button
$(".nm-show-pass").on("touchstart mousedown", function () {
	$(this).addClass("showing");
	$(this).closest(".nm-input-block").find(".nm-input").prop("type", "text")
})
$(".nm-show-pass").on("touchend mouseup mouseout", function () {
	$(this).removeClass("showing");
	$(this).closest(".nm-input-block").find(".nm-input").prop("type", "password")
})

//popup form validation
$(".nm-modal form input[type='submit']").on("click", function (e) {
	e.preventDefault();
	var nm_error = false;
	var form = $(this).closest("form");
	var input = form.find("input");
	var textarea = form.find("textarea");
	var err_field = $(this).closest("form").find(".nm-form-error");

	err_field.removeClass("error-active");

	if (input) {
		input.each(function () {
			var t = $(this);
			if (t.prop("required")) {
				switch (t.prop("type")) {
					case "text":
					case "number":
					case "file":
					case "email":
					case "password":
						t.closest(".nm-input-block").removeClass("nm-error");

						if (!t.val()) {
							t.closest(".nm-input-block").addClass("nm-error");
							err_field.addClass("error-active");
							nm_error = true
						}

						if (t.prop("type") == "email") {
							if (!isValidEmail(t.val())) {
								t.closest(".nm-input-block").addClass("nm-error");
								err_field.addClass("error-active");
								nm_error = true
							} else {
								t.addClass("nm-valid")
							}
						}

						if (t.prop("type") == "password") {
							if (t.val().length < 4) {
								t.closest(".nm-input-block").addClass("nm-error");
								err_field.addClass("error-active");
								nm_error = true
							}
						}

						if (t.hasClass("nm-input-check-password")) {
							if (t.val() !== t.closest("form").find(".nm-input-new-password").val()) {
								t.closest(".nm-input-block").addClass("nm-error");
								err_field.addClass("error-active");
								nm_error = true
							}
						}

					default:
						break;
				}
			}
		})
	}

	if (textarea) {
		textarea.each(function () {
			var t = $(this);
			if (t.prop("required")) {
				if (!t.val()) {
					t.closest(".nm-input-block").addClass("nm-error");
					nm_error = true
				} else {
					t.closest(".nm-input-block").removeClass("nm-error")
				}
			}
		})
	}

	if (!nm_error) {
		form.submit();
		//$(this).closest(".remodal").remodal().close()
	}
})
////////////////////////////////////////