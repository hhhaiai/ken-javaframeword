/***************************************************************
button.js
create button gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.btn.button");
//require resource
require("app.gui.engin");
require("app.gui.btn.buttonbase");

/*
CLASS:
  GUI.Button 
SUPERCLASS:
  GUI.ButtonBase
SUBCLASS:
  GUI.SplitButtonBase
DES:
  GUI.Button build the element structure which is always form of three items (left,middle,right).
PROPERTY:
  {HTMLElement} ele
    the button dom reference
  {HTMLElement} iconEle
    the icon dom reference
  {HTMLElement} titleEle
    the title dom reference
  {HTMLElement} textWrapEle
    the text wrapper dom reference
    
METHOD:
  {this} initialize({object} options)
	{void} handleOptions()
  {void} _buildView()
  {void} _createInnerHtml()
  {void} _createWrap()
  {void} _referElements()
  {void} setBtnItemsStyle({HTMLElement} btn, {object} style)
  {void} setIcon({string} iconUrl)
  {void} setTitle({string} title)
  {void} setWidth({ int | string} width)
*/
GUI.Button = function(){
  GUI.Button.superClass.apply(this);
  /*
  ():
    {this} initialize({object} options)
  DES:
    initialize layout options,and other options.
  ARG:
    {object} options
      default value:
			{
				container  : document.body,
				hasIcon    : true,
				hasTitle   : true,
				iconUrl    : "",
				title      : "",
				layout     : {
					width      : 100,
					height     : 25,
					iconWidth  : 16,
					bgImg_l_css: "gui_btn_left_img",
					bgImg_m_css: "gui_btn_text_wrap_img",
					bgImg_r_css: "gui_btn_right_img"
				},
				unknown : null
			}
  */
  this.initialize = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
      container  : null,
      iconUrl    : "",
      title      : "",
			tip        : "",
			autoTip    : true,
			layout     : {
				width      : 100,
				height     : 25,
				iconWidth  : 16,
				bgImg_l_css: "gui_btn_left_img",
				bgImg_m_css: "gui_btn_text_wrap_img",
				bgImg_r_css: "gui_btn_right_img"
			},
			unknown : null
			}, options, ["layout"]);
		WIN.extend(opt.layout, options.layout);
		
    GUI.Button.$initialize.call(this, opt);
		
		if(!String.notEmpty(opt.tip))this.setTitle(this.title);
		if(this.layout.width == "auto")this.autoWidth();
		
    return this;
  };
	/*
	():
		{void} handleOptions()
	DES:
		handle Options
	*/
	this.handleOptions = function(options){
		GUI.Button.$handleOptions.call(this, options);
		if(!options.tip)options.tip = options.title;
    options.container = $(options.container);
	};
  /*
  ():
    {void} _buildView()
  DES:
    build button view structure.Here we use innerHTML to build inner structure.
  */
  this._buildView = function(){
    this._createWrap(this._createInnerHtml());
    this._referElements();
  };
  /*
  ():
    {void} _createInnerHtml()
  DES:
    _create innerHtml
  */
  this._createInnerHtml = function(){
    var stl = this.layout, iconUrl = this.iconUrl, title = this.title;
    var pdl = pdr = title ? 2 : 0;
    var innerHtm  = '<div class="gui_btn_pos_wrap" onselectstart="return false;">'
											+ '<div class="gui_btn_left ' + stl.bgImg_l_css + '"></div>'
                      + '<div class="gui_btn_right ' + stl.bgImg_r_css + '"></div>';
    if(iconUrl){
      innerHtm += '<div class="gui_btn_icon" ' 
                 + 'style=" background-image:url(' + iconUrl + ');">'
               + '</div>';
      pdl += parseInt(stl.iconWidth);
    }
    
    innerHtm += '<div class="gui_btn_text_wrap ' + stl.bgImg_m_css 
                  + '" style="padding-left:' + pdl
									+ 'px; padding-right:' + pdr
									+ 'px;" >';
		innerHtm += '<div class="gui_btn_text" '
										+ 'style="line-height:' + EL.parseUnit(stl.height) + ';">' + title
									+ '</div>';
    innerHtm +=  '</div></div>';
    return innerHtm;
  };
  /*
  ():
    {void} _createWrap()
  DES:
    _create wrapper
  */
  this._createWrap = function(innerHtm){
    var stl = this.layout;
		var wrap = this.ele = this.renderTarget || (EL.c());
		EL.setAttr(wrap, {
      innerHTML : innerHtm,
      btnStatus : "normal",
			title     : this.tip,
      className : "gui_btn_wrap"
    });
		EL.setStyle(wrap, {
      width  : EL.parseUnit(stl.width),
      height : EL.parseUnit(stl.height)
    });
    if(WIN.isElement(this.container))this.container.appendChild(wrap);
  };
  /*
  ():
    {void} _referElements()
  DES:
    because we use innerHTML to create inner element structure,so we need to refer to the dom.
  */
  this._referElements = function(){
    var child, chd = this.ele.firstChild.childNodes, len = chd.length;
    for(var i=0; i< len; i++){
      child = chd[i];
      if(!WIN.isElement(child))continue;
      var css = child.className.toLowerCase();
      if(/gui_btn_text_wrap/.test(css)){
        this.titleEle = child.firstChild;
        this.textWrapEle = child;
      }
      else if(/gui_btn_icon/.test(css))this.iconEle = child;
    }
  };
  /*
  ():
    {void} setBtnItemsStyle({HTMLElement} btn, {object} style)
  DES:
    the button element is form of three items whose className contains "left" or "text_wrap" or "right", so we need to set each item's style.
  */
  this.setBtnItemsStyle = function(btn, style){
    var targets = Array.filter(function(eleItem){
      if(!WIN.isElement(eleItem))return;
      if(/gui_btn_(text_wrap|left|right)/.test(eleItem.className.toLowerCase()))return true;
    }, this.ele.firstChild.childNodes);
    Array.each(function(eleItem){
      EL.setStyle(eleItem, style);
    }, targets);
  };
  /*
  ():
    {void} setIcon({string} iconUrl)
  DES:
    set button icon.
  */
  this.setIcon = function(iconUrl){
		var ele = this.iconEle;
    if(WIN.isElement(ele)){
			ele.style.backgroundImage = "url(" + iconUrl + ")";
			this.iconUrl = iconUrl;
		}
  };
  /*
  ():
    {void} setTitle({string} title)
  DES:
    set button title and set tip by title if autoTip is true.
  */
  this.setTitle = function(title){
    var ele = this.titleEle;
    if(WIN.isElement(ele) && String.notEmpty(title)){
      ele.innerHTML = title;
			this.title = title;
			if(this.autoTip)this.setTip(title);
			
			if(this.layout.width == "auto")this.autoWidth();
    }
  };
  /*
  ():
    {void} setTip({string} tip)
  DES:
    set button tip text.
  */
  this.setTip = function(tip){
    var ele = this.ele;
    if(WIN.isElement(ele) && String.notEmpty(tip)){
			ele.title = tip;
			this.tip = tip;
    }
  };
  /*
  ():
    {void} setHeight({ int | string} height)
  DES:
    set button height.
  */
  this.setHeight = function(height){
    if(WIN.isElement(this.ele)){
			height = parseInt(height) + "px";
			this.ele.style.height = height;
			if(this.title)this.titleEle.style.lineHeight = height;
		}
  };
  /*
  ():
    {int} getHeight()
  DES:
    get button height.
  */
  this.getHeight = function(){
		return parseInt(this.ele.offsetHeight);
  };
  /*
  ():
    {void} setWidth({ int | string} width)
  DES:
    set button width.
  */
  this.setWidth = function(width){
    if(WIN.isElement(this.ele))this.ele.style.width = parseInt(width) + "px";
  };
  /*
  ():
    {string} getWidth()
  DES:
    get button width.
  */
  this.getWidth = function(){
    return parseInt(this.ele.offsetWidth);
  };
  /*
  ():
    {void} autoWidth()
  DES:
    auto fit title text width.
  */
  this.autoWidth = function(){
		var font = this.layout.boldFont ? "font-weight:bold;" : "";
		var str = "<span style='white-space:nowrap;" + font + "'>" + this.titleEle.innerHTML + "</span>" ;
		var ele = EL.createElementsByHtml(str)[0];
		var W = parseInt(this.getWidth());
		var w = this.titleEle.offsetWidth;
		var width = (ele.scrollWidth + W - w );
		this.setWidth(width);
  };
};
WIN.extendClass(GUI.Button, GUI.ButtonBase);