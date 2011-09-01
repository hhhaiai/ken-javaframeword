/***************************************************************
verticalmenu.js
defined GUI.VerticalMenu module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.menu.verticalmenu");
//require resource
require("app.gui.engin");
require("app.gui.btn.iconbutton");
require("app.gui.bar.vtoolbarbase");
require("app.gui.menu.menubase");

GUI.VerticalMenu = function(){
  GUI.VerticalMenu.superClass.apply(this);
  /* 
  ():
    {void} handleOptions()
  DES:
    handle options
  */
	this.handleOptions = function(options){
    if(!options)options ={};
		var opt = WIN.extendExclude({
			container      : document.body,
			headText       : "",
			barOptions     : {},
			layout         : {
				scrollArrowsCss: ["gui_verticalmenu_arrow_up", 
													"gui_verticalmenu_arrow_down"],
				scrollArrowsWidth : 14,
				scrollArrowsHeight: 14,
				wrapCss        : "gui_verticalmenu_wrap",
				posWrapCss     : "gui_verticalmenu_pos_wrap",
				barWrapCss     : "gui_verticalmenu_bar_wrap",
				bgImg_head_css : "gui_verticalmenu_head",
				headHeight: 25,
				height    : 250,
				width     : 150,
				unknown : null
			},
			unknown : null			
		}, options, ["layout"]);
		opt.container = $(opt.container);
		WIN.extend(opt.layout, options.layout);
		
		return opt;
	};	
  this._createBar = function(){
		var layout = this.layout;
		var opt = WIN.extend(opt, {
				container    : this.barWrapEle,
				layout       : {
					height     : parseInt(layout.height) - parseInt(layout.headHeight),
					width      : "100%"
				},
			  scrollArrows : this.scrollArrows
			});
		var bar = this.bar = new GUI.VToolBarBase();
		bar.initScorllArrowsStyle = this._setScrollArrowsStyle;
		this.bar.initialize(opt);
		if(BROWSER.IEversion == 7){//fix unknown bug under ie7 
			bar.sizeObserver.remove(bar.autoDisplayScrollArrows);
			bar.autoDisplayScrollArrowsIE7 = function(type, s){//fix ie7 bug
				if(!bar.scrollArrows)return;
				var type = bar.layout.isVertical ? "height" : "width" ;
				var overflow = bar.layout.itemsScrollSize > parseInt(bar.ele.style[type]);
				if(overflow){
					bar.showScrollArrows();
				}
				else{
					bar.hideScrollArrows();
					bar.scrollToHome();
				}
			};
			bar.sizeObserver.add(bar.autoDisplayScrollArrowsIE7);
		}
	};
	this.addItem = function(name, title, icon, cmdText){
		var bar = this.bar;
		if(!bar)return false;
		bar.addMenuItem(name, title, icon, cmdText);
	};
  this.onBuild = function(){
		var head = this.head = this._createHead();
    if(head && WIN.isElement(head.ele))this.ele.insertBefore(head.ele, this.ele.firstChild);
	};
  this.setHeight = function(h){
		if(!h)return;		
		h = parseInt(h);
		this.ele.style.height = EL.parseUnit(h);
		if(this.bar)this.bar.setHeight(h - parseInt(this.layout.headHeight));
	};
	this._createHead = function(){
		var layout = this.layout;
		var btn = new GUI.IconButton();
		btn.initialize({
      hasSplit : false,
			layout :{
				textLineHeight : layout.headHeight,
				height  : layout.headHeight,
				width   :"auto"
			},
			title  : this.headText
		});
		btn.ele.className += " " + layout.bgImg_head_css;
		return btn;
	};
};
WIN.extendClass(GUI.VerticalMenu, GUI.MenuBase);
