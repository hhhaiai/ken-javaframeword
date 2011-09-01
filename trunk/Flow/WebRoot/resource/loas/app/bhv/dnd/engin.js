/***************************************************************
engin.js
drag and drop behavior
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.bhv.dnd.engin");
//require resource
require("lib.evt.engin");
require("lib.core.interfacesMgr");
require("lib.dom.layout.position");

namespace("BHV");
/*
NAMESPACE:
  BHV.DND
DES:
  DND behavior common functions
PROPERTY:
  {object} _movingDataStore
FUNCTION:
  {boolean} BHV.DND.absolutize({HTMLElement} ele)
  {boolean} BHV.DND.end({event} evt)
  {object} BHV.DND.getOffsetByMethod({HTMLElement} ele)
  {boolean} BHV.DND.init({HTMLElement} ele, {object} handler)
  {void} BHV.DND.moving({event} evt)
  {boolean} BHV.DND.start({HTMLElement} element, {object} handler,
*/
BHV.DND = {
	/*
	OBJECT:
		BHV.DND._ghostElement
	DES:
		the ele instead to avoid directly moving target,created when first call BHV.DND.getGhost
	*/
	_ghostElement: null,
  /*
  OBJECT:
    BHV.DND._movingDataStore
  DES:
    store data on drag start for moving.It'll be passed as a param from DND start to end.It has these properties at least:
  PROPERTY:
    {int} maxDNDWidth,maxDNDHeight
      document client width, height
    {int} lastClientX,lastClientY
      event's clientX,clientY on drag start
    {int} X,Y
      ele style's left(| right), top(|bottom)
    {HTMLElement} target
      target element to be DND
    {HTMLElement} handleElement
			the element to act as the handle for DND,sometimes, we may wont instantly DND the target, we use a ghostElement as the handle instead.
		{object}DNDHandler
      dnd events("onDNDStart", "onDND", "onDNDEnd") handler;
    {object} options
      dnd options,It has these properties at least:{
				useDNDGhost : true
			}
  */
  _movingDataStore: {},
  /*
  ():
    {boolean} BHV.DND.absolutize({HTMLElement} ele)
  DES:
    set ele position to be absolute;
  */
  absolutize: function(ele){
    if(!WIN.isElement(ele))return ;
    var style = ele.style;    
    if(style.position == "absolute")return ;
    
    var p = BHV.DND.getOffsetByMethod(ele, 
							function(ele){return ele.style.position == "absolute";});
		
    WIN.extend(p, {
      width : (ele.clientWidth || ele.offsetWidth),//ie clientWidth wont work under xhtml1-transitional.dtd DOCTYPE!
      height : (ele.clientHeight || ele.offsetHeight)
    });
    
    style.position = "absolute";
    for(var i in p) style[i] = EL.parseUnit(p[i]);
  },
  /*
  ():
    {object} BHV.DND.getOffsetByMethod({HTMLElement} ele, {function} rootDetectMethod)
  DES:
    get ele offset position relative to its nearest absolute position offsetParent, not support css absolute position,it means that the style of offsetParent must has absolute attribute defined directly in html but not in css;
	ARG:
	  {function} rootDetectMethod
		  boolean function to detect the ele's offsetParent is the root that you want to relative to or not;the function accepts the offsetParent as only param.if the offsetParent is the root, we stop circulation from adding its offset.
  RTN:
    return obj with these properties:
    {int} left 
    {int} top
  */
  getOffsetByMethod: function(ele, rootDetectMethod){
    if(!WIN.isElement(ele))return null;
    var l= 0, t = 0;
    while(WIN.isElement(ele) && !rootDetectMethod(ele)){
      l += ele.offsetLeft;
      t += ele.offsetTop;
			ele = ele.offsetParent;
    }
    return {left: l, top: t};
  },
  /*
  NAMESPACE:
    BHV.DND.DNDGhost
  DES:
    DNDGhost element is instead of dnd directly a target.here are methods to control ghost behavior.
  Function:
		{HTMLDivElement} BHV.DND.DNDGhost.get()
		{void} BHV.DND.DNDGhost.hide()
		{HTMLElement} BHV.DND.DNDGhost.init({HTMLElement} target)
		{void} BHV.DND.DNDGhost.show()
	Usage:
		var ghost = BHV.DND.DNDGhost.init(target);//target is the target element to be dnd;
  */
	DNDGhost : function(){
		var ghostElement = null;
		return {
			/*
			():
				{HTMLDivElement} BHV.DND.DNDGhost.get()
			DES:
				get(if ghostElement existed) or create a GhostElement,
			*/
			get : function(){
				if(!WIN.isElement(ghostElement)){
					ghostElement = EL.c({
						innerHTML : ""				
					},{
						zIndex : 10000,
						position  :"absolute",
						left : 0,
						top : 0,
						border : "1px dotted #333"
					});
					document.body.appendChild(ghostElement);
				}
				return ghostElement;
			},
			/*
			():
				{void} BHV.DND.DNDGhost.hide()
			DES:
				hide ghostElement;
			*/
			hide : function(){
				if(WIN.isElement(ghostElement))ghostElement.style.display = "none";
			},
			/*
			():
				{HTMLElement} BHV.DND.DNDGhost.init({HTMLElement} target)
			DES:
				init ghostElement style by target's style;
			*/
			init : function(target){
				if(!WIN.isElement(ghostElement)) ghostElement = this.get();
				if(WIN.isElement(target) && ghostElement){		
					var s = {
						left : EL.getPageX(target) + "px",
						top : EL.getPageY(target) + "px",
						width : (target.clientWidth || target.offsetWidth) + "px",
						height : (target.clientHeight || target.offsetHeight) + "px"
					};
					EL.setStyle(ghostElement, s);
					this.show();
				}
				return ghostElement;
			},
			/*
			():
				{void} BHV.DND.DNDGhost.show()
			DES:
				show ghostElement;
			*/
			show: function(){
				if(WIN.isElement(ghostElement))ghostElement.style.display = "";
			}
		};
	}(),
  /*
  ():
    {boolean} BHV.DND.init({HTMLElement} ele, {object} handler)
  DES:
    init an ele dnd behavior, bind drag handler to ele.if parameters cant pass BHV.DND.basicCheck return false;
  ARG:
    {HTMLElement} ele
      ele to be dnd.
    {object} handler
      handler for dnd behavior.it should implements DND interface.
  */
  init: function(ele, handler) {
    var dnd = BHV.DND;
    if(!WIN.isElement(ele))return true;
    ele.onmousedown = dnd.start;
    ele.DNDHandler = handler;
    return true;
  },
  /*
  ():
    {boolean} BHV.DND.start({HTMLElement} element, {object} handler,
                            {object} options, {event} evt)
  DES:
    starts dnd behavior.Triggers handler.onDNDStart.
  ARG:
    {HTMLElement} ele
      ele to be dnd.
    {object} handler
      handler for dnd behavior.it should implements DND interface. handler.onDNDStart and handler.onDNDEnd should be a boolean function to indicates whethoer start is success or not;
    {object} options
      (optional) dnd options;
  */
  start: function  (element, handler, options, evt) {
    var dnd = BHV.DND, store = dnd._movingDataStore;
    var ele = WIN.isElement(element) ? element : this;
    var hnd = handler || ele.DNDHandler;
    if(!WIN.isElement(ele))return true;
    evt = EVT.Event.fix(evt, true);
    if(!evt.leftClick){
			EVT.observe(document, 'mousemove', dnd.moving,true);
			EVT.observe(document, 'mouseup', dnd.end,true);
			return true;
		}
		
    WIN.extend(store , {
      target : ele,
			handleElement: ele,
			DNDHandler : hnd,
			event : evt,
			lastClientX : evt.clientX,
      lastClientY : evt.clientY,
      maxDNDWidth : DOC.getClientWidth(),
      maxDNDHeight : DOC.getClientHeight(),
      options: WIN.extend({
				useDNDGhost : true  
			},options)
    });
		/*var iframes = ele.getElementsByTagName("IFRAME");
    if(iframes.length > 0)store.innerIframes = iframes;*/
		
    if(!hnd.onDNDStart(store)){
			dnd._movingDataStore = {};
			return true;
		}
		
    EVT.observe(document, 'mousemove', dnd.moving,true);
    EVT.observe(document, 'mouseup', dnd.end,true);
    if (ele.setCapture) ele.setCapture(); 
    else window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);      
    EVT.cancelBnD();
		
    return false ;
  }, 
  /*
  ():
    {void} BHV.DND.moving({event} evt)
  DES:
    handle dnd moving .trigger handler.onDND.
  */
  moving: function(evt){
    var dnd = BHV.DND;
    evt = EVT.getEvt(evt);
    var store = dnd._movingDataStore;
    var x_ = evt.clientX, y_ = evt.clientY;
    /*if(!store.iframesHidden){
			Array.each(function(i){i.style.display = "none";}, store.innerIframes);
			store.iframesHidden = true;
		}*/
    if(x_ > 0 && y_ > 0 && x_ < store.maxDNDWidth && y_ < store.maxDNDHeight)
      try{store.DNDHandler.onDND(store, x_ , y_);}catch(e){dnd.end();};
    EVT.cancelBnD();
  },
  /*
  ():
    {boolean} BHV.DND.end({event} evt)
  DES:
    end dnd behavior. Trigger handler.onDNDEnd.
  */
  end: function(){
    var reVal, dnd = BHV.DND, store = dnd._movingDataStore, ele = store.target;
    EVT.stopObserving(document, 'mousemove', dnd.moving, true);
    EVT.stopObserving(document, 'mouseup', dnd.end, true);
		if(!ele)return ;
    if (ele.releaseCapture) ele.releaseCapture();
    else window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
    EVT.cancelBnD();
    
    reVal = store.DNDHandler.onDNDEnd(store);//fix maxthon drag text bug;
		if(store.options.useDNDGhost){
			dnd.DNDGhost.hide();
		}
    /*if(store.iframesHidden){
			Array.each(function(i){i.style.display = "";}, store.innerIframes);
			store.iframesHidden = false;
		}*/
		store = null;
    dnd._movingDataStore = {};
    
    return reVal;
  }
};