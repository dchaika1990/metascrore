/*================================================*/
/*                e a c h    F A Q                */
/*================================================*/

function faq_arrow() {
	$('.faq .item .arrow').on('click', function () {
		$(this).toggleClass('active');
		$(this).closest('.item').find('.answer').slideToggle(200);
	})
}

/*================= Custom FAQ blocks position =============================*/

if(window.innerWidth >= 1200){
	$('.right-column').appendTo('.half.right');
}


$(document).ready(function () {
	faq_arrow();
})

/*================================================*/
/*                     Resize                     */
/*================================================*/

$(window).resize(function () {

});
