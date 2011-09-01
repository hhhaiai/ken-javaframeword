/* baseNode.js
*/
require.provide("sol.nodeMap.node.baseNode");
require("lib.core.util.ObserverProvider");
require("app.gui.indicator.textMonitor");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.BaseNode
SUPERCLASS:
  WIN.ObserverProvider
DES:
  BaseNode is a HTMLElement which uses a TextMonitor to display node tip.
CFG:
  {HTMLElement} container
		dom container;
  {string} description
		("") node description;
  {boolean} initAutoDisplayDes
		(false) if true auto show(onmouseover) | hide(onmouseout) description.
PROPERTY:
  {int} _domTag
		tag for node's dom;
  {int} _descriptionHideDelay
		(100 ms) delay time to hide descriptionMonitor;
  {number} _desHideTimer
    timer of delay hide descriptionMonitor;
  {GUI.TextMonitor}  _descriptionMonitor
    description info monitor;
  
  {HTMLElement} dom
    we expand an ownerObject property to dom to access this node reference;
	{boolean} showing
	  (true) indicates node display;
METHOD:
  {void} _initInfoMonitor()
  {void} _initDom()
  
  {this} build()
  {this} delayHideDescription()
  {void} dispose()
  {this} hideDescription()
  {this} initialize()
  {this} setStyle()
  {this} setDescription({string} text)
  {this} showDescription()
} */
NodeMap.BaseNode = WIN.createClass(function(){
  },{    
		initAutoDisplayDes : false,
    container : null,
    description : "",
    _domTag : "div",
    _descriptionHideDelay : 100,
    
    /* {
    ():
      {this} initialize({object} cfg)
    DES:
      apply cfg;
    } */
    initialize : function(cfg){
      WIN.extend(this, cfg);
			this.showing = true;
      this.build();
			return this;
    },
    /* {
    ():
      {void} dispose()
    DES:
      dispose node;
    } */
    dispose : function(){
			try{
				if(this._descriptionMonitor)this._descriptionMonitor.dispose();
				delete this._descriptionMonitor;
				if(WIN.isElement(this.dom)){
					this.dom.ownerObject = null;
					EL.destoryNode(this.dom);
					delete this.dom;
				}
			}catch(e){}
    },
    /* {
    ():
      {this} build()
    DES:
      build and init dom;
    } */
    build : function(){
      var ele = this.dom = DOC.c(this._domTag),
          ctn = this.container;
      if(WIN.isElement(ctn))ctn.appendChild(ele);
      this._initDom();
			this._initInfoMonitor();
      return this;
    },
    /* {
    ():
      {this} setStyle()
    DES:
      set dom style;
    } */
    setStyle : function(style){
      EL.setStyle(this.dom, style);
      return this;
    },
    /*
    ():
      {this} setDescription({string} text)
    */
    setDescription : function(text){
      if(WIN.isString(text)){
        this.description = text;
        this._descriptionMonitor.setText(text);
      }
      return this;
    },
    /* {
    ():
      {this} hide()
    DES:
      hide node;
    } */
    hide : function(){
			if(!this.showing) return this;
      var ele = this.dom;
      if(WIN.isElement(ele)){
        ele.style.display = "none";
				this.showing = false;
      }
			return this;
    },
    /* {
    ():
      {this} show()
    DES:
      show node;
    } */
    show : function(){
			if(this.showing) return this;
      var ele = this.dom;
      if(WIN.isElement(ele)){
        ele.style.display = "";
				this.showing = true;
      }
			return this;
    },
    /*
    ():
      {this} showDescription()
    DES:
      show description;
    */
    showDescription : function(evt){
      var ele = this.dom;
      if(this._desHideTimer)clearTimeout(this._desHideTimer);
      
      if(WIN.isElement(ele) && String.notEmpty(this.description)){
        var m = this._descriptionMonitor;
        if(!m.isShow){
					m.showAtEvent(evt, 16, 16, true);
				}
      }
      return this;
    },
    /*
    ():
      {this} hideDescription()
    DES:
      hide description;
    */
    hideDescription : function(){
      var m = this._descriptionMonitor;
      if(m) this._descriptionMonitor.hide();
      return this;
    },
    /*
    ():
      {this} delayHideDescription()
    DES:
      delay to hide description;
    */
    delayHideDescription : function(){
      var m = this._descriptionMonitor;
      if(m && m.isShow){
        var f = Function.bind(this.hideDescription, this)
        this._desHideTimer = setTimeout(f, this._descriptionHideDelay);
      }
      return this;
    },
    
    /*
    ():
      {void} _initInfoMonitor()
    DES:
      init this infoMonitor(GUI.TextMonitor);
    */
    _initInfoMonitor : function(){
      var m = this._descriptionMonitor = new GUI.TextMonitor;
      m.initialize(this.description, {container: document.body});
      m.setStyle({padding: "2px"});
    },
    /* {
    ():
      {void} _initDom()
    DES:
      init dom onmouseover, onmouseout handler
    } */
    _initDom : function(){
      var ele = this.dom,
          bind = Function.bind;
      if(this.initAutoDisplayDes){
				ele.onmouseover = bind(this.showDescription, this);
				ele.onmouseout = bind(this.delayHideDescription, this);
			}
      ele.ownerObject = this;
    },
    toString: function(){return "[object NodeMap.BaseNode]";}
  },
  WIN.ObserverProvider
);
