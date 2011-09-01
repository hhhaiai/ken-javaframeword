/* statusNode.js
defined node which is used to response a device's nodeDescription; 
*/
require.provide("sol.NMS.node.baseStatusNode");
require("sol.NMS.node.baseNode");
require("app.gui.indicator.textMonitor");

namespace("NMS");
NMS.StatusNode = WIN.createClass(
  function(){
  },{
    /*
    cfg:
      {int} normalBlinkInterval
    DES:
      blink interval for normal status;the blink interval depends on this status;its formula is 
      interval = normalBlinkInterval/this.status;
    */
    normalBlinkInterval : 1000,
    /*
    cfg:
      {boolean} enableIntervalBlink
    DES:
      enable interval blink when exceptional status,(defaults to false);
    */
    enableIntervalBlink : false,
    /*
    cfg:
      {array} statusImgList
    DES:
      status img src List.
    */
    statusImgList : null,
    /*
    ():
      {this} initialize(id, nodeDescription, {object} options)
    DES:
      initialize interface,add new handle(dispose) to window unload event;
    ARG:
      {object} options
        options are extended as this's props;
    */
    initialize : function(id, options){
      var opt = WIN.extend({
        id : id,
        ele : $(id)
      }, options);
      
      NMS.StatusNode.$initialize.call(this, opt);      
      this.setStatus(0);
      EVT.observe(window, "unload", Function.bind(function(){
        try{this.ele._this.dispose();}catch(e){}
      }, this));
      
      return this;
    },
    /*
    ():
      {void} dispose()
    DES:
      dispose object;
    */
    dispose : function(){
      this.ele._this = null;
      this.ele = undefined;
    },
    /*
    ():
      {void} build({boolean} fireOnBuild)
    DES:
      initInfoMonitor & initBehaviors;
    */
    build : function(fireOnBuild){
      NMS.StatusNode.$build.call(this, false);
      
      var ele = this.ele;
      ele._this = this;
      ele.id = this.id;//sometimes ele is created by js so we need to set id to it;
      
      this.initBehaviors();
      this.initInfoMonitor();
      this.initStatusObserver();
      
      if(fireOnBuild)this.onBuild();
    },
    /*
    ():
      {void} initBehaviors()
    DES:
      init this event behaviors, implements it in sub class;
    */
    initBehaviors : Function.empty,
    /*
    ():
      {void} initInfoMonitor()
    DES:
      init this infoMonitor
    */
    initInfoMonitor : function(){
      var m = this.infoMonitor = new GUI.TextMonitor;
      m.initialize("", {container: document.body});
      m.setStyle({padding: "2px"});
    },
    /*
    ():
      {void} initStatusObserver()
    DES:
      init statusObserver.
    */
    initStatusObserver : function(imgs){
      var o = this.statusObserver = new WIN.Observer;
      /* here the param zero is required otherwise the blink fn will default accept this status as its parameter */
      o.add(Function.bind(this.blink, this, 0));
    },
    
    /*
    ():
      {object || null} getStyleByStatus({int} status)
    DES:
      get style by status; here we return a obj whose backgroundImage is depended on status;
    */
    getStyleByStatus : function(status){
      var bg = this.statusImgList[status];
      return {backgroundImage: ("url(" + bg + ")")};
    },
    /*
    ():
      {void} setStatus({int} status)
    DES:
      set node status.
      if status is valid and not equal to this.status then it'll trigger onStatusChange event;
    */
    setStatus: function(status){
      status = parseInt(status);
      if(isNaN(status) || (status == this.status))return ;
      
      this.status = status;
      
      var style = this.getStyleByStatus(status);
      if(style)this.setStyle(style);
      
      this.onStatusChange(status);
    },
    /*
    ():
      {void} onStatusChange({int} status)
    DES:
      event fires on status change, executes this.statusObserver
    */
    onStatusChange: function(status){
      this.statusObserver.execute(status);
    },
    
    /*
    ():
      {string} getNodeDescription()
    */
    getNodeDescription : function(){
      return this.nodeDescription;
    },
    /*
    ():
      {this} setNodeDescription({string} value)
    */
    setNodeDescription : function(value){
      if(this.nodeDescription == value)return this;
      this.nodeDescription = value;
      this.infoMonitor.setText(value);
      return this;
    },
    /*
    ():
      {void} showNodeDescription()
    */
    showNodeDescription : function(){
      this.infoMonitor.showAtElement(this.ele, "ee", true);
    },
    /*
    ():
      {void} hideNodeDescription()
    */
    hideNodeDescription : function(){
      this.infoMonitor.hide();
    },
    
    _intervalChgStyle : function(){
      var state = this._intervalBlinkState;
      var s, s1 = this.getStyleByStatus(0), s2 = this.getStyleByStatus(this.status);

      if(state == 0){
        s = s1;
        this._intervalBlinkState = 1;
      }
      else {
        s = s2;
        this._intervalBlinkState = 0;
      }
      this.setStyle(s);
    },
    /*
    ():
      {returntype} blink({number} t)
    DES:
      statusNode normal behavior:blink when status is exceptional.
    ARG:
      {number} t
      blinkInterval in milliseconds (defaults to this.normalBlinkInterval/this.status;);
    */
    blink : function(t){
      if(this.canBlink()){
        t = t || (this.normalBlinkInterval/this.status);
        this.stopBlink();
        this.blinkTimer = setInterval(Function.bind(this._intervalChgStyle, this), t);
      }
    },
    /*
    ():
      {returntype} canBlink()
    DES:
      check this can blink or not.
    */
    canBlink : function(){
      return (this.enableIntervalBlink && (this.status > 0));
    },
    /*
    ():
      {returntype} stopBlink()
    DES:
      stop blink behavior;
    */
    stopBlink :function(){
      clearInterval(this.blinkTimer);
    },
    unknown: null  
  },
  NMS.BaseNode
);
