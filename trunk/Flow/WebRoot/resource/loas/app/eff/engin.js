/***************************************************************
engin.js
effects except animation for elements
****************************************************************/
require.provide("app.eff.engin");
require("lib.dom.engin");
require("lib.dom.style");
/*
Effect namespace
*/
namespace("EFF");
///
WIN.extend(EFF,{
	/*
	():
		EFF.cloneSomeStyleFromObj(o,propertyArr)
	DES:
		create a new element which inherits some style(always are position,cursorStyle,zIndex) from an element.always used when resize,drag an element.
	ARG:
		o						:element or its id
		propertyArr	:optional, more property to clone.
	RTN:
		new element
	*/					 
  cloneSomeStyleFromObj: function( o , arr){
		if(!(o = $(o)))return null;
		var objs = o.style;
		var tag = EL.isClientNode(o) ? "div" : o.tagName;
		var tmp = DOC.c(tag);
		var s = {
			left      :objs.left,
			top       :objs.top,
			bottom    :objs.bottom,
			right     :objs.right,
			cursor    :objs.cursor,
			zIndex    :objs.zIndex ? parseInt(objs.zIndex) + 1 : 1,
			position  :"absolute"
		};
		if(WIN.isArray(arr))Array.each(function(p){s[p] = objs[p];},arr);
		EL.setStyle(tmp,s);
		document.body.appendChild(tmp);
		return tmp;
	},
	/*
	():
		EFF.cloneLayerFromObj(o,styleOptions)
	DES:
		create a layer(div) which inherits some style(always are position,cursorStyle,zIndex) from an element and some other style(always are size,background).
	ARG:
		o							:element or its id
		styleOptions	:optional, more property to clone.
	RTN:
		new element
	*/					 
	cloneLayerFromObj: function(o,styleOptions){
		if(!(o = $(o)))return null;
		var s = WIN.extend({
			width     :EL.width(o) + "px",  //borderWidth: 2*2
			height    :EL.height(o) + "px",
			backgroundColor: "#666"			  
			},styleOptions || {});
		var tmp = EFF.cloneSomeStyleFromObj(o);
		EL.setOpacity(tmp,s.opacity || 50)
		delete s.opacity;
		EL.setStyle(tmp,s);
		return tmp;
	},
	/*
	():
		EFF.cloneRimFromObj(o,styleOptions,opacity)
	DES:
		create a rim(always shows as a border) which inherits some style(always are position,cursorStyle,zIndex) from an element and some other style(always are size,border).
	ARG:
		o							:element or its id
		styleOptions	:optional, more property to clone.
	RTN:
		new element
	*/					 
	cloneRimFromObj: function(o,styleOptions){
		if(!(o = $(o)))return null;
		var objs = o.style;
		var s = WIN.extend({
			width     :EL.width(o) - 4 + "px",  //borderWidth: 2*2
			height    :EL.height(o) - 4 + "px",
			border: "dotted #ccc 2px"	  
			},styleOptions || {});		
		var tmp = EFF.cloneSomeStyleFromObj(o);
		EL.setStyle(tmp,s);
		return tmp;
	},
	/*
	():
		EFF.setSelectElementVisibility()
	DES:
		hide select elements when on modal mode at ie6.
	ARG:
		o							:element or its id
		styleOptions	:optional, more property to clone.
	RTN:
		new element
	*/					 
	setSelectElementVisibility:function(visible){
		var IEversion = BROWSER.IEversion;
		if(IEversion > 0 && IEversion < 7){
			var selectElements = document.getElementsByTagName("select");
			if(visible){
				Array.each(function(o){
					if(o){
						var s = o.style;
						s.visibility = s.originalVisibility || "visible" ;
					}
				},selectElements);
			}
			else{
				Array.each(function(o){
					if(o){
						var s = o.style;
						s.originalVisibility = s.visibility;
						s.visibility = "hidden";
					}
				},selectElements);
			}
		}
	}
});

