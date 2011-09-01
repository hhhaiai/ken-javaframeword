/***************************************************************
buttonbase.js
defined GUI.ButtonBase module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.btn.buttonbase");
//require resource
require("app.gui.engin");
require("lib.evt.engin");

/*
CLASS:
  GUI.ButtonBase
DES:
  GUI.ButtonBase defined button default behavior;
PROPERTY:
  {object} btnStatusStyle
    style for different status
  {object} btnStatusPriority
    button status priority
  {object} options
    options for button
  {object} layout
    layout options
  {WIN.Observer} btnStatusObserver
    observe status change;
  {boolean} focused
    is button focused
  {boolean} disabled
    is button disabled
METHOD:
  {this} initialize({object} options)
  {void} _setDefaultEvents()
  {boolean} _setBtnStatus([ {string} status ])
  {void} addCommand({function} cmd, {string} type)
  {void} build()
  {void} blur()
  {void} disable()
  {void} enable()
  {void} focus()
  {string} getBtnStatus()
  {string} getElementBtnStatus({HTMLElement} btn)
  {void} handleOptions()
	{void} hide()
  {void} hndOnMouseover
  {void} hndOnMousedown
  {void} hndOnMouseup
  {void} hndOnMouseout
  {void} hndOnClick
  {void} hndSetNormalStyle({HTMLElement} btn, {object} style)
  {void} onBlur
  {void} onBtnStatusChange({HTMLElement} btn)
  {void} onFocus
  {void} regDefaultBtnStatus()
  {void} regBtnStatusStyle({string} status, {object} style)
  {void} regBtnStatusPriority({string} status, {int} priority)
  {void} removeCommand({function} cmd, {string} type)
  {boolean} setBtnStatus({string} status)
  {void} setBtnStyleByStatus({HTMLElement} btn)
  {boolean} setToNormalStatus()
	{void} show()
*/
GUI.ButtonBase = function(){
  /*
  ():
    {this} initialize({object} options)
  DES:
    initialize layout options,and other options.
  ARG:
    {object} layout
      layout options, default:
      {
        styleNormal    : {backgroundPosition: "0% 0%"},
        styleFocused   : {backgroundPosition: "0% 50%"},
        styleDisabled  : {backgroundPosition: "0% 0%"}
      }
      
  */
  this.initialize = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
      layout         : {
        styleNormal    : {backgroundPosition: "0% 0%"},
        styleFocused   : {backgroundPosition: "0 50%"},
        styleDisabled  : {backgroundPosition: "0% 0%"}
      },
      unknown : null
      }, options, ["layout"]);
    WIN.extend(opt.layout, options.layout);
    
    this.handleOptions(opt);
    WIN.extend(this, opt);
    
    this.btnStatusStyle = {};
    this.btnStatusPriority = {};
    this.btnStatusObserver = new WIN.Observer();
    this.btnStatusObserver.add(Function.bind(this.setBtnStyleByStatus, this));    
    this.regDefaultBtnStatus();
    
    this.build();
		if(WIN.isFunction(this.cmd))this.addCommand(this.cmd);
    return this;
  };
  /*
  ():
    {void} handleOptions()
  DES:
    handle Options:set layout.bgPos_over & layout.bgPos_down by layout.height;
    {
      bgPos_over : - height, //bgPos_over is the button background position onmouseover.
      bgPos_down : - height * 2    
    }    
  */
  this.handleOptions = function(options){
    var layout = options.layout;
    var h = parseInt(layout.height);
    if(!WIN.isDefined(layout.bgPos_over))layout.bgPos_over = - h  + "px";
    if(!WIN.isDefined(layout.bgPos_down))layout.bgPos_down = - (h * 2) + "px";    
  };
  /*
  ():
    {void} build()
  DES:
    build the button.You should define this._buildView in sub class to build different button.
  */
  this.build = function(){
    this._buildView();
    this._setDefaultEvents();
    this.onBuild();
  };
  this.onBuild = Function.empty;
  /*
  ():
    {void} addCommand({function} cmd, {string} type)
  DES:
    add command for button
  ARG:
    {string} type
      (optional),the event type to trigger the command. default is click;
  */
  this.addCommand = function(cmd, type){
    var ele = this.ele, _this = this;
		var cmds = this.cmds;
		var command = Function.curry(function(c){
			if(!_this.disabled)c();
		}, cmd);
		
    if(WIN.isElement(ele)) EVT.observe(ele, (type || "click"), command);
  };
  /*
  ():
    {void} removeCommand({function} cmd, {string} type)
  DES:
    remove appointed command
  this.removeCommand = function(cmd, type){
    var ele = this.ele;
    if(WIN.isElement(ele)) EVT.stopObserving(ele, (type || "click"), cmd);
  };
  */
  
  //set or unset btn's btnStatus:(Focused|Disabled)
  /*
  ():
    {void} focus()
  DES:
    set focus on button fire onFocus event
  */
  this.focus = function(){
    if( this.setBtnStatus("Focused") ){
      this.focused = true;
      this.onFocus();
    }
  };
  this.onFocus = Function.empty;
  /*
  ():
    {void} blur()
  DES:
    set button blur fire onBlur event
  */
  this.blur = function(){
    if( this.setToNormalStatus() ){
      this.focused = false;
      this.onBlur();
    }
  };
  this.onBlur = Function.empty;
  /*
  ():
    {void} hide()
  DES:
    hide button
  */
  this.hide = function(){
		var ele = this.ele;
    if(WIN.isElement(ele))ele.style.display = "none";
  };
  /*
  ():
    {void} show()
  DES:
    show button
  */
  this.show = function(){
		var ele = this.ele;
    if(WIN.isElement(ele))ele.style.display = "";
  };
  /*
  ():
    {void} disable()
  DES:
    set button disabled
  */
  this.disable = function(){
    if( this.setBtnStatus("Disabled") ) this.disabled = true;
  };
  /*
  ():
    {void} enable()
  DES:
    enable button
  */
  this.enable = function(){
    if( this.setToNormalStatus() ) this.disabled = false;
  };
  
  /*
  ():
    {void} _setDefaultEvents()
  DES:
    set default button behavior(events)
  */
  this._setDefaultEvents = function(){//setBtnStyleByStatus
    var ele = this.ele;
    if(! WIN.isElement(ele)) return;
    EL.setAttr(ele, {
      onmouseover : this.hndOnMouseover,
      onmousedown : this.hndOnMousedown,
      onmouseup   : this.hndOnMouseover,
      onmouseout  : this.hndOnMouseout
    });
  };
  //handles for button element events to set button diefferent status style,default we just change the element's bgPos style.
  this.hndOnMouseover = Function.curry(function(obj){
      obj.hndSetNormalStyle(this, {backgroundPosition: "0% " + obj.layout.bgPos_over});
    }, this);
  this.hndOnMousedown = Function.curry(function(obj, evt){
			evt = EVT.Event.fix(evt, true);
			if(evt.leftClick){
				obj.hndSetNormalStyle(this, {backgroundPosition: "0% " + obj.layout.bgPos_down});
			}
    }, this);
  this.hndOnMouseout = Function.curry(function(obj){
      obj.hndSetNormalStyle(this, obj.layout.styleNormal);
    }, this);
/*
  //on click set focus on button .this function must defined behind method focus;
  this.hndOnClick = Function.bind(this.focus, this);
*/
  
  /*
  ():
    {void} hndSetNormalStyle({HTMLElement} btn, {object} style)
  DES:
    if the button' btnStatus is normal set button style by assigned style.
  ARG:
    {HTMLElement} btn
      button element
    {object} style
      style json obj
  */
  this.hndSetNormalStyle = function(btn, style){
    var s = String.trim(btn.btnStatus.toLowerCase());
    if(s != "normal")return;
    this.setBtnItemsStyle(btn, style);
  };
  
  /*
  ():
    {string} getElementBtnStatus({HTMLElement} btn)
  DES:
    get btnStatus from btn element's ,if it's undefined return undefined;
  */
  this.getElementBtnStatus = function(btn){
    if(!WIN.isElement(btn)) return undefined;
    var s = btn.btnStatus;
    if(!s) return undefined;
    return String.trim(s.toLowerCase());
  };
  /*
  ():
    {string} getBtnStatus()
  DES:
    get this.ele's btnStatus
  */
  this.getBtnStatus = function(){
    var ele = this.ele;
    if(WIN.isElement(ele)) return ele.btnStatus;
  };
  /*
  ():
    {void} regDefaultBtnStatus()
  DES:
    register the default button status and their priority;
  */
  this.regDefaultBtnStatus = function(){
    var stl = this.layout;
    this.regBtnStatusStyle("Normal", stl.styleNormal);
    this.regBtnStatusPriority("Normal", 0);
    this.regBtnStatusStyle("Focused", stl.styleFocused);
    this.regBtnStatusPriority("Focused", 2);
    this.regBtnStatusStyle("Disabled", stl.styleDisabled);
    this.regBtnStatusPriority("Disabled", 5);
  };
  
  /*
  ():
    {void} setBtnStyleByStatus({HTMLElement} btn)
  DES:
    set button style by getting style from btn's btnStatus. triggered on btn status change;You should define setBtnItemsStyle in sub class for the button element may be formed of many items so we need to set each item's style.
  ARG:
    {HTMLElement} btn
      button element
  */
  this.setBtnStyleByStatus = function(btn){
    var style = this.btnStatusStyle[this.getElementBtnStatus(btn)];
    if(!style)return;
    this.setBtnItemsStyle(btn, style);
  };
  /*
  ():
    {boolean} setBtnStatus({string} status)
  DES:
    set btn's btnStatus;if status's priority is greater than current's or btnStatus is undefined ,return true;
  */
  this.setBtnStatus = function(status){
    var s = this.getBtnStatus();
    if(!s)return this._setBtnStatus(status);
    s = s.toLowerCase(), status = status.toLowerCase();
    var P = this.btnStatusPriority, _p = P[s], p_= P[status];
    if(p_ >= _p)return this._setBtnStatus(status);
    return false;
  };
  /*
  ():
    {boolean} setToNormalStatus()
  DES:
    set btn's btnStatus to "normal";
  */
  this.setToNormalStatus = function(){
    return this._setBtnStatus();
  };
  /*
  ():
    {boolean} _setBtnStatus([ {string} status ])
  DES:
    (private) set btn's btnStatus;
  ARG:
    {string} status
      (optional) default is "normal"
  */
  this._setBtnStatus = function(status){
    var ele = this.ele;
    if(! WIN.isElement(ele)) return;
    ele.btnStatus = (status || "normal");
    this.onBtnStatusChange(ele);
    return true;
  };
  /*
  ():
    {void} onBtnStatusChange({HTMLElement} btn)
  DES:
    occured when btn status changed,but if you want do something onBtnStatusChange please use this.btnStatusObserver.add();
  */
  this.onBtnStatusChange = function(btn){
    this.btnStatusObserver.execute(btn);
  };
  /*
  ():
    {void} regBtnStatusStyle({string} status, {object} style)
  DES:
    register a style for different btn status 
  ARG:
    {string} status
      btn status
    {object} style
      json style object
  */
  this.regBtnStatusStyle = function(status, style){
    this.btnStatusStyle[status.toLowerCase()] = style;
  };
  /*
  ():
    {void} regBtnStatusPriority({string} status, {int} priority)
  DES:
    The btn of contont table(this.contentTable) has different status,we use priority to indicate the importance bt them.This method registers a priority of btn status .
  ARG:
    {string} status
      btn status
    {int} priority
      the btn status's priority
  */
  this.regBtnStatusPriority = function(status, priority){
    this.btnStatusPriority[status.toLowerCase()] = priority;
  };
};