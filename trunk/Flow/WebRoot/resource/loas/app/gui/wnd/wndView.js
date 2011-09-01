/***************************************************************
windowView.js
define GUI window View  module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.wnd.wndView");
//require resource
require("app.gui.engin");


/*
CLASS:
  GUI.WndView
DES:
  define GUI window View  module
PROPERTY:
  {object} _eleStore
    DES:
      store window inner struct elements
    PROPERTY:
      {HTMLTableCellElement} bodyEle
        window inner struct element, it's height need to be update after this.setHeight;
      {HTMLDIVElement} nextToBiLRCEle
        bi ele that next to biLRCEle;when we changed its style we need to update biLRCEle's style. 
      {HTMLDIVElement} biLRCEle
        biLRCEle means bi left rounded corner ele

  {object} _optStore
    store useful initialize options data;
    
  {HTMLDIVElement} ele
  {HTMLDIVElement} biMiniEle
  {HTMLDIVElement} biMaxiEle
  {HTMLDIVElement} biCloseEle
  {HTMLTableCellElement} iconEle
  {HTMLTableCellElement} titleEle
METHOD:
  {void} _buildView()
  {string} _createWindowHtml()
  {void} _referenceDom()
  {int} _setWindowBodyHeight()
  
  {void} build()
  {object} getBIEle({int} which)
  {object} getBIStyleByStatus({int} which, {string} status)
  {object} getSize()
  {int} getHeight()
  {void} getWidth()
  {void} _handleOptions({object} options)
  {this} initialize({object} options)
  {void} onBuild()
  {void} setBIStyle({int} which, {object} style)
  ?{void} setBIStyleDisable({int} which)
  ?{void} setBIStyleEnable({int} which)
  {void} setBIStyleByStatus({int} which, {string} status)
  {void} setBIToResetStyle({boolean} isMini, {string} status)
  {void} setIcon({string} iconSrc)
  {void} setTitle({string} title)
  {void} setWidth({int | string} w)
  {void} setHeight({int | string} h)
*/
GUI.WndView = function(){
  var _optStore = {}, _eleStore = {};
  /*
  ():
    {this} initialize({object} options)
  DES:
    initialize;
  */
  this.initialize = function(options){
    this._handleOptions(options);
    this.build();
    delete this.options;
    return this;
  };
  /*
  ():
    {void} _handleOptions({object} options)
  DES:
    handle Options
  */
  this._handleOptions = function(options){
    var opt = this.options = WIN.extendExclude({
      container: document.body,
      isIframe : true,
      content  : "hello window <p></p>d<p></p><p></p><p>d</p><p></p><p>d</p>!!!",
      hasBiMini: true,
      hasBiMaxi: true,//we're not allowed no biClose window
      
      iconSrc : "",
      title : "",
      
      skin:{//skin is for window structure layout options
        windowWrapCss : "gui_window_table33",
        windowTitleBarCss: "window_table33_head",
        
        windowWrapperHeight: 29,
        minimizeWidth: 150,
        minimizeHeight: 26,
        
        miniWidth: 150,
        miniHeight:100,
        
        unknown: null
      },
      style:{//style is window ele style property
        left: "100px",
        top : "100px",
        zIndex: 1000,
        width: "600px",
        height: "300px",
				overflow: "hidden",
        unknown: null
      },
      
      unknown: null
    }, options, ["layout"]);
    
    if(WIN.isObject(options)){
      WIN.extend(opt.skin, options.skin);
      WIN.extend(opt.style, options.style);
    }
    
    WIN.extendThese(_optStore, opt,
                    ["isIframe", "hasBiMini", "hasBiMaxi"]);
    WIN.extendThese(_optStore, opt.skin,
                    ["miniWidth", "miniHeight", "windowWrapperHeight", "minimizeWidth", "minimizeHeight"]);
  };
  /*
  ():
    {void} _referenceDom()
  DES:
    reference Dom
  */
  this._referenceDom = function(){
    var _this = this, opt = this.options, ele = this.ele, css;
    var rows = ele.firstChild.rows, head = rows[0].cells[1], body = rows[1].cells[1];
    var cells = head.firstChild.rows[0].cells;
    this.iconEle = cells[0];
    this.titleEle = cells[1];
    _eleStore.bodyEle = body;
    
    Array.each(function(div){
      css = div.className;
      if(/biLeft/i.test(css))_eleStore.biLRCEle = div;
      else if(/biMini/i.test(css))_this.biMiniEle = div;
      else if(/biMaxi/i.test(css))_this.biMaxiEle = div;
      else if(/biClose/i.test(css))_this.biCloseEle = div;      
    }, head.getElementsByTagName("div"));
    
    _eleStore.nextToBiLRCEle = opt.hasBiMini ? _this.biMiniEle : (opt.hasBiMaxi ? _this.biMaxiEle : _this.biCloseEle);
  };
  /*
  ():
    {void} setBIStyleByStatus({int} which, {string} status)
  DES:
    set BI button style by button status
  ARG:
    {string} status
      case-insensitive, bi style include these status: disable,normal,mouseover,mousedown,mouseup,mouseout.
  */
  this.setBIStyleByStatus = function(which, status){
    var stl = this.getBIStyleByStatus(which, status);
    var ele = this.getBIEle(which);
    if(stl && ele){
      this.setBIStyle(which, stl);
      //update biLRCEle style;
      if(_eleStore.nextToBiLRCEle == ele){
        stl = this.getBIStyleByStatus(0, status);
        EL.setStyle(_eleStore.biLRCEle, stl);
      }
    }
  };
  /*
  ():
    {boolean} setBIStyleByStatus({object} style)
  DES:
    set window to be minimized style.
  */
  this.setStyleMinimize = function(){
    EL.setStyle(this.ele, {
		  width : EL.parseUnit(_optStore.minimizeWidth),
			height: EL.parseUnit(_optStore.minimizeHeight)
		});
    this._setWindowBodyHeight();
    return true;
  };
  this.setStyleMaximize = function(){
    
  };
  /*
  ():
    {void} setWidth({int | string} w)
  DES:
    set window width
  */
  this.setWidth = function(w){
    var ele = this.ele, miniW = _optStore.miniWidth;
    if(WIN.isElement(ele)) {
      style = ele.style;
      if(/%/.test(w)){
        style.width = EL.parseUnit(w);
        w = this.getWidth();
        if(w < miniW)style.width = EL.parseUnit(miniW);
      }
      else{
        w = parseInt(w);
        if(isNaN(w))return ;
        if(w < miniW)w = miniW;
        style.width = w + "px";
      }
    }
  };
  /*
  ():
    {void} setHeight({int | string} h)
  DES:
    set window height
  */
  this.setHeight = function(h){
    var ele = this.ele, miniH = _optStore.miniHeight;
		
    if(WIN.isElement(ele)) {
      style = ele.style;
      if(/%/.test(h)){
        style.height = EL.parseUnit(h);
        h = this.getHeight();
        if(h < miniH)style.height = EL.parseUnit(miniH);
      }
      else{
        h = parseInt(h);
        if(isNaN(h))return ;
        if(h < miniH)h = miniH;
        style.height = h + "px";
      }
      this._setWindowBodyHeight();
    }
  };
  /*
  ():
    {int} _setWindowBodyHeight()
  DES:
    set Window Body Height, because bodyEle's height cant auto adapt to window height, so after setHeight, we need to update body height, body height = windowWrapperHeight + bar(if has) height;
  */
  this._setWindowBodyHeight = function(){
    var H = this.getHeight(), ele = _eleStore.bodyEle;
    if(H > 0 && WIN.isElement(ele)){
      var h = H - parseInt(_optStore.windowWrapperHeight);
      if(h < 0)h = 0;
      ele.style.height = EL.parseUnit(h);
    }
  };
};
WIN.extend(GUI.WndView.prototype, {
  /*
  ():
    {void} build()
  DES:
    build window, fire onBuild event; 
  */
  build : function(){
    this._buildView();
    this.onBuild();
  },
  /*
  ():
    {void} _buildView()
  DES:
    build window view and reference dom
  */
  _buildView : function(){
    var opt = this.options, container = opt.container, skin = opt.skin;
    var stl = WIN.extend(opt.style, {position : "absolute"});
    var ele = this.ele = EL.c({
      innerHTML : this._createWindowHtml()
    }, stl) ;
    
    if(WIN.isElement(container))container.appendChild(ele);
    
    this._referenceDom();  
    this.setHeight(stl.height);
  },
  /*
  ():
    {string} _createWindowHtml()
  DES:
    create Window Html
  */
  _createWindowHtml : function(){
    var opt = this.options, title  = this.title || "&nbsp;", skin = opt.skin;
    var head = '<table onselectstart="return false;" class="'
              + skin.windowTitleBarCss + '" cellpadding="0" cellspacing="0" border="0">'
              + '<tr><td class="icon">&nbsp;</td><td class="title">' 
              + title + '</td> '
              + '<td style="width:4px;" valign="top"><div class="biLeft">&nbsp;</div></td>';
              
    if(opt.hasBiMini)head += '<td style="width:23px;" valign="top"><div class="biMini">&nbsp;</div></td>';
    if(opt.hasBiMaxi)head += '<td style="width:26px;" valign="top"><div class="biMaxi">&nbsp;</div></td>';
    
    head += '<td style="width:42px;" valign="top"><div class="biClose">&nbsp;</div></td></tr></table>';
    var body = opt.isIframe 
    ? '<iframe frameborder="0" src="' + opt.content + '"style="width:100%; height:100%;border:none;"></iframe>' 
    : '<div style="width:100%; height:100%;background-color:#D7E5F5; overflow:hidden;">' + opt.content + '</div>';
    
    return GUI.createTable33Html(head, body, undefined, skin.windowWrapCss);
  },
  /*
  ():
    {void} onBuild()
  DES:
    event triggered on window view build;
  */
  onBuild : Function.empty,
  /*
  ():
    {void} setBIStyleDisable({int} which)
  DES:
    disable BI button.
  setBIStyleDisable : function(which){
    this.setBIStyleByStatus(which, "disable");
  },
  */
  /*
  ():
    {void} setBIStyleEnable({int} which)
  DES:
    enable BI button.
  setBIStyleEnable : function(which){
    this.setBIStyleByStatus(which, "normal");
  },
  */
  /*
  ():
    {object} getBIEle({int} which)
  DES:
    get BI ele
  ARG:
    {int} which
      value to point which btn. 1 stands for biMiniEle, 2 for biMaxiEle, 3(default) for biCloseEle.
  */
  getBIEle : function(which){
    if(isNaN(which))return null;
    switch(which){
      case 1 :{
        return this.biMiniEle;
      };
      case 2 :{
        return this.biMaxiEle;
      };
      default :{
        return this.biCloseEle;
      };
    }
  },
  /*
  ():
    {object} getBIStyleByStatus({int} which, {string} status)
  DES:
    Get style from status. 
    By setting defferent background position for bi ele, we can make bi ele to be different  view for different status;
    The association bt status and background position is defined in GUI.WndView.BIBgPosX n GUI.WndView.StatusBIBgPosY;
  ARG:
    {string} status
      see setBIStyleByStatus arg status;
  RTN:
    a obj has backgroundPosition property.
  */
  getBIStyleByStatus : function(which, status){
    if(String.notEmpty(status) && !isNaN(which)){
      status = status.toLowerCase();
      var v = GUI.WndView, posX = v.BIBgPosX, sPosY = v.StatusBIBgPosY;
      return {backgroundPosition :(posX[which] + " " +  sPosY[status])};
    }
  },
  /*
  ():
    {void} setBIToResetStyle({boolean} isMini, {string} status)
  DES:
    set BI(minimize or maximize only) to be reset style
  */
  setBIToResetStyleByStatus : function(isMini, status){
    var which = isMini ? 1 : 2;
    var stl = this.getBIStyleByStatus((3 + which), status);
    this.setBIStyle(which, stl);
  },
  /*
  ():
    {void} setBIStyle({int} which, {object} style)
  DES:
    set BI button style
  */
  setBIStyle : function(which, style){
    if(isNaN(which) || which < 1)return ;
    var ele = this.getBIEle(which);
    if(ele) EL.setStyle(ele, style);
  },
  /*
  ():
    {object} getSize()
  DES:
    get window size
  RTN:
    return object which has width and height properties;
  */
  getSize : function(){
    return {
      width : this.setWidth(),
      height: this.getHeight()
    };
  },
  /*
  ():
    {void} setSize({object} size)
  DES:
    set window size by object which has width and height properties; 
  */
  setSize : function(size){
    if(!WIN.isObject(size))return;
    this.setWidth(size.width);
    this.setHeight(size.height);
  },
  /*
  ():
    {int} getHeight()
  DES:
    get window height
  RTN:
    the value of this ele height;if it is a percent(%) value, return ele's offsetHeight;
  */
  getHeight : function(){
    var ele = this.ele, h = -1;
    if(WIN.isElement(ele)){
      h = ele.style.height;
      if(/%/.test(h))  h = ele.offsetHeight;
    }
    return parseInt(h);
  },
  /*
  ():
    {void} getWidth()
  DES:
    get window width
  */
  getWidth : function(){
    var ele = this.ele, w = -1;
    if(WIN.isElement(ele)){
      w = ele.style.width;
      if(/%/.test(w))  w = ele.offsetWidth;
    }
    return parseInt(w);
  },
  /*
  ():
    {void} setTitle({string} title)
  DES:
    set window title
  */
  setTitle : function(title){
    var ele = this.titleEle;
    if(WIN.isElement(ele) && String.notEmpty(title))ele.innerHTML = title;
  },
  /*
  ():
    {void} setIcon({string} iconSrc)
  DES:
    set window icon
  */
  setIcon : function(iconSrc){
    var ele = this.iconEle;
    if(WIN.isElement(ele) && String.notEmpty(iconSrc))
      ele.style.backgroundImage = "url(" + iconSrc + ")";
  },
  /*
  ():
    {string} toString()
  */
  toString : function(){
    return "[object GUI.WndView]";
  }  
});

WIN.extend(GUI.WndView, function(){  
  return {
    BIBgPosX :[0, "-4px", "-27px", "-79px", "-56px", "-53px"],//background position x of biLRCEle, biMiniEle, biMaxiEle, biCloseEle, BIBgPosX[4],BIBgPosX[5] is position of biMiniEle, biMaxiEle in Reset mode.
    StatusBIBgPosY :{
      disable   : "-54px",
      normal    : 0,
      mouseover : "-18px",
      mousedown : "-36px",
      mouseup   : "-18px",
      mouseout  : 0,
      unknown:null
    },
    unknown: null
  };
}());