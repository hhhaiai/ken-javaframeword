/**
 * @fileOverview Extends or adds some common comps.
 * @author 彭日聪
 * @version 1.0.0
 * @change
    修改者      修改时间         版本       修改描述
*/
/*
rl.provide("nf:TabsDecorator");
*/
rl.importCss("nf:std_info");
rl.importJs("lib.dom.DomWrap");
rl.importJs("lib.dom.EventWrap");

/**
 * @class Simple tab panel component marked up from html.
 * @extends rl.util.EventProvider
 * @constructor
 * @description Construct a new instance by specified config.
 * @param {Object} [config]
 */
nf.TabsDecorator = rl.createClass({
    parent : rl.util.EventProvider,
    
	construct : function(config){
        if(rl.isPrototyping(arguments[0])) return ;
		nf.TabsDecorator.parent.call(this, config);
		rl.ext(this, config);
		if(this.autoDecorate){
			rl.onReady(Function.bind(this.initialize, this));
		}
    },
    
    members : {
        /** @lends nf.TabsDecorator# */
        
		autoDecorate : true,
		
		target : "",
		
		iniActive : 0,
		
		activeSwitchEventName : "mousedown",
		
		_activeEle : null,
		
		/**
		 * Tab element css for tab identification.
		 */
		_tabCss : "tab",
		
		initialize : function(){
			this.initEvents();
			this.iniFirstActive();
		},
        
		initEvents : function(){
			var tabbarEle, bodyStackEle,
				ele = rl.getDom(this.target),
				clean = rl.dom.cleanWhitespace;
			
			clean(ele);	
			tabbarEle = this.tabbarEle = ele.firstChild;
			bodyStackEle = this.bodyStackEle = tabbarEle.nextSibling;
			
			rl.$(tabbarEle).on(this.activeSwitchEventName,
							   this.hndActiveSwitch, this);
		},
        
		iniFirstActive : function(){
			var tabEle,
				index = rl.isNumber(this.iniActive) ? this.iniActive : 0,
				nodes = this.tabbarEle.getElementsByTagName("li");
				
			tabEle = nodes[index];
			this.setActive(tabEle);
		},
        
		hndActiveSwitch : function(evt){
			var tabEle = this.getTabByEle(rl.ew.init(evt).getTarget());
			this.setActive(tabEle);
		},
			
		/**
		 * get tab by an element which can be a child of tab dom.
		 */
		getTabByEle : function(ele){
			if(rl.isElement(ele)){
				return rl.dom.findParentBy(ele, this._isTabEle, this);				
			}
		},
        
		_isTabEle : function(target){
			return rl.dom.hasClass(target, this._tabCss);
		},
        
		_getChildNodeIndex : function(target){
			var index = -1;
			
			if(rl.isElement(target) && target.parentNode){
				index = Array.indexOf(function(chd){
					return (chd == target);
				}, target.parentNode.childNodes);
			}
			return index;
		},
        
		getActive : function(){
			return this._activeEle;
		},
        
		setActive : function(tabEle){
			if(!rl.isElement(tabEle) || this._activeEle == tabEle) return ;
			var index, lastBodyEle, bodyEle,
				last = this._activeEle,
				D = rl.dom;
			
			if(last){
				index = this._getChildNodeIndex(last);
				lastBodyEle = this.bodyStackEle.childNodes[index];
				
				if(!lastBodyEle){
					rl.debug('cant found last corresponding body,'
							 + 'index = ' + index
							 + 'last.className' + last.className, "err");
					return ;
				}
				
				D.removeClass(last, "active");
				D.removeClass(lastBodyEle, "active");		
			}
			
			index = this._getChildNodeIndex(tabEle);
			bodyEle = this.bodyStackEle.childNodes[index];
			if(!bodyEle){
				rl.debug('cant found corresponding activ body,'
						 + 'index = ' + index
						 + 'last.className' + last.className, "err");
				return ;
			}
			
			D.addClass(tabEle, "active");
			D.addClass(bodyEle, "active");
			
			this._activeEle = tabEle;
			this.fireEvent("activechange", tabEle);
			
			return this;
		},
        
		onDispose : function(){
			delete this.tabbarEle;
			delete this.bodyStackEle;
			delete this._activeEle;
		},
        
		dispose : function(){
			if(this._disposed)return this;            
			if(rl.isFunction(this.onDispose)) this.onDispose();			
			this._disposed = true;
			
			return this;
		},
        
        toString : function(){return "[object nf.TabsDecorator]";}
    }
});


