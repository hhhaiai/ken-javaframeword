/***************************************************************
drag.js
drag behavior
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.bhv.dnd.drag");
//require resource
require("app.bhv.dnd.engin");

/*
NAMESPACE:
  BHV.DND.Drag
DES:
  drag behavior common methods
PROPERTY:
  {object} _cache
  {class}BHV.DND.Drag.Handler
FUNCTION:
  {void} BHV.DND.Drag._setTop({object} style, {int} op, {int} chg)
  {void} BHV.DND.Drag._setRight({object} style, {int} op, {int} chg)
  {void} BHV.DND.Drag._setBottom({object} style, {int} op, {int} chg)
  {void} BHV.DND.Drag._setLeft({object} style, {int} op, {int} chg)
  {boolean} BHV.DND.Drag.toDragalbe({HTMLElement} ele, {object} handler)
*/
BHV.DND.Drag = {
  /*
  OBJECT:
    BHV.DND.Drag._cache
  DES:
    store function for setting drag ele ;initialize at dnd Handler onDNDStart method
	PROPERTY:
	{function} setX|setY
	  cache set left|right and set top|bottom methods
  */
  _cache : {
    setX:null,
    setY:null
  },
  /*
  ():
    {void} BHV.DND.Drag._setTop({object} style, {int} op, {int} chg)
  DES:
    set drag ele top position;
  ARG:
    {object} style
      style reference of drag ele's
    {int} op
      ele's original top position on drag start;
    {int} chg
      ele's changed distance on drag
  */
  _setTop: function(style, op, chg){
    style.top = op + chg + 'px';
  },
  /*
  ():
    {void} BHV.DND.Drag._setRight({object} style, {int} op, {int} chg)
  DES:
    see BHV.DND.Drag._setTop
  */
  _setRight: function(style, op, chg){
    style.right = op - chg + 'px';
  },
  /*
  ():
    {void} BHV.DND.Drag._setBottom({object} style, {int} op, {int} chg)
  DES:
    see BHV.DND.Drag._setTop
  */
  _setBottom: function(style, op, chg){
    style.bottom = op - chg + 'px';
  },
  /*
  ():
    {void} BHV.DND.Drag._setLeft({object} style, {int} op, {int} chg)
  DES:
    see BHV.DND.Drag._setTop
  */
  _setLeft: function(style, op, chg){
    style.left = op + chg + 'px';
  },
  /*
  ():
    {boolean} BHV.DND.Drag.toDragalbe({HTMLElement} ele[, {object} handler])
  DES:
    turn ele to be dragable
	ARG:
	  {object} handler
		  (optional),default is BHV.DND.Drag.basicHnd
  */
  toDragalbe: function(ele, handler){
    var dnd = BHV.DND, handler = handler || dnd.Drag.basicHnd;
    if(!WIN.isElement(ele))return false;
    dnd.absolutize(ele);
    return dnd.init(ele, handler);
  },
  Handler :function(){},
  unknown:null
};

/*
CLASS:
  BHV.DND.Drag.Handler
DES:
  dnd Handler
METHOD:
  {boolean} onDNDStart({object} dataStore)
	{void} onDND({object} dataStore, {int} clientX, {int} clientY)
  {void} onDNDEnd({object} dataStore)
*/
WIN.extend(BHV.DND.Drag.Handler.prototype, {
  /*
  ():
    {boolean} onDNDStart({object} dataStore)
  DES:
    handle on drag start,set the reference of BHV.DND.Drag's setX,setY function, then during the draging, we only need to call setX|setY without checking.
  ARG:
    {object} dataStore
      see BHV.DND._movingDataStore
  */
  onDNDStart: function(dataStore){
    var dnd = BHV.DND, Drag = dnd.Drag, cache = Drag._cache;
		
		if(dataStore.options.useDNDGhost){
			dataStore.handleElement = dnd.DNDGhost.init(dataStore.target);
		}
    var hStl = dataStore.handleElement.style;
		WIN.extend(dataStore,{
      X : parseInt(hStl.left || hStl.right),
      Y : parseInt(hStl.top || hStl.bottom)
		});
		
		hStl.cursor = "default";
    cache.setX = String.notEmpty(hStl.left) ? Drag._setLeft : Drag._setRight;
    cache.setY = String.notEmpty(hStl.top) ? Drag._setTop : Drag._setBottom;
		
		cache.setX = Function.curry(cache.setX, hStl);
		cache.setY = Function.curry(cache.setY, hStl);
		return true;
  },
  /*
  ():
    {void} onDND({object} dataStore, {int} clientX, {int} clientY)
  DES:
    handle on draging.update dataStore.target.style position;
  */
  onDND: function(dataStore, clientX, clientY){
    var cache = BHV.DND.Drag._cache;
    cache.setX(dataStore.X, (clientX - dataStore.lastClientX));
    cache.setY(dataStore.Y, (clientY - dataStore.lastClientY));
  },
  /*
  ():
    {boolean} onDNDEnd({object} dataStore)
  DES:
    handle on drag end, reset BHV.DND.Drag._cache.
  */
  onDNDEnd: function(dataStore){
    var opt = dataStore.options, 
		     tStl = dataStore.target.style,
				 hStl = dataStore.handleElement.style;
				 
		if(opt.useDNDGhost){
			if(WIN.isFunction(opt.onEnd))opt.onEnd(hStl);
			else {
				Array.each(function(i){
				  tStl[i] = hStl[i];
				}, ["top","right","bottom","left"]);
			}
		}
		BHV.DND.Drag._cache = {};
		return true;
  }
});
WIN.extend(BHV.DND.Drag, {
  /*
  OBJECT:
    BHV.DND.Drag.basicHnd
  DES:
    basic drag hanler. (a instance of BHV.DND.Drag.Handler.)
  */
  basicHnd : new BHV.DND.Drag.Handler,
  /*
  ():
    {void} BHV.DND.Drag.drag({HTMLElement} ele [, {object} options, {event}evt])
  DES:
    drag element with basic dnd hanler;
    Note:Make sure the element has defined these properties in in-line style property:
      position: (absolute|relative),
      (left|right),
      (top |bottom)
    If not, call BHV.DND.Drag.toDragalbe to make the target to be dragable.
  ARG:
    {object} options
      (optional),options will be store at BHV.DND._movingDataStore during dnd behavior;it may has thest properties:
			{boolean} useDNDGhost
			  (optional) use a DNDGhost element to handle DND instead or not,default is true
			{function} onEnd
			  (optional) a function to update target style(position) when options.useDNDGhost is true, ghost element style will be passed as a param to this function. You can add some lush behaviors for update target's style.If not offered, we just reset the target style without any other behivors.
  */
  drag : function(ele, options, evt){
    BHV.DND.start(ele, BHV.DND.Drag.basicHnd, options, evt);
  }
});