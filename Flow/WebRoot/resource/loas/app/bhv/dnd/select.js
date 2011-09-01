/* select.js
select behavior
*/
require.provide("app.bhv.dnd.select");
require("app.bhv.dnd.engin");
require("lib.dom.layout.position");

BHV.DND.Select = {
	hasPoint : function(ele, x, y){
		if(WIN.isElement(ele)){
			var XY = EL.getPageXY(ele),
					scrolled = EL.getScrollXY(document.body),
					x = x + scrolled.scrollLeft,
					y = y + scrolled.scrollTop;
			if(x > XY.x &&
				 y > XY.y &&
				 x < (XY.x + ele.offsetWidth) &&
				 y < (XY.y + ele.offsetHeight)
				)
			return true;
		}
		return false;
	},
	ghost : function(){
		var ghostElement = null;
		var gStyle = null;
		return {
			/*
			():
				{object} BHV.DND.Select.ghost._getScrolled()
			DES:
				get scopeNode scrollLeft and scrollTop.
			RTN:
			  {
					scrollLeft : {int},
					scrollTop : {int}
				}
			*/
			_getScrolled : function(){
				return EL.getScrollXY(document.body);
			},
			/*
			():
				{HTMLDivElement} BHV.DND.Select.ghost.get()
			DES:
				get(if ghostElement existed) or create a GhostElement,
			*/
			get : function(){
				if(!WIN.isElement(ghostElement)){
					ghostElement = EL.c({className : "bhv_ghost_select"});
					gStyle = ghostElement.style;
					document.body.appendChild(ghostElement);
				}
				return ghostElement;
			},
			/*
			():
				{HTMLElement} BHV.DND.Select.ghost.init({int} pageX, 
																								{int} pageY [,{HTMLElement} scopeNode])
			DES:
				init ghostElement style;
			ARG:
			  {int} pageX, {int} pageY
				  event pageX, pageY for ghost's position;
				{HTMLElement} scopeNode
				  (null) the scope of the select draw;if specified, the select draw is kept within 
					the scopeNode bounds;
			*/
			init : function(pageX, pageY, scopeNode){
				if(!WIN.isElement(ghostElement)) ghostElement = this.get();
				this.scopeNode = scopeNode;
				EL.setStyle(ghostElement, {
					width : 0,
					height : 0
				});
				this.setLeft(pageX);
				this.setTop(pageY);
				this.show();
				return ghostElement;
			},
			getLeft : function(){
				var p = 0, XY = this._getScrolled();
				if(WIN.isElement(this.scopeNode)){
					p = EL.getPageX(this.scopeNode);
				}
				return parseInt(gStyle.left) - XY.scrollLeft - p;
			},
			getTop : function(){
				var p = 0, XY = this._getScrolled();
				if(WIN.isElement(this.scopeNode)){
					p = EL.getPageY(this.scopeNode);
				}
				return parseInt(gStyle.top) - XY.scrollLeft - p;
			},
			getWidth : function(){
				return parseInt(gStyle.width);
			},
			getHeight : function(){
				return parseInt(gStyle.height);
			},
			setLeft: function(value){
				var XY = this._getScrolled(),
						v = (XY.scrollLeft + value);
				gStyle.left = v + "px";
			},
			setTop: function(value){
				var XY = this._getScrolled(),
						v = (XY.scrollTop + value);
				gStyle.top = v + "px";
			},
			setWidth: function(value){
				gStyle.width = value + "px";
			},
			setHeight : function(value){
				gStyle.height = value + "px";
			},
			/*
			():
				{void} BHV.DND.Select.ghost.hide()
			DES:
				hide ghostElement;
			*/
			hide : function(){
				if(WIN.isElement(ghostElement))gStyle.display = "none";
			},
			/*
			():
				{void} BHV.DND.Select.ghost.show()
			DES:
				show ghostElement;
			*/
			show: function(){
				if(WIN.isElement(ghostElement))gStyle.display = "";
			}
		};
	}()
};
/* {
CLASS:
  __classname
SUPERCLASS:
  __superclass
DES:
  __description
CFG:
  {__datatype} __cfgname
    __description
PROPERTY:
  {__datatype} __propertyname
    __description
METHOD:
  {void} onDNDStart({object} dataStore)
  {void} onDND({object} dataStore)
  {void} onDNDEnd({object} dataStore)z
} */
BHV.DND.Select.Handler = WIN.createClass(function(){
  },{
		onDNDStart: function(dataStore){
			var Select = BHV.DND.Select,
					curry = Function.curry,
					opt = dataStore.options,
					scopeNode = opt.scopeNode,
					x = dataStore.lastClientX,
					y = dataStore.lastClientY;
			if(WIN.isElement(scopeNode)){
				if(!Select.hasPoint(scopeNode, x, y))return false;
			}
			if(!WIN.isFunction(opt.updateHandler)) opt.updateHandler = Function.empty;
			Select.ghost.init(x, y, scopeNode);
			return true;
		},
		onDND: function(dataStore, clientX, clientY){
			var Select = BHV.DND.Select,
					ghost = Select.ghost,
					scopeNode = ghost.scopeNode,
					opt = dataStore.options,
					hnd = opt.updateHandler,
					instantUpdate = opt.instantUpdate,
					chgX = clientX - dataStore.lastClientX,
					chgY = clientY - dataStore.lastClientY;
			if(WIN.isElement(scopeNode)){
				if(!Select.hasPoint(scopeNode, clientX, clientY))return ;
			}
			if(chgX < 0){
				ghost.setLeft(clientX);
				ghost.setWidth(-chgX);
			}
			else{
				ghost.setLeft(dataStore.lastClientX);
				ghost.setWidth(chgX);
			}
			if(chgY < 0){
				ghost.setTop(clientY);
				ghost.setHeight(-chgY);
			}
			else{
				ghost.setTop(dataStore.lastClientY);
				ghost.setHeight(chgY);
			}
			if(instantUpdate){
				hnd(ghost.getLeft(), ghost.getTop(), ghost.getWidth(), ghost.getHeight());
			}
		},
		onDNDEnd: function(dataStore){
			var Select = BHV.DND.Select,
					ghost = BHV.DND.Select.ghost,
					hnd = dataStore.options.updateHandler;
			hnd(ghost.getLeft(), ghost.getTop(), ghost.getWidth(), ghost.getHeight());
			ghost.hide();
		},
    toString: function(){return "[object BHV.DND.Select.Handler]";}
  }
);
WIN.extend(BHV.DND.Select, {
  /*
  OBJECT:
    BHV.DND.Select.basicHnd
  DES:
    basic select hanler. (a instance of BHV.DND.Select.Handler.)
  */
  basicHnd : new BHV.DND.Select.Handler,
  /*
  ():
    {void} BHV.DND.Select.drawSelect({object} options, {event}evt)
  DES:
  */
  drawSelect : function(options, evt){
    BHV.DND.start(BHV.DND.Select.ghost.get(), BHV.DND.Select.basicHnd, options, evt);
  }
});