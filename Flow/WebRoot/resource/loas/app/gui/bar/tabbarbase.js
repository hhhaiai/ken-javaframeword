/***************************************************************
tabbarbase.js
defined GUI.TabBarBase module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.bar.tabbarbase");
//require resource
require("app.gui.engin");
require("app.gui.btn.tab");
require("app.gui.bar.toolbar");
require("lib.core.util.singlelast");
require("lib.evt.engin");

GUI.TabBarBase = function(){
  GUI.TabBarBase.superClass.apply(this);
	var count = 0;
  /*
  ():
    ?{this} initialize({object} options)
  DES:
    description
  ARG:
    {object} options
  */
  this.initialize = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
      container     : document.body,
			activeTabStyle:{
				height    : 25,//active tab is higher than normal
				marginTop : "-1px",
				color     : "#333",
				fontWeight: "bold"
			},
			normalTabStyle:{
				height    : 24,
				marginTop : 0,
				fontWeight: ""
			},
      layout        : {
        defaultTabWidth   : 150,
				maxNumOfTab   : 20,//
				minWidthOfTab : 50,//5*2 + icon width(16)
				barPaddingTop : 6,
				//tabWidthStyle : "auto",//opt: "auto(auto-fit)","fixed" //not surport in this version
				height  :32,
				width   : "100%",
				itemSpacing  : 1,
				unkonw  :null
      },
			unkonw :null
		}, options, ["layout", "activeTabStyle, normalTabStyle"]);
    WIN.extend(opt.layout, options.layout);
    WIN.extend(opt.activeTabStyle, options.activeTabStyle);
    WIN.extend(opt.normalTabStyle, options.normalTabStyle);
		
		this.activeTabSL = new WIN.SingleLast();
		this.activeTabSL.initialize(this.initActiveTab, this.restoreActiveTab);

    GUI.TabBarBase.$initialize.call(this, opt);
		this.itemsObserver.add(this.updateItemsWidth);
		this.sizeObserver.add(this.updateItemsWidth);
    return this;
  };
	
	this.initActiveTab = Function.bind(function(item){
		if(!item)return;
		item.focus();
		var style = this.activeTabStyle;
		item.setHeight(style.height);		
		item.showCloseIcon();	
		EL.setStyle(item.ele,style);
	}, this);	
	
	this.restoreActiveTab = Function.bind(function(item){
		if(!item)return;
		item.blur();
		var style = this.normalTabStyle;
		item.setHeight(style.height);	
		item.hideCloseIcon();	
		EL.setStyle(item.ele,style);
	}, this);
	
	this.addActive = function(name, title, options){
		if(!this.addTab(name, title, options))return false;
		return this.setActive(name);
	};
	
  this.addTab = function(name, title, options){
		if(!name)return null;
		var item = new GUI.Tab().initialize({
      hasCloseIcon : true,
      layout : {
				height : this.normalTabStyle.height,
				styleNormal    : {backgroundPosition: "0 0%"},
				styleFocused   : {backgroundPosition: "0 -72px"},
				styleDisabled  : {backgroundPosition: "0 -48px"},
				width  : this.layout.defaultTabWidth
      },
			title  : title
      });
		//item.addCommand(this.hndOC_tab);//no need to control (setActive)  here;
		if(this.addItem(name, item)){
			count += 1;
			return item;
		}
		return null;
  };
  this.removeTab = function(name){
		if(!this.removeItem(name))return false;
		count -= 1;
		return true;
  };
  this.getCount = function(){
		return count;
  };
	this.updateItemsWidth = Function.bind(function(){
		var barWidth = this.ele.scrollWidth;
		var container = this.itemContainer;
		var itemEle = container.firstChild;
		var itemsNum = container.childNodes.length;
		var layout = this.layout;
		if(itemsNum < 1)return;
		var _w = parseInt(itemEle.style.width);//item original width
			
		var w_ = (barWidth - (itemsNum * layout.itemSpacing))/itemsNum, items = this.items;
		if(w_ < layout.minWidthOfTab)w_ = layout.minWidthOfTab;
		else if(w_ > layout.defaultTabWidth )w_ = layout.defaultTabWidth;
		for(var i in items){
			items[i].setWidth(w_);
		}
		this.updateItemsScrollSize();
		this.autoDisplayScrollArrows();
	},this);
	/*no need to control (setActive) here;
		this.hndOC_tab = Function.bind(function(evt){// ? check btn enable here ...
			var name = this.getTbItemName(evt)
			if(name)this.setActive(name);
		}, this);
	*/
	
	this.getTbItemName = function(evt){
		evt = EVT.Event.fix(evt);
		var target = evt.target;
		var name;
		var ele = EL.getParentByMethod(target,function(ele){
																						 name = ele.tbItemName;
																						 return !!(name);});
		return name;
	};
  this.setActive = function(name){
		if(!name)return false;
		var item = this.getItem(name);
		if(!item)return false;
		this.activeTabSL.set(item);
		
		return this.scrollItemToView(name);
  };
	this.scrollItemToView = function(name){
		if(!name)return false;
		var item = this.getItem(name);
		if(!item)return false;
		var ele = item.ele;
		var itemContainer = this.itemContainer;
		var cLeft = parseInt(itemContainer.style.left), offsetLeft = ele.offsetLeft,
		    wrapWidth = this.ele.scrollWidth;
		var scrollWidth = ele.scrollWidth, p1 = (offsetLeft + cLeft), p2 = scrollWidth + p1;
		
		if( p2 > wrapWidth){
			this.scrollForward( wrapWidth - p2); 
		}
		else if(p1 < 0){
			this.scrollBack(Math.abs(p1));
		}
		return true;
	};
	this.initTabBarBasePaddingTop = function(){
		this.itemContainer.style.paddingTop = EL.parseUnit(this.layout.barPaddingTop);
	};
  this.onBuild = function(){
		this.initTabBarBasePaddingTop();
	};
};
WIN.extendClass(GUI.TabBarBase, GUI.ToolBar);

