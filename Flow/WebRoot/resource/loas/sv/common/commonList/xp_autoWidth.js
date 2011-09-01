/* xp_autoWidth.js
defines the auto width xp for commonList;
*/
require.provide("sv.common.commonList.xp_autoWidth");
require("sv.common.commonList.xp");
require("app.gui.table.tableAutoWidther");

/*
():
  {void} SV.CommonListXP.autoWidth({HTMLTableElement} table, {int} index)
DES:
  init commonList's autoWidth xp by Plugin function -- GUI.basicTableAutoWidther.initialize;
	the xpOptions rule:
	1. p2p.
	Plugin function parameters defaults:
	xp.autoWidth.PluginParams = {
		widthOverrides : [0],
		wrapOverrides : [0]
	};
*/
(function(){
	var xp = SV.CommonListXP;
	xp.autoWidth = function(table, index){
		var xp = SV.CommonListXP;
		var o = xp.getTableXPOptions("autoWidth", table, index) || {};
		var defs = xp.autoWidth.PluginParams;
		var wdSkips = o.widthOverrides || defs.widthOverrides;
		var wrSkips = o.wrapOverrides || defs.wrapOverrides;
		
		GUI.basicTableAutoWidther.initialize(table, wdSkips, wrSkips);
	};
	xp.autoWidth.PluginParams = {
		widthOverrides : [0],
		wrapOverrides : [0]
	};
	xp.XPObserver.add(xp.autoWidth);
})();
