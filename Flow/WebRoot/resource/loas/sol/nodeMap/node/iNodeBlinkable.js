/* iNodeBlinkable.js
defines a blink behavior interface; 
*/
require.provide("sol.nodeMap.node.iNodeBlinkable");
require("lib.core.util.methodPool");

namespace("NodeMap");
/* {
Interface:
  NodeMap.iNodeBlinkable
DES:
  iNodeBlinkable is the behavior that the node blinks on status abnormal; 
  Required properties:
    {int} basicBlinkInterval
      basic interval time of the blink behavior;
      @see _getBlinkInterval method;
    {boolean} autoBlink
      enable blink when node status becomes abnormal;
    {array} statusList
      store status list;
      the index of the list item stands for status's degree;
      first item of list should be "normal" status, its degree is 0;
    {array} statusStyleList
      style for different status;
  Required methods: 
    {int} setStyleByStatus({string} status)
      the action to change node style by status. 
PROPERTY:
  {boolean} _blinking
    indicates blinking;
  {number} _blinkTimer
    timer of blink;
FUNCTION:
  {this} _doBlink({number} t)
  {int} _getBlinkInterval([{int} degree])
  {void} _hndStatuschange()
  {int} _intervalChgStl()
  
  {this} blink()
  {int} getStatusDegree({string} status)
  {this} stopBlink()
} */
NodeMap.iNodeBlinkable = {
  /* {
  ():
    {int} _intervalChgStl()
  DES:
    interval change node style to indicate status changed;
  } */
  _intervalChgStl : function(){
    if(this._blinking){
      this.setStyleByStatus(this.statusList[0]);
      this._blinking = false;
    }
    else{
      this.setStyleByStatus(this.status);
      this._blinking = true;
    }
  },
  /* {
  ():
    {int} _getBlinkInterval([{int} degree])
  DES:
    the interval time of blink behavior depends on node status's degree;
    its formula is: time = basicBlinkInterval/degree; 
  ARG:
    {int} degree
      (1) node status's degree;
  } */
  _getBlinkInterval : function(degree){
    if(isNaN(degree ) || (degree < 1))degree = 1;
    return parseInt(this.basicBlinkInterval / degree );
  },
  /*
  ():
    {void} _doBlink({number} t)
  DES:
    do blink behavior: interval change node icon src.
  ARG:
    {number} t
      blink interval in milliseconds;
  */
  _doBlink : function(t){
    if(this.autoBlink && t >= 0){
      this.stopBlink();
      this._blinkTimer = setInterval(Function.bind(this._intervalChgStl, this), t);
    }
  },
  /* {
  ():
    {void} _hndStatuschange()
  DES:
    handler for statuschange;
  } */
  _hndStatuschange : function(){
    if(!this.autoBlink)return ;
    var degree = this.getStatusDegree(this.status);
    if(degree > 0){
      var t = this._getBlinkInterval(degree);
      this._doBlink(t);
    }
    else this.stopBlink();
  },
  
  /* {
  ():
    {int} getStatusDegree({string} status)
  DES:
    returns status degree;
  ARG:
    {string} status
      node status, should be item of this.statusList;
  } */
  getStatusDegree : function(status){
    var ind = this.statusList.indexOf(status);
    return ind;
  },
  /*
  ():
    {this} blink()
  DES:
     blink when node status becomes abnormal
  */
  blink : function(){
    if(!this.autoBlink)return ;
    var degree = this.getStatusDegree(this.status);
    if(degree > 0){
      var t = this._getBlinkInterval(degree);
      this._doBlink(t);
    }
    return this;
  },
  /*
  ():
    {this} stopBlink()
  DES:
    stop the blink and set status icon;
  */
  stopBlink :function(){
    clearInterval(this._blinkTimer);
    this.setStyleByStatus(this.status);
    return this;
  }
};

WIN.MethodPool.declare(NodeMap.iNodeBlinkable, {
  autoBlink : "boolean",
  basicBlinkInterval : "number",
  statusList : Array,
  statusStyleList : Array,
  setStyleByStatus : "function"
});
