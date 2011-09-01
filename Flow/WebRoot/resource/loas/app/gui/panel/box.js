/***************************************************************
box.js
defined base module -- box 
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.panel.box");
//require resource
require("app.gui.engin");

/*
CLASS:
  GUI.Box
DES:
  box is a div
PROPERTY:
  {HTMLElement} ele
METHOD:
  {this} initialize({object} options)
  {void} handleOptions()
  {void} build()
  {void} _buildView()
	{string} getHeight()
  {object} getSize()
	{string} getWidth()
	{void} setHeight({string | int} h)
  {void} setSize()
	{void} setWidth({string | int} w)
  {void} setStyle({object} style)
	
*/
GUI.Box = function(){
  /*
  ():
    {this} initialize({object} options)
  DES:
    description
  ARG:
    {object} options
      Box's properties,default value:
      {
        
      }
  */
  this.initialize = function(options){    
    WIN.extend(this, this.handleOptions(options));
    this.build();
    return this;
  };
  /*
  ():
    {void} handleOptions()
  DES:
    handle options
  */
  this.handleOptions = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
      unknown : null
      }, options, ["layout"]);
		opt.container = $(opt.container);
    WIN.extend(opt.layout, options.layout);
		return opt;
  };
  /*
  ():
    {void} build()
  DES:
    build box;You should define onBuild method in subClass;
  */
  this.build = function(){
    this._buildView();
    this.onBuild();
  };
  /*
  ():
    {void} _buildView()
  DES:
    build box dom; here we just create a div;
  */
  this._buildView = function(){
    this.ele = EL.c();
		if(WIN.isElement(this.container))this.container.appendChild(this.ele);
  };
  this.onBuild = Function.empty;
  /*
  ():
    {object} getSize()
  DES:
    get box size;
  RTN:
    a object contains width and height properties.
  */
  this.getSize = function(){
    return {
      width  : this.getWidth(),
      height : this.getHeight()
    };
  };
  /*
  ():
    {string} getHeight()
  */
  this.getHeight = function(){
		return this.ele.style.height;
  };
  /*
  ():
    {string} getWidth()
  */
  this.getWidth = function(){
		return this.ele.style.width;
  };
  /*
  ():
    {void} setSize()
  DES:
    set box size;
  */
  this.setSize = function(w, h){
    this.setWidth(w);
    this.setHeight(h);
  };
  /*
  ():
    {void} setHeight({string | int} h)
  */
  this.setHeight = function(h){
		if(WIN.isDefined(h))this.ele.style.height = EL.parseUnit(h);
  };
  /*
  ():
    {void} setWidth({string | int} w)
  */
  this.setWidth = function(w){
		if(WIN.isDefined(w))this.ele.style.width = EL.parseUnit(w);
  };
  /*
  ():
    {void} setStyle({object} style)
  DES:
    set box style;
  */
  this.setStyle = function(style){
    EL.setStyle(this.ele, style);
  };
};