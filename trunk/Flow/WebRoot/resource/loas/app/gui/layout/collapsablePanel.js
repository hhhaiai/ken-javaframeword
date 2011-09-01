/* collapsablePanel.js
define layout panel
*/
require.provide("app.gui.layout.collapsablePanel");
require("lib.core.util.SimpleTemplate");
require("lib.dom.style");

namespace("GUI.Layout");
/* {
CLASS:
  GUI.Layout.CollapsablePanel
SUPER:
DES:
PROPERTY:

METHOD:
} */
GUI.Layout.CollapsablePanel = WIN.createClass(
  function(){
  },{
    container : null,
		collapsed : false,
		firstCollapse : false,
		headerBgCss : "headerBg",
		expandedCss : "expanded",
		collapsedCss : "collapsed",
		title : "",
		contentHtml : "",
		
    htmlTpl : new WIN.SimpleTemplate('<div class="gui_collapsablePanel">'
				+ '<div class="header {headerBgCss}">'
					+ '<div class="title">'
					+ '</div>'
					+ '<div class="collaspeIconMask {headerBgCss}">'
						+	'<div class="collapseIcon {expandedCss}">'
						+	'</div>'
					+	'</div>'
				+	'</div>'
				+	'<div class="content"></div>'
			+ '</div>'),
		_bindDom : function(){
			var css ,
					nodes = this.dom.getElementsByTagName("div"),
					contains = String.contains;
			Array.each(function(node){
			  css = node.className;
				if(contains(css, "title"))this.titleEle = node;
				else if(contains(css, "content"))this.contentEle = node;
				else if(contains(css, "collapseIcon"))this.collapseIconEle = node;
			}, nodes, 0, this);
		},
		_initDom : function(){
			var ele = this.collapseIconEle;
			ele.onclick = Function.bind(this.toggleCollapse, this);
		},
		initialize : function(options){
			WIN.extend(this, options);
			this.build()
					.setTitle(this.title)
					.setContent(this.contentHtml);
			if(this.firstCollapse){
				this.collapse();
			}
			return this;
		},
    build : function(){
      var values = {
        headerBgCss : this.headerBgCss,
				expandedCss : this.expandedCss
      };
			var html = this.htmlTpl.apply(values),
					ele = this.dom = EL.createElementsByHtml(html)[0],
					ctn = this.container;
			if(WIN.isElement(ctn)){
				ctn.appendChild(ele);
			}
			this._bindDom();
			this._initDom();
			return this;
		},
		setTitle : function(text){
			if(WIN.isString(text)){
				var ele = this.titleEle;
				if(WIN.isElement(ele)){
					ele.innerHTML = text;
				}
			}
			return this;
		},
		setContent : function(text){
			if(WIN.isString(text)){
				var ele = this.contentEle;
				if(WIN.isElement(ele)){
					ele.innerHTML = text;
				}
			}
			return this;
		},
		setWidth : function(value){
			value = parseInt(value);
			EL.setStyle(this.dom, {width : EL.parseUnit(value)});
			if(BROWSER.IEversion == 6)EL.setStyle(this.contentEle, {width : EL.parseUnit(value)});
			return this;
		},
		setHeight : function(value){
			value = parseInt(value) - 2;//2 is border height;
			EL.setStyle(this.dom, {height : EL.parseUnit(value)});
			this.setContentHeight(value - this.titleEle.offsetHeight - 2);
		},
		setContentHeight : function(value){
			EL.setStyle(this.contentEle, {height : EL.parseUnit(value)});
			return this;
		},		
		collapse : function(){
			var ele = this.collapseIconEle;
			if(!this.collapsed && WIN.isElement(ele)){
				EL.swapClass(ele, this.expandedCss, this.collapsedCss);
				this.contentEle.style.display = "none";
				this.collapsed = true;
			}
			return this;
		},
		expand : function(){
			var ele = this.collapseIconEle;
			if(this.collapsed && WIN.isElement(ele)){
				EL.swapClass(ele, this.collapsedCss, this.expandedCss);
				this.contentEle.style.display = "";
				this.collapsed = false;
			}
			return this;
		},
		toggleCollapse : function(){
			if(this.collapsed)this.expand();
			else this.collapse();
			return this;
		},
		toString : function(){
      return "[object GUI.Layout.CollapsablePanel]";
    }
  }
);