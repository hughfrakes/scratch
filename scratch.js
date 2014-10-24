/*!
 * Scratch.js v0.1.0 (Oct.24, 2014) 
 * Copyright (c) 2014 Hugh Frakes - http://www.hughfrakes.com
 * License: MIT
 */

 /**
  * Scratch.js is a fully-customizable scratchcard plugin
  * Create a "div" element and define its width and height, and drag the mouse or move your finger to reveal the target image underneath
  *
  * Instruction
  *
  * scratch() {
  * 	div: "myDiv",		//id of target div element
  * 	targetImg: "targetImg.jpg",		//the image underneath
  * 	overlayImg: "overlayImg.jpg",		//optional param, the overlay image
  *	overlayImgOpacity: 0.8,		//optional param, the opacity of the overlay image
  * 	fillColor: "#ffffff",		//optional param, use a solid color instead of an image to cover the target image
  * 	scratchRadius: 30 	           //optional param, the radius of scratch (px)
  *  }
 */ 

function scratch(params) {
	// Default options
	if (!params.fillColor) params.fillColor = "#bababa"; // default fill color above
	if (!params.scratchRadius) params.scratchRadius = 20; // default radius of each scratch (px)

	//Global variables
	var wrapDiv;
	var canvasWidth;
	var canvasHeight;
	var canvasLeft;
	var canvasTop;
	var myCanvas;
	var ctx;
	var mouseDown;

	// Get some information of target "div" element
	wrapDiv = document.getElementById(params.div);
	canvasWidth = wrapDiv.offsetWidth;
	canvasHeight = wrapDiv.offsetHeight;
	canvasLeft = wrapDiv.offsetLeft;
	canvasTop = wrapDiv.offsetTop;

	// Create "canvas" element, and make targetImg as its background image
	wrapDiv.innerHTML = "<canvas id='" + params.div + "Canvas'></canvas>";
	myCanvas = document.getElementById(params.div + "Canvas");
	myCanvas.width = canvasWidth;
	myCanvas.height = canvasHeight;
	myCanvas.style.backgroundImage = "url(" + params.targetImg + ")";
	myCanvas.style.backgroundSize = "cover";

	// Draw the fill color or the overlay image
	ctx = myCanvas.getContext("2d");
	if (params.overlayImg) {
		var overlayImg = new Image();
		overlayImg.src = "overlayImg.jpg";
		overlayImg.onload = function() {
			ctx.drawImage(overlayImg,0,0,canvasWidth,canvasHeight);
			if (params.overlayImgOpacity) {
				var opa = params.overlayImgOpacity;
				var overlayImgData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
				for (var i = 3, l = overlayImgData.width*overlayImgData.height*4; i < l; i +=4) {
					overlayImgData.data[i] = Math.floor(255*opa);
				}
				ctx.putImageData(overlayImgData,0,0);
				ctx.globalCompositeOperation = "destination-out";
			}
		}
	}
	else {
		ctx.fillStyle = params.fillColor;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.globalCompositeOperation = "destination-out";
	}

	// Set events listeners
	mouseDown = false;
	myCanvas.addEventListener("mousedown", eventDown);
	myCanvas.addEventListener("mousemove", eventMove);
	myCanvas.addEventListener("mouseup", eventUp);
	myCanvas.addEventListener("touchstart", eventDown);
	myCanvas.addEventListener("touchmove", eventMove);
	myCanvas.addEventListener("touchend", eventUp);
	window.addEventListener("resize", function(){
		canvasLeft = wrapDiv.offsetLeft;
		canvasTop = wrapDiv.offsetTop;
	})
	function eventDown(e) {
		e.preventDefault();
		mouseDown =  true;
	}
	function eventMove(e) {
		e.preventDefault();
		if (mouseDown) {
			if (e.changedTouches) e = e.changedTouches[e.changedTouches.length - 1];
			var x = e.pageX - canvasLeft;
			var y = e.pageY - canvasTop;
			ctx.beginPath();
			ctx.arc(x,y,params.scratchRadius,0,Math.PI*2,false);
			ctx.fill();
		}
	}
	function eventUp(e) {
		e.preventDefault();
		mouseDown = false;
	}
}
