/***************************************************************
tabbarmgr.js
defined GUI.TabBarMgr module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.menu.tabbarmgr");
//require resource
require("app.gui.engin");
require("app.gui.menu.menubase");
require("app.gui.bar.tabbarbase");

GUI.TabBarMgr = function(){
  GUI.TabBarMgr.superClass.apply(this);
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
			barOptions     : {
				
			},
			layout         : {
				scrollArrowsCss: ["gui_tabbarmgr_arrow_left", 
													"gui_tabbarmgr_arrow_right"],
				scrollArrowsWidth : 14,
				scrollArrowsHeight: 14,
				wrapCss        : "gui_tabbarmgr_wrap",
				posWrapCss     : "gui_tabbarmgr_pos_wrap",
				barWrapCss     : "gui_tabbarmgr_bar_wrap",
				unknown : null
			},
			unknown : null			
		}, options, ["layout"]);
		opt.container = $(opt.container);
		WIN.extend(opt.layout, options.layout);
		
		return opt;
	};	
  this._createBar = function(){
		var opt = this.barOptions;
		WIN.extend(opt, {
				container    : this.barWrapEle,
			  scrollArrows : this.scrollArrows
			});
		this.bar = new GUI.TabBarBase();
		this.bar.initScorllArrowsStyle = this._setScrollArrowsStyle;
		this.bar.initialize(opt);
	};
	this.addItem = function(name, title){
		var bar = this.bar;
		if(!bar)return false;
		bar.addTab(name, title, icon);
	};
};
WIN.extendClass(GUI.TabBarMgr, GUI.MenuBase);
