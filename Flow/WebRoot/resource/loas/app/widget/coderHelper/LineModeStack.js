/* LineModeStack.js
*/
require.provide("app.widget.coderHelper.LineModeStack");

namespace("WIDGET");
WIDGET.LineModeStack = WIN.createClass(function(){
	},{
	  getMode : function(){
		  return this[this.length - 1];
		},
		isMode : function(mode){
		  return (this.getMode() == mode);
		},
		onModeChange : function(mode){
		  
		},
		pop : function(){
			var mode = this.pop();
			this.onModeChange(mode);
		  return mode;
		},
		push : function(mode){
		  var len = this.push(mode);
			this.onModeChange(mode);
			return len;
		},
		toString : function(){
		  return "[object LineModeStack]";
		}
	},
	Array
);
