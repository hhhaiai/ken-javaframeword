/* toolTip.js
define GUI.ToolTip
*/
require.provide("app.gui.indicator.toolTip");
require("app.gui.indicator.textMonitor");
require("lib.evt.engin");
require("app.ani.engin");

/*
singleton:
  GUI.ToolTip
DES:
  tool tip;Inspired by Ext JS Library 1.1.1;
PROPERTY:
  {boolean} animate
  {boolean} autoHide
  {boolean} autoDismiss
  {Number} autoDismissDelay
  {boolean} hideOnDown
  {Number} hideDelay
  {boolean} interceptTitle
  {Number} showDelay
  {Class} textMonitorClass
  {Number} tipAttributeName
  {boolean} trackMouse
METHOD:
  {this} initialize()
  {void} enable()
  {void} disable()
*/
GUI.ToolTip = function(){
  var disabled = true, initialized = false;
  var showIngTarget = null;
  var hideTimer = showTimer = dismissTimer = 1;
  var tm, tt, xy;
  
  var onOver = function(evt){
    if(disabled)return ;
    
    evt = EVT.getEvt(evt);
    var target = EVT.getEvtSrc(evt);
    if(!WIN.isElement(target) || EL.isClientNode(target))return ;
    if(showIngTarget == target){
      clearTimeout(hideTimer);
      clearTimeout(dismissTimer);
      return ;
    }
    var tip = "";
    if(tt.interceptTitle && String.notEmpty(target.title)){
      tip = target.title;
      target.tip = tip;
      target.setAttribute("title", "");
      setTimeout(function(){target.removeAttribute("title")}, 1000);
    }else{
      tip = target.tip || target.getAttribute(tt.tipAttributeName);
    }
    if(tip){
      tm.setText(tip);
      xy = EVT.pointerXY(evt);
      xy.y += 18;
      showTimer = setTimeout(Function.curry(show, target), tt.showDelay);
    }
  };
  var onOut = function(evt){
    clearTimeout(showTimer);
    var target = EVT.getEvtSrc(evt);
    if(target && showIngTarget == target && tt.autoHide) {
      hideTimer = setTimeout(hide, tt.hideDelay);
    }
  };
  var onMove = function(evt){
    if(disabled) return;
    if(tt.trackMouse && showIngTarget){
      xy = EVT.pointerXY(evt);
      xy.y += 18;
      tm.showAt(xy.x, xy.y, true);
    }
  };
  var onDown = function(evt){
    var target = EVT.getEvtSrc(evt);
    if(tt.hideOnDown && target != showIngTarget){
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      hide();
    }
  };
    
  var show = function(target){
    if(disabled)return ;
    clearTimeout(dismissTimer);
    showIngTarget = target;
    tm.showAt(xy.x, xy.y, true);
    if(tt.animate){
      ANI.fadeIn(tm.ele, 1000, null, afterShow);
    }else{
      afterShow();
    }
  };
  var afterShow = function(){
    if(tt.autoDismiss){
      dismissTimer = setTimeout(hide, tt.autoDismissDelay);
    }
  };
  var hide = function(){
    clearTimeout(dismissTimer);
    clearTimeout(hideTimer);
    showIngTarget = null;
    tm.hide();
  };
  return {
    /*
    P:
      {boolean} trackMouse
    DES:
      True to have the quick tip follow the mouse as it moves over the target element (defaults to false)
    */
    trackMouse : false,
    /*
    P:
      {boolean} animate
    DES:
      True to turn on fade animation. Defaults to false 
    */
    animate : true,
    /*
    P:
      {boolean} interceptTitle
    DES:
      True to automatically use the element's title value if available (defaults to true)
    */
    interceptTitle : true,
    /*
    P:
      {boolean} hideOnDown
    DES:
      True to hide the quick tip if the user clicks anywhere in the document (defaults to true)
    */
    hideOnDown : true,
    /*
    P:
      {boolean} autoHide
    DES:
      True to automatically hide the quick tip after the mouse exits the target element (defaults to true). Used in conjunction with hideDelay.
    */
    autoHide : true,
    /*
    P:
      {boolean} autoDismiss
    DES:
      True to automatically hide the quick tip after a set period of time, regardless of the user's actions(defaults to true).  Used in conjunction with autoDismissDelay.
    */
    autoDismiss : true,
    /*
    P:
      {Number} autoDismissDelay
    DES:
      Delay in milliseconds before the quick tip hides when autoDismiss = true (defaults to 5000)
    */
    autoDismissDelay : 5000,
    /*
    P:
      {Number} showDelay
    DES:
      Delay in milliseconds before the quick tip displays after the mouse enters the target element (defaults to 500)
    */
    showDelay : 500,
    /*
    P:
      {Number} hideDelay
    DES:
      Delay in milliseconds before the quick tip hides when autoHide = true (defaults to 200)
    */
    hideDelay : 200,
    /*
    P:
      {Number} tipAttributeName
    DES:
      name of element tip attribute; (defaults to "tip")
    */
    tipAttributeName : "tip",
    /*
    P:
      {Class} textMonitorClass
    DES:
      textMonitor Class (defaults to GUI.TextMonitor)
    */
    textMonitorClass : GUI.TextMonitor,
    /*
    P:
      {string} contentPadding
    DES:
      content padding
    */
		contentPadding: "1px",
    
    /*
    ():
      {this} initialize()
    DES:
      Initialize and enable toolTip for first use. This should be called once before the first attempt to access or display toolTip in a page.
    */
    initialize : function(){
      if(initialized)return this;
      tt = GUI.ToolTip;
      tm = (new tt.textMonitorClass).initialize();
			tm.setStyle({padding: tt.contentPadding});
			
      var d = document;
      EVT.observe(d, "mouseover", onOver);
      EVT.observe(d, "mouseout", onOut);
      EVT.observe(d, "mousedown", onDown);
      EVT.observe(d, "mousemove", onMove);
      initialized = true;
      tt.enable();
      return this;
    },
    /*
    ():
      {void} enable()
    DES:
      enable toolTip
    */
    enable : function(){
      if(initialized && disabled)disabled = false;
    },
    /*
    ():
      {void} disable()
    DES:
      disable toolTip
    */
    disable: function(){
      disabled = true;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
      if(tm)tm.hide();
    },
    unknown: null
  };
}();
