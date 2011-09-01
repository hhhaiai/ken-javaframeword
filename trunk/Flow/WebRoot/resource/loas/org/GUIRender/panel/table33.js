/***************************************************************
table33.js
defined GUIRender.table33 module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("org.GUIRender.panel.table33");
//require resource
require("org.GUIRender.engin");
require("app.gui.engin");
/*
CLASS:
  GUIRender.Table33 
SUPERCLASS:
  GUIRender.Base
DES:
  Table33 is a 3 cols and 3 rows table panel;
PROPERTY:
  {string}foot
	  table foot html
  {string}head
	  table head html
  {HTMLElement}renderTarget
	  container for panel
METHOD:
  see also GUIRender.Base
*/
GUIRender.Table33 = function(){
  GUIRender.Table33.superClass.apply(this);
  /*
  ():
    {this} initialize({object} options)
  ARG:
		{object} options
			PROPERTY:
				{string}head
					table head html
				{string}foot
					table foot html
  */
  /*
  ():
    {void} _buildView()
  DES:
    buildView and reference dom
  */
  this._buildView = function(){
		var ele = this.container || this.renderTarget;
		if(!WIN.isElement(ele)){
			ele = DOC.c("div") ;
			document.body.appendChild(ele);
		}
		var css = this.tableCss || "GUIRender_table33";
		ele.innerHTML = GUI.createTable33Html(this.head, ele.innerHTML, this.foot, css);
		this.ele = ele.firstChild;
		var rows = this.ele.rows;
		this.headEle = rows[0].cells[1];
		var bodyEle = this.bodyEle = rows[1].cells[1];
		this.footEle = rows[2].cells[1];
		if(this.contentId){
			var contentEle = $(this.contentId);
			if(WIN.isElement(contentEle)){
				bodyEle.innerHTML = "";
				setTimeout(function(){bodyEle.appendChild(contentEle);}, 10);
			}
		}
	};
	this.setHead = function(html){
		try{this.headEle.innerHTML = html;}catch(e){}
	};
	this.setBody = function(html){
		try{this.bodyEle.innerHTML = html;}catch(e){}
	};
	this.setFoot = function(html){
		try{this.footEle.innerHTML = html;}catch(e){}
	};
};
WIN.extendClass(GUIRender.Table33, GUIRender.Base);
