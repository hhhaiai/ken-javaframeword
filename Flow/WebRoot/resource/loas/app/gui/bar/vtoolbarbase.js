/***************************************************************
vtoolbarbase.js
defined GUI.VToolBarBase module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.bar.vtoolbarbase");
//require resource
require("app.gui.engin");
require("app.gui.btn.iconbutton");
require("app.gui.bar.toolbar");

GUI.VToolBarBase = function(){
  GUI.VToolBarBase.superClass.apply(this);
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
      layout        : {
        itemWidth   : "90%",
        itemHeight  : "60px",
				isVertical   : true,
				itemSpacing  : 10,
				unkonw  :null
      },
			unkonw :null
		}, options, ["layout"]);
    WIN.extend(opt.layout, options.layout);
		
    GUI.VToolBarBase.$initialize.call(this, opt);
    return this;
  };	
	
  this.addMenuItem = function(name, title, icon, cmdText){
		var layout = this.layout;
		var item = new GUI.IconButton();
		//handles for button element events to set button diefferent status style,here we add different css to chg border and padding style, see more in css gui_vtoolbarbase_item_OMO ;
		item.hndOnMouseover = function(){
			this.className += " gui_vtoolbarbase_item_OMO";
		};
		item.hndOnMouseout = function(){
			var css = this.className;
			if(String.contains(css, "gui_vtoolbarbase_item_OMO"))
			  this.className = css.replace(" gui_vtoolbarbase_item_OMO", "");};
		
		item._setDefaultEvents = function(){//setBtnStyleByStatus
			var ele = this.ele;
			if(! WIN.isElement(ele)) return;
			EL.setAttr(ele, {
				onmouseover : this.hndOnMouseover,
				onmouseout  : this.hndOnMouseout
			});
		};
		
		item.initialize({
		  iconUrl: icon,
      hasSplit : false,
			layout : {
				width : layout.itemWidth,
				height: layout.itemHeight
			},
			title  : title
		});
		if(!WIN.isElement(item.ele))return false;
		item.ele.onclick = this.hndOC_item;
		item.ele.cmdText = cmdText;
		item.ele.className += " gui_vtoolbarbase_item_normal"; 
		return this.addItem(name, item);
  };
	this.onBuild = function(){//adjust toolbar ele's style
		this.ele.className += " gui_vtoolbarbase_wrap"; 
		this.itemContainer.style.width = "100%";//important!, itemContainer position is absolute and our iconbutton's width is auto but not stastic, if we dont set itemContainer width to 100% then iconbutton and its inner element style's "center" property wont work;
	};
	this.hndOC_item = function(){
		try{eval(this.cmdText);}catch(e){};//obj this refer to element;
	};
};
WIN.extendClass(GUI.VToolBarBase, GUI.ToolBar);

