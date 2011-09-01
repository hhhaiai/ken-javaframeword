/***************************************************************
horizontalmenu.js
defined GUI.HorizontalMenu module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.menu.horizontalmenu");
//require resource
require("app.gui.engin");
require("app.gui.btn.iconbutton");
require("app.gui.bar.toolbar");
require("app.gui.menu.menubase");

GUI.HorizontalMenu = function(){
  GUI.HorizontalMenu.superClass.apply(this);
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
			barLayout      : {
				itemWidth     : 58,
				itemHeight    : 58,
				itembgImg_css : "standard_toolbar_iconbtn_bg",
				splitItembgImg_css : "standard_toolbar_iconbtn_bg_split",
				itemSpacing   : 10,
				height        : "100%",
				width         : "100%"
			},
			layout         : {
				scrollArrowsCss   : ["gui_horizontalmenu_arrow_left","gui_horizontalmenu_arrow_right"],
				scrollArrowsWidth : 16,
				scrollArrowsHeight: 16,
				//width             : 400,
				//height            : 60,defined in wrapCss
				wrapCss           : "gui_horizontalmenu_wrap",
				posWrapCss        : "gui_horizontalmenu_pos_wrap",
				barWrapCss        : "gui_horizontalmenu_bar_wrap",
				unknown : null
			},
			unknown : null			
		}, options, ["layout"]);
		opt.container = $(opt.container);
		WIN.extend(opt.layout, options.layout);
		
		return opt;
	};	
  this._createBar = function(){
		var opt = WIN.extend(opt, {
				container    : this.barWrapEle,
				layout       : this.barLayout,
			  scrollArrows : this.scrollArrows
			});
		this.bar = new GUI.ToolBar();
		this.bar.initScorllArrowsStyle = this._setScrollArrowsStyle;
		this.bar.initialize(opt);
	};
  this.addItem = function(name, title, icon, cmdText, splitCmdText){
		var bar = this.bar, layout = bar.layout;
		if(!(name || bar))return false;
		var bgImg_css = splitCmdText ? layout.splitItembgImg_css : layout.itembgImg_css ;
		var opt = {
			title   : title,
			iconUrl : icon,
			layout : {
				bgImg_css  : bgImg_css,
				bgPos_over : 0,
				bgPos_down : 0,
				styleNormal: {
					filter: "Alpha(opacity:100)",
					opacity: 100,
					backgroundPosition: "-58px -58px"
				},
				styleDisabled  : {
					filter: "Alpha(opacity:30)",
					opacity: 30,
					backgroundPosition: "-58px -58px"
				},
				width : layout.itemWidth,
				height: layout.itemHeight
			},
			unknown: null
		};
		
		if(splitCmdText){
			WIN.extend(opt,{
				hasSplit : true,
				splitCommand : Function.curry(this.executeCmd, splitCmdText)
			});
		}
		
		var item = new GUI.IconButton();
		item.initialize(opt);
		item.addCommand( Function.curry(this.executeCmd, cmdText) );
		
		return bar.addItem(name, item);
  };
	this.loadItemsData = function(data){
		var _this = this;
		function parse(i){
			if(WIN.isArray(i))_this.addItem(i[0], i[1], i[2], i[3], i[4]);
		}
		Array.each(parse, data);
	};
	this.executeCmd = function(cmd){
		try{eval(cmd);}catch(e){}
	};
};
WIN.extendClass(GUI.HorizontalMenu, GUI.MenuBase);
