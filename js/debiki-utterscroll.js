/* Debiki Utterscroll — dragscroll everywhere
 * http://www.debiki.com/dev/utterscroll*/

//----------------------------------------
  (function($){
//----------------------------------------

if (!window.debiki) window.debiki = {};
if (!debiki.Utterscroll) debiki.Utterscroll = {};

debiki.Utterscroll = (function(options) {
  var debug = (typeof console === 'undefined' || !console.debug) ?
      function() {} : function() { console.debug.apply(console, arguments); };

  var defaults = {
    defaultScrollstoppers: '',
    scrollstoppers: '',
    onMousedownOnWinVtclScrollbar: function() {},
    onMousedownOnWinHztlScrollbar: function() {},
    onHasUtterscrolled: function() {}
  };

  var enabled;
  var settings;
  var allScrollstoppers;
  var $elemToScroll;
  var startPos;
  var lastPos;
  var hasFiredHasUtterscrolled = false;
  var fireHasUtterscrolledMinDist = 15;
  var $viewportGhost =
      $('<div style="width: 100%; height: 100%;' +
        ' position: fixed; top: 0; left: 0; z-index: -999"></div>')
      .appendTo(document.body);

  $(".nm-scroll-area").on("mousedown", startScrollPerhaps);
  $("body").on("mousedown", "ul.options", startScrollPerhaps);

  function startScrollPerhaps(event) {
    if (!enabled)
      return;

    if (event.which !== 1 )
      return;

    var $target = $(event.target);
	  var target = $target;
    var $noScrollElem = $target.closest(allScrollstoppers);
    if ($noScrollElem.length > 0)
      return;
    var ghostOffset = $viewportGhost.offset();
    if (!ghostOffset) {
      return;
    }
    if (event.pageX > ghostOffset.left + $viewportGhost.width()) {
      settings.onMousedownOnWinVtclScrollbar();
      return;
    }
    if (event.pageY > ghostOffset.top + $viewportGhost.height()) {
      settings.onMousedownOnWinHztlScrollbar();
      return;
    }

    if ($target.css('overflow') === 'auto' ||
        $target.css('overflow') === 'scroll') {
      var $ghost = $('<div style="width: 100%; height: 100%; ' +
          'position: absolute;"></div>');
      $ghost.css({ top: $target.scrollTop(), left: $target.scrollLeft() });
      var targetPosOrig = $target.css('position');
      if (targetPosOrig === 'static') {
        $target.css('position', 'relative');
      }
      $target.prepend($ghost)
      var isScrollbar = false;
      if (event.pageX > $ghost.offset().left + $ghost.width())
        isScrollbar = true;
      if (event.pageY > $ghost.offset().top + $ghost.height())
        isScrollbar = true;

      if (targetPosOrig === 'static') {
        $target.css('position', targetPosOrig);
      }

      $ghost.remove();
      if (isScrollbar)
        return;
    }

    $elemToScroll = $.expr[':'].scrollable ? $target.closest('.nm-scroll-area').add($(window)).first() : $(window);

    return startScroll(event);

    function searchForTextIn($elem, recursionDepth) {
      if (recursionDepth > 6)
        return false;
      var $textElems = $elem.contents().filter(function(ix, child, ar) {
        if (child.nodeType === 3) {
          var onlyWhitespace = child.data.match(/^\s*$/);
          return !onlyWhitespace;
        }
        if (child.nodeType === 8)
          return false;
        var $child = $(child);
        if ($child.css('display') === 'inline') {
          var foundText = searchForTextIn($child, recursionDepth + 1);
          return foundText;
        }
        return false;
      });
      return $textElems.length > 0;
    };

    var dist = distFromTextToEvent($target, event);
    if (dist === -1 || dist > 55)
      return startScroll(event);
  };

  function distFromTextToEvent($elem, event) {
    var $parent = $elem;
    var innerHtmlBefore = $parent.html();
    var mark = '<span class="utrscrlhlpr"/>';
    var savedTags = [];
    var innerHtmlNoTags =
        innerHtmlBefore.replace(/<[^>]*>/g, function($0) {
      savedTags.push($0);
      return '·';
    });
    var htmlWithMarksNoTags = mark + innerHtmlNoTags.replace(
        /(\s*.{0,2})/g, '$1'+ mark);
    var savedTagsIx = 0;
    var htmlWithMarks = htmlWithMarksNoTags.replace(/·/g, function() {
      savedTagsIx += 1;
      return savedTags[savedTagsIx - 1];
    });

    var $parentClone = $parent.clone();
    $parentClone.html(htmlWithMarks);
    $parentClone.insertBefore($parent);

    var mouseOffs;
    if (event.pageX || event.pageY) {
      mouseOffs = { x: event.pageX, y: event.pageY };
    }
    else {
      var d = document;
      mouseOffs = {
        x: event.clientX + d.body.scrollLeft + d.documentElement.scrollLeft,
        y: event.clientY + d.body.scrollTop + d.documentElement.scrollTop
      };
    }

    var minDist2 = 999999999;
    $parentClone.find('.utrscrlhlpr').each(function() {
      var myOffs = $(this).offset();
      var distX = mouseOffs.x - myOffs.left;
      var distY = mouseOffs.y - myOffs.top;
      var dist2 = distX * distX + distY * distY;
      if (dist2 < minDist2) {
        minDist2 = dist2;
      }
    });

    $parentClone.remove();

    return Math.sqrt(minDist2);
  };

  function startScroll(event) {
    $(document).mousemove(doScroll);
    $(document).mouseup(stopScroll);
    $(document.body).css('cursor', 'pointer');
    startPos = { x: event.clientX, y: event.clientY };
    lastPos = { x: event.clientX, y: event.clientY }; 

    return false;
  };

  function doScroll(event) {
    var distTotal = {
      x: Math.abs(event.clientX - startPos.x),
      y: Math.abs(event.clientY - startPos.y)
    };
    var distNow = {
      x: event.clientX - lastPos.x,
      y: event.clientY - lastPos.y
    };

    if ($elemToScroll[0] === window) {
    } else {
      if ($elemToScroll.css('overflow-y') === 'hidden') distNow.y = 0;
      if ($elemToScroll.css('overflow-x') === 'hidden') distNow.x = 0;
    }

    if (!hasFiredHasUtterscrolled &&
        (distTotal.x * distTotal.x + distTotal.y * distTotal.y >
        fireHasUtterscrolledMinDist * fireHasUtterscrolledMinDist)) {
      hasFiredHasUtterscrolled = true;
      settings.onHasUtterscrolled();
    }

    var mul;
    if (distTotal.x > 9){
      mul = Math.log((distTotal.x - 9) / 3);
      if (mul > 1.7 && $.browser && $.browser.opera) mul = 1.7;
      if (mul > 1) distNow.x *= mul;
    }
    if (distTotal.y > 5){
      mul = Math.log((distTotal.y - 5) / 2);
      if (mul > 1.3 && $.browser && $.browser.opera) mul = 1.3;
      if (mul > 1) distNow.y *= mul;
    }
	
    $elemToScroll.scrollLeft($elemToScroll.scrollLeft() - distNow.x);
    $elemToScroll.scrollTop($elemToScroll.scrollTop() - distNow.y);

    lastPos = {
      x: event.clientX,
      y: event.clientY
    };

    return false;
  };

  function stopScroll(event) {
    $elemToScroll = undefined;
    startPos = undefined;
    lastPos = undefined;
    $(document.body).css('cursor', '');
    $.event.remove(document, 'mousemove', doScroll);
    $.event.remove(document, 'mouseup', stopScroll);
    return false;
  };

  var api = {
    enable: function(options) {
      enabled = true;
      if (!options && settings)
        return;

      settings = $.extend({}, defaults, options);
      allScrollstoppers = settings.defaultScrollstoppers;
      if (settings.scrollstoppers.length > 0)
        allScrollstoppers += ', '+ options.scrollstoppers;
    },

    disable: function() {
      enabled = false;
    },

    isEnabled: function() {
      return enabled;
    },

    isScrolling: function() {
      return !!startPos;
    }
  };

  return api;
})();

//----------------------------------------
  })(jQuery);
//----------------------------------------