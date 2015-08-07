$(function(){
    var $header = $("header");
    var $headerScreenShot = $("header .screenshot");
    var $infoScreenShot = $("#info .screenshot");

    var $headerBg = $("header .bg");
    var $info = $("section#info");
    var isShown = false;
    $(window).on('scroll', function(){
        var scrollTop = window.scrollY;
        $headerScreenShot.css("bottom" , -scrollTop * 0.3);
        $headerBg.css("background-position-y", scrollTop * 0.1);
        if($info.position().top - $(window).height()< scrollTop){
            $info.css("background-position-y", (scrollTop - $info.position().top ) * 0.1);
        }else{
        }
        if($header.position().top + $header.height() < scrollTop && !isShown){
             $infoScreenShot.animate({"bottom": -300}, 'slow');
             isShown = true;
        }else{
            $infoScreenShot.animate({"bottom": ''}, 'slow');
            isShown = false;
        }
    });

    $("a[href^=#]").on('click', function(e){
        if(navigator.userAgent.match(/webkit/i)){
            e.preventDefault();
            var $dest = $($(this).attr("href"));
            $('body').animate({ scrollTop: $dest.position().top });
        }
    })
});


$(function(){

})