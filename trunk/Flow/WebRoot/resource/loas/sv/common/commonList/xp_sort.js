/* xp_sort.js
defines sortable xp for commonList;
*/
require.provide("sv.common.commonList.xp_sort");
require("sv.common.commonList.xp");
require("app.gui.table.tableSorter");

/*
():
  {void} SV.CommonListXP.sort({HTMLTableElement} table, {int} index)
DES:
  init commonList's sort xp by Plugin function -- GUI.TableSorter.init;
	the xpOptions rule:
	1. p2p.
	Plugin function parameters defaults:
	xp.sort.PluginParams = {
		overrides : [0],
		options : {
			onSort : function(table){
				var f = SV.CommonListXP.paintRows;
				if(WIN.isFunction(f)) f(table);
			},
			getArrowContainer: function(cell){return cell.firstChild;}
		}
	};
*/
(function(){
	var xp = SV.CommonListXP;
	xp.sort = function(table, index){
		var xp = SV.CommonListXP;
		var o = xp.getTableXPOptions("sort", table, index) || {};
		var defs = xp.sort.PluginParams;
		var skips = o.overrides || defs.overrides;
		var opt = WIN.extend({}, defs.options);
		WIN.extend(opt, o.options);
		
		GUI.TableSorter.init(table, skips, opt);
	};
	xp.sort.PluginParams = {
		overrides : [0],
		options : {
			onSort : function(table){
				var f = SV.CommonListXP.paintRows;
				if(WIN.isFunction(f)) f(table);
			},
			getArrowContainer: function(cell){return cell.firstChild;}
		}
	};
	xp.XPObserver.add(xp.sort);
})();