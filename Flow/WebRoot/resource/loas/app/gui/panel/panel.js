/***************************************************************
panel.js
defined panel module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.panel.panel");
//require resource
require("app.gui.engin");
require("app.gui.panel.box");

/*
CLASS:
  GUI.Panel
SUPERCLASS:
  GUI.Box
SUBCLASS:
  subclass
DES:
  Panel is form of two items: head and body;
	head is fixed height while body's height is alterable;
PROPERTY:
  {GUI.Box} head
    head must inherit from GUI.Box;Its height is fixed;
  {GUI.Box} body
    body must inherit from GUI.Box;Its height is alterable;
METHOD:
	{void} _buildView()
	{void} setHeight({string | int} h)
	{void} setWidth({string | int} w)
*/
GUI.Panel = function(){
  GUI.Panel.superClass.apply(this);
  /*
  ():
    {void} _buildView()
  DES:
    build head dom;
  */
  this._buildView = function(){
		GUI.Panel.$_buildView.call(this);
    var wrap = this.ele, head = this.head, body = this.body;
    if(head && WIN.isElement(head.ele))wrap.appendChild(head.ele);
    if(body && WIN.isElement(body.ele))wrap.appendChild(body.ele);
  };
  /*
  ():
    {void} setHeight({string | int} h)
	ARG:
	 {string | int} h
	   cant accept auto,must be a exact length;
  */
  this.setHeight = function(h){
		h = parseInt(h);
		this.ele.style.height = h + "px";
		try{h -= this.head.ele.scrollHeight;}catch(e){}
		this.body.setHeight(h);
  };
  /*
  ():
    {void} setWidth({string | int} w)
  */
  this.setWidth = function(w){
		this.ele.style.width = EL.parseUnit(w);
		var _this = this;
		TRY.whatever(function(){_this.head.setWidth(w);},
								 function(){_this.body.setWidth(w);});
  };
};
WIN.extendClass(GUI.Panel, GUI.Box);