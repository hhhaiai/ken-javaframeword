/* popupMenu.js
define GUI.PopupMenu model
*/
require.provide("app.gui.menu.popupMenu");
require("app.gui.engin");
require("app.gui.btn.menuitem");
require("app.gui.btn.popupMenuItem");
require("lib.dom.layout.position");
require("lib.evt.engin");
/*
CLASS:
  GUI.PopupMenu
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.PopupMenu = WIN.createClass(
  function(){
    this.items = {};
  },{
    /*
    cfg:
      {HTMLElement | id} showTrigger
    DES:
      event target ele to show menu onContextMenu;
    */
    showTrigger : document,
    /*
    cfg:
      {HTMLElement | id} showTrigger
    DES:
      event target ele to hide menu onmousedown;
    */
		hideTrigger : document,
    /*
    cfg:
      {string || int} menuWidth
    DES:
      menu width(defaults to 200) ;
    */
    menuWidth : 200,
    /*
    cfg:
      {string} eleCss
    DES:
      css for this.ele
    */
    eleCss : "gui_popupMenu",
    /*
    cfg:
      {string} eleCss
    DES:
      css for items separator
    */
    separatorCss : "sep",
    
    initialize : function(options){
      WIN.extend(this, options);
      this.build(true);
			this.showing = false;
      EVT.observe(window, "unload", Function.bind(this.dispose, this));
      return this;
    },
    dispose : function(){
      try{
        var item, items = this.items;
        for(var i in items){
          item = items[i];
          if(item.subMenu instanceof GUI.PopupMenu)item.subMenu.dispose();
          delete item.subMenu;
          delete item.parentMenu;
        }
        this.ele._this = null;
        this.ele = null;
      }catch(e){};
    },
    build : function(fireOnBuild){
      this.ele = EL.c(
        {
          className : this.eleCss
        },{
          display : "none",
          width : EL.parseUnit(this.menuWidth)
        },{
          mousedown : EVT.cancelBnD,
					mouseout : Function.bind(this.hndMouseout, this),
          contextmenu : EVT.cancelBnD
        }
      );
			if(BROWSER.IE)this.ele.onselectstart = function(){return false;};
      this.ele._this = this;
      GUI.appendToOnReady.call(this);
      if(fireOnBuild)this.onBuild();
    },
    onBuild : Function.empty,
		hndMouseout : function(){  
			if(this._lastSubMenuShowedItem){				
				this._lastSubMenuShowedItem.setStyleByMouseType("over");
			}
		},
    addItem : function(name, menuItem, index){
      if(!menuItem instanceof GUI.PopupMenuItem || !String.notEmpty(name))return false;
      
      var itemEle = menuItem.ele, name = name.toLowerCase();
      if(!WIN.isElement(itemEle))return false;
      
      var ele = this.ele, targetEle = ele.childNodes[index];
      
      if(WIN.isElement(targetEle))ele.insertBefore(itemEle, targetEle);
      else ele.appendChild(itemEle);
      
      this.initItemOnAdd(name, menuItem);
      this.items[name] = menuItem;
      this.onItemsChange();
      
      return true;
    },
    initItemOnAdd : function(name, item){
      //item.addCommand(Function.bind(this.showItemSubMenu, this, item), "mouseover");
      //item.addCommand(Function.bind(this.hide, this));
      item.parentMenu = this;
    },
    onItemsChange : Function.empty,
    /*
    ():
      {buttonBase | null} getItem({string} name)
    DES:
      get item by name
    */
    getItem : function(name){
      try{return this.items[name.toLowerCase()];}catch(e){return null;}
    },
    addSeparator : function(index){
      var sepEle = EL.c({
        className : this.separatorCss
      });
      var ele = this.ele, targetEle = ele.childNodes[index];
      
      if(WIN.isElement(targetEle))ele.insertBefore(sepEle, targetEle);
      else ele.appendChild(sepEle);
    },
    removeSeparator : function(index){
      var ele = this.ele, targetEle = ele.childNodes[index];      
      if(WIN.isElement(targetEle))ele.removeChild(targetEle);
    },
    show : function(){
			if(this.showing)return ;
			
			GUI.PopupMenu.setMenu(this);
			
      EL.fixElementPosition(this.ele, true);
      this.ele.style.display = "block";
			this.showing = true;
    },
		showAt : function(x, y){
			EL.setStyle(this.ele, {
			  left : EL.parseUnit(x),
				top : EL.parseUnit(y)
			});
			this.show();
		},
		showAtEvent : function(evt){
			var XY = EVT.pointerXY(evt);
			var ele = this.ele,
					s = ele.style;
			XY.width = parseInt(s.width);
			XY.height = parseInt(s.height);
			EL.fixBoxPosition(XY, true);
			var pFix = BROWSER.IE ? 2 : 0
			EL.setStyle(ele, {
				left : EL.parseUnit(XY.x - pFix),
				top : EL.parseUnit(XY.y - pFix)
			});
			
			this.show();
			EVT.cancelBnD(evt);
		},
    hide : function(){
      this.ele.style.display = "none";
			this.showing = false;
    },
		hideLastSubMenu : function(){
			if(this._lastSubMenuShowedItem){
				this._lastSubMenuShowedItem.subMenu.hideAll();
				this._lastSubMenuShowedItem = null;
			}
		},
		hideAll : function(){
			this.hide();
			this.hideLastSubMenu();
		},
		showItemSubMenu : function(item){
			if(String.notEmpty(item))item = this.getItem(item);
			if(item instanceof GUI.PopupMenuItem){
				this.hideLastSubMenu();
				var menu = item.subMenu;
				if(menu){
					menu.show();
					this._lastSubMenuShowedItem = item;
				}
			}
		},
		toString : function(){return "[object GUI.PopupMenu]";}
  }
);

WIN.extend(GUI.PopupMenu,{
  last : null,
	hideLast : function(){
		var PM = GUI.PopupMenu;
		if(PM.last instanceof PM)PM.last.hideAll();
	},
	setMenu : function(menu){
		var PM = GUI.PopupMenu;
		if(!menu instanceof PM && menu.parentMenuItem) return ;
		PM.hideLast();
		PM.last = menu;
	},
  setContextmenuTrigger : function(popupMenu, showTrigger, hideTrigger){
    if(!popupMenu instanceof GUI.PopupMenu)return ;
		EVT.observe(showTrigger || document, "contextmenu", 
								Function.bind(popupMenu.showAtEvent, popupMenu) );
  },
	create : function(){
		
	}
});
EVT.observe(document, "mousedown", GUI.PopupMenu.hideLast);
EVT.observe(document, "keypress", function(evt){
  evt = EVT.Event.fix(evt);
	if(evt.keyCode == 27) GUI.PopupMenu.hideLast();
});

GUI.SubPopupMenu = WIN.createClass(
  function(){
  },{
    /*
    cfg:
      {string || int} menuWidth
    DES:
      menu width(defaults to 150) ;
    */
    menuWidth : 150,
    show : function(){
      var item = this.parentMenuItem;
      if(!item)return ;
      var ele = item.ele;
			this.fixPosByElement(ele);
      this.ele.style.display = "block";
			item.setStyleByMouseType("over");
    },
		fixPosByElement : function(tarEle){
			if(!WIN.isElement(tarEle))return ;
			function getTop(){
				if(DOC.getClientHeight() - pB > h){
					top = pBox.y;
				}
				else{
					top = pB - box.height;
				}
			}
			var ele = this.ele;
			var box = EL.getElementBoxInfo(this.ele), pBox = EL.getElementBoxInfo(tarEle);
			var w = box.width, h = box.height;
			var pR = (pBox.x + pBox.width), pB = (pBox.y + pBox.height);
			var left, top;
			if(DOC.getClientWidth() - pR > w){//show at right side
				left = pR;
				getTop();
			}
			else{//show at left side
				left = pBox.x - box.width;
				getTop();
			}
			EL.setStyle(ele, {
			  left : EL.parseUnit(left),
				top : EL.parseUnit(top)
			});
		},
		hide : function(){
			GUI.SubPopupMenu.$hide.call(this);
			var item = this.parentMenuItem;
			if(!item)return;
			item.setStyleByMouseType();
		},
		toString : function(){return "[object GUI.SubPopupMenu]";}
  },
  GUI.PopupMenu
);
