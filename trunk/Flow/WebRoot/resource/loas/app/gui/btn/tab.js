/***************************************************************
splitbuttonbase.js
create tab gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.btn.tab");
//require resource
require("app.gui.btn.splitbuttonbase");

/*
CLASS:
  GUI.Tab 
SUPERCLASS:
  GUI.SplitButtonBase
DES:
  Tab
METHOD:
  {this} initialize({object} options)
  {void} hideCloseIcon()
  {void} showCloseIcon()
*/
GUI.Tab = function(){
  GUI.Tab.superClass.apply(this);
  /*
  ():
    {this} initialize({object} options)
  ARG:
    {object} options
      default value:
      {
        hasCloseIcon : true,
        layout       : {
          width         : 100,
          height        : 25,
          splitWidth    : 16 //we need this to adjust TextWrap's paddingRight
        },
        unknown : null
      }
  */
  this.initialize = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
      hasCloseIcon : true,
			autoFitWidth : false,
      layout       : {
        height        : 25,
        width         : 100,
        splitWidth    : 12,
        unknown : null
      },
      unknown : null
		}, options, ["layout"]);
    WIN.extend(opt.layout, options.layout);
		
    GUI.Tab.$initialize.call(this, opt);
		
    if(opt.hasCloseIcon) this.appendSplit();
    return this;
  };
	this.appendSplit = function(){
		this.splitEle = EL.c({
				className : "gui_btn_close_icon"
			},
			null,
			{
				mouseover : this.hndSplitOnMouseover,
				mouseout : this.hndSplitOnMouseout
			}
		);
		GUI.Tab.$appendSplit.call(this);
	};
  /*
  ():
    {void} hideCloseIcon()
  DES:
    hide close icon
  */
  this.hideCloseIcon = function(){
    var ele = this.splitEle;
    if(!WIN.isElement(ele))return;
    var s = ele.style;
    if(s.display == "none")return;
    s.display = "none";
    this._adjustTextWrapPaddingRight();
  };
  /*
  ():
    {void} showCloseIcon()
  DES:
    show  close icon
  */
  this.showCloseIcon = function(){
    var ele = this.splitEle;
    if(!WIN.isElement(ele))return;
    var s = ele.style;
    if(s.display != "none")return;
    s.display = "";
    this._adjustTextWrapPaddingRight(true);
  };
  this.hndSplitOnMouseover = Function.curry(function(obj){
	  //check enable here
		this.style.backgroundPosition = "-9px 60%";
	}, this);	
  this.hndSplitOnMouseout = Function.curry(function(obj){
	  //check enable here
		this.style.backgroundPosition = "0 60%";
	}, this);	
};
WIN.extendClass(GUI.Tab, GUI.SplitButtonBase);
