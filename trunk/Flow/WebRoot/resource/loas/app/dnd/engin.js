/***************************************************************
engin.js
drag and drop behavior
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.dnd.engin");
//require resource
require("lib.dom.engin");
require("lib.dom.style");
require("lib.dom.layout.size");
require("lib.evt.engin");
require("app.eff.engin");

//drag and drop namespace namespace
namespace("DND");
////
//extend DND methods
/*
():
  DND.drag(dragElement[,useTempMode,moveF,upF,evt])
DES:
  drag element,alaways used at onmousedown event
ARG:
  dragElement: 
  useTempMode : whether create a rim instead of dragElement on mousemoving
RTN:
  
*/
////
WIN.extend(DND,{
	drag        : function(obj,useTempMode,moveF,upF,options){
		evt = EVT.getEvt();
		if(!(evt.button == 1 || evt.button == 0))return;
		var d = document;
		var objs = obj.style;
		var opt = WIN.extend({
				useTempMode	:false,
				animove			:false,
				gradualTime :300,
				moveF	:Function.empty,
				upF		:Function.empty				
			},options||{});
		var useTempMode = opt.useTempMode;
		var moveObj,moveObjs;//moving obj
		if(useTempMode){
			moveObj = EFF.cloneRimFromObj(obj);
			moveObjs = moveObj.style;
			moveObjs.visibility = "hidden";
		}else{
			moveObj = obj;
			moveObjs = objs;
		}
		//obj pos
		var x = (objs.left != "") ? parseInt(objs.left) : parseInt(objs.right) ;
		var y = (objs.top != "") ? parseInt(objs.top) : parseInt(objs.bottom) ;
		
		var _x,_y;//starts pos
		var x_,y_;//moving pos
		_x=evt.clientX;
		_y=evt.clientY;
		
		var maxW = DOC.getClientWidth();//窗口可用宽度,用于画选择框 scrollbar:20px
		var maxH = DOC.getClientHeight();//窗口可用高度
		EVT.observe(d,'mousemove', _inFmove,true);
		EVT.observe(d,'mouseup', _inFup,true);
		if (moveObj.setCapture)
			moveObj.setCapture(); 
		EVT.cancelB();
		function _inFmove(evt){
			evt = EVT.getEvt(evt);//evt for firefox
			x_=evt.clientX;
			y_=evt.clientY;
			if(useTempMode)moveObj.style.visibility = "visible";
			if(x_ > 0 && y_ > 0 && x_ < maxW && y_ < maxH){			
				if((objs.left != ""))moveObjs.left = x + (x_ - _x)+'px';
				else moveObjs.right = x - (x_ - _x)+'px';      
				
				if((objs.top != ""))moveObjs.top = y + (y_ - _y)+'px';
				else moveObjs.bottom = y - (y_ - _y)+'px';
			}
			if(opt.moveF)opt.moveF(obj,evt);
			EVT.cancelB();
		};
		function _inFup(){
			EVT.stopObserving(d,'mousemove', _inFmove,true);
			EVT.stopObserving(d,'mouseup', _inFup,true);
			if (moveObj.releaseCapture)
				moveObj.releaseCapture(); 
			
			//update obj.style			
			if(useTempMode){
				if(opt.animove && ANI && ANI.move){//animation
				  var x = (moveObjs.left||moveObjs.right);
					var y = (moveObjs.top||moveObjs.bottom);
					ANI.move(obj,x,y,opt.gradualTime,1);
				}else{
					Array.each(function(i){
												objs[i] = moveObjs[i];
											},["top","right","bottom","left"]);
				}
				d.body.removeChild(moveObj);
				moveObj = null;
			}
			//
			if(opt.upF)opt.upF(obj,evt);
			EVT.cancelB();
		};
	},
	
	/*
	():
		.resize(element, canResize, direct, options, evt)
	DES:
		do resize.
	ARG:
		canResize : function, to check the element is resizeable.
		direct    : direction of mouse moveing relative to element
		options   : default value is {
				canResize      :Function.K,//before resizing a element we check it if it's resizeable
				onResizeWidth  :Function.K,//
				onResizeHeight :Function.K,
				onmouseup      :Function.empty,
				useTempMode    :true,
				scopeWidth     :DOC.getClientWidth(),
				scopeHeight    :DOC.getClientHeight(),
				maxWidth       :DOC.getClientWidth(),
				maxHeight      :DOC.getClientHeight(),
				minWidth       :0,
				minHeight      :0
			}
	RTN:
		
	*/
	resize : function(o, direct, options, evt){
		if (!(o = $(o))) return;
		evt = EVT.getEvt(evt);
		if(!(evt.button != 1 ||evt.button != 0))return;
		//drag options
		var bodyWidth = DOC.getClientWidth();
		var bodyHeight = DOC.getClientHeight();
		var opt = WIN.extend({
				/*
				():
					canResize(element)
				DES:
					before resizing a element we check it if it's resizeable
				ARG:
					element: the element to be resize
				RTN:
					boolean
				*/
				canResize      :Function.K,
				/*
				():
					onResizeWidth(width)
				DES:
					when we resize the element,if we dont use useTempMode ,we need to update its relative 
					elements width onmousemove.
				ARG:
					width:new width after the element being resized
				*/
				onResizeWidth  :Function.empty,
				/*
				():
					onResizeHeight(height)
				DES:
					 see onResizeWidth.
				*/
				onResizeHeight :Function.empty,
				/*
				():
					onmouseup(style)
				DES:
					if we dont useTempMode, we need to update its relative elements style by tempNode 
					style onmouseup.Here we had updated the element style so in onmouseup function you 
					just need to update its relative elements style.
				ARG:
					style:new width after the element being resized
				*/
				onmouseup      :Function.empty,
				useTempMode    :true,
				scopeWidth     :bodyWidth,
				scopeHeight    :bodyHeight,
				maxWidth       :bodyWidth,
				maxHeight      :bodyHeight,
				minWidth       :0,
				minHeight      :0
			},options||{});
		//check o is resizeable
		if(!opt.canResize(o))return;
		
		var hndEle;//event control target
		hndEle = opt.useTempMode ? EFF.cloneRimFromObj(o) : o;
		var s = hndEle.style;
		var d = document;
		EVT.cancelB(evt);
		EVT.observe(d,'mousemove', _inFmove,true);
		EVT.observe(d,'mouseup', _inFup,true);
		if (hndEle.setCapture)
			hndEle.setCapture(); 
		else
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		var t,r,b,l;//o original top,right,bottom,left
		l = parseInt(s.left);
		r = l + parseInt(s.width);
		t = parseInt(s.top);
		b = t + parseInt(s.height);
		var sw = EL.width(o);//o original width,height
		var sh = EL.height(o);
		var w,h;
		
		function _inFmove(evt){
			EVT.cancelB(evt);
			var x = EVT.pointerX(evt);
			var y = EVT.pointerY(evt);
	
			if(x > 0 && y > 0 && x < opt.scopeWidth && y < opt.scopeHeight){
				switch(direct){
					case "se":{
						w = x - l;
						h = y - t;
						if(x > l ){
							if(_checkWidth(w)){_set("width",w);}
						}
						if(y > t){								
							if(_checkHeight(h)){_set("height",h);}
						}
						break;
					};
					case "sw":{
						w = r - x;
						h = y - t;
						if(r > x){
							if(_checkWidth(w)){_set("left",x);_set("width",w);}
						}
						if(y > t){
							if(_checkHeight(h)){_set("height",h);}
						}
						break;
					};
					case "nw":{
						w = r - x;
						h = b - y;
						if(r > x){
							if(_checkWidth(w)){_set("left",x);_set("width",w);}
						}
						if(b > y){
							if(_checkHeight(h)){_set("top",y);_set("height",h);}
						}
						break;
					};
					case "n":{
						h = b - y;
						if(b > y && _checkHeight(h)){_set("top",(b - h));_set("height",h);}
						break;
					};
					case "e":{
						w = x - l;
						if(x > l && _checkWidth(w)){_set("width",w);}
						break;
					};
					case "s":{
						w = r - l;
						h = y - t;
						if(y > t && _checkHeight(h)){_set("height",h);}
						break;
					};
					case "w":{
						w = r - x;
						if(r > x && _checkWidth(w)){_set("left",x);_set("width",w);}
						break;
					};
					default:{//"ne"
						w = x - l;
						h = b - y;
						if(x > l){
							if(_checkWidth(w)){_set("width",w);}
						}
						if(b > y){
							if(_checkHeight(h)){_set("top",y);_set("height",h);}
						}
					};
				};
			}
		};
		function _set(type, n){
			s[type] = n + "px";
			if(type == "width"){
				if(!opt.useTempMode)opt.onResizeWidth(n);
			}
			else if(type == "height"){
				if(!opt.useTempMode)opt.onResizeHeight(n);
			}
		}
		function _checkWidth(w){
			return (w <= opt.maxWidth && w >= opt.minWidth);
		};
		function _checkHeight(h){
			return (h <= opt.maxHeight && h >= opt.minHeight);
		};
		function _inFup(evt){
			EVT.cancelB(evt);
			if(opt.useTempMode){
				//update o style
				Array.each(function(i){
											o.style[i] = s[i];
										},["top","right","bottom","left"]);
				//update relative elements
				opt.onmouseup(s);
			}
			EVT.stopObserving(d,'mousemove', _inFmove,true);
			EVT.stopObserving(d,'mouseup', _inFup,true);
			if (!window.captureEvents)
				hndEle.releaseCapture();
			else
				window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.body.removeChild(hndEle);
			hndEle = undefined;
		};
	}

});
