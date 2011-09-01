/* tblrLayout.js
split body layout to top|bottom(left|right) panel;
*/
require.provide("app.gui.layout.tblrLayout");
require("app.gui.layout.bodyPanel");
require("lib.core.util.ObserverProvider");

GUI.TBLR_Layout = WIN.createClass(function(){
  },{
    topPanelHeight : 30,
		leftPanelWidth : 150,
		
		initialize : function(options){
			WIN.extend(this, options);
			this.addObservers("onbuild");
			var bp = GUI.Layout.bodyPanel;
			if(bp.isReady) this.build();
			else bp.addListener("onready", Function.bind(this.build, this));
			return this;
		},
    build : function(){
			var tl, br, 
					bp = GUI.Layout.bodyPanel;
			bp.split({
				fixedCfg : {
					initHeight : this.topPanelHeight
				}
			});
			tl = this.topPanel = bp.tlPanel;
			br = bp.brPanel;
			br.split({
				isVertical : true,
				fixedCfg : {
					initWidth : this.leftPanelWidth
				}
			});
			this.leftPanel = br.tlPanel;
			this.contentPanel = br.brPanel;
			this.builded = true;
			this.fireObserver("onbuild");
			return this;
		},
    toString: function(){return "[object GUI.TBLR_Layout]";}
  },
  WIN.ObserverProvider
);
