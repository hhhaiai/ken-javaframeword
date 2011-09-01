/* statusIcon.js
*/
require.provide("sol.nodeMap.node.statusIcon");
require("sol.nodeMap.node.iconNode");
require("sol.nodeMap.node.iNodeBlinkable");

/* {
CLASS:
  NodeMap.StatusIcon
SUPERCLASS:
  NodeMap.IconNode
IMPLEMENTS:
  NodeMap.iNodeBlinkable
DES:
  StatusIcon is the iconNode used for exhibiting node's multi status;
CFG:
  {string} initStatus
PROPERTY:
  {string} status
    indicates node status;
METHOD:
  {this} initialize({object} cfg)
  {this} setStatus({string} status)
  {int} setStyleByStatus({string} status)
} */
NodeMap.StatusIcon = WIN.createClass(function(){
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
    autoBlink : false,
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
    statusList : ["0", "1", "2", "3"],
    /*
    initCfg:
      {array} statusStyleList
    DES:
      ([]) StatusIcon indicates node status changed by changing icon src.
      So, statusStyleList stores different icon src for different status;
    */
    statusStyleList : [],
    
    /* {
    ():
      {this} initialize({object} cfg)
    DES:
      initialize
    ARG:
      {object} cfg
        if cfg icon is not specified, we use this.statusStyleList[0] instead;
    } */
    initialize : function(cfg){
      WIN.extend(this, cfg);
      if(!String.notEmpty(this.icon))this.icon = this.statusStyleList[0];
      NodeMap.StatusIcon.$initialize.call(this, cfg);
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
        this.setStyleByStatus(status);
        this.fireObserver("onstatuschange");
      }
      return this;
    },
    /* {
    ():
      {int} setStyleByStatus({string} status)
    DES:
      set node style by status, node style value is stored at statusStyleList;
      StatusIcon indicates node status changed by changing icon src.
    ARG:
      {string} status
        @see setStatus method;
    } */
    setStyleByStatus : function(status){
      var degree = this.getStatusDegree(status);
      this.setIcon(this.statusStyleList[degree]);
    },
    toString: function(){return "[object NodeMap.StatusIcon]";}
  },
  NodeMap.IconNode
);
WIN.MethodPool.extendsPool(NodeMap.StatusIcon, NodeMap.iNodeBlinkable);