$.fn.slide = function(options){

	var defaultOptions = {
		auto : false,
		indicator : true,
		arrow : true,
		thumbnail : false,
		touch : true,
		interval : 4000,
		durition : 500,
		context : true,
		loop : true,
		contextRate : 0.25,
		// onMoved : function(n){},
		// onStartMove : function(n){},
	}
	if(options){
		for(var key in defaultOptions){
			if(typeof options[key] !== typeof defaultOptions[key])
				options[key] = defaultOptions[key];
		}
	}else{
		options = defaultOptions;
	}
	var DURITION = options.durition;
	var $UL = this;
	var $LI_ARR = this.find('li');
	var indecatorArr = [];
	var $indecatorArr;
	var LENGTH = $LI_ARR.length;
	var WIDTH_RATE = 1 - options.contextRate;

	var $parent = this.parent();
	var width = $UL.width();
	var $viewpoint = $('<div class="bam_slide_viewpoint">');
	var $slideContainer = $('<div class="bam_slide_container">');
	var $indicatorContianer = $('<div class="bam_indecator_container">');
	var $arrowNext = $('<a class="bam_arrow_next">');
	var $arrowPrev = $('<a class="bam_arrow_prev">');
	var indicatorTemplate = '<li class="indicator">';
	var current = 0;
	var bufferSize = 2;
	var isMoving = false;
	var isTouching = false;
	var intervalObj;

	var init = function init(){

		/* dom */
		if(LENGTH <= 1)
			return;
		if(LENGTH < 4 && options.context)
			options.loop = false;
		$LI_ARR.width(width).css({'margin' : 0});
		$parent.append(
			$viewpoint.append(
				$slideContainer.wrapInner($UL).width(width * LENGTH)
			).append(
				$indicatorContianer
			)
		);
		onResize();
		
		setViewPointHeightToFit(current);
		if(options.loop)setBuffer();
		if(options.arrow){
			$arrowPrev.appendTo($viewpoint).on('click', moveBackward);
			$arrowNext.appendTo($viewpoint).on('click', moveForward);
		}

		/* onresize */
		$(window).on('resize', onResize);

		
		/* exports API */
		$.fn.toNext = moveForward;
		$.fn.toPrev = moveBackward;
		$.fn.jumpTo = moveTo;
		$.fn.startSlide = start;
		$.fn.stopSlide = start;

		/* set indicator */
		if(options.indicator)
			setIndicator()
		/* auto */
		if(options.auto)
			start();
		/* touch */
		if(options.touch)
			bindTouchEvent();

		moveTo(current);
	}
	var moveForward = function moveForward(){
		moveTo((current + 1 + LENGTH)%LENGTH, 'F');
	}

	var moveBackward = function moveBackward(){
		moveTo((current - 1 + LENGTH)%LENGTH, 'B');
	}

	var stop = function stop(){
		clearInterval(intervalObj);
	}

	var start = function start(){
		intervalObj = setInterval(moveForward, options.interval);
	}

	var setIndicator = function setIndicator(){
		var $inner = $('<ul>').appendTo($indicatorContianer);
		$.each($LI_ARR, function(i, elem){
			indecatorArr.push(
				$(indicatorTemplate).appendTo($inner).on('click', function(){
					moveTo(i);
				})
			);
		});
		$indecatorArr = $inner.find('li');
		$(indecatorArr[current]).addClass('current');
	}

 	//end may be greater then LENGTH
	var setElementSequence = function setElementSequence(start, end){
		if(end - start > 0){
			var $base = $($LI_ARR[start]);
			for (var i = start + 1; i <= end; i++) {
				var curr = $LI_ARR[(i+LENGTH)%LENGTH];
				if($base.next()[0] !== curr){
					$base.after(curr);
					setContainerLeft();
				}
				$base = $(curr);
			}
		}else if(start -end > 0){
			var $base = $($LI_ARR[start]);
			for (var i = start - 1; i >= end; i--) {
				var curr = $LI_ARR[(i+LENGTH)%LENGTH];
				if($base.prev()[0] !== curr){
					$base.before(curr);
					setContainerLeft();
				}
				$base = $(curr);
			}
		}else{
			return;
		}
	}
	
	var onResize = function onResize(){
		width = $viewpoint.width();
		var margin = 10;
		if(options.context){
			width = width * WIDTH_RATE;
		}
		$LI_ARR.stop('on', 'off').css({
			width: width - margin,
			'margin-left': margin,
			'margin-rihght': margin,
		});
		$slideContainer.stop('on', 'off').css({width : width * LENGTH});
		setContainerLeft()
	}

	var setBuffer = function setBuffer(){
		if( bufferSize * 2 + 1 > LENGTH ){
			bufferSize = LENGTH / 2;
		}
		setElementSequence(current, current-bufferSize);
		setElementSequence(current, current+bufferSize);
	};

	var moveTo = function moveTo(dest, direction){
		if(!$LI_ARR[dest] || isMoving || isTouching)
			return;
		if(LENGTH == 2){
			if(direction == 'F')
				setElementSequence(current, current+1);
			else
				setElementSequence(current, current-1)
		}else{
			if(!direction) setElementSequence(current, dest);
		}
		$LI_ARR.removeClass('current')
		$indecatorArr.removeClass('current');
		isMoving = true;
		setViewPointHeightToFit(dest, true);
		current = dest;
		$($LI_ARR[current]).addClass('current');
		setContainerLeft(undefined, true, undefined, function(){
			isMoving = false;
			$(indecatorArr[current]).addClass('current');
			if(LENGTH > 2 && options.loop)
				setBuffer();
		});
		// function getLeftOffset(){
		// 	return -$($LI_ARR[dest]).position().left;
		// }
	}

	var setContainerLeft = function setContainerLeft(v, isAnimate, durition, cb){
			$slideContainer.animate({left : (v !== undefined ? v : -getCurrentLiLeft()) },isAnimate ? (durition ? durition : DURITION) : 0, cb);	
	}

	var setViewPointHeightToFit = function setViewPointHeightToFit(n, isAnimate, durition){

		$viewpoint.animate({height : $($LI_ARR[n]).height()+50}, isAnimate ? (durition ? durition : DURITION) : 0);

	}

	var getCurrentLiLeft = function getCurrentLiLeft(){
		return $($LI_ARR[current]).position().left - width * 1 / WIDTH_RATE * ( 1 - WIDTH_RATE ) / 2;
	}

	var bindTouchEvent = function bindTouchEvent(){
		if( !('ontouchstart' in window) ){
			console.warn('touch event is not supported by browser');
			return;
		}
		var startPos;
		var startLeft;
		var diff;
		var THRESHOLD = 0.2;
		var BUFFER = width * 0.5;
		$slideContainer.on('touchstart',function(e){
			if( LENGTH == 2 ){
				setElementSequence(0 , 1);
			}
			isTouching = true;
			startPos = e.originalEvent.touches[0].pageX;
			startLeft = getCurrentLiLeft();
		});
		$slideContainer.on('touchmove',function(e){
			if(isMoving)
				return;
			diff = e.originalEvent.touches[0].pageX - startPos;
			if( ( LENGTH == 2 || !options.loop ) && ( current === 0 && diff > 0 || current === LENGTH - 1 && diff < 0 ))
				if(( current === 0 && diff > BUFFER || current === LENGTH - 1 && diff < -BUFFER) )
					return diff = 0;
				else{
					setContainerLeft(-startLeft+diff);
					diff = 0;
				}
			else
				setContainerLeft(-startLeft+diff);
		});
		$slideContainer.on('touchend', function(e){
			isTouching = false;
			if( diff < -THRESHOLD*width ){
				moveForward()
			}else if( diff > THRESHOLD*width ){
				moveBackward()
			}else
				setContainerLeft(undefined, true);
			diff = 0;
		});
	}

	init();
	
	window.test = this;
	
}