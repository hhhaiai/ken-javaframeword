/* splitPanel.js
define layout panel
*/
require.provide("app.gui.layout.splitPanel");
require("lib.dom.style");
require("lib.core.util.ObserverProvider");

namespace("GUI.Layout");
/* {
CLASS:
  GUI.Layout.SplitPanel
SUPER:
  WIN.ObserverProvider
DES:
  defines a layout panel: it's formed of 2 sub panels, one's size is fixed while the other's is 
  autosized. Panel has 2 split ways: tb and lr which means top-bottom and left-right;
PROPERTY:
  {string} _panelCss
    (readonly) css for panel, defaults to "gui_splitPanel_" + this.splitType;
  {boolean} _splited
    (readonly) indicates panel has splited or not;
  {boolean} _autosize
    (readonly) if panel's autosize is true then its size is autoset by system;
  {int} miniWidth, miniHeight, maxiWidth, maxiHeight
    range for panel unless it's autosize;
  {int} initWidth, initHeight
    init width or height for panel
    
  {GUI.Layout.SplitPanel} autosizePanel
    (readonly) reference for the autosize panel;
  {GUI.Layout.SplitPanel} fixedsizePanel
    (readonly) reference for the fiexd size panel;
  {GUI.Layout.SplitPanel} tlPanel
    (readonly) reference for panel layouts at top or left inner;
  {GUI.Layout.SplitPanel} brPanel
    (readonly) reference for panel layouts at bottom or right inner;
  {GUI.Layout.SplitPanel} sibling
    (readonly) reference for sibling;
METHOD:
  {HTMLElement} _createSplitBar()
  {this} _setSize({string} type, {int | string} value)
  {this} _updateAutosizeView()
  {this} _updateSiblingView()
  {this} _updateChildrenView({string} type, {int} value, {int} original)
  
  {this} appendTo({HTMLElement} target)
  {int} getHeight({boolean} ignoreDisplay)
  {int} getWidth({boolean} ignoreDisplay)
  {this} initialize({HTMLElement} container, {object} cfg)
  {this} refresh()
  {this} setContent({string} html)
  {this} setHeight({int | string} value)
  {this} setInnerPanels({object} options [, {GUI.Layout.SplitPanel} trPanel, 
                                {GUI.Layout.SplitPanel} brPanel ])
  {this} setWidth({int | string} value)
  {this} split({object} options)
  {this} toggleFixedsize()
  {this} updateInnerView()
} */
GUI.Layout.SplitPanel = WIN.createClass(
  function(){
  },{
    /*
    ():
      {this} _updateChildrenView({string} type, {int} value, {int} original)
    DES:
      update children view on this resize if this is splited;
    */
    _updateChildrenView : function(type, value, original){
      if(!this._splited)return this;
      var capType = String.capitalize(type),
          getter = "get" + capType,
          setter = "set" + capType,
          auto = this.autosizePanel,
          fix = this.fixedsizePanel,
          changed = (value != original),
          v = this._verticalSplit,
          updateBoth = (!v && (type == "width")) || (v && (type == "height"));
      if(updateBoth){
        fix[setter](value);
        auto[setter](value);
      }
      else{
        if(changed){
          var s =  (value - original) + auto[getter]();
          auto[setter](s);
        }
        else{
          this._updateAutosizeView();
        }
      }
      return this;
    },
    /*
    ():
      {this} _updateSiblingView({string} type)
    DES:
      update sibling view on this resize if the sibling is autosize;
    */
    _updateSiblingView : function(type){
      var p = this.parent,          
          sib = this.sibling;
      if(p && p._splited && p._updateAutosizeView && sib && sib._autosize){
        var v = p._verticalSplit,
            needUpdate = (v && (type == "width")) || (!v && (type == "height"));
        if(needUpdate){
          p._updateAutosizeView();
        }
      }
      return this;
    },
    /*
    ():
      {this} _updateAutosizeView({booealn} ignoreDisplay)
    DES:
      update autosize item's view, when autosize item building or the fixedsize item resize;
    ARG:
      {booealn} ignoreDisplay
        @see method getWidth
    */
    _updateAutosizeView : function(ignoreDisplay){
      var auto = this.autosizePanel, fix = this.fixedsizePanel;
      if(!(auto && fix))return ;
      
      var s, type, getter, setter;
      type = this._verticalSplit ? "Width" : "Height";
      getter = "get" + type;
      setter = "set" + type;
      
      var fsize = fix[getter](ignoreDisplay), 
        sb = this.splitBar,
        ele = fix.dom;
      s = this[getter]() - fsize;
      if(sb){
        s -= sb["offset" + type];
      }
      auto[setter](s);
      return this;
    },
    
    /*
    ():
      {HTMLElement} _createSplitBar()
    DES:
      return this splitBar, if not exists then creates it;
    */
    _createSplitBar : function(vertical){
      if(WIN.isElement(this.splitBar))return this.splitBar;
      
      var sb,
          pre = "gui_splitPanel_" + (vertical ? "lr" : "tb"),
          sbCss = pre + "_sb",
          tgHtml = String.trim("<div class='tgWrap'><div class='tg'></div></div> ");
      
      sb = this.splitBar = EL.c({
        className : sbCss,
        innerHTML : tgHtml
      });
      var tg = this.splitToggler = sb.firstChild.firstChild;
      tg.onclick = Function.bind(this.toggleFixedsize, this);
      var ele = this.dom;
      ele.appendChild(sb);
      return sb;
    },
    /*
    ():
      {this} _initPanelsAutoLogic()
    DES:
      init panels's logic of autosize and fixedsize 
    */
    _initPanelsAutoLogic : function(auto, fixed){
      auto.sibling = fixed;
      fixed.sibling = auto;
      auto.parent = fixed.parent = this;
      auto._autosize = true;
      fixed._autosize = false;
      this.autosizePanel = auto;
      this.fixedsizePanel = fixed;
      return this;
    },
    /*
    ():
      {void} _setSize({string} type, {int | string} value)
    DES:
      set dom width or height unless the dom's display is none;
      if size changed it'll fire onresize event;
    ARG:
      {string} type
        size type: "width" or "height";
      {int | string} value
        only these value are suitable: 100px || 100; 
        Note: values like "50%" will be parsed to int;
    */
    _setSize : function(type, value){
      var ele = this.dom;
      if(!WIN.isElement(ele) || ele.style.display == "none")return this;
      var capType = String.capitalize(type),
          getter = "get" + capType,
          setter = "set" + capType,
          original = this[getter](),
          maxi = this["maxi" + capType],
          mini = this["mini" + capType];
      
      value = parseInt(value);
      if(value < 0) value = 0;
      if( !isNaN(value) && !this._autosize ){
        if(!isNaN(maxi) && value > maxi) value = maxi;
        else if(!isNaN(mini) && value < mini)value = mini;
      }
     
      if(!isNaN(value)){
				if(BROWSER.Gecko && type=="width" && value > 20)value = value - 2;
        ele.style[type] = value + "px";
      }
      if(this._splited)this._updateChildrenView(type, value, original);
      this._updateSiblingView();
      if(value != original)this.fireObserver("onresize", type);
      
      return this;
    },
    /*
    ():
      {this} initialize({HTMLElement} container, {object} cfg)
    DES:
      apply cfg and set panel size;
    ARG:
      {HTMLElement} container
        a container for panel dom;
      {object} cfg
        it supports these options:
        {int} miniWidth, miniHeight, maxiWidth, maxiHeight
          range for panel unless it's autosize;
        {int} initWidth, initHeight
          init width or height for panel
    */
    initialize : function(container, cfg){
      WIN.extend(this, cfg);
      var ele = this.dom = DOC.c("div");
      if(this._panelCss)ele.className = this._panelCss;
      if(WIN.isElement(container)){
        container.appendChild(ele);
      }
      this.setWidth(this.initWidth);
      this.setHeight(this.initHeight);
      this.addObservers("onresize");
      //this.addObservers("onsplit");
      return this;
    },
    /*
    ():
      {int} getWidth({boolean} ignoreDisplay)
    DES:
      get dom style width or offsetWidth;
    ARG:
      {boolean} ignoreDisplay
        (optional, false) if true,it returns the theoritical width value 
        and care nothing about the display of the dom;
    */
    getWidth : function(ignoreDisplay){
      var ele = this.dom;
      if(!WIN.isElement(ele))return 0;
      var s = ele.style;
      if(!ignoreDisplay && s.display == "none")return 0;
      return parseInt(s.width) || ele.offsetWidth;
    },
    /*
    ():
      {int} getHeight()
    DES:
      get dom style height or offsetHeight;
    ARG:
      {boolean} ignoreDisplay
        @see method getWidth
    */
    getHeight : function(ignoreDisplay){
      var ele = this.dom;
      if(!WIN.isElement(ele))return 0;
      var s = ele.style;
      if(!ignoreDisplay && s.display == "none")return 0;
      return parseInt(s.height) || ele.offsetHeight;
    },
    /*
    ():
      {this} setWidth({int | string} value)
    DES:
      set this dom style width;
    ARG:
      @see method _setSize
    */
    setWidth : function(value){
      return this._setSize("width", value);
    },
    /*
    ():
      {this} setHeight({int | string} value)
    DES:
      set this dom style height;
    ARG:
      @see method _setSize
    */
    setHeight : function(value){
      return this._setSize("height", value);
    },
    /* {
    ():
      {this} split({object} options)
    DES:
      split to 2 panels;
    ARG:
      {object} options
        @see method setInnerPanels
    RTN:
      return true if split success;
    e.g.
      var mySp = new GUI.Layout.SplitPanel();
      mySp.split({
        isVertical : false,
        showSplitBar : false,
        brFixed : false,
        fixedCfg : {
          miniHeight : 200
        }
      });
    } */
    split : function(options){
      return this.setInnerPanels(options);
    },
    /* {
    ():
      {this} appendTo({HTMLElement} target)
    DES:
      append to a HTMLElement;
    } */
    appendTo : function(target){
      var isElement = WIN.isElement;
      if(  isElement(target) && isElement(this.dom) ){
        target.appendChild(this.dom);
        this.refresh();
      }
      return this;
    },
    /* {
    ():
      {this} setInnerPanels({object} options [, {GUI.Layout.SplitPanel} trPanel, 
                                    {GUI.Layout.SplitPanel} brPanel ])
    DES:
      append 2 panels; if trPanel or brPanel is not exists, creates new panel instead;
      Note: this method has known bug, you should refresh this view after calling this, 
      see _fixBug_AppendPanels method of GUI.Layout.bodyPanel for bug fixing details;
    ARG:
      {object} options
        it supports these options:
        @{boolean} isVertical
          (optional, false) specify split type: vertical or horizontal;
          if true, split to top panel and bottom panel, else to left and right;
        @{boolean} showSplitBar
          (optional, false) show splitBar bt tlPanel and brPanel;
        @{boolean} brFixed
          (optional, false) when a panel spilted to 2 sub panels(tlPanel or brPanel), 
          one of the sub is autosize and the other is fixedsize. 
          autosize means panel's size is auto set by system.
          brFixed specifys brPanel to be fixedsize;
        @{object} fixedCfg
          cfg for fixedsize panel,it supports these options:
          @@{int} miniWidth, miniHeight, maxiWidth, maxiHeight
            range for fixedsize panel unless it's autosize;
          @@{int} initWidth, initHeight
            init width or height for fixedsize panel
    e.g.
      bp.setInnerPanels({
        isVertical : true,
        showSplitBar : true,
        brFixed : false,
        fixedCfg : {
          initWidth : 200
        }
      },null, myPanel);
      bp._fixBug_AppendPanels();
    } */
    setInnerPanels : function(options, trPanel, brPanel){
      if(this._splited)return this;
      var tl, br,
          ele = this.dom,
          P = GUI.Layout.SplitPanel,
          o = options || {},
          vertical = o.isVertical,
          css = "gui_splitPanel_" + (vertical ? "lr" : "tb"),
          tlCfg = {_panelCss : css},
          brCfg = {_panelCss : css};
      
      if(o.brFixed) WIN.extend(brCfg, o.fixedCfg);
      else WIN.extend(tlCfg, o.fixedCfg);
      
      if(tl = trPanel){
        ele.appendChild(tl.dom);
        EL.addClass(tl.dom, css);
        tl.setWidth(tlCfg.initWidth);
        tl.setHeight(tlCfg.initHeight);
      }
      else{
        tl = (new P).initialize(ele, tlCfg);
      }
      this.tlPanel = tl;
      if(o.showSplitBar) this._createSplitBar(vertical);
      if(br = brPanel){
        ele.appendChild(br.dom);
        EL.addClass(br.dom, css);
      }
      else{
        br = (new P).initialize(ele, brCfg);
      }
      this.brPanel = br;
      
      if(o.brFixed)this._initPanelsAutoLogic(tl, br);
      else this._initPanelsAutoLogic(br, tl);
      this._verticalSplit = vertical;
      
      this._splited = true;
      this._updateAutosizeView();
      //this.fireObserver("onsplit");
      return this;
    },
    /*
    ():
      {this} refresh()
    DES:
      refresh this size and inner view;
    */
    refresh : function(){
      this.setWidth(this.getWidth());
      this.setHeight(this.getHeight());
      return this;
    },
    /*
    ():
      {this} updateInnerView()
    DES:
      update view on this resize or on toggle if this is splited;
    */
    updateInnerView : function(){
      this._updateChildrenView("width", this.getWidth());
      this._updateChildrenView("height", this.getHeight());
      return this;
    },
    /*
    ():
      {this} setContent({string} html)
    DES:
      set content
    */
    setContent : function(html){
      if(!this._splited && WIN.isString(html)){
        var ele = this.dom
        ele.innerHTML = html;
      }
      return this;
    },
    /*
    ():
      {this} setContent({object} style)
    DES:
      set style
    */
    setStyle : function(style){
      if(!style)return ;      
      var s = WIN.extendExclude({}, style, ["width", "height"]);
      EL.setStyle(this.dom, s);
      this.setWidth(style.width);
      this.setHeight(style.height);
      return this;
    },
    /*
    ():
      {this} toggleFixedsize()
    DES:
      toggle fixedsizePanel's display;
      when we toggle the display of fixedsize panel from "none" to "block",
      because of the total size is bigger than parent's at the tiem, the autosizePanel will 
      slide down. So we need to set autosizePanel size before the toggle;
    */
    toggleFixedsize : function(){
      var p = this.fixedsizePanel;
      if(p){
        var display = "block", 
            ele = p.dom;
        if(!WIN.isElement(ele))return ;
        if(ele.style.display == "none"){
          this._updateAutosizeView(true);
          p.setStyle({display : "block"});
        }
        else{
          p.setStyle({display : "none"});
          this._updateAutosizeView();
        }
        this.updateInnerView();
      }
      return this;
    },
    toString : function(){
      return "[object GUI.Layout.SplitPanel]";
    }
  },
  WIN.ObserverProvider
);