/* statusLink.js
*/
require.provide("sol.nodeMap.node.statusLink");
require("sol.nodeMap.node.linkNode");
require("sol.nodeMap.node.iNodeBlinkable");

NodeMap.StatusLink = WIN.createClass(function(){
  },{
    /*
    initCfg:
      {string} initStatus
    DES:
      ("1") node initial status;
    */
    initStatus : "1",
    /*
    initCfg:
      {boolean} autoBlink
    DES:
      (true)
    */
    autoBlink : true,
    /*
    initCfg:
      {int} basicBlinkInterval
    DES:
      (1000 ms)
    */
    basicBlinkInterval : 1000,
    /*
    initCfg:
      {array} statusList
    DES:
      (["1", "2", "3", "4"])
    */
    statusList : ["1", "2", "3", "4"],
    /*
    initCfg:
      {array} statusStyleList
    DES:
      (["#000", "#FFCC00", "#FF0000", "#CCC"]) // ("black", "yellow", "red", "gray") 
      StatusLink indicates node status changed by changing node stroke color.
      So, statusStyleList stores different color for different status;
    */
    statusStyleList : ["#000", "#FFCC00", "#FF0000", "#CCC"],
    
    /* {
    ():
      {this} initialize({object} cfg)
    DES:
      initialize
    ARG:
      {object} cfg
        if cfg initColor is not specified, we use this.statusStyleList[0] instead;
    } */
    initialize : function(cfg){
      if(!String.notEmpty(this.initColor))this.initColor = this.statusStyleList[0];
      
      NodeMap.StatusLink.$initialize.call(this, cfg);
      this.addObservers("onstatuschange");
      this.addListener("onstatuschange", Function.bind(this._hndStatuschange, this) );
      
      this.setStatus(this.initStatus);
      return this;
    },
    /* {
    ():
      {this} setStatus({string} status)
    DES:
      set node status, fires onstatuschange observer
    ARG:
      {string} status
        node status, should be item of this.statusList;
    } */
    setStatus : function(status){
      if(this.status != status){
        this.status = status;
        this.setStrokecolor(status);
				this.normalColor = this.getStatusStyle(status);
        this.fireObserver("onstatuschange");
      }
      return this;
    },
    /* {
    ():
      {string} getStatusStyle({string} status)
    DES:
      return status corresponding style;
    ARG:
      {string} status
        @see setStatus method;
    } */
    getStatusStyle : function(status){
      var degree = this.getStatusDegree(status);
      return this.statusStyleList[degree];
    },
    /* {
    ():
      {int} setStyleByStatus({string} status)
    DES:
      the interval time of blink behavior depends on node status's degree;
      its formula is: time = basicBlinkInterval/degree; 
    ARG:
      {string} status
        @see setStatus method;
    } */
    setStyleByStatus : function(status){
      this.setStrokecolor(this.getStatusStyle(status));
    },
    toString: function(){return "[object NodeMap.StatusLink]";}
  },
  NodeMap.LinkNode
);
WIN.MethodPool.extendsPool(NodeMap.StatusLink, NodeMap.iNodeBlinkable);
