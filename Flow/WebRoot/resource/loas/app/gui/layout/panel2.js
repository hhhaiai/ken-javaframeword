/* panel.js
define layout panel
*/
require.provide("app.gui.layout.panel");
require("lib.dom.style");
require("lib.core.util.Enumerable");

namespace("GUI.Layout");
GUI.Layout.LayoutPanel = WIN.createClass(
	function(container, cfg){
		this.container = container || document.body;
		this._createDomStruct();
		EVT.observe(window, "unload", Function.bind(this.dispose, this));
	},{
		/* {
		cfg:
			{string} align
		DES:
			align to cotainer;defaults to "none";
			It has these options:
			"none" 		: absolutly display the dom element;
			"client" 	: auto stretch width and height;
			"custom"  : size is fixed by specified width and height;
			"t"				: auto stretch width, align to container inner top or follow previous;
			"r"				: auto height, align to container inner right or follow previous;
			"b"				: auto width, align to container inner botton or follow previous;
			"l"				: auto height, align to container inner left or follow previous;
		} */
		align : "none",
		/*
		cfg:
			{boolean} autoSize
		DES:
			if ture fit size to content on content change;
			autoSize wont work if it has the item with auto stretch width or height;
		*/		
		autoSize : false,
		
		_createDomStruct : function(){
			var ctn = this.container,
					ele = this.dom = EL.c(),
					iWrap = EL.c();
			ele._this = this;
			ele.appendChild(iWrap);
			if(WIN.isElement(ctn))ctn.appendChild(ele);
			
			this._springsDomWrap = {
				client : iWrap,
				r : iWrap,
				l : iWrap
			};
		},
		
		_isSpringSize : function(){
			return (this._isSpringWidth() || this._isSpringHeight());
		},
		_isSpringWidth : function(){
			var al = this.align;
			return (al == "t" || al == "b" || al == "client");
		},
		_isSpringHeight : function(){
			var al = this.align;
			return (al == "r" || al == "l" || al == "client");
		},
		_hasSpringHeightItems : function(){
			return this.some(function(item){
			  try{
					if(item._isSpringHeight())return true;
				}catch(e){}
			});
		},
		_hasSpringWidthItems : function(){
			return this.some(function(item){
			  try{
					if(item._isSpringWidth())return true;
				}catch(e){}
			});
		},
		
		  
		_checkInsertable : function(item){
			if(!item)return false;
			var sp = this.parent;
			while(sp){
				if(item == sp)throw {description : "Item is one of this ancestors!"};
				sp = sp.parent;
			}
			return true;
		},
		
		_updateItemView : function(item, type){
			var t = String.capitalize(type);
			var offset = item.dom["offset" + t];
			var last = item["_last" + s];
			var re = ( offset != last);
			if(re){
				item["_last" + s] = offset;
				item.fireEvent( type + "change");
			}
		},
		_updateItemsIndex : function(startItem){
			var s = startItem|| this.firstChild;
			if(!this.hasChild(s))return ;
			
			var next, 
			  	index = s._itemIndex;
					
			while(next = s.nextSibling){
				next._itemIndex = ++ index ;
			}
		},
		_updateItemsSpringHeight : function(){
			
			var fH = this._getItemsFixedHeight();
			var H = this.getHeight();
			var lH = this._lastItemsSpringHeight;
			var h = H - h;
			if(h < 0) h = 0;
			if(lH == h)return ;
			
			var ele = this._springsDomWrap.center;
			ele.style.height = EL.parseUnit(h);
			Array.each(function(item){
			  if(item.fireEvent)item.fireEvent("heightchange");
			}, items);
			this._lastItemsSpringHeight = h;
		},
		_updateItemsSpringSize : function(type){
			var capType = String.capitalize(type)
			var items = this.select(function(item){
			  try{
					if(item["_isSpring" + capType]())return true;
				}catch(e){}
			});
			if(items.length == 0) return ;
			
			var fS = this["_getItemsFixed" + capType]();
			var S = this["get" + capType]();
			var last = this["_lastItemsSpring" + capType];
			var s = S - fS;
			if(s < 0) s = 0;
			if(last == s)return ;
			
			var ele = this._springsDomWrap.center;
			ele.style.height = EL.parseUnit(h);
			Array.each(function(item){
			  if(item.fireEvent)item.fireEvent("heightchange");
			}, items);
			this._lastItemsSpringHeight = h;
			
		},
		_updateItemsSpringWidth : function(){
			if(!this._hasSpringWidthItems())return ;
		},
		_doAutosize : function(){
			if(!this.autosize)return ;
			var ele = this.dom;
			var h = ele.scrollHeight,
					w = ele.scrollWidth;
			this.setHeight(h);
			this.setWdith(w);
		},
		
		_getItemsFixedHeight : function(){
			var wrap = this._springsDomWrap,
					t = wrap.t,
					b = wrap.b;
			return t.offsetHeight + b.offsetHeight;
		},
		_getItemsFixedWidth : function(){
			var wrap = this._springsDomWrap,
					l = wrap.l,
					r = wrap.r;
			return l.offsetWidth + r.offsetWidth;
		},
		
		_initInsertBefore : function(item, target){
			var pre = target.previousSibling;
			item.previousSibling = pre;
			if(!pre) this.firstChild = item;
			item.nextSibling = target;
			target.previousSibling = item;
		},
		_initInsertFirst : function(item){
			item.previousSibling = item.nextSibling = null;				
			this.firstChild = this.lastChild = item;
			item._itemIndex = 0;
		},
		_initInsertLast : function(item){
			delete item.nextSibling;
			var l = this.lastChild;
			item.previousSibling = l;
			l.nextSibling = item;
			this.lastChild = item;
		},
		_insertItemNode : function(item){
			var ele, target,
					al = item.align,
					ind = item._itemIndex,
					iEle = item.dom;
			ele = this._springsDomWrap[al] || this.dom;
			
			Array.each(function(chd){
			  if(ind < chd._itemIndex){
					target = chd;
					throw Object;
				}
			}, ele.childNodes);
			if(target)ele.insertBefore(iEle, target);
			else ele.appendChild(iEle);
			iEle._itemIndex = ind;
			
			return iEle;
		},
		_removeItemNode : function(item){
			var ele,
					al = item.align,
					iEle = item.dom;
			ele = this._springsDomWrap[al] || this.dom;
			
			if(iEle.parentNode == ele)ele.removeChild(iEle);
			
			return iEle;
		},
		
    getHeight : function(){
			if(this._isSpringHeight())return this.dom.offsetHeight;// "100%"
			else return this.height;
    },
    getWidth : function(){
			if(this._isSpringWidth())return this.dom.offsetWidth;
			else return this.width;
    },
    setHeight : function(value){
			if(this.height == value)return ;
			if(!this._isSpringHeight()){
				this.height = value;
				this.dom.style.height = EL.parseUnit(value);
			}
			this._heightChangeObserver.execute();
    },
    setWidth : function(value){
			if(this.width == value)return ;
			//check anchor
			if(!this._isSpringWidth()){
				this.width = value;
				this.dom.style.width = EL.parseUnit(value);
			}
			this._widthChangeObserver.execute();
    },
    getSize : function(){
			return {
				width : this.getWidth(),
				height : this.getHeight()
			};
    },
    setSize : function(width, height){
			this.setWidth(width);
			this.setHeight(height);
    },
		
		each : WIN.Enumerable.each,
		every : WIN.Enumerable.every,
		some : WIN.Enumerable.some,
		select : WIN.Enumerable.select,
		/*
		():
			{returntype} insertItem({object} item, targetItem)
		DES:
			description
		ARG:
			{datatype} argument
		RTN:
			return_value_description
		*/
    insertItem : function(item, targetItem){
			if(!this._checkInsertable(item))return null;
			
			var p = item.parent;
			if(p && p.removeItem) p.removeItem(item);
			
			item.parent = this;
			
			if(this.hasChild(targetItem)) this._initInsertBefore(item, targetItem);
			else if(this.hasChildren()) this._initInsertLast(item);
			else this._initInsertFirst(item);
			
			this._updateItemsIndex(item.previousSibling);
			this._insertItemNode(item);
			this.updateView();
			
			return item;
    },
    insertItems : function(items, targetItem){
			
		},
    removeItem : function(item){
			if(!this.hasChild(item))return ;
			
			var pre = item.previousSibling,
					next = item.nextSibling;			
			
			if(this.firstChild == item)this.firstChild = next;
			else if(this.hasChild(pre))pre.nextSibling = next;
			
			if(this.lastChild == item)this.lastChild = pre;
			else if(this.hasChild(next))next.previousSibling = pre;
			
			this._updateItemsIndex(item.previousSibling);
			this._removeItemNode(item);
			this.updateView();
			
			item.previousSibling = item.nextSibling = item.parent =  null;
			
			return item;
    },
		updateView : function(){
			var item = this.fisrtChild;
			while(item){
				this._updateItemView(item, "width");
				this._updateItemView(item, "height");
				item = item.nextSibling;
			}
		},
		hasChild : function(item){
			return (item && item.parent == this);
		},
		hasChildren : function(){
			return !!(this.firstChild);
		},
		dispose : function(){
			var item = this.firstChild;
			while(item){
				item.dispose();
				item = item.nextSibling;
			}
			this.dom._this = null;
		},
		
    toString : function(){
      return "[object GUI.Layout.LayoutPanel]";
    }
	}
);

GUI.Layout.ContentPanel = WIN.createClass(
	function(cfg){
	},{
		/*
		cfg:
			{string} anchors
		DES:
			anchor to cotainer;defaults to "tl";
			It may contain one or more following value :
			"t", "r", "b", "l";
		*/
		anchors : "tl",
		panelCss : "cotentPanel",//{position: absolute; overflow:auto; left:0; top:0;}
		autosize : false,
		setStyle : function(style){
			var ele = this.dom;
			var p = style.position; 
			if(p)delete style.position;
			EL.setStyle(ele, style);
			if(p)style.position = p;
		},
		build : function(){
			var ele = this.dom = EL.c({
			  className : this.panelCss
			});
		},
    toString : function(){
      return "[object GUI.Layout.ContentPanel]";
    }
	}
);
GUI.Layout.toLayoutable = function(){};




