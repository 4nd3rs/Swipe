window.Swipe = function(element,options){
	
	
	// return immediately if element doesn't exist
  	if (!element) return null;



	this.options = options || {};
	this.index = this.options.startSlide || 0;
	this.speed = this.options.speed || 200;
	this.transitionEnd = this.options.transitionEnd || function() {};

	//the index of this swipeinstance on the page.
	this.swipeIndex = options.swipeIndex || 0;



	this.parent = element.parentNode;
	this.container = element.firstElementChild;//the wrapper
  	this.element = this.container.children[0]; // the slide pane'
  	this.count = this.container.children.length;
  	this.initialCount = this.count;//need to know if we had 2 elements


  	if(this.count < 2) return null;//need at least 2 elements


  	//that = this;
  	//TODO, find out when to do this
  	setTimeout(function(that){
  		that.setup(that);	
  	}, 800, this);
  	
  	//this.setup();

  // add event listeners
  if (this.container.addEventListener) {
    this.container.addEventListener('touchstart', this, false);
    this.container.addEventListener('touchmove', this, false);
    this.container.addEventListener('touchend', this, false);
    this.container.addEventListener('touchleave', this, false);
    this.container.addEventListener('mousedown', this, false);
    this.container.addEventListener('mousemove', this, false);
    this.container.addEventListener('mouseup', this, false);
    this.container.addEventListener('mouseout', this, false);
    this.container.addEventListener('webkitTransitionEnd', this, false);
    this.container.addEventListener('msTransitionEnd', this, false);
    this.container.addEventListener('oTransitionEnd', this, false);
    this.container.addEventListener('transitionend', this, false);
    window.addEventListener('resize', this, false);
  }

		
};

Swipe.prototype = {
	setup: function(that){

		console.log("--setup--");

		if(that === "undefined") that = this;

		//make sure first element is in the middle
		that.container.insertBefore(that.container.children[that.container.children.length-1],that.container.firstElementChild);
		that.container.insertBefore(that.container.children[that.container.children.length-1],that.container.firstElementChild);

		//make sure we have 5 and only 5 elements, copy from beginning until we have 5
		while(that.count < 5){			
			console.log("INIT: that.count: " + that.count);
			var copyIndex = that.count - that.initialCount;
			console.log("INIT: copyIndex: " + copyIndex);
			that.container.appendChild(that.container.children[copyIndex].cloneNode(true));
			that.count = that.container.children.length;
			console.log("INIT: that.count.end: " + that.count);
		}
		that.element = that.container.children[0]; // the slide pane'

		//get width and heights
		that.parentWidth = Math.ceil(("getBoundingClientRect" in that.parent) ? that.parent.getBoundingClientRect().width : that.parent.offsetWidth);
	    that.width = Math.ceil(("getBoundingClientRect" in that.container) ? that.container.getBoundingClientRect().width : that.container.offsetWidth);
	    that.elementWidth = that.parentWidth;

	    
	    

	    //set widths
	    that.container.style.width = (that.elementWidth * that.count) + "px";//make room for 3 elements, we will never have more
	    that.container.style.left = "-" + (that.elementWidth*2) + "px"; //center on the second element in the list
	    //set explicit width on the elements
    	for(var i = 0; i < that.container.children.length; i++){
    		that.container.children[i].style.width = that.elementWidth + "px";
    	}

		//Set the full width (initial with is set to something smaller
		that.parent.style.width = "100%";


    	//get heights
    	that.parentWidth = Math.ceil(("getBoundingClientRect" in that.parent) ? that.parent.getBoundingClientRect().height : that.parent.offsetHeight);
    	that.height = Math.ceil(("getBoundingClientRect" in that.container) ? that.container.getBoundingClientRect().height : that.container.offsetHeight);
	    
    	//set heights
    	that.container.parentNode.style.height = that.height + "px";
    	that.parent.style.height = that.height + "px";


	    console.log("Width: " + that.width);
	    // return immediately if measurement fails
	    if (!that.width) return null;



		that.slide(that.index, 0);
		that.parent.style.visibility = "visible";


	},
	handleEvent: function(e) {
    switch (e.type) {
      case 'touchstart': this.onTouchStart(e); break;
      case 'touchmove': this.onTouchMove(e); break;
      case 'touchend': this.onTouchEnd(e); break;
      case 'touchleave': this.onTouchEnd(e); break;
      case 'mousedown': this.onTouchStart(e); break;
      case 'mousemove': this.onTouchMove(e); break;
      case 'mouseup': this.onTouchEnd(e); break;
      case 'mouseout': this.onTouchEnd(e); break;
      /*case 'webkitTransitionEnd':
      case 'msTransitionEnd':
      case 'oTransitionEnd':
      case 'transitionend': this.transitionEnd(e); break;*/
      //case 'resize': this.setup(); break;
    }
  },
	slide: function(index, duration){


		//wait until anim is ready before we do something new
		if(this.animating){
			return;
		}
		
		duration = duration || this.speed;

		this.firstElement = this.container.children[0];
		this.last = this.container.children[this.container.children.length-1];
		this.elementWidth = this.firstElement.getBoundingClientRect().width;


		/*this.container.style.webkitTransitionDuration =
			this.container.style.MozTransitionDuration =
				this.container.style.msTransitionDuration =
					this.container.style.OTransitionDuration =
						this.container.style.transitionDuration = duration + "ms";
*/

		if(this.index == index){

			this.container.style.webkitTransform =
				this.container.style.MozTransform =
					this.container.style.msTransform =
						this.container.style.OTransform =
							this.container.style.transform = "translate3d(0px,0px,0px)";

			this.container.style.webkitTransitionDuration =
				this.container.style.MozTransitionDuration =
					this.container.style.msTransitionDuration =
						this.container.style.OTransitionDuration =
							this.container.style.transitionDuration = duration + "ms";
			return;
		}

		if(this.index > index){
			this.moveNext = false;	
			this.amount = this.elementWidth;
		}else{
			this.moveNext = true;	
			this.amount = -this.elementWidth;
		}

		this.container.style.webkitTransitionDuration =
			this.container.style.MozTransitionDuration =
				this.container.style.msTransitionDuration =
					this.container.style.OTransitionDuration =
						this.container.style.transitionDuration = duration + "ms";


		this.container.style.webkitTransform =
			this.container.style.MozTransform =
				this.container.style.msTransform =
					this.container.style.OTransform =
						this.container.style.transform = "translate3d(" + this.amount + "px,0px,0px)";

		/*this.container.style.webkitTransform = "translate3d(" + this.amount + "px,0px,0px)";*/

		this.animating = true;

		this.onTransitionEnd(index);

		//that = this;
		//flip around the elements
		this.moveTimeoutID = setTimeout(function(that){
			
			//no animation while we shuffle elements
			that.container.style.webkitTransitionDuration =
				that.container.style.MozTransitionDuration =
					that.container.style.msTransitionDuration =
						that.container.style.OTransitionDuration =
							that.container.style.transitionDuration = "0ms";

			if(that.moveNext == true){
				//copy first to last position
				if(that.initialCount < 5){
					var copyThisIndex = 5 - that.initialCount;
					that.firstElement.innerHTML = that.container.children[copyThisIndex].innerHTML;
					/*that.container.appendChild(that.container.children[0].cloneNode(true));
					that.container.removeChild(that.firstElement);*/
					that.container.appendChild(that.firstElement);

				}else{
					that.container.appendChild(that.firstElement);
				}
			}else{
				//copy last to first position
				if(that.initialCount < 5){
					var copyThisIndex = that.initialCount - 1;
					that.last.innerHTML = that.container.children[copyThisIndex].innerHTML;
					that.container.insertBefore(that.last,that.firstElement);
					/*that.container.removeChild(that.last);
					that.container.insertBefore(that.container.children[copyThisIndex].cloneNode(true),that.container.children[0]);*/
				}else{
					that.container.insertBefore(that.last,that.firstElement);
				}
			}
			that.container.style.webkitTransform =
				that.container.style.MozTransform =
					that.container.style.msTransform =
						that.container.style.OTransform =
							that.container.style.transform = "translate3d(0px,0px,0px)";

			//send callback


			//reset the animation duration back to normal
			setTimeout(function(that){
				that.container.style.webkitTransitionDuration =
					that.container.style.MozTransitionDuration =
						that.container.style.msTransitionDuration =
							that.container.style.OTransitionDuration =
								that.container.style.transitionDuration = duration + "ms";
			},1,that);
			that.animating = false;
			
		},duration, this);

		
		this.index = index;
		
	},
	next: function(){
		this.slide(this.index + 1);
	},
	prev: function(){
		this.slide(this.index - 1);
	},
	onTransitionEnd: function(index) {


		if(index < 0){
			this.transitionEnd((this.initialCount - (Math.abs(index) % this.initialCount)) % this.initialCount);
		}else{
			this.transitionEnd(index % this.initialCount);
		}

  	},
	onTouchStart: function(e) {
    

		//do not scroll again too soon...
	    if(this.animating){	    		    			   
	    	
	    	//the animating bool is sometimes not reset so we check time as well
	    	if(Number( new Date() - this.lastTouchEnd)  < this.speed){
		    	this.start = undefined;

		    	return;
	    	}else{
				this.animating = false;
	    	}
	    }

	      // get touch coordinates for delta calculations in onTouchMove
	      	if(e instanceof MouseEvent){

	  			this.start = {
			    	pageX: e.pageX,
  					pageY: e.pageY,
			    	time: Number( new Date() )
			    };
	  		}else{
	      		this.start = {
			    	pageX: e.touches[0].pageX,
			    	pageY: e.touches[0].pageY,
			    	time: Number( new Date() )
			    };

	  		}
	      // set initial timestamp of touch sequence
	      

	    // used for testing first onTouchMove event
	    this.isScrolling = undefined;
	    
	    // reset deltaX
	    this.deltaX = 0;

	    // set transition time to 0 for 1-to-1 touch movement
		this.container.style.webkitTransitionDuration =
			this.container.style.MozTransitionDuration =
				this.container.style.msTransitionDuration =
					this.container.style.OTransitionDuration =
						this.container.style.transitionDuration = "0ms";

	    
	    e.stopPropagation();
	},

	onTouchMove: function(e) {

		if(!this.start){
			return;
		}

		if(e instanceof TouchEvent){
	    	// ensure swiping with one touch and not pinching
	    	if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
		}


		if(e instanceof TouchEvent){
	    	this.deltaX = e.touches[0].pageX - this.start.pageX;
	    	this.deltaY = e.touches[0].pageY - this.start.pageY;
		}else{
			this.deltaX = e.pageX - this.start.pageX;
			this.deltaY = e.pageY - this.start.pageY;
		}

		var pageY = (e instanceof TouchEvent) ? e.touches[0].pageY : e.pageY;

	    // determine if scrolling test has run - one time test
	    if ( typeof this.isScrolling == 'undefined') {
	      this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(this.deltaY) );
	    }

	    // if user is not trying to scroll vertically
	    if (!this.isScrolling) {

	      // prevent native scrolling 
	      e.preventDefault();

	      //clear ongoint timeout
	      //clearTimeout(this.moveTimeoutID);

	      // translate immediately 1-to-1
	      var iLikeToMovitMovit = this.deltaX;

			this.container.style.webkitTransform =
				this.container.style.MozTransform =
					this.container.style.msTransform =
						this.container.style.OTransform =
							this.container.style.transform = "translate3d(" + iLikeToMovitMovit + "px,0px,0px)";


	      
	      e.stopPropagation();
	    }

	},

	onTouchEnd: function(e) {

		if(!this.start){
			return;
		}

	    // determine if slide attempt triggers next/prev slide
	    var isValidSlide = 
	          (Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
	          && Math.abs(this.deltaX) > 20)                   // and if slide amt is greater than 20px
	          || (Math.abs(this.deltaX) > this.width/2);        // or if slide amt is greater on third the width


	    // if not scrolling vertically
	    if (!this.isScrolling) {

	    	//speed things up!
	    	/*var speed = Number(this.speed * (Math.abs(this.width-this.deltaX)/this.width) ); */

	      	// call slide function with slide end value based on isValidSlide test
	      	this.slide( this.index + ( isValidSlide ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed );

	    }
	    
		this.start = undefined;
		this.lastTouchEnd = Number( new Date() );

	    e.stopPropagation();
	}


};