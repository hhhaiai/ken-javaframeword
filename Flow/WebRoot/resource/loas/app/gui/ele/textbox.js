/***************************************************************
engin.js
window and dialog gui base
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.ele.textbox");
//require resource
require("app.gui.ele.engin");
require("lib.dom.engin");
/*
CLASS:
  GUItextBox
DES:
  build a text box which can automatically truncate its innerText by given width.
PUBL_p:
  ele   : text box element
PUBL_m:
  .initialize(innerText, width, height, pNode, options):init options and create element.
	.setWidth(width):set box width and auto truncate its boxText length
	.setText(boxText):set box text
PRIV_p:
  opt  :options
	text :box text
eg.
  var myTbox = new GUItextBox();
	myTbox.initialize("its a box content text,you can also type chinese!", 100,20 ,document.body);
*/
function GUItextBox(){
  //private variant
  var opt;  //options
	var text; //boxText
	/*
	():
		initialize(innerText, width, height, pNode, options)
	DES:
	  create an element which style is :{
			overflow:"hidden",
			width   : width,
			height  : (height || 14) + "px"
		}
	ARG:
		text: box content
		width:int, text container width
		height:int, text container height,optional,default is 14;
		pNode: box parent node.optional,no default value
		options:{//optional,default is:
		  tagName   :"div", //text container tag name
			fontSize  : 12,//int,
			style     :undefined //more style options for box
		}
	*/
  this.initialize = function(innerText, width, height, pNode, options){
	  opt = WIN.extend({
		  	fontSize: 20,
				tagName : "div"
			},options || {});
	  text = innerText;
		var box = EL.c(null,{
				overflow:"hidden",
				width   : width,
				fontSize: opt.fontSize + "px",
				height  : (height || 20) + "px"
			},null,opt.tagName);
		this.ele = box;
		if(opt.style)EL.setStyle(box,opt.style);
		this.setWidth(width);
		if(pNode)pNode.appendChild(box);
	};
	/*
	():
		.setWidth(width)
	DES:
	  set box width and auto truncate its boxText length
	*/
	this.setWidth = function(w){
	  w = parseInt(w);
	  var box = this.ele;
		var newText = String.truncateByWidth(text, w, opt.fontSize);
		//here we setTimeout to setInnerText to fix firefox bug which cant display whole text.
		setTimeout(function(){EL.setInnerText(box, newText);},1);
	  box.style.width = w + "px";
	};
	/*
	():
		.setText(boxText)
	DES:
	  set box text
	*/
	this.setText = function(boxText){
	  text = boxText;
		this.setWidth(this.ele.style.width);
	};
}
