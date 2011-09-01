/* position.js
defined methods for operate elements layout's position.
*/
require.provide("lib.dom.layout.position");
require("lib.dom.engin");

/*
Extend NAMESPACE :
  EL
DES:
  decription
PROPERTY:
  {datatype} property_name
FUNCTION:
  {void} EL.fixBoxPosition({object} box)
  {void} EL.fixElementPosition({HTMLElement} ele)
  {int} EL.getPageX(element)||EL.getPageY(element)
  {object} EL.getPageXY(element)
  {object} EL.getScrollXY([{HTMLElement || string} e ])
  {int} EL.left(e[, iX])||EL.top(e[, iY])
  {void} keepInview({HTMLElement || id} ele)
	{boolean} EL.overlap({object} d1, {object} d2)
  {void} EL.setPos(e, iX, iY)
*/
WIN.extend(EL,{
  /*
  ():
    {int} EL.getPageX(element)||EL.getPageY(element)
  DES:
    Get the absolute position X||Y  of the element.
  ARG:
    e: id string or object reference
  RTN:
    the page relative X||Y position of e
  */
  getPageX :function (element){
    var l=element.offsetLeft;
    while(element=element.offsetParent){l+=element.offsetLeft;}
    return l;
  },
  getPageY :function (element){
    var t=element.offsetTop;
    while(element=element.offsetParent){t+=element.offsetTop;}
    return t;
  },
  /*
  ():
    {object} EL.getPageXY(element)
  DES:
    Get the absolute position X and Y position of the element.See also EL.getPageX or EL.getPageY
  RTN:
    {
      x : ,//{int}
      y : 
    }
  */
  getPageXY: function(element){
    return {
      x : EL.getPageX(element),
      y : EL.getPageY(element)
    };
  },
  /*
  ():
    {object} EL.getScrollXY([{HTMLElement || string} e ])
  DES:
    Determine how far the window (or an element) has scrolled horizontally and vertically.
  ARG:  
    {HTMLElement} e 
      (optional) id string or element reference. If not offered return document scrollLeft;
  RTN:
    {
      scrollLeft : ,//{int}
      scrollTop : 
    }
  */
  getScrollXY : function (e){
    var l = t = 0;
    if (!WIN.isDefined(e) || EL.isClientNode(e)) {
      var doc = window.document;
      var docEL = doc.documentElement;
      var docBD = doc.body;
      
      if(docEL && WIN.isDefined(docEL.scrollLeft)){
        l = docEL.scrollLeft;
        t = docEL.scrollTop;
      }
      else if(docBD && WIN.isDefined(docBD.scrollLeft)){
        l = docBD.scrollLeft;
        t = docBD.scrollTop;
      }
      else{
        l = window.scrollX;
        t = window.scrollY;
      }
    }
    else {
      e = $(e);
      if(WIN.isElement(e)){
        l = e.scrollLeft;
        t = e.scrollTop;
      }
    }
    return {scrollLeft: l, scrollTop: t};
  },
  /*
  ():
    {void} EL.fixBoxPosition({object} box [, {boolean} rebound])
  DES:
    if box is out of window, we'll fix the box position to make the box to be in the window view port;
  ARG:
    {object} box
      box should has these props: "x" ,"y" , "width", "height" and their value type are int;
		{boolean} rebound
		  (optional,defaults to false)if true, the box rebounds from the window ,else just sticks to, when it is out of window.
  */
  fixBoxPosition : function (box, rebound) {
    if (box.x < 0) box.x = 0;
    if (box.y < 0) box.y = 0;
    var br = {
      y : DOC.getClientHeight(),
      x : DOC.getClientWidth()
    }
    var scrollXY = EL.getScrollXY();
    br.x += scrollXY.scrollLeft;
    br.y += scrollXY.scrollTop;
    
    var tmp = box.x + box.width - br.x;
    if (tmp > 0){
			if(rebound)box.x = box.x - box.width;
			else box.x -= tmp;
		}
    else if(scrollXY.scrollLeft > box.x)box.x = scrollXY.scrollLeft;
    tmp = box.y + box.height - br.y;
    if (tmp > 0){
			if(rebound)box.y = box.y - box.height;
			else box.y -= tmp;
		}
    else if(scrollXY.scrollTop > box.y)box.y = scrollXY.scrollTop;
  },
  /*
  ():
    {void} EL.fixElementPosition({HTMLElement} ele [, {boolean} rebound, {boolean} missLeft, {boolean} missTop])
  DES:
    let the whole element to be in the view port;
	ARG:
	  {boolean} rebound
		  see EL.fixBoxPosition;
	  {boolean} missLeft
		  if missLeft then left position will not be fixed;
  */
  fixElementPosition : function(ele, rebound, missLeft, missTop){
    var box = EL.getElementBoxInfo(ele);
		if(!box)return ;
    EL.fixBoxPosition(box, rebound);
		if(!missLeft)ele.style.left = EL.parseUnit(box.x);
		if(!missTop)ele.style.top = EL.parseUnit(box.y);
  },
  /*
  ():
    {object} EL.getElementBoxInfo({HTMLElement} ele )
  DES:
    get Element Box Info;
	RTN:
   Box Info:{
      x : {int}
      y : {int}
			width: {int}
			height : {int}
    }
  */
	getElementBoxInfo : function(ele){
    var ele = $(ele);
    if(!ele)return null;
    var s = ele.style, oDisplay = s.display;
    s.display = "block";
    var box = {
      x : EL.getPageX(ele),
      y : EL.getPageY(ele),
      width : parseInt(ele.offsetWidth),
      height: parseInt(ele.offsetHeight)
    };
    s.display = oDisplay;
		return box;
	},
  /*
  ():
    {void} keepInview({HTMLElement || id} ele)
  DES:
    keep an element in view;
  ARG:
    {HTMLElement || id} ele
      absolute position
  */
  keepInview : function(ele){
    EVT.observe(window, "scroll", function(){EL.fixElementPosition($(ele), false, true);});
  },
  /*
  ():
    {int} EL.left(e[, iX])||EL.top(e[, iY])
  DES:
    Return and optionally set the element's x||y coordinate.
  ARG:
    e: id string or object reference
    iX||iY: integer x||y coordinate
  */
  left :function (e, iX){
    if(!(e=$(e))) return 0;
    var css=WIN.isDefined(e.style);
    if (css && WIN.isString(e.style.left)) {
      if(!isNaN(iX)) e.style.left=iX+'px';
      else {
        iX=parseInt(e.style.left);
        if(isNaN(iX)) iX=EL.getCssVal(e,'left',1);
        if(isNaN(iX)) iX=0;
      }
    }
    else if(css && WIN.isDefined(e.style.pixelLeft)) {
      if(!isNaN(iX)) e.style.pixelLeft=iX;
      else iX=e.style.pixelLeft;
    }
    return iX;
  },  
  top :function (e, iY){
    if(!(e=$(e))) return 0;
    var css=WIN.isDefined(e.style);
    if(css && WIN.isString(e.style.top)) {
      if(!isNaN(iY)) e.style.top=iY+'px';
      else {
        iY=parseInt(e.style.top);
        if(isNaN(iY)) iY=EL.getCssVal(e,'top',1);
        if(isNaN(iY)) iY=0;
      }
    }
    else if(css && WIN.isDefined(e.style.pixelTop)) {
      if(!isNaN(iY)) e.style.pixelTop=iY;
      else iY=e.style.pixelTop;
    }
    return iY;
  },
  /*
  ():
    {void} EL.setPos(e, iX, iY)
  DES:
    set an element position
  */
  setPos :function (e, iX, iY){
    EL.left(e, iX);
    EL.top(e, iY);
  },
  /*
  ():
    {boolean} EL.overlap({object} d1, {object} d2)
  DES:
    return true if d1 overlap d2;
	ARG:
	  {object} d1, {object} d2
		  dimension object contains these properties :
			{
				t : {int} top
				r : {int} right
				b : {int} bottom
				l : {int} left
			}
  */
	overlap : function(d1, d2){
		if(!(d1 && d2))return false;
		var h = (d2.l >= d1.l && d2.l <= d1.r) || (d2.l < d1.l && d2.r >= d1.l);
		var v = (d2.t >= d1.t && d2.t <= d1.b) || (d2.t < d1.t && d2.b >= d1.t);
		return (h && v);
	},
  unknown: null
});

