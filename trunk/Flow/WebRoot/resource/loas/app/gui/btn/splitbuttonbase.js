/***************************************************************
splitbuttonbase.js
create split button,tab and menu item gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.btn.splitbuttonbase");
//require resource
require("app.gui.btn.button");

/*
CLASS:
  GUI.SplitButtonBase 
SUPERCLASS:
  GUI.Button
SUBCLASS:
  GUI.Tab
  GUI.MenuItem
DES:
  SplitButtonBase insert split part to a button if the splitEle offered;
PROPERTY:
  {HTMLElement} splitEle
    the split dom reference,
METHOD:
  {this} initialize({object} options)
	{void} _adjustTextWrapPaddingRight({boolean} isIncrease) 
*/
GUI.SplitButtonBase = function(){
  GUI.SplitButtonBase.superClass.apply(this);
	this.appendSplit = function(splitEle){
		splitEle = (splitEle || this.splitEle);
		if(WIN.isElement(splitEle)){
			var ele = this.ele.firstChild, layout = this.layout;
			ele.insertBefore(splitEle, ele.firstChild);
			if(!layout.splitWidth)layout.splitWidth = splitEle.scrollWidth;//it only work after appending to body.
			this.splitEle = splitEle;
			this._adjustTextWrapPaddingRight(true);
		}
	};
	/*
	():
		{void} _adjustTextWrapPaddingRight({boolean} isIncrease)
	DES:
		after inserted or removed a new element(split) we need to reset TextWrap PaddingRight,You should assign this.layout.splitWidth before you use this method;splitWidth is width of the split element.
	ARG:
		{boolean} isIncrease
			whether increase padding right or not
	*/
	this._adjustTextWrapPaddingRight = function(isIncrease){
		var s = this.textWrapEle.style;
		var p = parseInt(this.layout.splitWidth);
		p = isIncrease ? p : - p;
		s.paddingRight = parseInt(s.paddingRight) + p + "px";
	};
};
WIN.extendClass(GUI.SplitButtonBase, GUI.Button);