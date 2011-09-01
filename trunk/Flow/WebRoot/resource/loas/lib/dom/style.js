/***************************************************************
style.js
set elements sytle.
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.dom.style");
//require resource
require("lib.dom.engin");
////
//extend EL's public methods
////
WIN.extend(EL,{
	/*
	():
		EL.addClass(element, className)
	DES:
		add a css class to an element
	*/
  addClass	  : function (e, className){
		if(!(EL.hasClass(e,className)) && className != "")
			e.className += " " + className;
	},
	/*
	():
		EL.removeClass(element, className)
	DES:
		remove a css class from an element
	*/
  removeClass : function (e, className){
		var arrClass=e.className.split(" ");
		var arr=[];
		for(var i=0;i<arrClass.length;i++){
			if(arrClass[i]!=className)arr[arr.length]=arrClass[i];
		}
		e.className=arr.join(" ");
	},
	
	swapClass: function(e, oldCss, newCss){
		EL.removeClass(e, oldCss);
		EL.addClass(e, newCss);
	}
});