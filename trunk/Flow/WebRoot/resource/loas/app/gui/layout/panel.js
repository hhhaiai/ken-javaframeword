/* panel.js
define layout panel
*/
require.provide("app.gui.layout.panel");
require("lib.dom.style");

namespace("GUI.Layout");
GUI.Layout.Panel = WIN.createClass(
	function(container, cfg){
		this.container = container || document.body;
		this.items = [];
		
		var iSizeObv = this.itemSizeChangeObserver = new WIN.Observer;
		var sizeObv = this.sizeChangeObserver = new WIN.Observer;
		iSizeObv.add(Function.bind(this.hndItemSizeChange, this));
		sizeObv.add(Function.bind(this.hndSizeChange, this));
		
		var alObv = this._alignChangeObserver = new WIN.Observer;
		alObv.add();
		
		this._SpringHeightItems = [];
		this.autoId = 100;
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
			{string} anchors
		DES:
			anchor to cotainer;defaults to "tl";
			It may contain one or more following value :
			"t", "r", "b", "l";
		*/
		anchors : "tl",
		/*
		cfg:
			{boolean} autoSize
		DES:
			if ture fit size to content on content change;
		*/		
		autoSize : false,
		items : [],
		itemAutoOrder : 0,
		
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
		hndSizeChange : function(){
			var p = this.parent,
					item, w = this.getWidth(), h = this.getHeight(),
					items = this.items;
			if(p && p.onItemSizeChange)p.onItemSizeChange(this);
			
			for(var i = 0, len = items.length; i < len; i++){
				item = items[i];
				if(item._isSpringSize && item._isSpringSize()){
					item.refleshView();
					//continue ;
				}
				else{
					//set anchors here ...
					
				}
			}
		},
		hndItemSizeChange : function(item){
			if(!item)return ;
			if(item._isSpringSize){
				if(item._isSpringWidth()){//height changed
					var h = item._getValidSpringHeight();
					
				}
				else if(item._isSpringHeight()){
					
				}
			}
		},
		onItemSizeChange : function(item){
			this.itemSizeChangeObserver.execute(item);
		},
		refleshView : function(){
			var w = this.getWidth(), h = this.getHeight();
			this.setSize(w, h);
		},
    setAlign : function(value){
			if(!String.notEmpty(value))return ;
			value = value.toLowerCase();
			if(this.align == value)return ;
			
			var ele = this.dom,
					s = ele.style,
					w = ele.offsetWidth,
					h = ele.offsetHeight,
					oCss = ele.className,
					nCss = "al" + String.capitalize(value),
					pu = EL.parseUnit;
			
			//"alNone": {position:absolute;}
			//"alClient": {position:absolute;clear:none;float:left;width:100%;height:100%;}
			//"alCustom": {position:absolute;}
			//"alNone": {position:absolute;}
			EL.swapClass(ele, oCss, nCss);
			switch(value){
				case "none" : {
					s.width = pu(w);
					s.height = pu(h);
					break;
				}
				case "client" : {
					s.width = "";
					s.height = "";
					break;
				}
				case "custom" : {
					s.width = pu(w);
					s.height = pu(h);
					break;
				}
				case "t" : {
					s.width = "";
					s.height = pu(h);
					break;
				}
				case "r" : {
					s.width = pu(w);
					s.height = "";
					break;
				}
				case "b" : {
					s.width = "";
					s.height = pu(h);
					break;
				}
				case "l" : {
					s.width = pu(w);
					s.height = "";
					break;
				}
				default : throw {description : "GUI.Layout.Panel.setAlign: illegal align value!"};
			}
			this.align = value;
    },
    setAnchors : function(value){
			
    },
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
			if(!item)return null;
			var p = item.parent;
			if(p && p.removeItem)p.removeItem(item);
			
			var targetEle = this._findInsertTarget(item, targetItem);
			var ele = this.dom, newEle = item.dom;
			if(item._isSpringHeight && item._isSpringHeight()) ele = this._heightSpringsWrap;			
			this._insertItemNode(ele, newEle, targetEle);
			
			var al = item.align;
			if(String.notEmpty(al)) this._alignItems[al].push(item);
			
			this.items.push(item);
			item.parent = this;
			
			return item;
    },
    _hndItemAlignChange : function(item){
			
    },
		_insertItemNode : function(ele, newEle, targetEle){
			if(targetEle){
				ele.insertBefore(newEle, targetEle);
			}
			else{
				ele.appendChild(newEle);
			}
		},
		_findInsertTarget : function(newItem, targetItem){
			var target = null, al = newItem.align;
			if(targetItem && String.notEmpty(al)){
				Array.each(function(i){
					if((i.align == al) && (i == targetItem)){
						target = WIN.isElement(targetItem.dom) ? targetItem.dom : null;
						throw Object;
					}
				}, this.items);
			}
			return target;
		},
		
    removeItem : function(item){
			if(item){
				var p = item.parent;
				if(p == this){					
					var ele = this.dom, iEle = item.dom;
					if(item._isSpringHeight && item._isSpringHeight())ele = this._heightSpringsWrap;
					ele.removeChild(iEle);
					
					var al = item.align;
					if(String.notEmpty(al)) this._alignItems[al].remove(item);
					this.items.remove(item);
				}
			}
    },
    _getValidSpringHeight : function(){
			
    },
    _getValidSpringWidth : function(){
			
    },
    updateItemsAlign : function(start){
			
    },
    updateItemsOrder : function(start, isAdd){
			start = isNaN(start) ? start : 0;
			if(isAdd)Array.each(function(i){if(i._order >= start)i._order ++;}, this.items);
			else Array.each(function(i){if(i._order >= start)i._order --;}, this.items);
    },
		 
    toString : function(){
      return "[object GUI.Layout.Panel]";
    }
	}
);