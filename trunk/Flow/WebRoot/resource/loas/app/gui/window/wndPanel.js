/* wndPanel.js
*/
require.provide("app.gui.window.wndPanel");
require("lib.core.util.SimpleTemplate");
require("lib.evt.engin");
require("app.bhv.dnd.resize");
require("app.bhv.dnd.drag");
require("lib.core.util.ObserverProvider");
require("app.gui.window.windowMgr");
require("app.gui.window.biSystemMenu");

namespace("GUI");
/* {
CLASS:
  GUI.WndPanel
SUPERCLASS:
  WIN.ObserverProvider
DES:
  WndPanel is basic panel for display a html content or a iframe page;
CFG:
  {string} borderStyle
  {string} cascadingType
  {boolean} dragable
  {boolean} hasBiSystemMenu
  {boolean} hasBiMinimize
  {boolean} hasBiMaximize
  {boolean} isFrame
  {int} initLeft, initTop, initWidth, initHeight
  {boolean} initVisible
  {boolean} resizable
  {string} startupPostionType
  {string} title
PROPERTY:
  {WIN.SimpleTemplate} _htmlTpl
  {stringe} _msgOnbeforclose
  {string} _iframeBodyHtml
  {string} _divBodyHtml
  {int} _miniWidth, _miniHeight
  
  {int} width, height
    (readonly)return panel size;
  {boolean} hidden
    (readonly)returns panel visibility;
  {string} title
METHOD:
  {void} _adjustViewport({int} w, {int}h)
  {void} _bindDom()
  {object} _getStartupPosition()
  {object} _getBiCfg()
  {void} _hndPanelDragEvent({event} evt)
  {void} _hndPanelMousedown({event} evt)
  {void} _hndPanelResizeEvent({event} evt)
  {void} _hndTitleBarDblclick()
  {void} _initBorderStyle()
  {void} _initTitleBarBehaviors()
  {void} _refreshSize()
  {void} _updateTitleWidth()
  {void} _updateBodyHeight()
  
  {this} build()
  {boolean} close()
  {this} dispose()
  {int} getTop()
  {int} getLeft()
  {this} hide()
  {this} initialize({object} cfg)
  {this} maximize({int} w, {int} h)
  {this} minimize()
  {this} open({NEString} url)
  {this} resetMaximize()
  {this} resetMinimize()
  {this} resizeTo({int} w, {int}h)
  {this} setLeft({int} value)
  {this} setHeight({int} value)
  {this} setIcon({string} src)
  {this} setPosition({int} left, {int} top)
  {this} setResizable([{boolean} disable])
  {this} setTitle({string} text)
  {this} setTop({int} value)
  {this} setWidth({int} value)
  {this} setZIndex({int} zIndex)
  {this} show()
  {this} showContent({HTMLElement | string} content)
  {this} toFront()
  {this} toggleMaximize()
  {this} toggleMinimize()
  {this} toggleVisible()
} */
GUI.WndPanel = WIN.createClass(function(){
  },{
    /*
    cfg:
      {boolean} isFrame
    DES:
      (true) indicates content type is iframe else is div;
    */
    isFrame : true,
    /*
    cfg:
      {boolean} hasBiSystemMenu
    DES:
      (true) show system menu or not.
    */
    hasBiSystemMenu : true,
    /*
    cfg:
      {boolean} hasBiMinimize
    DES:
      (true) show Minimize button or not.
    */
    hasBiMinimize : true,
    /*
    cfg:
      {boolean} hasBiMaximize
    DES:
      (true) show hasBiMaximize button or not.
    */
    hasBiMaximize : true,
    /*
    cfg:
      {boolean} resizable
    DES:
      (true) specifys panel resizable;
    */
    resizable : true,
    /*
    cfg:
      {boolean} dragable
    DES:
      (true) specifys panel dragable;
    */
    dragable : true,
    /*
    cfg:
      {boolean} initVisible
    DES:
      (true) specifys panel visibility on initialize;
    */
    initVisible : true,
    /*
    cfg:
      {int} initLeft, initTop, initWidth, initHeight
    DES:
      (0, 0, 300, 200) specifys panel init position or size;
    */
    initLeft : 0,
    initTop : 0,
    initWidth : 300,
    initHeight : 200,
    /*
    cfg:
      {string} title
    DES:
      (readonly cfg, "about: blank")
      represents panel title;
    */
    title : "about: blank",
    /*
    cfg:
      {string} startupPostionType
    DES:
      (readonly cfg, "auto")
      represents startup postion;
      "custom" : user custom;
      "center" : center of viewport;
      "auto" : depends on system(GUI.windowMgr);
    */
    startupPostionType : "auto",
    /*
    cfg:
      {string} borderStyle
    DES:
      (readonly cfg, "bsSizeable")
      represents border style,contains these options:
      "bsSizeable" : panel is resizable;
      "bsDialog" : panel is unresizeable and no biMinimize or biMaximize;
      "bsPanel" : panel has no head(title bar, menu bar, etc);
    */
    borderStyle : "bsSizeable",
    /*
    cfg:
      {string} cascadingType
    DES:
      (readonly cfg, "normal")
      specify which cascad mgr it belongs to, cascad mgr is kind of GUI.windowMgr cascading, 
      which contains normal, topmost and dialog cascading;
    */
    cascadingType : "normal",
    /*
    PROPERTY:
      {WIN.SimpleTemplate} _htmlTpl
    DES:
      panel html template ;
    */
    _htmlTpl : new WIN.SimpleTemplate(''
        + '<table class="gui_wnd" border="0" cellspacing="0" cellpadding="0" style="left:{left}; top:{top}; width:{width};visibility:{visibility}">'
        + '<tr><td class="nw"></td><td class="n"></td><td class="ne"></td></tr>'
        + '<tr><td class="w"></td>'
          + '<td class="center">'
            + '<div class="head">'
              + '<div class="titleBar" onselectstart="return false;">'
                + '<div class="title"></div><div class="icon"></div>'
              + '</div>'
            + '</div>'
            + '{bodyHtml}'
            + '<div class="foot"></div>'
          + '</td>'
        + '<td class="e"></td></tr>'
        + '<tr><td class="sw"></td><td class="s"></td><td class="se"></td></tr>'
      + '</table>'),
    /*
    PROPERTY:
      {stringe} _msgOnbeforclose
    DES:
      confirm msg onbeforclose;
    */
    _msgOnbeforclose :'Are you sure to close window?\n{cfmMsg}\n\n\nPress button yes to close or no to cancel.',
    /*
    PROPERTY:
      {string} _iframeBodyHtml
    DES:
      Html for iframe Body 
    */
    _iframeBodyHtml : '<iframe class="body" frameborder="0" src="http://www.baidu.com/"></iframe>',
    /*
    PROPERTY:
      {string} _divBodyHtml
    DES:
      Html for div Body 
    */
    _divBodyHtml : '<div class="body"></div>',
    /*
    PROPERTY:
      {int} _miniWidth, _miniHeight
    DES:
      panel mini size; these depend on panel dom struct, never change them unless you implement
      your own panel dom;
    */
    _miniWidth : 150,
    _miniHeight : 30,
    
    /* {
    ():
      {void} _bindDom()
    DES:
      bind Dom.
    } */
    _bindDom : function(){
      var css, 
          self = this,
          ele = this.dom,
          nodes = ele.getElementsByTagName("div");
      Array.each(function(node){
        css = node.className;
        self[css + "Ele"] = node;
      }, nodes);
      if(this.isFrame){
				this.bodyEle = ele.getElementsByTagName("iframe")[0];
			}
    },
    /* {
    ():
      {void} _initBorderStyle()
    DES:
      init border style by checking this.borderStyle cfg;
    } */
    _initBorderStyle : function(){
      var s = this.borderStyle.toLowerCase();
      if(s == "bssizeable")return ;
      this.hasBiMinimize = this.hasBiMaximize = false;
      this.setResizable(false);
      if(s == "bspanel"){
        this.hasBiSystemMenu = false;
        var ele = this.headEle;
        if(WIN.isElement(ele))ele.style.display = "none";
      }
    },
    /* {
    ():
      {void} _initTitleBarBehaviors()
    DES:
      init titleBar behaviors: drag, toggleMaximize or toggleMinimize;
    } */
    _initTitleBarBehaviors : function(){
      var ele = this.titleBarEle;
      if(!WIN.isElement(ele))return ;
      if(this.dragable)ele.onmousedown = Function.bind(this._hndPanelDragEvent, this);
      if(this.resizable)ele.ondblclick = Function.bind(this._hndTitleBarDblclick, this);
    },
    /* {
    ():
      {void} _updateTitleWidth()
    DES:
      update title width on panel rewidth;
    } */
    _updateTitleWidth : function(){
      var w, titleBar = this.titleBarEle,
          ele = this.titleEle;
      if(!WIN.isElement(ele) || !WIN.isElement(titleBar) )return ;
      w = titleBar.offsetWidth;
      if(!w)return ;
      
      w -= (20 + 6);//20 is space for icon, 6 is for padding right
      if(this.biSystemMenu)w = w - this.biSystemMenu.width;
      if(w < 0) w = 0;
      ele.style.width = w + "px";
    },
    /* {
    ():
      {void} _updateBodyHeight()
    DES:
      update body height on panel reheight;
    } */
    _updateBodyHeight : function(total){
      var ele = this.bodyEle;
      if(!WIN.isElement(ele))return ;
      var h = total,
          rows = this.dom.rows;
      h = h - rows[0].offsetHeight - rows[2].offsetHeight;
      if(WIN.isElement(this.headEle))h -= this.headEle.offsetHeight;
      ele.style.height = h + "px";
    },
    /* {
    ():
      {object} _getStartupPosition()
    DES:
      returns startup position by checking this.startupPostionType cfg;
    RTN:
      {
        {int} left,
        {int} top
      }
    } */
    _getStartupPosition : function(){
      var l, t,
          type = this.startupPostionType.toLowerCase();
      if(type == "custom"){
        l = parseInt(this.initLeft);
        t = parseInt(this.initTop);
      }
      else if(type == "center"){
        l = parseInt((DOC.getClientWidth() - parseInt(this.initWidth))/2);
        t = parseInt((DOC.getClientHeight() - parseInt(this.initHeight))/2);
      }
      else {
        var mgr = GUI.windowMgr;
        if(mgr && WIN.isFunction(mgr.getAutoPosition)){
          return mgr.getAutoPosition();
        }
      }
      if(isNaN(l))l = 0;
      if(isNaN(t))t = 0;
      return {left : l, top : t };
    },
    /* {
    ():
      {object} _getBiCfg()
    DES:
      return cfg for this biSystemMenu ;
    } */
    _getBiCfg : function(){
      return {
        biMinimize : this.hasBiMinimize,
        biMaximize : this.hasBiMaximize,
        container : this.titleBarEle,
        wndPanel : this
      };
    },
    /* {
    ():
      {void} _hndTitleBarDblclick()
    DES:
      handler for titleBar dblclick event, if this.minimized toggleMinimize else toggleMaximize;
    } */
    _hndTitleBarDblclick : function(){
      if(this.minimized)this.toggleMinimize();
      else this.toggleMaximize();
    },
    /* {
    ():
      {void} _hndPanelResizeEvent({event} evt)
    DES:
      handler for panel resize event;
    } */
    _hndPanelResizeEvent : function(evt){
      if(!this.resizable)return ;
      var ele = this.dom;
      if(!WIN.isElement(ele))return ;
      var e = EVT.Event.fix(evt),
          self = this,
          target = e.target;
      if(!WIN.isElement(target))return ;
      var css = target.className,
          p = target.parentNode.parentNode.parentNode;
      if((p == ele) && /nw|n|ne|e|se|s|sw|w/i.test(css)){
        var o = {
              useDNDGhost: BROWSER.Gecko,
              minResizeWidth : this._miniWidth,
              minResizeHeight : this._miniHeight,
              direction : css,
              setH: function(h){self.setHeight(h);},
              setW: function(w){self.setWidth(w);}
            };
        BHV.DND.Resize.resize(this.dom, o, evt);
      }
    },
    /* {
    ():
      {void} _hndPanelDragEvent({event} evt)
    DES:
      handler for panel drag event;
    } */
    _hndPanelDragEvent : function(evt){
      this.toFront();
      if(this.dragable)
        BHV.DND.Drag.drag(this.dom, {useDNDGhost:false}, evt);
    },
    /* {
    ():
      {void} _hndPanelMousedown({event} evt)
    DES:
      handler for panel mousedown; set to front and begin resize;
    } */
    _hndPanelMousedown : function(evt){
      this.toFront();
      this._hndPanelResizeEvent(evt);
    },
    /* {
    ():
      {void} _adjustViewport({int} w, {int}h)
    DES:
      set size to specified size or to viewport
    } */
    _adjustViewport : function(w, h){
      if(!this.maximized)return ;
      if(!w || !h){
        w = DOC.getClientWidth();
        h = DOC.getClientHeight();
      }
      this.resizeTo(w, h);
    },
    /* {
    ():
      {void} _refreshSize()
    DES:
      fix ie unknown bug on panel set or reset maximize or minimize;
    } */
    _refreshSize : function(){
      this.resizeTo((this.width + 1 ), (this.height + 1));
      this.resizeTo((this.width - 1 ), (this.height - 1));
    },
    
    /* {
    ():
      {this} initialize({object} cfg)
    DES:
      apply cfg, add observers, build struct and registerPanel to GUI.windowMgr;
    } */
    initialize : function(cfg){
      WIN.extend(this, cfg);
      this.addObservers("onresize", "onmaximize", "onresetmaximize", 
                        "onresetminimize", "onminimize", "onclose");
      this.build();
      this.setTitle(this.title);
      this._hndWindowResize = Function.bind(this._adjustViewport, this);
      EVT.observe(window, "resize", this._hndWindowResize );
      GUI.windowMgr.registerPanel(this);
      return this;
    },
    /* {
    ():
      {this} build()
    DES:
      build struct;
    } */
    build : function(){
      var html, ele,
          b = document.body,
          pos = this._getStartupPosition(),
          visibility = this.initVisible ? "visible" : "hidden",
          bodyHtml = this.isFrame ? this._iframeBodyHtml : this._divBodyHtml;
      
      html = this._htmlTpl.apply({
        left : pos.left + "px",
        top : pos.top + "px",
        visibility : visibility,
        width : EL.parseUnit(this.initWidth),
        bodyHtml : bodyHtml
      });
      ele = this.dom = EL.createElementsByHtml(html)[0];
      ele.onmousedown = Function.bind(this._hndPanelMousedown, this);
      b.appendChild(ele);
      this._bindDom();
      
      this._initBorderStyle();
      this._initTitleBarBehaviors();
      
      if(this.hasBiSystemMenu){
        this.biSystemMenu = (new GUI.BiSystemMenu).initialize(this._getBiCfg());
      }
      
      this.setPosition(pos.left, pos.top);
      this.setWidth(this.initWidth);
      this.setHeight(this.initHeight);
      if(!this.initVisible){
        this.hide();
        ele.style.visibility = "visible";
      }
      
      return this;
    },
    /* {
    ():
      {boolean} close()
    DES:
      close and dispose panel, it will first checks onbeforeclose method,
      if onbeforeclose is defined and returned a string, then close or not is confirmed by user;
    ARG:
      {HTMLElement | string} content
        content can be a html string or an HTMLElement;
    RTN:
      returns false if close canceled; 
    } */
    close : function(){
      if(WIN.isFunction(this.onbeforeclose)){
        var cfmMsg = this.onbeforeclose();
        if(WIN.isString(cfmMsg)){
          var cfm = window.confirm;
          cfmMsg = this._msgOnbeforclose.replace(/{cfmMsg}/, cfmMsg);
          if(typeof page == "object" && WIN.isFunction(page.confirm)){
            cfm = page.confirm;
            cfmMsg = cfmMsg.replace(/\n/g, "<br />");
          }
          if(!cfm(cfmMsg))return false;
        }
      }
      EL.destoryNode(this.dom);
      this.dispose();
      this.fireObserver("onclose");
      return true;
    },
    /* {
    ():
      {this} dispose()
    DES:
     dispose panel;
    } */
    dispose : function(){
      var self = this, 
          toDelete = ["dom", "headEle", "bodyEle", "footEle", 
                      "titleBarEle", "titleEle", "iconEle", "biSystemMenu"];
      
      if(this.biSystemMenu)this.biSystemMenu.dispose();
      EVT.stopObserving(window, "resize", this._hndWindowResize);
      EL.destoryNode(this.dom);
		  Array.each(function(name){
        delete self[name];
      }, toDelete);
      GUI.windowMgr.unRegisterPanel(this);
    },
    /* {
    ():
      {this} open({NEString} url)
    DES:
      open a url, only if this is a frame panel;
    } */
    open : function(url){
      var ele = this.bodyEle;
      if(this.isFrame &&WIN.isElement(ele) && String.notEmpty(url)){
        ele.src = url;
      }
      return this;
    },
    /* {
    ():
      {this} showContent({HTMLElement | string} content)
    DES:
      display content unless this is a frame panel;
    ARG:
      {HTMLElement | string} content
        content can be a html string or an HTMLElement;
    } */
    showContent : function(content, options){
      var ele = this.bodyEle;
      if(!this.isFrame &&WIN.isElement(ele)){
        if(String.notEmpty(content))ele.innerHTML = content;
        else if(WIN.isElement(content))ele.appendChild(content);
      }
      return this;
    },
    /* {
    ():
      {this} toFront()
    DES:
      Brings this panel to the front of any other panels;
    } */
    toFront : function(){
      GUI.windowMgr.bringToFront(this);
      return this;
    },
    /* {
    ():
      {this} toggleMaximize()
    DES:
      toggle maximize
    } */
    toggleMaximize : function(){
      if(this.maximized) this.resetMaximize();
      else this.maximize();
      return this;
    },
    /* {
    ():
      {this} toggleMinimize()
    DES:
      toggle minimize
    } */
    toggleMinimize : function(){
      if(this.minimized) this.resetMinimize();
      else this.minimize();
      return this;
    },    
    /* {
    ():
      {this} toggleVisible()
    DES:
      toggle visible
    } */
    toggleVisible : function(){
      if(this.hidden) this.show();
      else this.hide();
      return this;
    },    
    /* {
    ():
      {this} show()
    DES:
      show panel
    } */
    show : function(){
      var ele = this.dom;
      if(!WIN.isElement(ele))return this;
      ele.style.display = "";
      this.hidden = false;
    },
    /* {
    ():
      {this} hide()
    DES:
      hide panel
    } */
    hide : function(){
      var ele = this.dom;
      if(!WIN.isElement(ele))return this;
      ele.style.display = "none";
      this.hidden = true;
    },
    /* {
    ():
      {this} maximize({int} w, {int} h)
    DES:
      maximize panel
    } */
    maximize : function(w, h){
      if(this.maximized)return this;
      
      var ele = this.dom;
      if(!WIN.isElement(ele))return this;
      w = w ? w : DOC.getClientWidth();
      h = h ? h : DOC.getClientHeight();
      
      this._beforeMaxi = {
        left : this.getLeft(),
        top : this.getTop()
      };
      if(this.minimized){
        this.minimized = false;
        WIN.extend(this._beforeMaxi, this._beforeMini);
      }
      else WIN.extend(this._beforeMaxi, {
        width : this.width,
        height : this.height
      });
      
      this.setPosition(0, 0);
      this.resizeTo(w, h);
      if(BROWSER.IE){
        this._refreshSize();
      }
      this.setResizable(false);
      
      this.maximized = true;
      this.dragable = false;
      this.fireObserver("onmaximize");
      return this;
    },
    /* {
    ():
      {this} resetMaximize()
    DES:
      reset maximized panel
    } */
    resetMaximize : function(){
      if(!this.maximized)return this;
      var o = this._beforeMaxi;
      if(!o)return this;
      
      this.setResizable(true);
      this.setPosition(o.left, o.top);
      this.resizeTo(o.width, o.height);
      if(BROWSER.IE){
        this._refreshSize();
      }
      
      delete this._beforeMaxi;
      this.maximized = false;
      this.dragable = true;
      this.fireObserver("onresetmaximize");
      return this;
    },
    /* {
    ():
      {this} minimize()
    DES:
      minimize panel
    } */
    minimize : function(){
      if(this.minimized)return this;
      if(this.maximized){
        var o = this._beforeMaxi;
        this._beforeMini = {
          width : o.width,
          height : o.height
        };
        this.setPosition(o.left, o.top);
      }
      else{
        this._beforeMini = {
          width : this.width,
          height : this.height
        };
      }
      this.resizeTo(this._miniWidth, this._miniHeight);
      if(BROWSER.IE){
        this._refreshSize();
      }
      this.setResizable(false);
      this.minimized = true;
      this.maximized = false;
      this.fireObserver("onminimize");
      return this;
    },
    /* {
    ():
      {this} resetMinimize()
    DES:
      reset minimized panel
    } */
    resetMinimize : function(){
      if(!this.minimized)return this;      
      var o = this._beforeMini;
      if(!o)return this;
      
      this.resizeTo(o.width, o.height);
      if(BROWSER.IE){
        this._refreshSize();
      }
      this.setResizable(true);
      
      delete this._beforeMaxi;
      this.minimized = false;
      this.fireObserver("onresetminimize");
      return this;
    },
    /* {
    ():
      {int} getLeft()
    DES:
      return panel left position      
    } */
    getLeft : function(){
      var r = 0;
      var ele = this.dom;
      if(WIN.isElement(ele)){
        r = parseInt(ele.style.left);
      }
      return r;
    },
    /* {
    ():
      {int} getTop()
    DES:
      return panel top position
    } */
    getTop : function(){
      var r = -1;
      var ele = this.dom;
      if(WIN.isElement(ele)){
        r = parseInt(ele.style.top);
      }
      return r;
    },
    /* {
    ():
      {this} setPosition({int} left, {int} top)
    DES:
      set panel position
    } */
    setPosition : function(left, top){
      this.setLeft(left);
      this.setTop(top);
      return this;
    },
    /* {
    ():
      {this} setLeft({int} value)
    DES:
      set panel left position
    } */
    setLeft : function(value){
      value = parseInt(value);
      if(!isNaN(value)){
        var ele = this.dom;
        if(WIN.isElement(ele)){
          ele.style.left = value + "px";
        }
      }
      return this;
    },
    /* {
    ():
      {this} setTop({int} value)
    DES:
      set panel top position
    } */
    setTop : function(value){
      value = parseInt(value);
      if(!isNaN(value)){
        var ele = this.dom;
        if(WIN.isElement(ele)){
          ele.style.top = value + "px";
        }
      }
      return this;
    },
    /* {
    ():
      {this} resizeTo({int} w, {int}h)
    DES:
      resize panel;
    } */
    resizeTo : function(w, h){
      this.setWidth(w);
      this.setHeight(h);
      return this;
    },
    /* {
    ():
      {this} setWidth({int} value)
    DES:
      set panel width;
    } */
    setWidth : function(value){
      value = parseInt(value);
      if(!isNaN(value)){
        var ele = this.dom;
        if(WIN.isElement(ele)){
          var maxi = DOC.getClientWidth(),
              mini = this._miniWidth,
              oValue = this.width;
          if(value > maxi)value = maxi;
          if(value < mini) value = mini;
          ele.style.width = value + "px";
          this.width = value;
          this._updateTitleWidth();
          this.fireObserver("onresize", "width", value, oValue);
        }
      }
      return this;
    },
    /* {
    ():
      {this} setHeight({int} value)
    DES:
      set panel height;
    } */
    setHeight : function(value){
      value = parseInt(value);
      if(!isNaN(value)){
        var ele = this.dom;
        if(WIN.isElement(ele)){
          var maxi = DOC.getClientHeight(),
              mini = this._miniHeight,
              oValue = this.height;
          if(value > maxi)value = maxi;
          if(value < mini) value = mini;
          ele.style.height = value + "px";
          this.height = value;
          this._updateBodyHeight(value);
          if(BROWSER.IE)setTimeout(Function.bind(this._updateBodyHeight, this, value), 1);
          this.fireObserver("onresize", "height", value, oValue);
        }
      }
      return this;
    },
    /* {
    ():
      {this} setResizable([{boolean} disable])
    DES:
      set panel resizable
    ARG:
      {boolean} disable
        (false) disable resize;
    } */
    setResizable : function(disable){
      var ele = this.dom;
      if(!WIN.isElement(ele))return this;
      
      disable = !!(disable);
      this.resizable = disable;
      var setCursor = disable ? 
        function(cell){
          var css = cell.className;
          if(css == "center")cell.style.cursor = "auto";
          else cell.style.cursor = css + "-resize";
        } :
        function(cell){
          cell.style.cursor = "default";
        };
      
      Array.each(function(row){
        Array.each(setCursor, row.cells);
      }, ele.rows);
      
      return this;
    },
    /* {
    ():
      {this} setTitle({string} text)
    DES:
      set panel title;
    } */
    setTitle : function(text){
      var ele = this.titleEle
      if(WIN.isElement(ele) && WIN.isString(text)){
        ele.innerHTML = text;
        this.title = text;
      }
      return this;
    },
    /* {
    ():
      {this} setIcon({string} src)
    DES:
      set panel icon;
    } */
    setIcon : function(src){
      var ele = this.iconEle;
      if(WIN.isElement(ele) && WIN.isString(src)){
        ele.style.backgroundImage = "url(" + src + ")";
      }
      return this;
    },
    /* {
    ():
      {this} setZIndex({int} zIndex)
    DES:
      set panel zIndex; 
      Note: panel's zIndex is managed by GUI.windowMgr;Here we just implements the method;
    } */
    setZIndex : function(zIndex){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        var o = ele.style.zIndex;
        zIndex = isNaN(zIndex) ? 0 : zIndex;
        if(zIndex != o)   ele.style.zIndex = zIndex;
      }
      return this;
    },    
    toString: function(){return "[object GUI.WndPanel]";}
  },
  WIN.ObserverProvider
);