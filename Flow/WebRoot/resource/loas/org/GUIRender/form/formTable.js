/***************************************************************
formTable.js
defined GUI.formTable module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("org.GUIRender.form.formTable");
//require resource
require("org.GUIRender.engin");

namespace("GUIRender");
GUIRender.FormTable = function(){
  /*
  ():
    {this} initialize({object} options)
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
    var opt = WIN.extend({
      unknown : null      
    }, options);
    
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
    buildView and reference dom
  */
  this._buildView = function(){
		var ele = this.container || this.renderTarget;
		GUIRender.FormTable.render(ele, this.caption, this.foot);
	};
  /*
  ():
    {void} onBuild()
  DES:
    Function.empty;
  */
  this.onBuild = Function.empty;
};

WIN.extend(GUIRender.FormTable, function(){
    return {
			/*
			():
				{void} GUIRender.FormTable.render({HTMLElement} ele, {string}caption, {string}foot)
			DES:
				render a div with formTable
			ARG:
				{HTMLElement} ele
				  target element, contains contont inner;
				{string}caption
				  caption html
				{string}foot
				  foot html
			*/
      render : function(ele, caption, foot){
				if(!WIN.isElement(ele))return ;
				if(!String.notEmpty(caption))caption = "&nbsp;";
				if(!String.notEmpty(foot))foot = "&nbsp;";
				var html = '<table class="sv_formTable" width="100%" border="0" cellspacing="0" cellpadding="0">'
								 + '<tr>'
								 +   '<td class="nw">&nbsp;</td>'
								 +   '<td class="n">' + caption + '</td>'
								 +   '<td class="ne">&nbsp;</td>'
								 + '</tr>'
								 + '<tr>'
								 +   '<td class="w">&nbsp;</td>'
								 +   '<td class="content">';
				html += ele.innerHTML;
				html += 		 '</td>'
								 +   '<td class="e">&nbsp;</td>'
								 + '</tr>'
								 + '<tr>'
								 +   '<td class="sw">&nbsp;</td>'
								 +   '<td class="s">' + foot + '</td>'
								 +   '<td class="se">&nbsp;</td>'
								 + '</tr>'
								 +'</table>';
				ele.innerHTML = html;
      },
      unknown : null
    };
  }()
);
