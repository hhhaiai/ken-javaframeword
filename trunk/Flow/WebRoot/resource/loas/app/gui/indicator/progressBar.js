/* progressBar.js
*/
require.provide("app.gui.indicator.progressBar");
require("lib.core.util.ObserverProvider");

namespace("GUI");
/* {
CLASS:
  GUI.ProgressBar
SUPERCLASS:
  WIN.ObserverProvider
DES:
  ProgressBar, surports auto progress;
CFG:
  {boolean} showText
    (true) show progress text
  {boolean} autoHide
    (true) auto hide onEnd(progress == 100);
  {boolean} autoShow
    (true) auto show when value is not 100;
PROPERTY:
  {HTMLElement} dom
  {HTMLElement} proEle
    progress Ele
  {HTMLElement} proTextEle
    progress Text Ele
	{boolean}	showing
	  indecates bar is visiable;
	{int} value
		progress value
	
  {int} _autoProgressLimit
    auto Progress Limit, @see method autoProgress;
  {number} _gatherProgressTimer
    gather progress timer
  {int} _html
    node html;
METHOD:
	{this} autoProgress([{int} limit, {number} timeout])
	{this} build()
	{int} getValue()
	{this} hide()
	{this} hideProText()
	{this} initialize({object} options)
	{this} setValue({int} value)
	{this} show()
	{this} showProText()
	
	{int} _getNumBetween({int} mini, {int} maxi)
	{void} _bindDom()
	{void} _gatherProgress()
	{void} _doAutoHide()
	{void} _updateProTextEle({string} text)
	{void} _updateProEle({string} value)
OBSERVER:
  onEnd : on value == 100;
} */
GUI.ProgressBar = WIN.createClass(function(){
  },{
		showText : true,
		autoHide : true,
		autoShow : true,
		value : 0,
		
		/* {
		():
			{this} initialize({object} options)
		DES:
			build dom, addObservers("onEnd");
		} */
		initialize : function(options){
      WIN.extend(this, options);
			this.addObservers("onEnd");
			this.addListener("onEnd", Function.bind(this._doAutoHide, this) );
			this.build();
      return this;	
    },
		/* {
		():
			{this} build()
		DES:
			build dom
		} */
		build : function(){
			var html = this._html,
					ele = this.dom = EL.createElementsByHtml(html)[0],
					ctn = this.container;
			if(WIN.isElement(ctn))ctn.appendChild(ele);
			this._bindDom();
			if(!this.showText) this.hideProText();
			return this;
    },
		
		/* {
		():
			{this} setValue({int} value)
		DES:
			set progress value;
		} */
		setValue : function(value){
			if(typeof value != "number"){
				value = 0;
			}
			else {
				if(value < 0)value = 0;
				else if(value > 100)value = 100;
			}
			if(value == this.value) return this;
			var val = String(parseInt(value)) + "%";
			this._updateProTextEle(val);
			this._updateProEle(val);
			this.value = value;
			if(value == 100 )this.fireObserver("onEnd");
			else if(this.autoShow){
				clearTimeout(this._hideDelayTimer);
				this.show();
			}
			
			return this;
    },
		/* {
		():
			{int} getValue()
		DES:
			get progress value;
		} */
		getValue : function(){
			return this.value;
    },		
		/* {
		():
			{this} autoProgress([{int} limit, {number} timeout])
		DES:
			auto gather progress value to a specified limit for visual effect;
		ARG:
		  {int} limit
			  (100) it should be an int bt this.value(progress value) and 100 ;
			{number} timeout
			  (undefined) if timeout specified, this._gatherProgressTimer would be cleared on timeout;
		} */
		autoProgress : function(limit, timeout){
			var tmr = this._gatherProgressTimer,
					self = this;
			clearTimeout(tmr);
			if(typeof limit != "number" || (limit > 100) || (limit < this.value)){
				limit = 100;
			}
			
			this._autoProgressLimit = limit;
			this._gatherProgress();
			if(timeout)setTimeout(function(){
			  clearTimeout(tmr);
				self.setValue(limit);
			}, timeout);
			return this;
    },
		
		/* {
		():
			{this} hide()
		DES:
			hide bar
		} */
		hide : function(){
			var ele = this.dom;
			if(WIN.isElement(ele)){
				ele.style.display = "none";
			}
			this.showing = false;
			return this;
    },
		/* {
		():
			{this} show()
		DES:
			show bar
		} */
		show : function(){
			var ele = this.dom;
			if(WIN.isElement(ele)){
				ele.style.display = "";
			}
			this.showing = true;
			return this;
    },
		/* {
		():
			{this} hideProText()
		DES:
			hide Pro Text
		} */
		hideProText : function(){
			var ele = this.proTextEle;
			if(WIN.isElement(ele)){
				ele.style.display = "none";
			}
		},
		/* {
		():
			{this} showProText()
		DES:
			show Pro Text
		} */
		showProText : function(){
			var ele = this.proTextEle;
			if(WIN.isElement(ele)){
				ele.style.display = "";
			}
		},
		
		_html : ''
			+ '<div class="gui_progressbar">'
				+ '<div class="text">0%</div>'
				+ '<div class="main">'
					+ '<div class="pro"></div>'
				+ '</div>'
			+ '</div>',
		
		/* {
		():
			{void} _bindDom()
		DES:
			bind these elements: proTextEle, proEle;
		} */
		_bindDom : function(){
			var ele = this.dom;
			if(ele){
				var css,
						nodes = ele.getElementsByTagName("div");
				Array.each(function(node){
				  css = node.className;
					if(/text/.test(css)) this.proTextEle = node;
					else if(/pro/)this.proEle = node;
				}, nodes, 0, this);
			}
    },
		/* {
		():
			{void} _updateProTextEle({string} text)
		DES:
			update pro text.
		} */
		_updateProTextEle : function(text){
			var ele = this.proTextEle;
			if(WIN.isElement(ele)){
				ele.innerHTML = text;
			}
		},
		/* {
		():
			{void} _updateProEle({string} value)
		DES:
			update pro ele width.
		} */
		_updateProEle : function(value){
			try{EL.setStyle(this.proEle, {width : value});}catch(e){}
		},
		/* {
		():
			{void} _doAutoHide()
		DES:
			delay hide bar if this.autoHide is true;
		} */
		_doAutoHide : function(){
			if(this.autoHide){
				this._hideDelayTimer = setTimeout(Function.bind(this.hide, this), 100);
			}
		},
		/* {
		():
			{int} _getNumBetween({int} mini, {int} maxi)
		DES:
			return a number bt mini and maxi;
		} */
		_getNumBetween : function(mini, maxi){
			mini += (maxi - mini) * 0.05;
			return mini;
		},
		/* {
		():
			{void} _gatherProgress()
		DES:
			gather progress;
		} */
		_gatherProgress : function(){
			var value = this.value,
					limit = this._autoProgressLimit;
			if( value < limit){
				value = this._getNumBetween(value, limit);
				this.setValue(value);
				var t = (Math.random() * 1000 + 1);
				this._gatherProgressTimer = setTimeout(Function.bind(this._gatherProgress, this), t);
			}
		},
		 
    toString: function(){return "[object GUI.ProgressBar]";}
  },
	WIN.ObserverProvider
);