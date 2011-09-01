/* biSystemMenu.js
*/
require.provide("app.gui.window.biSystemMenu");
require("lib.evt.engin");

namespace("GUI");
/* {
CLASS:
  GUI.BiSystemMenu
DES:
  __description
CFG:
  {boolean} biMinimize
  {boolean} biMaximize
  {HTMLElement} container
  {GUI.WndPanel} wndPanel
  {int} width
PROPERTY:
  {string} _iconsHtml
METHOD:
  {void} _initDomEvents({event} evt)
  {void} _hndMenuEvents({event} evt)
  {void} _hndMenuClick({HTMLElement} ele, {string} css)
  {string} _getIconBgPosition({string} which, {string} status)
  {HTMLElement | null} _getIconEle({string} iconCss)
  {void} _setMaximizeStyle()
  {void} _setMinimizeStyle()
  {void} _setMinimizeStyle()
  {void} _setMinimizeStyle()
  {this} initialize({object} cfg)
  {this} dispose()
  {this} build()
  {this} setIconStyleByStatus({string} iconCss, {string} status)
  {this} disableIcon({string} iconCss)
  {this} enableIcon({string} iconCss)
} */
GUI.BiSystemMenu = WIN.createClass(function(){
  },{  
    /*
    cfg:
      {boolean} biMinimize
    DES:
      (true) show Minimize button or not.
    */
    biMinimize : true,
    /*
    cfg:
      {boolean} biMaximize
    DES:
      (true) show biMaximize button or not.
    */
    biMaximize : true,
    /*
    cfg:
      {HTMLElement} container
    DES:
      (require) menu container;
    */
    container : null,
    /*
    cfg:
      {GUI.WndPanel} wndPanel
    DES:
      (require) menu owner -- wndPanel;
    */
    wndPanel : null,
    /*
    PROPERTY:
      {int} width
    DES:
      (readonly)menu width initialized on dom builded;
    */
    width : 0,
    /*
    PROPERTY:
      {string} _iconsHtml
    DES:
      (readonly)biClose & biLeft icons Html;
    */
    _iconsHtml : '<div class="biClose"></div><div class="biLeft"></div>',
    /* {
    ():
      {void} _initDomEvents({event} evt)
    DES:
      init dom events;
    } */
    _initDomEvents : function(){
      var ele = this.dom, hnd = Function.bind(this._hndMenuEvents, this);
      if(ele){
        WIN.extend(ele, {
          onclick : hnd,
          ondblclick : hnd,
          oncontextmenu : hnd,
          onmouseout : hnd,
          onmouseover : hnd,
          onmousedown : hnd,
          onmouseup : hnd
        });
      }
    },
    /* {
    ():
      {void} _hndMenuEvents({event} evt)
    DES:
      handler for menu events; Ananisys event type and target, fires the 
    } */
    _hndMenuEvents : function(evt){
      var ele, css, disabled,
          setIconStyle = Function.bind(this.setIconStyleByStatus, this), 
          e = EVT.Event.fix(evt, true),
          type = e.type.toLowerCase(),
          has = String.contains,
          target = e.target;
      if(!WIN.isElement(target))return ;
      if(target == this.biLeftEle)target = this.nextToLeftEle;
      disabled = target.biDisabled;
      if(disabled)return ;
      
      css = target.className;
      ele = this._getIconEle(css);
      if(!ele)return ;
      
      if(has(type, "mouseover")){
        setIconStyle(css, "mouseover");
      }
      else if(has(type, "mousedown")){
        if(e.leftClick)setIconStyle(css, "mousedown");
        if(this.wndPanel)this.wndPanel.toFront();
      }
      else if(has(type, "mouseout")){
        setIconStyle(css, "mouseout");
      }
      else if(has(type, "mouseup")){
        if(e.leftClick)setIconStyle(css, "mouseup");
      }
      else if(has(type, "click")){
        this._hndMenuClick(ele, css);
      }
      EVT.Event.stopEvent();
    },
    /* {
    ():
      {void} _hndMenuClick({HTMLElement} ele, {string} css)
    DES:
      handler for menu click event;
      fires onmaximize, onminimize, onclose, onresetmaximize, onresetminimize event;
    } */
    _hndMenuClick : function(ele, css){
      var panel = this.wndPanel;
      if(!panel)return ;
      if(ele != this.biCloseEle){
        if(/biminimize/i.test(css)){
          panel.toggleMinimize();
        }
        else{
          panel.toggleMaximize();
        }
      }
      else panel.close();
    },
    /* {
    ():
      {string} _getIconBgPosition({string} which, {string} status)
    DES:
      returns bi position x and y;
    ARG:
      {string} which
        specify which part of biSystemMenu by using the name 
        of GUI.WndPanel.biBgPositions.X properties.
      {string} status
        provides bi status by using the name of GUI.WndPanel.biBgPositions.Y properties.
    RTN:
      returns string likes "0 -10px";
    } */
    _getIconBgPosition : function(which, status){
      var o = GUI.BiSystemMenu.biBgPositions;
      which = which.toLowerCase();
      status = status.toLowerCase();
      return (o.X[which] + " " + o.Y[status]);
    },
    /* {
    ():
      {HTMLElement | null} _getIconEle({string} iconCss)
    DES:
      get IconEle by ele's css;
    ARG:
      {string} iconCss
        specify which icon of biSystemMenu by using the IconEle's css name;
        Note: iiconCss is used for marking the iconEle, so it cant be changed;
        Each iconEle has its own fixed css: 
        biMaximizeEle to bimaximize", biMinimizeEle to "biminimize", biCloseEle to "biclose"
    } */
    _getIconEle : function(iconCss){
      var ele;
      iconCss = iconCss.toLowerCase();
      if(iconCss == "bimaximize")ele = this.biMaximizeEle;
      else if(iconCss == "biminimize")ele = this.biMinimizeEle;
      else if(iconCss == "biclose")ele = this.biCloseEle;
      return WIN.isElement(ele) ? ele : null;
    },
    /* {
    ():
      {void} _setMaximizeStyle()
    DES:
      set menu maximize icon style onmaximize;
    } */
    _setMaximizeStyle : function(){
      if(this.minimized)this._setResetMinimizeStyle();
      var ele = this.biResetEle = this.biMaximizeEle;
      if(!ele)return ;
      this.setIconStyleByStatus("bimaximize", "normal");
      this.maximized = true;
    },
    /* {
    ():
      {void} _setMinimizeStyle()
    DES:
      set menu minimize icon style onminimize;
    } */
    _setMinimizeStyle : function(){
      if(this.maximized)this._setResetMaximizeStyle();
      var ele = this.biResetEle = this.biMinimizeEle;
      if(!ele)return ;
      this.setIconStyleByStatus("biminimize", "normal");
      this.minimized = true;
    },
    /* {
    ():
      {void} _setMinimizeStyle()
    DES:
      set menu maximize icon style onresetmaximize;
    } */
    _setResetMaximizeStyle : function(){
      delete this.biResetEle;
      this.setIconStyleByStatus("bimaximize", "normal");
      this.maximized = false;
    },
    /* {
    ():
      {void} _setMinimizeStyle()
    DES:
      set menu minimize icon style onresetmaximize;
    } */
    _setResetMinimizeStyle : function(){
      delete this.biResetEle;
      this.setIconStyleByStatus("biminimize", "normal");
      this.minimized = false;
    },
    
    /* {
    ():
      {this} initialize({object} cfg)
    DES:
      set cfg and build menu;
    ARG:
      {object} cfg
        @see this cfg;
    } */
    initialize : function(cfg){
      WIN.extend(this, cfg);
      var panel = this.wndPanel, bind = Function.bind;
      if(!( panel instanceof GUI.WndPanel))throw{description : "Invalid penel!"};
      if(this.biMinimize){
        panel.addListener("onminimize", bind(this._setMinimizeStyle, this));
        panel.addListener("onresetminimize", bind(this._setResetMinimizeStyle, this));
      }
      if(this.biMaximize){
        panel.addListener("onmaximize", bind(this._setMaximizeStyle, this));
        panel.addListener("onresetmaximize", bind(this._setResetMaximizeStyle, this));
      }
      return this.build();
    },
    /* {
    ():
      {this} dispose()
    DES:
      dispose
    } */
    dispose : function(){
      EL.destoryNode(this.dom);
      var self = this, 
          toDelete = ["dom", "container", "biLeftEle", "biCloseEle", "biMaximizeEle", 
                      "biMinimizeEle", "nextToLeftEle", "biResetEle", "wndPanel"];
      Array.each(function(name){
        delete self[name];
      }, toDelete);
    },
    /* {
    ():
      {this} build()
    DES:
      build dom, 
    } */
    build : function(){
      var ele, biLeftEle, width, node;
      ele = this.dom = EL.c({
        className : "biSystemMenu",
        innerHTML : this._iconsHtml
      });
      /*
      Never bind ele's events handler in this function in which the ele is created ;
      so we bind them in another method _initDomEvents;
      */
      this._initDomEvents();
      this.container.appendChild(ele);
      this.biCloseEle = ele.firstChild;
      biLeftEle = this.biLeftEle = ele.lastChild;
      width = this.biCloseEle.offsetWidth + biLeftEle.offsetWidth;
      
      if(this.biMaximize){
        node = this.biMaximizeEle = EL.c({className : "biMaximize"});
        ele.insertBefore(node, this.biLeftEle);
        width += node.offsetWidth;
      }
      if(this.biMinimize){
        node = this.biMinimizeEle = EL.c({className : "biMinimize"});
        ele.insertBefore(node, this.biLeftEle);
        width += node.offsetWidth;
      }
      this.nextToLeftEle = this.biLeftEle.previousSibling;
      this.width = width;
      return this;
    },
    /* {
    ():
      {this} setIconStyleByStatus({string} iconCss, {string} status)
    DES:
      set icon style by status;
    ARG:
      {string} iconCss
        @see method _getIconEle
      {string} status
        @see method _getIconBgPosition
    } */
    setIconStyleByStatus : function(iconCss, status){
      var xy, ele = this._getIconEle(iconCss);      
      if(ele){
        if(this.biResetEle == ele)iconCss += "_reset";
        xy = this._getIconBgPosition(iconCss, status);
        if(String.notEmpty(xy)){
          EL.setStyle(ele, {backgroundPosition : xy});
        }
        if(this.nextToLeftEle == ele){
          xy = this._getIconBgPosition("bileft", status);
          if(String.notEmpty(xy)){
            EL.setStyle(this.biLeftEle, {backgroundPosition : xy});
          }
        }
      }
      return this;
    },
    /* {
    ():
      {this} disableIcon({string} iconCss)
    DES:
      disable icon;When a icon  is disabled, we add property {boolean} biDisabled to iconEle;
    ARG:
      {string} iconCss
        @see method _getIconEle
    } */
    disableIcon : function(iconCss){
      var ele = this._getIconEle(iconCss);  
      if(ele){
        this.setIconStyleByStatus(iconCss, "disabled");
        ele.biDisabled = true;
      }
      return this;
    },
    /* {
    ():
      {this} enableIcon({string} iconCss)
    DES:
      enable icon, @see method disableIcon;
    } */
    enableIcon : function(iconCss){
      var ele = this._getIconEle(iconCss);  
      if(ele){
        this.setIconStyleByStatus(iconCss, "normal");
        ele.biDisabled = false;
      }
      return this;
    },
    toString: function(){return "[object GUI.BiSystemMenu]";}
  }
);
/* {
OBJECT:
  GUI.BiSystemMenu.biBgPositions
DES:
  store bi background positions;
PROPERTY:
  {object} X
    x positions, represents which part of biSystemMenu;
  {object} Y
    y positions, represents status of icons;
} */
WIN.extend(GUI.BiSystemMenu, {
  biBgPositions : {
    X : {
      bileft : 0,
      biminimize : "-4px",
      bimaximize : "-27px",
      bimaximize_reset : "-53px",
      biminimize_reset : "-56px",
      biclose : "-79px"
    },
    Y : {
      disabled   : "-54px",
      normal    : 0,
      mouseover : "-18px",
      mousedown : "-36px",
      mouseup   : "-18px",
      mouseout  : 0
    }
  }
});