/* suggestInput.js
*/
require.provide("app.gui.indicator.suggestInput");
require("lib.evt.engin");
require("lib.core.util.SimpleTemplate");
require("lib.dom.style");

namespace("GUI");
GUI.SuggestInput = WIN.createClass(function(){
  }, {
    inputMask : "",
		container : null,
		
		htmlTpl : new WIN.SimpleTemplate('<div class="gui_suggestInput">'
				+ '<input class="io mask" value="{inputMask}" />'
				+ '<ul class="list">'
				+ '</ul>'
			+ '</div>'),
    
		_bindDom : function(){
      var css,
					ele = this.dom,
					nodes = ele.childNodes,
					contains = String.contains;
			Array.each(function(node){
			  css = node.className;
				if(contains(css, "list")){
					this.listEle = node;
				}
				else if(contains(css, "io")){
					this.ioEle = node;
				}
			}, nodes, 0, this);
    },
		_hndIoEleBlur : function(evt){
			var ele = this.ioEle,
					value = String.trim(ele.value);
			if(!String.notEmpty(value)){
				ele.value = this.inputMask;
				EL.addClass(ele, "mask");
			}
		},
		_hndIoEleFocus : function(evt){
			var ele = this.ioEle,
					value = String.trim(ele.value);
			if(value == this.inputMask){
				ele.value = "";
				EL.removeClass(ele, "mask");
			}
		},
		_initDom : function(){
      var ioEle = this.ioEle,
					listEle = this.listEle;
			WIN.extend(ioEle, {
				onfocus : Function.bind(this._hndIoEleFocus, this),
				onblur : Function.bind(this._hndIoEleBlur, this)
			});
			
			WIN.extend(listEle, {
			  onclick : Function.bind(this.chooseItem, this)
			}); 
    },
		
		initialize : function(options){
      WIN.extend(this, options);
			this.build();
      return this;
    },
    build : function(){
      var values = {
        inputMask : this.inputMask
      };
			var html = this.htmlTpl.apply(values),
					ele = this.dom = EL.createElementsByHtml(html)[0],
					ctn = this.container;
      if(WIN.isElement(ctn))ctn.appendChild(ele);
			this._bindDom();
			this._initDom();
			return this;
    },
		loadData : function(data){
			
		},
		setSelectItem : function(item){
			
		},
		selectNext : function(){
			
		},
		selectPrevious : function(){
			
		},
		cancelSelectItem : function(item){
			
		},
		choose : function(evt){
			
		},
		chooseItem : function(item){
			
		},
    
    toString : function(){return "[object GUI.SuggestInput]";}
  }
);
