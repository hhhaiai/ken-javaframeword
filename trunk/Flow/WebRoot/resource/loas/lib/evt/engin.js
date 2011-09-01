/***************************************************************
engin.js
event's engin
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.evt.engin");
//register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
require.registerPackage("lib.evt",{files   :["keycodeconst"]});

/*
NAMESPACE:
  EVT
DES:
  event properties and functions
PROPERTY:
  {object} KEY
METHOD:
  {void} cancelB({event} evt)
  {void} cancelD({event} evt)
  {void} cancelBnD({event} evt)
  {event} getEvt({event} evt)
  {HTMLelement | null} getEvtSrc({event} evt)
  {int} offsetX({event} evt)
  {int} offsetY({event} evt)
  {void} onBodyReady({function} callback, {int} freq)
  {int} pointerX({event} evt)
  {int} pointerY({event} evt)
*/
WIN.extend(EVT,{
  /*
  ():
    {void} EVT.cancelB([evt])
  DES:
    cancel event bubble
  ARG:
    evt:provide argument evt is a good habit and can improve efficiency.
  */
  cancelB     : function (evt){
    evt = EVT.getEvt(evt);
		//compat page comm sol;
		if(typeof page == "object" && WIN.isFunction(page.notifyFocused)){page.notifyFocused();}
    if(evt.stopPropagation) return evt.stopPropagation();
    else return evt.cancelBubble=true;
  },
  /*
  ():
    {void} EVT.cancelD([evt])
  DES:
    cancel event default action
  */
  cancelD     : function (evt){
    evt = EVT.getEvt(evt);
    if(evt.preventDefault) evt.preventDefault();
    else evt.returnValue=false;
  },
  /*
  ():
    {void} EVT.cancelBnD([evt]);
  DES:
    cancel event bubble and default
  */
  cancelBnD   : function (evt){
    EVT.cancelB(evt);
    EVT.cancelD(evt);
  },
  /*
  ():
    {event} getEvt([evt])
  DES:
    get event obj
  */
  getEvt      : function (evt){
    evt = evt || window.event;
    if (!evt) {
      var c = arguments.callee.caller;
      while (c) {
        evt =c.arguments[0];
        if (evt && Event == evt.constructor) {break;}
        c=c.caller;
      }
    }
    return evt;
  },
  /*
  ():
    {HTMLelement | null} getEvtSrc({event} evt)
  DES:
    get event target
  */
  getEvtSrc   : function (evt){
    evt = EVT.getEvt(evt);
    return (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  },
  /*
  PROPERTY:
    {object} KEY
  DES:
    key code const
  */
  KEY:{
    BACKSPACE: 8,
    TAB:       9,
    RETURN:   13,
    ENTER:    13,
    ESC:      27,
    ESCAPE:   27,
    SPACE:    32,
    PAGEUP:   33,
    PAGEDOWN: 34,
    HOME:     36,
    END:      35,
    LEFT:     37,
    UP:       38,
    RIGHT:    39,
    DOWN:     40,
    DELETE:   46
  },
  /*
  ():
    {int} offsetX({event} evt)
  DES:
    Returns the horizontal coordinate of the event relative to the current layer. 
  */  
  offsetX    : function (evt) {
    evt = EVT.getEvt(evt);
    return evt.offsetX || evt.layerX;
  },
  /*
  ():
    {int} offsetY({event} evt)
  DES:
    Returns the vertical coordinate of the event relative to the current layer. 
  */  
  offsetY    : function (evt) {
    evt = EVT.getEvt(evt);
    return evt.offsetY || evt.layerY;
  },
  /*
  ():
    EVT.pointerX(evt)
  DES:
    Get the absolute position X of the evt.
		pointerX = pageX || (clientX + body.scrollLeft).
  */  
  pointerX : function (evt) {
    evt = EVT.getEvt(evt);
    var doc=document;
    return evt.pageX||(evt.clientX +(doc.documentElement.scrollLeft||doc.body.scrollLeft));
  },
  /*
  ():
    EVT.pointerY(evt)
  DES:
    Get the absolute position Y of the evt.
    pointerY = pageY || (clientY + body.scrollTop).
  */  
  pointerY : function (evt) {
    evt = EVT.getEvt(evt);
    var doc=document;
    return evt.pageY||(evt.clientY +(doc.documentElement.scrollTop||doc.body.scrollTop));
  }, 
	/*
  ():
    {object} EVT.pointerXY(evt)
  DES:
    Get the absolute position X and Y position of the evt.See also EVT.pointerX or EVT.pointerY
  RTN:
    {
      x : ,//{int}
      y : 
    }
  */  
  pointerXY : function(evt) {
		return {
			x : EVT.pointerX(evt),
			y : EVT.pointerY(evt)
		};
  }	
});

/*
Singleton:
  EVT.Event
DES:
  Unify browser differences for event properties. 
  Note:It's not a good idea to use this object onmousemove.
PROPERTY:
  If called methond initialize then it just has these properties
  {boolean} altKey|ctrlKey|shiftKey
    indicating whether the <alt|ctrlKey|shiftKey> key was pressed during the event
  {HTMLElement} relatedTarget
    Identifies a secondary target for the event.
  {HTMLElement} target
    a reference to the target to which the event was originally dispatched
  {string} type
    the name of the event
  {int} keyCode
    representing the character that was pressed as part of the key event
    
  If fixed all event info then it also has these properties
  {int} pageX|pageY
    the horizontal|vertical coordinate of the event relative to the visible page.
  {int} offsetX|offsetY
    the horizontal|vertical coordinate of the event relative to the current layer.
  {int} screenX|screenY
    Returns the horizontal|vertical  position of the event on the screen. 
  {boolean} leftClick|middleClick|rightClick
    indicating whether the button is clicked;    
METHOD:
  {this} fix({event} evt, {boolean} all)
	{object} getSystemEvent()
  {boolean} isKey({int|string} keyCode)
  {this} reset({event} evt)
  {void} stopBubble()
  {void} stopDefault()
  {void} stopEvent()
  {string} toString()
*/
EVT.Event = function(){
  //private
  var _e = null;//reference to event.
  
  return {
    /*
    ():
      {this} fix({event} evt, {boolean} all)
    DES:
      Unify event properties;
    ARG:
      {Event}  evt
        optional,for optimized performance.
      {boolean} all
        whether fix all event info or not,
        if not,this only has these properties: type, target, relatedTarget, "shiftKey", "ctrlKey", "altKey", keyCode
        else, also has these:  "screenX","screenY","clientX","clientY", pageX,pageY,offsetX ,offsetY ,leftClick, middleClick, rightClick
    */
    fix : function(evt, all){
      _e = EVT.getEvt(evt);
			
      this.type = _e.type;
      this.target = _e.target || _e.srcElement;
      WIN.extendThese(this, _e ,["shiftKey","ctrlKey","altKey"]);    
      var t = _e.relatedTarget;
      if(!t){
        if (_e.type == 'mouseover'){
          t = _e.fromElement;
        }
        else if (_e.type == 'mouseout'){
          t = _e.toElement;
        }
      }
      this.relatedTarget = t;
      this.keyCode = _e.keyCode || _e.which || 0;
			
      if(all)this._fixMouse();
      return this;
    },
    /*
    ():
      {this} _fixMouse({event} evt)
    DES:
      set mouse info.
    */
    _fixMouse : function(){
      WIN.extendThese(this, _e ,["screenX","screenY","clientX","clientY"]);
      var doc = document;
      this.pageX = _e.pageX||(_e.clientX +(doc.documentElement.scrollLeft||doc.body.scrollLeft));
      this.pageY = _e.pageY||(_e.clientY +(doc.documentElement.scrollTop||doc.body.scrollTop));
      this.offsetX = _e.offsetX || _e.layerX;
      this.offsetY = _e.offsetY || _e.layerY;
			this.wheelDelta = _e.wheelDelta || (_e.detail * -40);
  
      var eType = _e.type;
      if (WIN.isString(eType)) {
				var button = this.button = _e.button;
        //reset click type
        this.leftClick = this.middleClick = this.rightClick = undefined;
        if (/click/.test(eType)) {
          this.leftClick = true;
        }
        else if (/mouse(down|up)/.test(eType)) {
          if(BROWSER.IE){
						if(button == 1)this.leftClick = true;
						else if(button == 4)this.middleClick = true;
						else if(button == 2 || button == 0)this.rightClick = true;//button == 0 :fix maxthon bug
          }
          else{
						if(button == 0)this.leftClick = true;
						else if(button == 1)this.middleClick = true;
						else if(button == 2)this.rightClick = true;
					}
        }
				else if(/contextmenu/.test(eType))this.rightClick = true;
      }
      return this;
    },
    /*
    ():
      {boolean} isKey({int|string} keyCode)
    DES:
      return true if keyCode == this.keyCode;
    ARG:
      {int|string} keyCode
        acsii code or the propertiy name(case-insensitive) of EVT.KEY.For details see EVT.KEY.
    eg:
      EVT.Event.isKey(13)//RETURN
      EVT.Event.isKey("return")//RETURN
    */
    isKey : function(keyCode){
      if(WIN.isString(keyCode)){
        keyCode = EVT.KEY[keyCode.toUpperCase()];
      }
      return (this.keyCode == keyCode);
    },
    /*
    ():
      {void} stopBubble()
    DES:
      Stops the bubbling of events further along in the DOM
    */
    stopBubble : function(){
      if(!_e)return;
      if(_e.stopPropagation) return _e.stopPropagation();
      else return _e.cancelBubble=true;
    },
    /*
    ():
      {void} stopDefault()
    DES:
      Cancels the default action performed when the event is handled 
    */
    stopDefault : function(){
      if(!_e)return;
      if(_e.preventDefault) _e.preventDefault();
      else _e.returnValue = false;
    },
    /*
    ():
      {void} stopEvent()
    DES:
      stopBubble and stopDefault
    */
    stopEvent : function(){
      this.stopBubble();
      this.stopDefault();
    },
    /*
    ():
      {object} getSystemEvent()
    DES:
      return system event object
    */
		getSystemEvent : function(){
			return _e;
		},
    /*
    ():
      {string} toString()
    */
    toString : function(){
      return "[object EVT.Event]";
    }
  };
}();