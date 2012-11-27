window.Swipe=function(e,t){if(!e)return null;this.options=t||{};this.index=this.options.startSlide||0;this.initialWidth=this.initialWidth||"90%";this.speed=this.options.speed||200;this.transitionEnd=this.options.transitionEnd||function(){};this.swipeIndex=this.options.swipeIndex||0;this.setupCount=0;this.parent=e.parentNode;this.container=e.firstElementChild;this.element=this.container.children[0];this.count=this.container.children.length;this.initialCount=this.count;if(this.count<2)return null;setTimeout(function(e){e.setup(e)},800,this);if(this.container.addEventListener){this.container.addEventListener("touchstart",this,!1);this.container.addEventListener("touchmove",this,!1);this.container.addEventListener("touchend",this,!1);this.container.addEventListener("touchleave",this,!1);this.container.addEventListener("mousedown",this,!1);this.container.addEventListener("mousemove",this,!1);this.container.addEventListener("mouseup",this,!1);this.container.addEventListener("mouseout",this,!1);this.container.addEventListener("webkitTransitionEnd",this,!1);this.container.addEventListener("msTransitionEnd",this,!1);this.container.addEventListener("oTransitionEnd",this,!1);this.container.addEventListener("transitionend",this,!1);window.addEventListener("resize",this,!1)}};Swipe.prototype={setup:function(e,t){console.group("SETUP");e==undefined&&(e=this);e.parent.style.width=e.initialWidth;if(e.setupCount==0){console.log("Making sure the first element is in the middle");e.container.insertBefore(e.container.children[e.container.children.length-1],e.container.firstElementChild);e.container.insertBefore(e.container.children[e.container.children.length-1],e.container.firstElementChild);t=t||e.index;if(t>0)for(var n=0;n<t;n++)e.container.appendChild(e.container.children[0])}console.log("Making sure we have 5 elements --> ");while(e.count<5){console.log("that.count: "+e.count);var r=e.count-e.initialCount;console.log("copyIndex: "+r);e.container.appendChild(e.container.children[r].cloneNode(!0));e.count=e.container.children.length;console.log("that.count.end: "+e.count)}e.element=e.container.children[0];console.log("<-- Making sure we have 5 elements  ");console.log("Getting widths");e.parentWidth=Math.ceil("getBoundingClientRect"in e.parent?e.parent.getBoundingClientRect().width:e.parent.offsetWidth);e.width=Math.ceil("getBoundingClientRect"in e.container?e.container.getBoundingClientRect().width:e.container.offsetWidth);e.elementWidth=e.parentWidth;console.log("Parent width: "+e.parentWidth);console.log("Width: "+e.parentWidth);console.log("Setting widths");e.container.style.width=e.elementWidth*e.count+"px";e.container.style.left="-"+e.elementWidth*2+"px";for(var n=0;n<e.container.children.length;n++)e.container.children[n].style.width=e.elementWidth+"px";console.log("Setting parent width to 100%");e.parent.style.width="100%";console.log("Get heights");e.parentWidth=Math.ceil("getBoundingClientRect"in e.parent?e.parent.getBoundingClientRect().height:e.parent.offsetHeight);e.height=Math.ceil("getBoundingClientRect"in e.container?e.container.getBoundingClientRect().height:e.container.offsetHeight);console.log("Set heights");e.container.parentNode.style.height=e.height+"px";e.parent.style.height=e.height+"px";if(!e.width)return null;console.log("Sliding to slide 1 and setting visibility to visible");console.groupEnd();e.slide(t!=undefined?t:e.index,0);e.parent.style.visibility="visible";e.setupCount++},handleEvent:function(e){switch(e.type){case"touchstart":this.onTouchStart(e);break;case"touchmove":this.onTouchMove(e);break;case"touchend":this.onTouchEnd(e);break;case"touchleave":this.onTouchEnd(e);break;case"mousedown":this.onTouchStart(e);break;case"mousemove":this.onTouchMove(e);break;case"mouseup":this.onTouchEnd(e);break;case"mouseout":this.onTouchEnd(e);break;case"click":this.onClick(e);break;case"resize":console.log("resize!");this.setup()}},slide:function(e,t){console.group("SLIDE");if(this.animating){console.log("is already animating, returning");console.groupEnd();return}t==undefined&&(t=this.speed);console.log("Getting some elements");this.firstElement=this.container.children[0];this.last=this.container.children[this.container.children.length-1];this.elementWidth=this.firstElement.getBoundingClientRect().width;if(this.index==e){console.log("index has not changed setting som styles and returning");this.setTransitionDuration(this.container,t+"ms");this.setTranslateX(this.container,"0");console.groupEnd();return}if(this.index>e){this.moveNext=!1;this.amount=this.elementWidth*(this.index-e);console.log("Moving next with "+this.amount+"px")}else{this.moveNext=!0;this.amount=-this.elementWidth*(e-this.index);console.log("Moving previous with "+this.amount+"px")}this.setTransitionDuration(this.container,t+"ms");this.setTranslateX(this.container,this.amount);this.animating=!0;this.onTransitionEnd(e);this.moveTimeoutID=setTimeout(function(e){console.log("Inside setTimeout ");var n=navigator.userAgent.toLowerCase();n.indexOf("android 4")!=-1&&n.indexOf("chrome")==-1&&n.indexOf("opera")==-1&&n.indexOf("firefox")?e.setTransitionDuration(e.container,"1ms"):e.setTransitionDuration(e.container,"0ms");e.setTranslateX(e.container,0);if(e.moveNext==1)if(e.initialCount<5){var r=5-e.initialCount;console.log("Less than 5, moving elem "+r+" to first element and copying that to the last node");e.firstElement.innerHTML=e.container.children[r].innerHTML;e.container.appendChild(e.firstElement)}else{console.log("5 or more: Moving first to last");e.container.appendChild(e.firstElement)}else if(e.initialCount<5){var r=e.initialCount-1;console.log("Less than 5, moving elem "+r+" to last element and copying that to the first node");e.last.innerHTML=e.container.children[r].innerHTML;e.container.insertBefore(e.last,e.firstElement)}else{console.log("5 or more: Moving last to first");e.container.insertBefore(e.last,e.firstElement)}setTimeout(function(e){e.setTransitionDuration(e.container,t+"ms");e.setTranslateX(e.container,0)},1,e);e.animating=!1;console.log("Ending setTimeout ")},t,this);console.groupEnd();this.index=e},setTranslateX:function(e,t){e.style.webkitTransform=e.style.MozTransform=e.style.msTransform=e.style.transform="translate3d("+t+"px,0px,0px)";e.style.OTransform="translate("+t+"px)"},setTransform:function(e,t){e.style.webkitTransform=e.style.MozTransform=e.style.msTransform=e.style.OTransform=e.style.transform=t},setTransitionDuration:function(e,t){e&&t&&(e.style.webkitTransitionDuration=e.style.MozTransitionDuration=e.style.msTransitionDuration=e.style.OTransitionDuration=e.style.transitionDuration=t)},next:function(){this.slide(this.index+1)},prev:function(){this.slide(this.index-1)},getPos:function(e){e==undefined&&(e=this.index);return e<0?(this.initialCount-Math.abs(e)%this.initialCount)%this.initialCount:e%this.initialCount},onTransitionEnd:function(e){this.transitionEnd(this.getPos(e))},onClick:function(e){(this.deltaX||thisdeltaY)&&e.preventDefault()},onTouchStart:function(e){if(this.animating){if(Number(new Date-this.lastTouchEnd)<this.speed){this.start=undefined;return}this.animating=!1}e instanceof MouseEvent?this.start={pageX:e.pageX,pageY:e.pageY,time:Number(new Date)}:this.start={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY,time:Number(new Date)};this.isScrolling=undefined;this.deltaX=0;this.setTransitionDuration(this.container,"0ms");this.container.style.webkitTransitionDuration=this.container.style.MozTransitionDuration=this.container.style.msTransitionDuration=this.container.style.OTransitionDuration=this.container.style.transitionDuration="0ms";e.stopPropagation()},onTouchMove:function(e){if(!this.start)return;if(e instanceof TouchEvent)if(e.touches.length>1||e.scale&&e.scale!==1)return;if(e instanceof TouchEvent){this.deltaX=e.touches[0].pageX-this.start.pageX;this.deltaY=e.touches[0].pageY-this.start.pageY}else{this.deltaX=e.pageX-this.start.pageX;this.deltaY=e.pageY-this.start.pageY}var t=e instanceof TouchEvent?e.touches[0].pageY:e.pageY;typeof this.isScrolling=="undefined"&&(this.isScrolling=!!(this.isScrolling||Math.abs(this.deltaX)<Math.abs(this.deltaY)));if(!this.isScrolling){e.preventDefault();this.setTranslateX(this.container,this.deltaX);e.stopPropagation()}},onTouchEnd:function(e){if(!this.start)return;var t=Number(new Date)-this.start.time<250&&Math.abs(this.deltaX)>20||Math.abs(this.deltaX)>this.elementWidth/2;this.isScrolling||this.slide(this.index+(t?this.deltaX<0?1:-1:0),this.speed);this.start=undefined;this.lastTouchEnd=Number(new Date);e.stopPropagation()}};