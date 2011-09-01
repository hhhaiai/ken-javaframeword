/* chartStatusIcon.js
*/
require.provide("sol.nodeMap.node.chartStatusIcon");
require("app.gui.indicator.chartBar");
require("sol.nodeMap.node.statusIcon");

/* {
CLASS:
  NodeMap.ChartStatusIcon
SUPERCLASS:
  NodeMap.StatusIcon
DES:
  ChartStatusIcon is a stautsIcon which uses a chartBar to show node's inner status in detail ;
PROPERTY:

METHOD:
} */
NodeMap.ChartStatusIcon = WIN.createClass(function(){
  },{
		chartBarTotal : 100,
		chartBarWidth : 100,
		chartBarNormalStatusBg : "",
		chartBarWarningStatusBg : "red",
		
		initialize : function(options){
			NodeMap.ChartStatusIcon.$initialize.call(this, options);
			setTimeout(Function.bind(this._initChartBar, this), 1000);
      return this;	
    },
		setNormalStatusValue : function(value){
			var bar = this.statusChartBar;
			if(bar && WIN.isFunction(bar.setCategoryValue)){
				if(typeof value == "number"){
					var total = this.chartBarTotal;
					if(value > total) value = total;
					else if(value < 0) value = 0;
					bar.setCategoryValue("normal", value);
				}
			}
			return this;
		},
		
		_initChartBar : function(){
			var bar = this.statusChartBar = new GUI.ChartBar,
					initW = this.initWidth,
					w = this.chartBarWidth || (initW + 20);
			
			bar.initialize({
				container : this.dom,	
				barWidth : w,
				categroies : [
					{name : "normal", value : this.chartBarTotal, bg : this.chartBarNormalStatusBg},
					{name : "warning", value : 11, bg : this.chartBarWarningStatusBg}
				]
			});
			EL.setStyle(bar.dom, {left : EL.parseUnit((initW - w)/2)});
		},
		
		toString: function(){return "[object NodeMap.ChartStatusIcon]";}
  },
  NodeMap.StatusIcon
);
WIN.Console.ensureShow();