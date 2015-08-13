$(function(){
    var $header = $("header");
    var $headerScreenShot = $("header .screenshot");
    var $infoSection = $("section#info");
    var $infoLeftHeader = $("#info .left h2");
    var $infoLeft = $("#info .left");
    var $ankorTop = $("#ankor_top");

    var $headerBg = $("header .bg");
    var isShown = false;

    var origTop = parseInt($headerScreenShot.css('top'));
    var $ankor, lowerBounder, upperBounder;// size sensitive


    $('#comment_container').slide({loop : false});
    $('#detail_container').slide();

    updateOffset()
    $(window).on('resize', updateOffset);
    $(window).on('scroll', function(){
        var scrollTop = window.scrollY;
        if(util.isCompleteShown($ankor) || util.isOverflowUp($ankor))
            $headerScreenShot.css({"top": lowerBounder});
        else
            $headerScreenShot.css("top" , upperBounder + scrollTop * (util.isLT768() ? 0.3 : 0.3));

        if(util.isShown($headerBg))
            $headerBg.css("background-position-y", scrollTop * 0.1);
        if(util.isShown($infoSection))
            $infoSection.css("background-position-y", (scrollTop - util.getTop($infoSection) ) * 0.1);
    });

    $("a[href^=#]").on('click', function(e){
        if(navigator.userAgent.match(/webkit/i)){
            e.preventDefault();
            var $dest = $($(this).attr("href"));
            $('body').animate({ scrollTop: $dest.position().top });
        }
    })

    function updateOffset(){
        if(util.isLT768()){
            $ankor = $infoLeft;
            upperBounder = 0;
            lowerBounder = util.getBottom($ankor.css('margin-bottom', $headerScreenShot.height())) - util.getBottom($ankorTop);
        }else{
            $ankor = $infoLeftHeader;
            upperBounder = 100;
            lowerBounder = util.getTop($ankor) - 20;
            $infoLeft.css('margin-bottom','');
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
                return util.getTop($element) < util.getScrollTop(); 
            },
            isOverflowDown : function isOverflowDown($element){
                return util.getBottom($element) > util.getScrollBottom(); 
            },
            isShown : function isShown($element){
                return !util.isOverflowUp($element) || !util.isOverflowDown($element); 
            },
            isCompleteShown : function isCompleteShown($element){
                return !util.isOverflowUp($element) && !util.isOverflowDown($element); 
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