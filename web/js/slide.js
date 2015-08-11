$.fn.slide = function(options){

	var defaultOptions = {
		auto : true,
		indicator : true,
		arrow : true,
		thumbnail : false,
		touch : false,
		interval : 1000,
		onMoved : function(n){},
		onStartMove : function(n){},
	}
	options = options || defaultOptions;
	var DURITION = 300;
	var $UL = this;
	var $LI_ARR = this.find('li');
	var INDICATOR_ARR = [];
	var $INDICATOR_ARR;
	var LENGTH = $LI_ARR.length;
	var $parent = this.parent();
	var width = $UL.width();
	var $viewpoint = $('<div class="bam_slide_viewpoint">');
	var $slideContainer = $('<div class="bam_slide_container">');
	var $indicatorContianer = $('<div class="bam_indecator_container">');
	var indicatorTemplate = '<li class="indicator">';
	var current = 0;
	var bufferSize = 2;

	var init = function init(){
		var $inner = $('<ul>').appendTo($indicatorContianer);
		$LI_ARR.width(width);
		$parent.append(
			$viewpoint.append(
				$slideContainer.wrapInner($UL).width(width * LENGTH)
			).append(
				$indicatorContianer
			)
		);
		setViewPointHeightToFit(current);
		makeBuffer();

		$.each($LI_ARR, function(i, elem){
			INDICATOR_ARR.push(
				$(indicatorTemplate).appendTo($inner).on('click', function(){
					moveTo(i);
				})
			);
		});

		$INDICATOR_ARR = $inner.find('li');
		$(INDICATOR_ARR[current]).addClass('current');


		$.fn.toNext = function moveForward(){
			moveTo((current + 1 + LENGTH)%LENGTH, true);
		}
		$.fn.toPrev = function moveBackward(){
			moveTo((current - 1 + LENGTH)%LENGTH, true);
		}
		$.fn.jumpTo = function jumpTo(n){
			moveTo(n);
		}
		// setInterval(this.toNext, 1000);
	}

	var getDirction = function getDirction(curr, dest){
		var diff = dest - curr;
		if(diff < 0){
			return 'B';
		}
		if(diff > 0){
			return 'F';
		}
		return 'N';
	}

 
	var makeElementSequence = function makeElementSequence(start, end){
		var direction = getDirction(start, end);
		switch(direction){
			case 'F':
				var $base = $($LI_ARR[start]);
				for (var i = start + 1; i <= end; i++) {
					var curr = $LI_ARR[(i+LENGTH)%LENGTH];
					if($base.next()[0] !== curr){
						$base.after(curr);
						setContainerLeft();
					}
					$base = $(curr);
				};
				break;
			case 'B':
				var $base = $($LI_ARR[start]);
				for (var i = start - 1; i >= end; i--) {
					var curr = $LI_ARR[(i+LENGTH)%LENGTH];
					if($base.prev()[0] !== curr){
						$base.before(curr);
						setContainerLeft();
					}
					$base = $(curr);
				};
				break;
			default:
				return;
		}
	}

	var makeBuffer = function makeBuffer(){
		if( bufferSize * 2 + 1 < LENGTH ){
			bufferSize = LENGTH / 2;
		}
		makeElementSequence(current, current+bufferSize);
		makeElementSequence(current, current-bufferSize);
	};

	var moveTo = function moveTo(dest, isAuto){
		if(!$LI_ARR[dest])
			return;
		if(!isAuto) makeElementSequence(current, dest);
		$LI_ARR.removeClass('current')
		$INDICATOR_ARR.removeClass('current');
		setViewPointHeightToFit(dest, true);
		$slideContainer.animate({'left' : -$($LI_ARR[dest]).position().left}, DURITION, function(){
			current = dest;
			$($LI_ARR[current]).addClass('current');
			$(INDICATOR_ARR[current]).addClass('current');
			makeBuffer();
		});
		// function getLeftOffset(){
		// 	return -$($LI_ARR[dest]).position().left;
		// }
	}

	var setContainerLeft = function setContainerLeft(){
		$slideContainer.css('left', -getCurrentLiLeft());
	}

	var setViewPointHeightToFit = function setViewPointHeightToFit(n, isAnimate){
		$viewpoint.animate({height : $($LI_ARR[n]).height()+50}, isAnimate ? DURITION : 0);

	}

	var getCurrentLiLeft = function getCurrentLiLeft(){
		return $($LI_ARR[current]).position().left;
	}


	init();
	
	window.test = this;
	
}