$(window).load(function() {
    var $header = $("header");
    var $headerScreenShot = $("header .screenshot");
    var $infoSection = $("section#info");
    var $infoLeftHeader = $("#info .left h2");
    var $infoLeft = $("#info .left");
    var $ankorTop = $("#ankor_top");
    var $headerBg = $("header .bg");
    var isShown = false;
    var slider;

    var origTop = parseInt($headerScreenShot.css('top'), null);
    var $ankor, lowerMargin, upperMargin, scrollRate; // size sensitive

    $("a[href^=#]").on('click', function(e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
    });
    // var float = $('<p id="float">').css({'position': 'fixed','width': 20,'height': 20,'left':0,top:0,'z-index':1000000}).appendTo('body');

    var ua = (new UAParser()).getResult();
    // float.text(ua.engine.name + ua.os.name)
    $('#comment_container').bamSlider();

    if (navigator.userAgent.toLowerCase().search('micromessenger') > -1) {
        $('.note').text("长按二维码，识别并关注");
    }
    updateOffset();


    $(window).on('resize', updateOffset);
    if (
        (ua.browser.name === 'WebKit' || ua.browser.name === 'Chrome') && (ua.os.name === 'iOS')) {
        $headerScreenShot.css({
            "transform": 'translateY(' + (lowerMargin - upperMargin) + 'px)'
        });
    } else {
        $(window).on('scroll', scrollHandler);

    }

    function scrollHandler(e) {
        var scrollTop = window.scrollY;

        $headerBg.css("transform", 'translate3d(0,' + (scrollTop * 0.5) + 'px,0)');


        var offset = upperMargin + scrollTop * scrollRate >= lowerMargin ? lowerMargin - upperMargin : scrollTop * scrollRate;
        $headerScreenShot.css({
            "transform": 'translate3d(0,' + offset + 'px,0)'
        });


        // if (!(ua.os.name === 'iOS' || ua.os.name === 'Android') && util.isShown($headerBg))
    }

    function updateOffset() {
        upperMargin = parseInt($headerScreenShot.css('top'));

        if (util.isLT768()) {
            slider = $('#detail_container').bamSlider();
            $ankor = $infoLeft;
            scrollRate = 1.2;
            lowerMargin = util.getBottom($ankor.css('margin-bottom', $headerScreenShot.height()));
        } else {
            if (slider) {
                slider.destroy();
                slider = null;
            }
            $ankor = $infoLeftHeader;
            lowerMargin = util.getTop($ankor) - 30;
            scrollRate = 1.5;
            $infoLeft.css('margin-bottom', '');
            $infoSection.css('min-height', $headerScreenShot.height() + 80);
        }
        window.scrollBy(0, -1);
    }
});
var util = (function() {
    var util = {
        getBottom: function getBottom($element) {
            $element = $($element);
            return $element.offset().top + $element.height();
        },
        getTop: function getTop($element) {
            return $element.offset().top;
        },
        getScrollTop: function getScrollTop() {
            return $(window).scrollTop();
        },
        getScrollBottom: function getScrollBottom() {
            return $(window).scrollTop() + $(window).height();
        },
        isTopUp: function isTopUp($element) {
            return util.getTop($element) < util.getScrollTop();
        },
        isBottomDown: function isBottomDown($element) {
            return util.getBottom($element) > util.getScrollBottom();
        },
        isTopDown: function isTopDown($element) {
            return util.getTop($element) > util.getScrollBottom();
        },
        isBottomUp: function isBottomUp($element) {
            return util.getBottom($element) < util.getScrollTop();
        },
        isOverflow: function isOverflow($element) {
            return this.isBottomDown($element) && this.isTopUp($element);
        },
        isShown: function isShown($element) {
            return !(this.isBottomUp($element) || this.isBottomDown($element)) || !(this.isTopUp($element) || this.isTopDown($element) || this.isOverflow($element));
        },
        isCompleteShown: function isCompleteShown($element) {
            return !(this.isBottomUp($element) || this.isBottomDown($element) || this.isTopUp($element) || this.isTopDown($element));
        },
        isLT768: function isLT768() {
            return $(window).width() <= 768;
        },
        isLT320: function isLT768() {
            return $(window).width() <= 320;
        }
    };
    return util;
})();
$(function() {

});