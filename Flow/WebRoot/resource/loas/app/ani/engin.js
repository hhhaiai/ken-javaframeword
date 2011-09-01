/***************************************************************
Array.js
extend Array.prototype
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.ani.engin");
require("lib.dom.style");
/*
ANIAnimation namespace
*/
namespace("ANI");
////
//extend ANI public methods
////
WIN.extend(ANI,{
	/*
	():
		ANI.fade(e,sOpacity,eOpacity,t,a,callback)
	DES:
		Animate an element's opacity from sOpacity to eOpacity.
	ARG:
		sOpacity: startOpacity(integer);
		eOpacity: endOpacity(integer);
	*/
  fade     :function(e,sOpacity,eOpacity,t,a,callback){
    if (!(e=$(e))) return;
    if(e.fading)return;
    e.fading = true;
    var dOp = eOpacity - sOpacity;
		var fq = 1 / t;
    if (a) fq *= (Math.PI / 2);
		var t0 = new Date().getTime();
		EL.setOpacity(e,sOpacity);
		var tmr = setInterval(
			function() {
				if (!e) return;
        var eOp = eOpacity;
        var et = new Date().getTime() - t0;
        if (et < t) {
          var f = et * fq;
          if (a == 1) f = Math.sin(f);
          else if (a == 2) f = 1 - Math.cos(f);
          eOp = f * dOp + sOpacity;
				}
        else { 
          clearInterval(tmr);
          e.fading = false;
          ANI._excuteCallback(callback);
        }
        EL.setOpacity(e,eOp);
			}, 10
		);
  },
	/*
	():
		ANI.fadeIn(e,t,a,callback)
	DES:
		Animate an element's opacity from 0 to 100.   
	*/
  fadeIn      :function(e,t,a,callback){
    this.fade(e,0,100,t,a,callback);
  },
	/*
	():
		ANI.fadeOut(e,t,a,callback)
	DES:
		Animate an element's opacity from 100 to 0.
	*/
  fadeOut     :function(e,t,a,callback){
    this.fade(e,100,0,t,a,callback);
  },
	/*
	():
		ANI.move(e, x, y, t, a, callback)
	DES:
		Animate an element's position over a line segment. This is a minimal, time-based implementation - only supports constant velocity.
	ARG:
		e: An Element object reference or an id string.
		x: The target X coordinate (integer).
		y: The target Y coordinate (integer).
		a: 
		t: The total time for the animation, in milliseconds.
		callback:'onEnd' handler
	*/
  move   :function (e, x, y, t, a, callback){//base on X, a Cross-Browser Javascript Library
    if (!(e=$(e))) return;
    if(e.moving)return;
    e.moving = true;
		
		var eStyle = e.style;
  	var x0,y0;// start positions
		var leftOrRight,topOrBottom;//defined pos left or right,top or bottom
		if(WIN.isDefined(eStyle.left)){
			x0 = parseInt(eStyle.left);
			leftOrRight = "left";
		}else{
			x0 = parseInt(eStyle.right);
			leftOrRight = "right";
		}
		if(WIN.isDefined(eStyle.top)){
			y0 = parseInt(eStyle.top);
			topOrBottom = "top";
		}else{
			y0 = parseInt(eStyle.bottom);
			topOrBottom = "bottom";
		}
    x = Math.round(parseInt(x)); y = Math.round(parseInt(y));
    var dx = x - x0, dy = y - y0; // displacements
    var fq = 1 / t; // frequency
    if (a) fq *= (Math.PI / 2);
    var t0 = new Date().getTime(); // start time
    var tmr = setInterval(
      function() {
				if (!e) return;
        var et = new Date().getTime() - t0; // elapsed time
        if (et < t) {
          var f = et * fq; // constant velocity
          if (a == 1) f = Math.sin(f); // sine acceleration
          else if (a == 2) f = 1 - Math.cos(f); // cosine acceleration
          f = Math.abs(f);
          e.style[leftOrRight] = Math.round(f * dx + x0) + 'px'; // instantaneous positions
          e.style[topOrBottom] = Math.round(f * dy + y0) + 'px';
        }
        else {
          clearInterval(tmr);
          e.moving = false;
          e.style[leftOrRight] = x + 'px'; // target positions
          e.style[topOrBottom] = y + 'px';
          ANI._excuteCallback(callback);
        }
      }, 10 // timer resolution
    );
  },
  resize   :function (e, w, h, t, a, callback){//base on X, a Cross-Browser Javascript Library
    if (!(e=$(e))) return;
    if(e.resizing)return;
    e.resizing = true;
  	var w0 = parseInt(e.style.width),h0 =  parseInt(e.style.height); // start positions
    w = Math.round(w); h = Math.round(h);
    var dw = w - w0, dh = h - h0; // displacements
    var fq = 1 / t; // frequency
    if (a) fq *= (Math.PI / 2);
    var t0 = new Date().getTime(); // start time
    var tmr = setInterval(
      function() {
				if (!e) return;
        var et = new Date().getTime() - t0; // elapsed time
        if (et < t) {
          var f = et * fq; // constant velocity
          if (a == 1) f = Math.sin(f); // sine acceleration
          else if (a == 2) f = 1 - Math.cos(f); // cosine acceleration
          f = Math.abs(f);
          e.style.width = Math.round(f * dw + w0) + 'px'; // instantaneous positions
          e.style.height = Math.round(f * dh + h0) + 'px';
        }
        else {
          clearInterval(tmr);
          e.resizing = false;
          e.style.width = w + 'px'; // target positions
          e.style.height = h + 'px';
          ANI._excuteCallback(callback);
        }
      }, 10 // timer resolution
    );
  },  
	_excuteCallback:function(f){
		if (WIN.isFunction(f)) f();
		else if (WIN.isString(f)) eval(f);
	}
});

