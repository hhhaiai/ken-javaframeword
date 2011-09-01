/***************************************************************
iconbutton.js
create iconbutton gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.btn.iconbutton");
//require resource
require("app.gui.engin");
require("app.gui.btn.buttonbase");
require("lib.evt.engin");

/*
CLASS:
  GUI.IconButton 
SUPERCLASS:
  GUI.ButtonBase
DES:
  icon button is the button whose width and height is stastic.So we just need to appoint a bg img to display different button status.
PROPERTY:
  {HTMLElement} ele
    the button dom reference
  {HTMLElement} iconEle
    the icon dom reference
  {HTMLElement} splitEle
    the split dom reference
    
METHOD:
  {this} initialize({object} options)
	{void} handleOptions()
  {void} _buildView()
  {void} setBtnItemsStyle({HTMLElement} btn, {object} style)
  {returntype} setIcon({string} iconUrl)
*/
GUI.IconButton = function(){
  GUI.IconButton.superClass.apply(this);  
  /*
  ():
    {this} initialize({object} options)
  DES:
    initialize layout options,and other options.
  ARG:
    {object} options
      default value:
			{
				container  : document.body,// HTMLElement | id
				hasSplit   : true,
				iconUrl    : "",			//button icon background image url
				title      : "",
				tip        : "",
				layout     : {
					bgImg_css      : "gui_iconbtn_wrap_img",//button background-image css;
					bgImg_split_css: "gui_iconbtn_split_img",//split background-image css;
					width          : 80,
					height         : 80
				},
				unknown : null
			}
  */
  this.initialize = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
      container  : document.body,
			splitCommand: null,
      iconUrl    : "",
      title      : "",
      tip        : "",
			layout     : {
				bgImg_css      : "",
				bgImg_split_css: "gui_iconbtn_split_img",
				text_css       : "gui_iconbtn_text"
			},
			unknown : null
			}, options, ["layout"]);
		WIN.extend(opt.layout, options.layout);
		
    GUI.IconButton.$initialize.call(this, opt);
    return this;
  };
	/*
	():
		{void} handleOptions()
	DES:
		handle Options
	*/
	this.handleOptions = function(options){
		GUI.IconButton.$handleOptions.call(this, options);
		var layout = options.layout;
    if(!WIN.isDefined(layout.textLineHeight))layout.textLineHeight = 1.7 * parseInt(layout.height);
		if(!options.tip)options.tip = options.title;
		options.container = $(options.container);
	};
  /*
  ():
    {void} _buildView()
  DES:
    build button view structure.
  */
  this._buildView = function(){
    var stl = this.layout, marginTop, wrap, icon;
    wrap = this.ele = EL.c({
        className : "gui_iconbtn_wrap " + stl.bgImg_css,
        btnStatus : "normal",
        title     : this.tip
      },{
        width     : EL.parseUnit(stl.width),
        height    : EL.parseUnit(stl.height)
      });
    
    if(this.hasSplit){//its style'float is right,so it should be append before icon
      var splitEle = this.splitEle = EL.c({
				className : "gui_iconbtn_split " + stl.bgImg_split_css  
			});
			splitEle.onclick = splitEle.ondblclick = EVT.cancelB;//cancel btn command
			splitEle.onmousedown = this.setSplitCommand;
      wrap.appendChild(this.splitEle);
    }
    
    icon = this.iconEle = EL.c({
        className : "gui_iconbtn_icon"
      },{
        backgroundImage: "url(" + this.iconUrl + ")"
      });
		
		if(this.title){
			this.titleEle = EL.c({
				className : stl.text_css,
				innerHTML : this.title
			},{
				lineHeight: EL.parseUnit(stl.textLineHeight)
			});
			icon.appendChild(this.titleEle);
		}
    wrap.appendChild(icon);
    
    if(WIN.isElement(this.container))this.container.appendChild(wrap);
  };  
  /*
  ():
    {void} setBtnItemsStyle({HTMLElement} btn, {object} style)
  DES:
    set Btn Items Style.
  */
  this.setBtnItemsStyle = function(btn, style){
    EL.setStyle(btn, style);
  };
	this.setSplitCommand = Function.bind(function(){
		// ? check btnStatus here...
		//onmousedown,note:we havent canceled bubble here so that we can chg btn;
		if(WIN.isFunction(this.splitCommand)){
			this.splitCommand();
		}
		else if(WIN.isString(this.splitCommand)){
			eval(this.splitCommand);
		}
	}, this);
  /*
  ():
    {void} setIcon({string} iconUrl)
  DES:
    set a new icon for iconbutton.
  */
  this.setIcon = function(iconUrl){
    if(WIN.isElement(this.iconEle)){
			this.iconEle.backgroundImage = "url(" + iconUrl + ")";
			this.iconUrl = iconUrl;
		}
  };
  /*
  ():
    {void} setTitle({string} title, {string} tip)
  DES:
    set button title and tip text.
  */
  this.setTitle = function(title, tip){
    if(WIN.isElement(this.iconEle)){
			this.titleEle.innerHTML = title;
			this.title = title;
			
      if(WIN.isString(tip))this.tip = tip;
			else this.tip = title;
			
			this.ele.title = this.tip;
		}
  };
};
WIN.extendClass(GUI.IconButton, GUI.ButtonBase);
