$(document).ready(function () {

  $('.js-user-name-edit-btn').on('click', function() {
      var _that = $(this),
          form = _that.parents('form'),
          input = form.find('.js-user-name-input'),
          currentName = input.val(),
          currentNameLen = currentName.length;

      form.addClass('-active');
      form.data('currentName', currentName);
      input.removeAttr('readonly').focus().val(currentName);
      input[0].setSelectionRange(currentNameLen, currentNameLen);
  });

  $('.js-user-name-submit').on('click', function(e) {
      var _that = $(this),
          form = _that.parents('form'),
          input = form.find('.js-user-name-input'),
          value = input.val(),
          field = $('.js-user-name-field');

      e.preventDefault();

      form.find('.user-name-edit-error').remove();

      if( !value.length ) {
          var errorText = '<span class="user-name-edit-error">The field is empty</span>';
          input.focus().before(errorText);
          //_that.val(form.data('currentName'));
          //field.text('currentName');
      } else {
          input.attr('readonly', true);
          field.text(value);
          form.removeClass('-active');
      }

      // functionality for submit form
  });
    var topPredictorsItems = $('.top-predictors-item'),
        topPredictorsItemsLen = topPredictorsItems.length,
        topPredictorsLimit = 10;

    var asideOwlCarousel = $('.js-aside-owl-carousel').owlCarousel({
        items: 1,
        nav: true,
        navContainer: '.aside-owl-nav-container > .title',
        navText: [
            '<svg class="svg-ic" width="6" height="9"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use></svg>',
            '<svg class="svg-ic" width="6" height="9"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use></svg>'
        ]
    });

    asideOwlCarousel.on('changed.owl.carousel', function(event) {
        var page = event.page.index;
        var _from = topPredictorsLimit * page + 1;
        var _to = ((page + 1) * topPredictorsLimit) < topPredictorsItemsLen ?
            ((page + 1) * topPredictorsLimit) : topPredictorsItemsLen;

        $('.js-top-predictors-from').text(_from);
        $('.js-top-predictors-to').text(_to);
    });

    $('.js-user-file-input').on('change', function() {
      var _that = $(this)[0],
          file  = _that.files[0],
          size = file.size,
          valid = true;

      valid = validateImgSize(size);

      if (file && valid) {
          var reader = new FileReader();

          reader.addEventListener("load", function () {
              var result = this.result;
              valid = validateImageDimension(result);

              $('.js-user-logo-img').attr('src', result);
          }, false);

          if (valid) {
              reader.readAsDataURL(file);
          }
      }
  });
});

function validateImageDimension(img) {
    var i = new Image();
    i.src = img.src;

    if (i.width < 500 || i.height < 500) {
        return true;
    }
    alert('Image dimensions should be less than 500px');
    return false;
}

function validateImgSize(size) {
    if (size < 41943040) {
        return true;
    }
    alert('Image size should be less than 5mb');
    return false;
}