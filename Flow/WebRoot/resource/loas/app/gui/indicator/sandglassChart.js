/* sandglassChart.js
*/
require.provide("app.gui.indicator.sandglassChart");
require("lib.core.util.ObserverProvider");


GUI.SandglassChart = WIN.createClass(function(){
  },{
		barWidth : 100,
		total : 100,
		
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
			var ele = this.dom = EL.c(
			
			
			var html = this._html,
					ele = this.dom = EL.createElementsByHtml(html)[0],
					ctn = this.container;
			if(WIN.isElement(ctn))ctn.appendChild(ele);
			this._bindDom();
			return this;
    },
		
		_html : ''
			+ '<div class="gui_sandglassChart">'
				+ '<div class="text">0%</div>'
				+ '<div class="main">'
					+ '<div class="pro"></div>'
				+ '</div>'
			+ '</div>',
			
    toString: function(){return "[object GUI.SandglassChart]";}
  },
	WIN.ObserverProvider
);
