$(window).load(function(){
    var $header = $("header");
    var $headerScreenShot = $("header .screenshot");
    var $infoSection = $("section#info");
    var $infoLeftHeader = $("#info .left h2");
    var $infoLeft = $("#info .left");
    var $ankorTop = $("#ankor_top");
    var $headerBg = $("header .bg");
    var isShown = false;
    var slider;

    var origTop = parseInt($headerScreenShot.css('top'));
    var $ankor, lowerBounder, upperBounder;// size sensitive
    
    // var float = $('<p id="float">').css({'position': 'fixed','width': 20,'height': 20,'left':0,top:0,'z-index':1000000}).appendTo('body');

    var ua = (new UAParser()).getResult();
    // float.text(ua.engine.name + ua.os.name)
    $('#comment_container').bamSlider();

    updateOffset()

    if((
        ua.browser.name === 'WebKit' 
        || ua.browser.name === 'Chrome') 
        && ( ua.os.name === 'iOS' || ua.os.name === 'Android' )
        && util.isLT768()
        ){
        var bg = $headerBg.css('background-image');
        $('body').css({
            'background-image': bg,
            'background-attachment': 'fixed',
            'background-size': 'auto ' + $header.height() + 'px' 
        });
        $headerBg.css({'background': 'none'});
        $headerScreenShot.css({"top": 100});
        $ankor.css('margin-bottom', 0);
        // $headerScreenShot.parent()

    }else{
        $(window).on('resize', updateOffset);
        $(window).on('scroll', function(){
            var scrollTop = window.scrollY;
            if(util.isCompleteShown($ankor) || util.isOverflowUp($ankor) || util.isShown($ankor))
                $headerScreenShot.css({"top": lowerBounder});
                // $headerScreenShot.css({"transform": 'translateY(' + lowerBounder + 'px)'});
            else
                $headerScreenShot.css("top" , upperBounder + scrollTop * (util.isLT768() ? 0.3 : 0.3));
                // $headerScreenShot.css("transform", 'translateY(' + ( upperBounder + scrollTop * (util.isLT768() ? 0.3 : 0.3) ) + 'px)');
            if(util.isShown($headerBg))
                $headerBg.css("background-position-y", scrollTop * 0.1);
            if(util.isShown($infoSection))
                $infoSection.css("background-position-y", (scrollTop - util.getTop($infoSection) ) * 0.1);
        });
    }

    function updateOffset(){

        if(util.isLT768()){
            slider = $('#detail_container').bamSlider();
            $ankor = $infoLeft;
            upperBounder = 0;
            lowerBounder = util.getBottom($ankor.css('margin-bottom', $headerScreenShot.height())) - util.getBottom($ankorTop);
        }else{
            if(slider){
                slider.destroy();
                slider = null;
            }
            $ankor = $infoLeftHeader;
            upperBounder = 100;
            lowerBounder = util.getTop($ankor) - 20;
            $infoLeft.css('margin-bottom','');
            $infoSection.css('min-height', $headerScreenShot.height() + 80);
        }
        window.scrollBy(0, -1);
    }
});
var util = (function(){
        var util = {
            getBottom : function getBottom($element){
                $element = $($element);
                return $element.offset().top + $element.height();
            },
            getTop : function getTop($element){
                return $element.offset().top;
            },
            getScrollTop : function getScrollTop(){
                return $(window).scrollTop();
            },
            getScrollBottom : function getScrollBottom(){
                return $(window).scrollTop() + $(window).height();
            },
            isOverflowUp : function isOverflowUp($element){
                return util.getBottom($element) < util.getScrollTop(); 
            },
            isOverflowDown : function isOverflowDown($element){
                return util.getTop($element) > util.getScrollBottom(); 
            },
            isShown : function isShown($element){
                return !util.isOverflowUp($element) && !util.isOverflowDown($element); 
            },
            isCompleteShown : function isCompleteShown($element){
                return util.getTop($element) > util.getScrollTop() && util.getBottom($element) < util.getScrollBottom(); 
            },
            isLT768 : function isLT768(){
                return $(window).width() <= 768;
            },
            isLT320 : function isLT768(){
                return $(window).width() <= 320;
            }
        };
        return util;
    })();
$(function(){

})