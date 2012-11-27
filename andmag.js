window.Swipe = function(element,options){


	// return immediately if element doesn't exist
	if (!element) { return null; }

	this.isActive = true;

	this.options = options || {};
	this.index = this.options.startSlide || 0;



	this.initialWidth = element.getAttribute("data-swipe-initial-width") || this.options.initialWidth || "90%";

	this.adjustHeightOnElement = element.getAttribute("data-swipe-adjust-height-on-element") || this.options.adjustHeightOnElement || undefined;
	this.speed = this.options.speed || 200;
	this.transitionEnd = this.options.transitionEnd || function () {};
	this.click = this.options.click || function () {};


	//the index of this swipeinstance on the page.
	this.swipeIndex = this.options.swipeIndex || 0;


	//keep track of how many times we have run the setup function
	this.setupCount = 0;

	this.parent = element.parentNode;
	this.container = element.firstElementChild;//the wrapper
	this.element = this.container.children[0]; // the slide pane'
	this.count = this.container.children.length;
	this.initialCount = this.count;//need to know if we had 2 elements


	if (this.count < 2) { return null; }//need at least 2 elements


	//that = this;
	//TODO, find out when to do this
	setTimeout(function (that) {
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
		window.addEventListener('mouseup', this, false);
		this.parent.addEventListener('mouseout', this, false);
		this.container.addEventListener('webkitTransitionEnd', this, false);
		this.container.addEventListener('msTransitionEnd', this, false);
		this.container.addEventListener('oTransitionEnd', this, false);
		this.container.addEventListener('transitionend', this, false);
		this.container.addEventListener('click', this, false);
		window.addEventListener('resize', this, false);
	}


};

Swipe.prototype = {
	setup: function (that, startIndex) {
		var i;

		if (that === undefined) { that = this; }

		//return if not active
		if (!that.isActive) { return; }

		console.group("SETUP");

		that.parent.style.width = that.initialWidth;

		//reset styles before calculating stuff
		that.container.parentNode.style.height = "inherit";
		that.parent.style.height = "inherit";


		//make sure first element is in the middle, but only the first time
		if (that.setupCount === 0) {
			console.log("Making sure the first element is in the middle");
			that.container.insertBefore(that.container.children[that.container.children.length-1], that.container.firstElementChild);
			that.container.insertBefore(that.container.children[that.container.children.length-1], that.container.firstElementChild);

			startIndex = startIndex || that.index;

			//shuffle around elements until the correct one is in the middle
			if (startIndex > 0) {
				for (i = 0; i < startIndex; i++) {
					that.container.appendChild(that.container.children[0]);
				}
			}

			try{
			//go through links, remove clicks and make the link handeling be taken care of by the swipe/click eventlisteners
			for (i = 0; i< that.container.children.length; i++) {
				var linkElem = that.container.children[i].querySelectorAll("a");
				if (linkElem && linkElem.length === 1) {
					/*that.container.children[i].setAttribute("data-mediabox-item-href",linkElem[0].getAttribute("href"));
					linkElem[0].setAttribute("href","javascript:void(0);//");*/
				}
			}
			}catch(e){
				console.log(e);
			}

		} else {
			if (startIndex !== that.getPos()) {
				if (startIndex > that.getPos()) {
					for (i = that.getPos() + 1; i <= startIndex; i++) {
						that.slide(i, 0);
					}
				} else {
					for (i = that.getPos() - 1; i >= startIndex; i--) {
						that.slide(i, 0);
					}
				}
			}
		}



		console.log("Making sure we have 5 elements --> ");
		//make sure we have 5 and only 5 elements, copy from beginning until we have 5
		while (that.count < 5) {
			console.log("that.count: " + that.count);
			var copyIndex = that.count - that.initialCount;
			console.log("copyIndex: " + copyIndex);
			that.container.appendChild(that.container.children[copyIndex].cloneNode(true));
			that.count = that.container.children.length;
			console.log("that.count.end: " + that.count);
		}
		that.element = that.container.children[0]; // the slide pane'

		console.log("<-- Making sure we have 5 elements  ");

		console.log("Getting widths");
		//get width and heights
		that.parentWidth = Math.ceil(("getBoundingClientRect" in that.parent) ? that.parent.getBoundingClientRect().width : that.parent.offsetWidth);
		that.width = Math.ceil(("getBoundingClientRect" in that.container) ? that.container.getBoundingClientRect().width : that.container.offsetWidth);
		that.elementWidth = that.parentWidth;

		console.log("Parent width: " + that.parentWidth);
		console.log("Width: " + that.parentWidth);



		//set widths
		console.log("Setting widths");
		that.container.style.width = (that.elementWidth * that.count) + "px";//make room for 3 elements, we will never have more
		that.container.style.left = "-" + (that.elementWidth*2) + "px"; //center on the second element in the list
		//set explicit width on the elements
		for (i = 0; i < that.container.children.length; i++) {
			that.container.children[i].style.width = that.elementWidth + "px";
		}

		//Set the full width (initial with is set to something smaller
		console.log("Setting parent width to 100%");
		that.parent.style.width = "100%";

		if (that.adjustHeightOnElement) {
			var adjustUs = that.container.querySelectorAll(that.adjustHeightOnElement);
			if (adjustUs && adjustUs.length > 1) {
				var maxHeight = 0;
				for (i = 0; i < adjustUs.length; i++) {
					if(adjustUs[i]){
						//first reset height
						adjustUs[i].style.height = "inherit";
						//then get actual height
						var elemHeight = adjustUs[i].clientHeight - (adjustUs[i].offsetTop * 2);

						maxHeight = elemHeight > maxHeight ? elemHeight : maxHeight;
					} else {
						//something is wrong, get out of here
						maxHeight = 0;
						break;
					}
				}
				if (maxHeight > 0) {
					for (i = 0; i < adjustUs.length; i++) {
						adjustUs[i].style.height = maxHeight + "px";
					}
				}
			}
		}




		//get heights
		console.log("Get heights");
		that.parentWidth = Math.ceil(("getBoundingClientRect" in that.parent) ? that.parent.getBoundingClientRect().height : that.parent.offsetHeight);
		that.height = Math.ceil(("getBoundingClientRect" in that.container) ? that.container.getBoundingClientRect().height : that.container.offsetHeight);

		//set heights
		console.log("Set heights");
		that.container.parentNode.style.height = that.height + "px";
		that.parent.style.height = that.height + "px";


		// return immediately if measurement fails
		if (!that.width) { return null; }


		console.log("Sliding to slide 1 and setting visibility to visible");
		console.groupEnd();

		//move to specified index (initial index if nothing is set)
		//that.slide(startIndex != undefined ? startIndex : that.index, 0);
		that.parent.style.visibility = "visible";


		that.setupCount++;

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
			case 'click': this.preventClick(e); break;
			/*case 'webkitTransitionEnd':
			 case 'msTransitionEnd':
			 case 'oTransitionEnd':
			 case 'transitionend': this.transitionEnd(e); break;*/
			case 'resize': console.log("resize!");this.setup(); break;
		}
	},
	slide: function (index, duration) {

		console.group("SLIDE");
		//wait until anim is ready before we do something new
		if (this.animating) {
			console.log("is already animating, returning");
			console.groupEnd();
			return;
		}


		//set duration
		duration === undefined ? this.duration = this.speed : this.duration = duration;

		console.log("Getting some elements");
		this.firstElement = this.container.children[0];
		this.last = this.container.children[this.container.children.length-1];
		this.elementWidth = this.firstElement.getBoundingClientRect().width;

		if (this.getPos() === this.getPos(index)) {

			console.log("index has not changed - setting som styles and returning");
			this.setTransitionDuration(this.container,this.duration + "ms");
			this.setTranslateX(this.container,"0");
			console.groupEnd();
			return;
		}

		var currentPos = this.getPos(), newPos = this.getPos(index);

		if(this.initialCount == 2){
			index < this.index ? (this.moveNext = true, this.amount = this.elementWidth) : (this.moveNext = false, this.amount = -this.elementWidth);
		} else if (newPos === 0 && currentPos == (this.initialCount-1) ) {
			//from last to first
			this.moveNext = true;
			this.amount = -this.elementWidth;
		} else if(currentPos === 0 && newPos == (this.initialCount-1)) {
			//from first to last
			this.moveNext = false;
			this.amount = this.elementWidth;
		} else if(currentPos > newPos) {
			this.moveNext = false;
			this.amount = this.elementWidth;
		} else {
			this.moveNext = true;
			this.amount = -this.elementWidth;
		}

		this.setTransitionDuration(this.container,this.duration + "ms");
		this.setTranslateX(this.container,this.amount);

		this.animating = true;

		this.onTransitionEnd(index);

		//that = this;
		//flip around the elements
		if (this.duration > 0) {
			this.moveTimeoutID = setTimeout(function(that) {
				that.shuffleElements();
			},this.duration, this);
		} else {
			this.shuffleElements();
		}


		console.groupEnd();
		this.index = index;

	},

	shuffleElements: function(){
		console.log("Inside shuffleElements ");
		//no animation while we shuffle elements

		var ua = navigator.userAgent.toLowerCase();

		//TODO: FIND A WAY AROUND THIS
		//If android 4 and not chrome, firefox or opera
		if (ua.indexOf("android 4") != -1
			&& ua.indexOf("chrome") == -1
			&& ua.indexOf("opera") == -1
			&& ua.indexOf("firefox")){
			this.setTransitionDuration(this.container,"1ms");//wait a bit to fix a android issue (That breaks in Android Chrome)
		} else {
			this.setTransitionDuration(this.container,"0ms");//wait a bit to fix a android issue (That breaks in Android Chrome)
		}

		this.setTranslateX(this.container,0);


		if (this.moveNext == true) {
			//copy first to last position
			if(this.initialCount < 5){
				var copyThisIndex = 5 - this.initialCount;
				console.log("Less than 5, moving elem " + copyThisIndex + " to first element and copying that to the last node");
				this.firstElement.innerHTML = this.container.children[copyThisIndex].innerHTML;
				this.container.appendChild(this.firstElement);
			} else {
				console.log("5 or more: Moving first to last");
				this.container.appendChild(this.firstElement);
			}
		} else {
			//copy last to first position
			if (this.initialCount < 5) {
				var copyThisIndex = this.initialCount - 1;
				console.log("Less than 5, moving elem " + copyThisIndex + " to last element and copying that to the first node");
				this.last.innerHTML = this.container.children[copyThisIndex].innerHTML;
				this.container.insertBefore(this.last,this.firstElement);
			} else {
				console.log("5 or more: Moving last to first");
				this.container.insertBefore(this.last,this.firstElement);
			}
		}



		//reset the animation duration back to normal
		setTimeout(function(that){

			that.setTransitionDuration(that.container,this.duration + "ms");
			that.setTranslateX(that.container,0);

		},1,this);
		this.animating = false;
		console.log("Ending shuffleElements ");
	},

	setTranslateX: function(that, x) {
		that.style.webkitTransform =
			that.style.MozTransform =
				that.style.msTransform =
					that.style.transform = "translate3d(" + x + "px,0px,0px)";

		that.style.OTransform = "translate(" + x + "px)";
	},
	setTransform: function(that, value) {
		that.style.webkitTransform =
			that.style.MozTransform =
				that.style.msTransform =
					that.style.OTransform =
						that.style.transform = value;

	},
	setTransitionDuration: function(that,duration) {
		if(that && duration){
			that.style.webkitTransitionDuration =
				that.style.MozTransitionDuration =
					that.style.msTransitionDuration =
						that.style.OTransitionDuration =
							that.style.transitionDuration = duration;
		}
	},
	next: function() {
		this.moveNext = true;
		this.slide(this.index + 1);
	},
	prev: function() {
		this.moveNext = false;
		this.slide(this.index - 1);
	},

	//index can be a large number or a negative number so we need to normalize it
	getPos: function(index) {
		if (index == undefined) {
			index = this.index;
		}

		if (index < 0) {
			return (this.initialCount - (Math.abs(index) % this.initialCount)) % this.initialCount;
		}else{
			return index % this.initialCount;
		}


		return this.index;
	},
	onTransitionEnd: function(index) {
		this.transitionEnd(this.getPos(index));
	},


	onTouchStart: function(e) {


		//do not scroll again too soon...
		if (this.animating) {

			//the animating bool is sometimes not reset so we check time as well
			if (Number( new Date() - this.lastTouchEnd)  < this.speed) {
				this.start = undefined;

				return;
			}else{
				this.animating = false;
			}
		}

		// get touch coordinates for delta calculations in onTouchMove
		if (e instanceof MouseEvent) {

			this.start = {
				pageX: e.pageX,
				pageY: e.pageY,
				time: Number( new Date() )
			};
		} else {
			this.start = {
				pageX: e.touches[0].pageX,
				pageY: e.touches[0].pageY,
				time: Number( new Date() )
			};

		}

		// used for testing first onTouchMove event
		this.isScrolling = undefined;

		// reset deltaX
		this.deltaX = 0;
		this.deltaY = 0;

		this.setTransitionDuration(this.container,"0ms");

		// set transition time to 0 for 1-to-1 touch movement
		this.container.style.webkitTransitionDuration =
			this.container.style.MozTransitionDuration =
				this.container.style.msTransitionDuration =
					this.container.style.OTransitionDuration =
						this.container.style.transitionDuration = "0ms";


		e.stopPropagation();
	},

	onTouchMove: function(e) {

		if (!this.start) {
			return;
		}

		if (e instanceof TouchEvent) {
			// ensure swiping with one touch and not pinching
			if (e.touches.length > 1 || e.scale && e.scale !== 1){ return; }
		}


		if (e instanceof TouchEvent) {
			this.deltaX = e.touches[0].pageX - this.start.pageX;
			this.deltaY = e.touches[0].pageY - this.start.pageY;
		} else {
			this.deltaX = e.pageX - this.start.pageX;
			this.deltaY = e.pageY - this.start.pageY;
		}

		var pageY = (e instanceof TouchEvent) ? e.touches[0].pageY : e.pageY;

		// determine if scrolling test has run - one time test - only for touch
		if(e instanceof MouseEvent){
			this.isScrolling = false;
		} else if ( typeof this.isScrolling == 'undefined') {
			this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(this.deltaY) );
		}

		// if user is not trying to scroll vertically
		if (!this.isScrolling) {

			// prevent native scrolling
			e.preventDefault();

			this.setTranslateX(this.container,this.deltaX);

			e.stopPropagation();
		}

	},

	onTouchEnd: function(e) {




		if (!this.start) {
			return;
		}

		if (e instanceof MouseEvent && e.type === "mouseout") {
			var i = 0, parent = e.toElement, containerID = this.parent.children[0].id;
			do{
				if(parent instanceof HTMLDocument){
					console.log("Got mouseout, reached HTMLDocument, we have a valid event");
					break;
				}

				var elemID = parent.getAttribute("id");
				if (elemID === containerID) {
					//Still inside container, continue swiping
					console.log("Got mouseout, but still inside container");
					return;
				} else {
					if(parent.parentNode){
						parent = parent.parentNode;
					}else{
						//cant go further...
						console.log("Got mouseout, but cant find parent, assuming we're outside now");
					}
				}
			}while(i++ < 7);
		}


		var isClick = Number(new Date()) - this.start.time < 500 //click length is shorter than 250ms
					&& Math.abs(this.deltaX) < 20 //x and y is less than 20px
				   	&& Math.abs(this.deltaY) < 20;


		// determine if slide attempt triggers next/prev slide
		var isValidSlide =
			(Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
				&& Math.abs(this.deltaX) > 20)                   // and if slide amt is greater than 20px
				|| (Math.abs(this.deltaX) > this.elementWidth/2);        // or if slide amt is greater on third the width

		// if not scrolling vertically
		if (!this.isScrolling) {
			  if (isClick) {
				  //we have a click
				  this.onClick(e);
			  } else {

			  	  this.deltaX < 0 ? this.moveNext = true : this.moveNext = false;
				  // call slide function with slide end value based on isValidSlide test
				  this.slide( this.index + ( isValidSlide ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed );
				  //should not trigger other clicks
				  e.preventDefault();
				  e.stopPropagation();
		  	}

		}

		this.start = undefined;
		this.lastTouchEnd = Number( new Date() );

		e.stopPropagation();
		return false;
	},
	preventClick: function(e){
		if(this.isClicked === true){

		}else{
			e.preventDefault();
		}
		//reset the click
		this.isClicked = false;
	}

	,onClick: function(e) {
		this.isClicked = true;
	}


};