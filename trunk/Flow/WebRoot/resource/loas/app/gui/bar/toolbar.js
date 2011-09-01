/***************************************************************
toolbar.js
create toolbar, vToolbar gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.bar.toolbar");
//require resource
require("app.gui.engin");
require("lib.evt.engin");

/*
bug:scroll distance 
*/

GUI.ToolBar = function(){
	this.initialize = function(options){
		var opt = this.handleOptions(options)
		WIN.extend(this, opt);
		
		this.itemsObserver = new WIN.Observer();
		this.sizeObserver = new WIN.Observer();
		this.itemsObserver.add(this.autoDisplayScrollArrows);
		this.sizeObserver.add(this.autoDisplayScrollArrows);
		
		this.build();
		
		return this;
	};
	this.handleOptions = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
			container      : document.body,
			scrollArrows   : null, //scrollArrow elements array
			plugins        : null,
			layout         : {
				height       : 25,
				width        : 550,
				isVertical   : false,
				itemSpacing  : 0,
				overflow     : "scroll", //"hidden"(hidden items), "scroll"(show scrollArrows), "break"(only work when isVertical is false)
				unknown : null
			},
			unknown : null			
		}, options, ["layout"]);
		opt.container = $(opt.container);
		WIN.extend(opt.layout, options.layout);
		return opt;
	};
	this.build = function(){
		var layout = this.layout;
		this._createWrap();
    this.setContainer(this.container);
		if(layout.overflow !="hidden")this.initScorllArrows();
		this.onBuild();
	};
	this.onBuild = Function.empty;
  /*
  ():
    {void} _createWrap()
  DES:
    _create wrapper
  */
	this._createWrap = function(){
		var layout = this.layout, w = EL.parseUnit(layout.width), h = EL.parseUnit(layout.height);
    var wrap = this.ele = EL.c({
			className : "gui_toolbar_wrap"
    },{
      width  : w,
      height : h
		});
		if(BROWSER.IE){
		  EVT.observe(wrap, "mousewheel", this.hndMousewheel);
		}
		else{
		  EVT.observe(wrap, "DOMMouseScroll", this.hndMousewheel);
		}
		var posWrapEle = this.posWrapEle = EL.c({//relative position wrap
			className : "gui_toolbar_pos_wrap"
		});
		
		var itemContainer = this.itemContainer = EL.c({//absolute position wrap
			className : "gui_toolbar_item_container"
		},{
			left   : "0px",
			top    : "0px"
		});
		posWrapEle.appendChild(itemContainer);
		wrap.appendChild(posWrapEle);
	};
	this.initScorllArrows = function(){
		if(! WIN.isArray(this.scrollArrows))return ;
		this.initScorllArrowsStyle(this.scrollArrows);
		this.initScorllArrowsCommands(this.scrollArrows);
	};
	this.initScorllArrowsCommands = function(scrollArrows){
		var l = scrollArrows[0], r = scrollArrows[1];

		r.addCommand(Function.bind(this.hndOMDScrollForward, this), "mousedown");
		r.addCommand(Function.bind(this.clearScrollTimer, this), "mouseup");
		r.addCommand(Function.bind(this.clearScrollTimer, this), "mouseout");
		l.addCommand(Function.bind(this.hndOMDScrollBack, this), "mousedown");
		l.addCommand(Function.bind(this.clearScrollTimer, this), "mouseup");
		l.addCommand(Function.bind(this.clearScrollTimer, this), "mouseout");
	};
	this.initScorllArrowsStyle = function(scrollArrows){
		var ele = this.posWrapEle;
		var l = scrollArrows[0], r = scrollArrows[1];
		var lEle = l.ele, rEle = r.ele;
		
		lEle.className += " " + this.scrollArrowsCss[0];
		rEle.className += " " + this.scrollArrowsCss[1];
		lEle.style.display = "none";
		rEle.style.display = "none";
	};
	/*
	():
		{void} setContainer({HTMLElement} container)
	DES:
		set toolbar's container;Because this.layout.itemsScrollSize is base on item's scrollWidth or scrollHeight, so when we append toolbar to container, we need to reset itemsScrollSize;
	ARG:
		{datatype} argument
	*/
	this.setContainer = function(container){
		if(!WIN.isElement(container))return;
		this.container = container;
		container.appendChild(this.ele);
		this.updateItemsScrollSize();
	};
	this.onResize = function(type, s){
		this.sizeObserver.execute(type, s);
	};
	this.setSize = function(w, h){
		this.setWidth(w);
		this.setHeight(h);
	};
	this.setHeight = function(h){
		h = parseInt(h);
		this.ele.style.height = h + "px" ;
		this.posWrapEle.style.height = h + "px";
		this.onResize("height", h);
	};
	this.setWidth = function(w){
		w = parseInt(w);
		this.ele.style.width = w + "px" ;
		this.posWrapEle.style.width = w + "px";
		this.onResize("width", w);
	};
	/*
	():
		{boolean} addItem({string} name, {buttonBase} item, {int} index)
	DES:
		add a item to bar
	ARG:
		{string} name
		  the name of the item in the bar
		{buttonBase} item
		  bar item, instanceof buttonBase
		{int} index
		  the position where you want to put the item
	*/
	this.addItem = function(name, item, index){
		if(!this.items)this.items = {};
		if(!(name && item))return false;
		
		var ele = item.ele, name = name.toLowerCase();
		var itemContainer = this.itemContainer, targetEle = itemContainer.childNodes[index];
		if(!WIN.isElement(ele))return false;
		if(WIN.isElement(targetEle))itemContainer.insertBefore(ele, targetEle);
		else itemContainer.appendChild(ele);
		
		this.setItemEleStyleOnAdd(ele);
		ele.tbItemName = name;
		this.updateItemsScrollSize();
		
		this.items[name] = item;
		this.onItemsChange();
		return true;
	};
	this.setItemEleStyleOnAdd = function(ele){
		var style = ele.style, layout = this.layout, isVertical = layout.isVertical;
		var type = isVertical ? "marginTop" : "marginRight" ;
		if(!isVertical){
			if(WIN.isDefined(style.styleFloat))style.styleFloat = "left";
			else if(WIN.isDefined(style.cssFloat))style.cssFloat = "left";
		}
		style[type] = EL.parseUnit(layout.itemSpacing);
	};
	/*
	():
		{void} updateItemsScrollSize()
	DES:
		update this.layout.itemsScrollSize which is all the total scrollWidth|scrollHeight of the itemContainer.childNodes.and set itemContainer's width|height to it;
	*/
	this.updateItemsScrollSize = function(){
		if(!WIN.isElement(this.container)) return;
		var itemContainer = this.itemContainer, layout = this.layout;
		layout.itemsScrollSize = 0;
		var type = (this.layout.isVertical) ? "height" : "width" ;
		Array.each(function(i){
			if(isNaN(i.scrollWidth))return;
			layout.itemsScrollSize += i["offset" + String.capitalize(type)] + layout.itemSpacing;
		}, itemContainer.childNodes);
		itemContainer.style[type] = layout.itemsScrollSize  + "px";
	};
	/*
	():
		{void} addItems({array} items)
	DES:
		fast to add item;
	ARG:
		{array} items
		  items array, the item of it has these properties: name, item, index corresponding addItem method's parameters
	*/
	this.addItems = function(items){
		var _this = this;
		Array.each(function(i){
		  _this.addItem(i.name, i.item, i.index);
		}, items);
	};
	/*
	():
		{buttonBase | null} getItem({string} name)
	DES:
		get item by name
	*/
	this.getItem = function(name){
		try{return this.items[name.toLowerCase()];}catch(e){return null;}
	};
	this.getItemNameList = function(){
	  var chd = this.itemContainer.childNodes;
		var list = [], _this = this;
		Array.each(function(i){
			list.push(i.tbItemName);
		}, chd);
		return list;
	};
	/*
	():
		{boolean} removeItem({string} name)
	DES:
		remove item by name,if error return false;
	*/
	this.removeItem = function(name){
		try{
			var items = this.items;
			if(!items || !name)return false;
			name = name.toLowerCase();
			var item = items[name];
			this.itemContainer.removeChild(item.ele);
			item.ele = undefined;
			delete items[name];
			
			this.onItemsChange();
			return true;
		}catch(e){	return false;}
	};
	
	var _this = this;
	/*
	():
		{void} scrollElement({HTMLElement} ele, {int | pxString} s)
	DES:
		scroll an element;this is stastic method;
	ARG:
		{int | pxString} s
		  scroll distance
	*/
	this.scrollElement= function(ele, s){
		var style = ele.style;
		s = s ? parseInt(s) : 10;
		if(_this.layout.isVertical)style.top = parseInt(style.top) + s + "px";
		else	style.left = parseInt(style.left) + s + "px";
	};
	/*
	():
		{void} scrollForward({int | pxString} s)
	DES:
		if this.layout.isVertical, it scroll items to left else to top;
	*/
	this.scrollForward = function(s){
		var ele = _this.itemContainer;
		if(!ele)return;
		s = s ? parseInt(s) : -5;
		if(_this.canScrollForward())_this.scrollElement(ele, s);
	};
	/*
	():
		{void} scrollBack({int | pxString} s)
	DES:
		if this.layout.isVertical, it scroll items to right else to bottom;
	*/
	this.scrollBack = function(s){
		var ele = _this.itemContainer;
		if(!ele)return;
		s = s ? parseInt(s) : 5;
		if(_this.canScrollBack())_this.scrollElement(ele, s);
	};
	this.hndMousewheel = Function.curry(function(obj, evt){
		EVT.Event.fix(evt,true);
		var wheelDelta = EVT.Event.wheelDelta, s = 20;
		if (wheelDelta >= 120)
			obj.scrollBack(s);
		else if(wheelDelta <= -120 )
			obj.scrollForward(-s);
	}, this);
	this.hndOMDScrollForward = function(){
		_this.scrollTimer = setInterval(function(){_this.scrollForward()},10);
	};
	this.hndOMDScrollBack = function(){
		_this.scrollTimer = setInterval(function(){_this.scrollBack()},10);
	};
	this.clearScrollTimer = function(){
		clearInterval(this.scrollTimer);
	};
	/*
	():
		{boolean} _canScroll({string} direct)
	DES:
		return true if items can be scroll;
	ARG:
		{string} direct
		  scroll direction
	*/
	this._canScroll = function(direct, s){
		var ele = this.itemContainer, style = ele.style;
		var scrollS, offsetS, p;
		s = s ? parseInt(s) : 0;
		if(this.layout.isVertical){
			scrollS = parseInt(style.height);
			offsetS = this.ele.scrollHeight;
			p = parseInt(style.top); 
		}
		else{
			scrollS = this.layout.itemsScrollSize;
			offsetS = this.ele.scrollWidth;
			p = parseInt(style.left); 
		}
		if(direct == "forward"){
			return (scrollS + p > offsetS);
		}
		else{
			return (p < 0);
		}
	};
	this.canScrollForward = Function.bind(this._canScroll, this, "forward");
	this.canScrollBack = Function.bind(this._canScroll, this, "back");
	
	this._displayScrollArrows = function(display){
		Array.each(function(i){
			i.ele.style.display = display;
		},this.scrollArrows);
	};
	this.showScrollArrows = Function.bind(this._displayScrollArrows, this, "block");
	this.hideScrollArrows = Function.bind(this._displayScrollArrows, this, "none");
	/*
	():
		{returntype} autoDisplayScrollArrows()
	DES:
		check the itemsScrollSize then to decide display ScrollArrows or not
	*/
	this.autoDisplayScrollArrows = function(){
		if(!_this.scrollArrows)return;
		var type = _this.layout.isVertical ? "offsetHeight" : "offsetWidth" ;
		var overflow = _this.layout.itemsScrollSize > parseInt(_this.ele[type]);
		if(overflow){
			_this.showScrollArrows();
		}
		else{
			_this.hideScrollArrows();
			_this.scrollToHome();
		}
	};
	this.scrollToHome = function(){
		var style = _this.itemContainer.style;
		if(this.layout.isVertical)style.top = 0;
		else	style.left = 0;
	};
	this.scrollToEnd = function(){
		
	};
	this.onItemsChange = function(items){
		this.itemsObserver.execute();
	};
};
