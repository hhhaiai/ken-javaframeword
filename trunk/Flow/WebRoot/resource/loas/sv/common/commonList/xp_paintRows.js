/* xp_paintRows.js
defines parity paint talbe rows color xp for commonList;
*/
require.provide("sv.common.commonList.xp_paintRows");
require("sv.common.commonList.xp");
require("app.gui.table.tableColorer");

/*
():
  {void} SV.CommonListXP.paintRows({HTMLTableElement} table, {int} index)
DES:
  init commonList's paintRows xp by Plugin function -- GUI.Plugin.ParityRowsColorTable.prettifyRows;
	the xpOptions rule:
	1. p2p.
	Plugin function parameters defaults:
	xp.paintRows.PluginParams = {
		options : {
			oddLineColor : "#fff",
			evenLineColor : "#E4F2FD",
			startRowIndex : 1
		}
	};
*/
(function(){
	var xp = SV.CommonListXP;
	xp.paintRows = function(table, index){
		var xp = SV.CommonListXP;
		var o = xp.getTableXPOptions("paintRows", table, index) || {};		
		var defs = xp.paintRows.PluginParams;
		var opt = WIN.extend({}, defs.options);
		WIN.extend(opt, o.options);
		
		GUI.TableColorer.paintRows(table, opt);
	};
	xp.paintRows.PluginParams = {
		options : {
			oddLineColor : "#F1F8FF",
			evenLineColor : "#E8EDF4",
			startRowIndex : 1
		}
	};
	xp.XPObserver.add(xp.paintRows);
})();
