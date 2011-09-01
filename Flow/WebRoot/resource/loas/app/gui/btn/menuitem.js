/***************************************************************
menuitem.js
create menu item gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.btn.menuitem");
//require resource
require("app.gui.btn.splitbuttonbase");

/*
CLASS:
  GUI.MenuItem 
SUPERCLASS:
  GUI.SplitButtonBase
DES:
  MenuItem: item for menu;
METHOD:
  {this} initialize({object} options, {object} layoutOpt)
*/
GUI.MenuItem = function(){
  GUI.MenuItem.superClass.apply(this);
	/*
	():
    {this} initialize({object} options)
	ARG:
    {object} options
      default value:
        {
					hasSplit : true,
					layout     : {
						bgImg_split_css: "gui_btn_split_menuitem_img",
						width          : 100,
						height         : 25,
						splitWidth     : 8
					}
        }
	*/
	this.initialize = function(options){
    var opt = WIN.extendExclude({
			hasSplit : true,
			layout     : {
				bgImg_split_css: "gui_btn_split_menuitem_img",
				width          : 100,
				height         : 25,
				splitWidth     : 15
			},
			unknown : null
			}, options, ["layout"]);
		WIN.extend(opt.layout, options.layout);		
		
		GUI.MenuItem.$initialize.call(this, opt);
		
		if(opt.hasSplit) this.appendSplit();
    return this;
  };
	this.appendSplit = function(){
		this.splitEle = EL.c({
			className : "gui_btn_split_menuitem " + this.layout.bgImg_split_css	
		});
		GUI.MenuItem.$appendSplit.call(this);
	};
};
WIN.extendClass(GUI.MenuItem, GUI.SplitButtonBase);
