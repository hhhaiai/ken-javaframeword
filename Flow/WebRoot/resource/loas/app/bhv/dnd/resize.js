/***************************************************************
resize.js
resize behavior
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.bhv.dnd.resize");
//require resource
require("app.bhv.dnd.engin");

/*
NAMESPACE:
  BHV.DND.Resize
DES:
  resize behavior common methods
PROPERTY:
  {object} _cache
  {class}BHV.DND.Resize.Handler
FUNCTION:
  {string} BHV.DND.Resize.getDirection({object} style,
                                       {int} offsetX, {int} offsetY [,{int} limit])
  {object} BHV.DND.Resize.getInnerEventOffset({HTMLElement} root, {event} evt)
  {int} BHV.DND.Resize.getChgW(direct, chgX)
  {int} BHV.DND.Resize.getChgW(direct, chgY)
  {boolean} BHV.DND.Resize.hasAncestor({HTMLElement} ele, {HTMLElement} ancestor)
  {string} BHV.DND.Resize.initMousemoveCursor({HTMLElement} ele)
  {string} BHV.DND.Resize.setLeft(direct, style, op, chgX)
  {void} BHV.DND.Resize.setWidth({object} style, {int | string} width)
  {void} BHV.DND.Resize.setHeight({object} style, {int | string} height)
  {boolean} BHV.DND.Resize.toResizable({HTMLElement} ele [, {object} handler])
*/
BHV.DND.Resize = {
  /*
  OBJECT:
    BHV.DND.Resize._cache
  DES:
    store function for setting resize ele ;initialize at dnd Handler onDNDStart method
  PROPERTY:
  {function} setW|setH
    cache set width and set height methods
  {boolean} resizing
    indicates it's resizing
 */
  _cache : {
    setW:null,
    setH:null,
    resizing:false
  },
  /*
  ():
    {string} BHV.DND.Resize.getDirection({object} style,
                                         {int} offsetX, {int} offsetY [,{int} limit])
  DES:
    by analysising event's offsetX and offsetY to conclude the resize direction.
  ARG:
    {object} style 
      element's style
    {int} offsetX, {int} offsetY
      event offsetX offsetY
    {int} limit
      (optional), the limit to judge direction,default is 5;
  RTN:
    the direction may has one of these value: "nw", "n", "ne", "e", "se", "s", "sw", "w";
  */
  getDirection: function(style, offsetX, offsetY, limit){
    var w = parseInt(style.width), h = parseInt(style.height);
    var rX = w - offsetX, bY = h - offsetY;//right X, bottom Y
    var direct = "", limit = isNaN(limit) ? 10 : limit;
    if(offsetX < limit){
      if(offsetY < limit) direct = "nw";
      else if(bY < limit) direct = "sw";
      else direct = "w";
    }
    else if(rX < limit){
      if(offsetY < limit) direct = "ne";
      else if(bY >= limit) direct = "e";
      else if(bY < limit) direct = "se"
    }
    else {
      if(offsetY < limit)direct = "n";
      else if(bY < limit)direct = "s";
    }
    return direct;
  },
  /*
  ():
    {int} BHV.DND.Resize.getChgW(direct, chgX)
  DES:
    get changed width from the direct and changed x position
  */
  getChgW : function(direct,chgX){
    var chgW = 0;
    if(String.contains(direct, "w"))chgW = (-chgX);
    else if(String.contains(direct, "e"))chgW = chgX;
    return chgW;
  },
  /*
  ():
    {int} BHV.DND.Resize.getChgW(direct, chgY)
  DES:
    get changed height from the direct and changed y position
  */
  getChgH : function(direct,chgY){
    var chgH = 0;
    if(String.contains(direct, "n"))chgH = (-chgY);
    else if(String.contains(direct, "s"))chgH = chgY;
    return chgH;
  },
  /*
  ():
    {object} BHV.DND.Resize.getInnerEventOffset({HTMLElement} root, {event} evt)
  DES:
    get event offset relative to the root;
  ARG:
    {HTMLElement} root
      root that event target relative to;
    {event} evt
      EVT.Event || window.event;
  RTN:
    if event target is not root's child return null; 
    else return obj with these properties:
    {int} left 
    {int} top
  */
  getInnerEventOffset: function(root, evt){
    evt = evt || EVT.getEvt(evt);
    var target = evt.target || evt.srcElement;
    if(!BHV.DND.Resize.hasAncestor(target, root))return null;
    
    var offX = (evt.offsetX || evt.layerX || 0), offY = (evt.offsetY || evt.layerY || 0);
    var offset = BHV.DND.getOffsetByMethod(target, function(ele){return root == ele;});
    offX += offset.left;
    offY += offset.top;
    return {left: offX, top: offY};
  },
  /*
  ():
    {boolean} BHV.DND.Resize.hasAncestor({HTMLElement} ele, {HTMLElement} ancestor)
  DES:
    returns true the ele has assigned ancestor;
  */
  hasAncestor: function(ele, ancestor){
    var re = false;
    while(ele){
      if(ele == ancestor)re = true;
      ele = ele.parentNode;
    }
    return re;
  },
  /*
  ():
    {string} BHV.DND.Resize.initMousemoveCursor({HTMLElement} ele)
  DES:
    set the cursor style for resizable element onmousemove if not ele.disableResize or BHV.DND.Resize._cache.resizing;
  */
  initMousemoveCursor:function(ele, resizeDetectFn){
    EVT.observe(ele, "mousemove", Function.curry(function(ele , evt){
      if(!WIN.isElement(ele))return;
      var style = ele.style, dnd = BHV.DND;
      resizeDetectFn = WIN.isFunction(resizeDetectFn) ? resizeDetectFn : Function.K;
      if(!resizeDetectFn(ele))style.cursor = "default";
      else if(!dnd.Resize._cache.resizing){
        var offset = dnd.Resize.getInnerEventOffset(ele, evt) || {};
        var direct = dnd.Resize.getDirection(style, offset.left, offset.top);
        if(String.notEmpty(direct))style.cursor = direct + "-resize";
        else style.cursor = "default";
      }
    }, ele));
  },
  /*
  ():
    {string} BHV.DND.Resize.setLeft(direct, style, op, chgX)
  DES:
    set resizing element left;
  ARG:
    {object} style 
      element's style
  */
  setLeft: function(direct, style, op, chgX){
    if(String.contains(direct, "w"))
      style.left = op + chgX + 'px';
  },
  setTop: function(direct, style, op, chgY){
    if(String.contains(direct, "n"))
      style.top = op + chgY + 'px';
  },
  /*
  ():
    {void} BHV.DND.Resize.setWidth({object} style, {int | string} width)
  DES:
    set resize ele width;
  ARG:
    {object} style
      style reference of drag ele's
  */
  setWidth: function(style, width){
    style.width = EL.parseUnit(width);
  },
  /*
  ():
    {void} BHV.DND.Resize.setHeight({object} style, {int | string} height)
  DES:
    set resize ele height;see also BHV.DND.Resize.setWidth.
  */
  setHeight : function(style, height){
    style.height = EL.parseUnit(height);
  },
  /*
  ():
    {boolean} BHV.DND.Resize.toResizable({HTMLElement} ele [, {object} handler])
  DES:
    turn ele to be resizable
  */
  toResizable: function(ele, handler){
    var dnd = BHV.DND, handler = handler || dnd.Resize.basicHnd;
    if(!dnd.basicCheck(ele, handler))return false;
    dnd.Resize.absolutize(ele);
    return dnd.init(ele, handler);
  },
  Handler :function(){},
  unknown:null
};

/*
CLASS:
  BHV.DND.Resize.Handler
DES:
  dnd Handler
METHOD:
  {boolean} onDNDStart({object} dataStore)
	{void} onDND({object} dataStore, {int} clientX, {int} clientY)
  {void} onDNDEnd({object} dataStore)
*/
WIN.extend(BHV.DND.Resize.Handler.prototype, {
  /*
  ():
    {void} onDNDStart({object} dataStore)
  DES:
    handle on resize start,set the reference of BHV.DND.Resize's setLeft,setTop function, then during the draging, we only need to call setLeft|setTop without checking.
  ARG:
    {object} dataStore
      see BHV.DND._movingDataStore
  */
  onDNDStart: function(dataStore){
    var dnd = BHV.DND, Resize = dnd.Resize, cache = Resize._cache, curry = Function.curry;
    var tStl = dataStore.target.style,
				opt = dataStore.options,
				defOpt = {
					minResizeWidth: 20,
					minResizeHeight: 20,
					maxResizeWidth: dataStore.maxDNDWidth,
					maxResizeHeight: dataStore.maxDNDHeight
				},
				direct = opt.direction;
    var offset = BHV.DND.Resize.getInnerEventOffset(dataStore.target, EVT.Event);
    if(!offset && BROWSER.IE){
			return true;
		}
		direct = String.notEmpty(direct) ? direct : Resize.getDirection(tStl, offset.left, offset.top);
    if(!String.notEmpty(direct))return false;
    
    if(opt.useDNDGhost) dataStore.handleElement = dnd.DNDGhost.init(dataStore.target);
    var hStl = dataStore.handleElement.style;
    WIN.extend(dataStore,{
      H : parseInt(hStl.height),
      W : parseInt(hStl.width),
      X : parseInt(hStl.left || hStl.right),
      Y : parseInt(hStl.top || hStl.bottom)
    });
    
    cache.setW = WIN.isFunction(opt.setW) ? opt.setW : curry(Resize.setWidth, tStl);
    cache.setH = WIN.isFunction(opt.setH) ? opt.setH : curry(Resize.setHeight, tStl);

    cache.setHW = curry(Resize.setWidth , hStl);//set handleElement width
    cache.setHH = curry(Resize.setHeight , hStl);
    cache.setLeft = curry(Resize.setLeft ,direct, hStl);
    cache.setTop = curry(Resize.setTop ,direct, hStl);
    
    cache.getChgW = curry(Resize.getChgW, direct);
    cache.getChgH = curry(Resize.getChgH, direct);
    
		for(var i in defOpt){
			if(opt[i] === undefined )opt[i] = defOpt[i];
		}
    if(BROWSER.IEversion == 6){//fix ie6 bug
      tStl.overflow = hStl.overflow = "hidden";
    }
    BHV.DND.Resize._cache.resizing = true;
    return true;
  },
  /*
  ():
    {void} onDND({object} dataStore)
  DES:
    handle on draging.update dataStore.target.style position;
  */
  onDND: function(dataStore, clientX, clientY){
    var Resize = BHV.DND.Resize, cache = Resize._cache, opt = dataStore.options,
         chgX = clientX - dataStore.lastClientX,
         chgY = clientY - dataStore.lastClientY,
         w = dataStore.W + cache.getChgW(chgX),
         h = dataStore.H + cache.getChgH(chgY);
         
    if(w > opt.minResizeWidth && w < opt.maxResizeWidth &&
       h > opt.minResizeHeight && h < opt.maxResizeHeight){
      if(opt.useDNDGhost){
        cache.setHW(w);
        cache.setHH(h);
      }
      else{
        cache.setW(w);
        cache.setH(h);
      }
      cache.setLeft(dataStore.X, chgX);
      cache.setTop(dataStore.Y, chgY);
    }
  },
  /*
  ():
    {void} onDNDEnd({object} dataStore)
  DES:
    handle on resize end, reset BHV.DND.Resize._cache.
  */
  onDNDEnd: function(dataStore){
    var opt = dataStore.options, cache = BHV.DND.Resize._cache,
         tStl = dataStore.target.style, hStl = dataStore.handleElement.style;
         
    if(opt.useDNDGhost){
      if(WIN.isFunction(opt.onEnd))opt.onEnd(hStl);
      else {
        Array.each(function(i){
          tStl[i] = hStl[i];
        }, ["top","right","bottom","left"]);
        cache.setW(hStl.width);
        cache.setH(hStl.height);
      }
    }
    BHV.DND.Resize._cache = {};
    return true;
  }
});
WIN.extend(BHV.DND.Resize, {
  /*
  OBJECT:
    BHV.DND.Resize.basicHnd
  DES:
    basic resize hanler. (a instance of BHV.DND.Resize.Handler.)
  */
  basicHnd : new BHV.DND.Resize.Handler,
  /*
  ():
    {void} BHV.DND.Resize.resize({HTMLElement} ele, {object} options, {event}evt)
  DES:
    resize element with basic dnd hanler;
    Note:Make sure the element has defined these properties in in-line style property:
      position: (absolute|relative),
      (left|right),
      (top |bottom)
    If not, call BHV.DND.Resize.toDragalbe to make the target to be resizable.
  ARG:
    {object} options
      (optional),options will be store at BHV.DND._movingDataStore during dnd behavior;it may has thest properties:
      {string} direction
        (optional) the direction of resize behavior,if offered, it should be one of the following value: "nw","n","ne","e", "se", "s", "sw", "w", case-sensitive;if not offered, it'll be set by BHV.DND.Resize.getDirection;
      {boolean} useDNDGhost 
        (optional) use a DNDGhost element to handle DND instead or not,default is true
      {function} onEnd
        (optional) a function to update target style(include size and position) when options.useDNDGhost is true, ghost element's style will be passed as a param to this function. You can add some lush behaviors for update target's style.If not offered, we just reset the target style without any other behivors.
      {function} setW
        (optional) a function to set target width accepts a width param, default we just set directly by BHV.DND.Resize.setWidth;
      {function} setH
        (optional) see setW options;
  */
  resize : function(ele, options, evt){
    BHV.DND.start(ele, BHV.DND.Resize.basicHnd, options, evt);
  }
});