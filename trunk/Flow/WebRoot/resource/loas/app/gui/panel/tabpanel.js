/***************************************************************
tabpanel.js
defined GUI.TabPanel module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.panel.tabpanel");
//require resource
require("app.gui.engin");
require("app.gui.panel.panel");
require("app.gui.menu.tabbarmgr");
require("app.gui.panel.panelbody");
require("lib.core.string.pathMapper");

GUI.TabPanel = function(){
  GUI.TabPanel.superClass.apply(this);
  /*
  ():
    {void} _buildView()
  DES:
    build head dom;
  */
  this._buildView = function(){
		GUI.TabPanel.$_buildView.call(this);
    this.ele.className = "gui_tabpanel_wrap";
		this.ele.onselectstart = function(){return false;};
  };
	this._initTabItem = function(item){
		this._initTabItemStyle(item);
		this._initTabItemCommand(item);
	};
	this._initTabItemStyle = function(item){
		var titleEle = item.titleEle;
		if(WIN.isElement(titleEle)){
			titleEle.style.paddingTop = "2px";
		}
	};
	this._initTabItemCommand = function(item){
		item.addCommand(this.hndOC_tab);
		item.addCommand(this.hndODC_tab, "dblclick");
		this._initTabItemSplitCommand(item);
	};
	this._initTabItemSplitCommand = function(item){
		item.splitEle.onclick = this.hndOC_iconClose;
	};
  
	this.autoWidth = function(){
		this.head.bar.onResize();
	};
  this.addTab = function(name, title, content){
		try{
			var tabItem = this.head.bar.addTab(name, title);
			if(!tabItem instanceof GUI.Tab)return null;
			this._initTabItem(tabItem);
			if(!this.body.addBody(name, content))throw {message: "Can't add body!"};
			return tabItem;
		}catch(e){return null;}
  };
  this.removeTab = function(name){
		try{
			if(!this.head.bar.removeTab(name))return false;
			if(!this.body.removeItem(name))throw {message: "Can't remove body!"};
		}catch(e){return false}
  };
	
	this.hndOC_tab = Function.bind(function(evt){
		var name = this.head.bar.getTbItemName(evt);
		if(name)this.setActive(name);
	}, this);
	this.hndODC_tab = this.hndOC_iconClose = Function.bind(function(evt){
		var bar = this.head.bar;
		var name = bar.getTbItemName(evt);
		this.close(name);
	}, this);
	
	this._getSiblingName = function(name, isNext){
		try{
			var item = this.getTabItem(name),ele = item.ele;
			var node = isNext ? ele.previousSibling : ele.nextSibling;
			return node.tbItemName;
		}catch(e){}
	};
	this.getNext = function(name){
		return this._getSiblingName(name, true);
	};
	this.getNextActive = function(name){
		var nextActive = this.getPrevious(name);
		if(!nextActive)nextActive = this.getNext(name);
		return nextActive;
	};
	this.getPrevious = function(name){
		return this._getSiblingName(name);
	};
	this.getTabItem = function(name){
		try{return this.head.bar.getItem(name);}catch(e){return null;}
	};
	this.getItemNameList = function(){
		try{return this.head.bar.getItemNameList();}catch(e){return null;}
	};
	this.getCount = function(){
		try{return this.head.bar.getCount();}catch(e){return -1;}
	};
	
  this.setActive = function(name){
		if(!String.notEmpty(name))return false;
		name = name.toLowerCase();
		try{
			if(this.activeItemName == name)return true;
			var bar = this.head.bar, tab = bar.getItem(name);
			
			if(!bar)return false;
			if(!bar.setActive(name))return false;
			if(!this.body.setActive(name))return false;
			if(this.getCount() == 1)this.onCountEqualOne(tab);
			this.activeItemName = name;
			this.onActiveChange(name);
			return true;
		}catch(e){	return false;}
  };
	this.setActiveToNext = function(name){
		name = this.getNextActive(name);
		return this.setActive(name);
	};
	this.setTitle = function(name, title){
		if(String.notEmpty(name) && String.notEmpty(title)){
			var item = this.head.bar.getItem(name);
			if(item instanceof GUI.Tab)item.setTitle(title);
		}
	};
	
	this.canClose = function(name){
		//check enable
		return (this.getCount() > 0  && !this.locked);
	};
	this.isActive = function(name){
		//check enable
		if(String.notEmpty(name))	return (this.activeItemName == name.toLowerCase());
	};
	
	this.open = function(url, name, options){
		if(!options)options = {};
		if(!String.notEmpty(name))name = "GUI.TabPanel_" + new Date().getTime() + "";
		
		if(this.getTabItem(name)){//exist same name
			this.setActive(name);
			try{
				if(window.frames[name.toLowerCase()].location.href != String.mapPath(url))
				  this.body.setContent(name, url);
			}catch(e){}
			return name;
		}
		else{
			var tab = this.addTab(name, options.title, url);
			if(tab){
				this.onAdd(name, options.title, url);
				if(options.active)this.setActive(name);
				if(this.getCount() == 1)this.onCountEqualOne(tab);
				return name;
			}
		}
	};
	this.close = function(name){
		if(String.notEmpty(name) && this.canClose(name)){
			var next = this.getNextActive(name), isActive = this.isActive(name);
			this.removeTab(name);
			if(isActive) this.setActive(next);
			this.onClose(name);
			return true;
		}
	};
	this.onActiveChangeObserver = new WIN.Observer();
	this.onActiveChange = function(name){
		this.onActiveChangeObserver.execute(name);
	};
	this.onAddObserver = new WIN.Observer();
	this.onAdd = function(name, title, url){
		this.onAddObserver.execute(name, title, url);
	};
	this.onCountEqualOne = function(tab){
		if(!tab)tab = this.head.bar.getItem(this.activeItemName);
		if(tab && tab.hideCloseIcon)tab.hideCloseIcon();
	};
	this.onCountEqualZero = function(){
		this.activeItemName = undefined;
	};
	this.onCloseObserver = new WIN.Observer();
	this.onClose = function(name){
		var count = this.getCount();
		if(count == 1)this.onCountEqualOne();
		else if(count==0)this.onCountEqualZero();
		this.onCloseObserver.execute(name);
	};
	this.closeAll = function(){
		var list = this.getItemNameList(), _this = this;
		Array.each(function(i){_this.close(i);}, list);
	};
};
WIN.extendClass(GUI.TabPanel, GUI.Panel);
