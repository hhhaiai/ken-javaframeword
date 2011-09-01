/* popupMenuItem.js
*/
require.provide("app.gui.btn.popupMenuItem");
require("lib.evt.engin");
require("app.gui.btn.menuitem");
require("app.gui.btn.systemButtonMgr");

GUI.PopupMenuItem = WIN.createClass(
  function(){
		this.initialize = function(type, cmd, text, tip, hasSubMenu, options, pathMapper){
			var typeInfo = WIN.extend({}, GUI.systemButtonMgr.getTypeInfo(type, pathMapper));
			var opt = WIN.extend(typeInfo, {
				hasSplit : hasSubMenu,
				title : text,
				tip : tip,
				cmd : cmd,
				layout : GUI.PopupMenuItem.defaultLayout
			});
			
			if(options){
				WIN.extendExclude(opt, options, ["layout"]);
				WIN.extend(opt.layout, options.layout);
			}
			
			if(!String.notEmpty(opt.iconUrl))opt.iconUrl = "blank.gif";//force to has icon
			GUI.PopupMenuItem.$initialize.call(this, opt);
			
			this.addCommand(Function.bind(this.hndClick, this));
			this.addCommand(Function.bind(this.hndMouseover, this), "mouseover");
			this.addCommand(Function.bind(this.hndContextmenu, this), "contextmenu");
			
			return this;
		};
	},
	{
		/*
		cfg:
			{boolean} clickToHideAll
		DES:
			hide all onclick(defaults to true)
		*/
		clickToHideAll : true,
		/*
		cfg:
			{boolean} executeCmdOncontextmenu
		DES:
			execute command oncontextmenu(defaults to true)
		*/
		executeCmdOncontextmenu : true,
		/*
		():
			{void} hndContextmenu() || hndMouseover() || hndClick()
		DES:
			event handlers
		*/
		hndContextmenu : function(){
			var menu = this.parentMenu ;
			if(menu instanceof GUI.PopupMenu){
				try{
					if(this.executeCmdOncontextmenu && WIN.isFunction(this.cmd))this.cmd();
				}catch(e){}
				this.hideAll();
			}
		},
		hndMouseover : function(){
			this.parentMenu.hideLastSubMenu();
			this.showSubMenu();
		},
		hndClick : function(){
			if(this.clickToHideAll)this.hideAll();
		},
		setStyleByMouseType : function(type){
			if(!WIN.isString(type))type = "";
			var style, layout = this.layout;
			switch (type.toLowerCase()){
				case "down" : 
				  style = {backgroundPosition: "0% " + layout.bgPos_down};
					break;
				case "over" : 
				  style = {backgroundPosition: "0% " + layout.bgPos_over};
					break;
				default : style = layout.styleNormal;//mouseout
			}
			this.hndSetNormalStyle(this.ele, style);
		},
		setSubMenu : function(menu){
			this.subMenu = menu;
			menu.parentMenuItem = this;
			var ele = this.ele, menuEle = menu.ele;
			this.clickToHideAll = false;
		},
		/*
		():
			{void} showSubMenu()
		DES:
			showSubMenu if it has;
		*/
		showSubMenu : function(){
			if(!this.disabled && this.subMenu){
				this.parentMenu.showItemSubMenu(this);
			}
		},
		/*
		():
			{void} hideSubMenu()
		DES:
			hideSubMenu if it has;
		*/
		hideSubMenu : function(){
			if(this.subMenu){
				this.subMenu.hideAll();
			}
		},
		/*
		():
			{void} hideAll()
		DES:
			hideAll onClick;
		*/
		hideAll : function(){
			var menu = this.parentMenu;
			while(menu.parentMenuItem){//get root
				menu = menu.parentMenuItem.parentMenu;
			}
			if(menu instanceof GUI.PopupMenu){
				menu.hideAll();
			}
		},
		unknown : null
	},
	GUI.MenuItem
);
GUI.PopupMenuItem.defaultLayout = WIN.extendExclude({
			iconWidth : 25,
			width : "100%",
			bgImg_split_css: "gui_btn_split_menuitem_img",
			unknown : null			
	}, 
	GUI.systemButtonMgr.layout, 
	["width", "iconWidth"]
);

/*			this.ele._this = this;
			EVT.observe(window, "unload", Function.bind(function(){
			  try{
					ele._this = null;
					this.ele = null;
				}catch(e){}
			}, this));
			
*/