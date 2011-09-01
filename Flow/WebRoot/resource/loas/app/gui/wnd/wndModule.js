/***************************************************************
wndModule.js
define GUI window data module  module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.wnd.wndModule");
//require resource

GUI.WndModule = function(){
  this.initialize = function(options){
		var opt = WIN.extend({
		  resizeable : true,
			unknown: null
		}, options);
		WIN.extend(this, opt);
    return this;
	};
};
