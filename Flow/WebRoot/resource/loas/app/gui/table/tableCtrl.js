/* tableCtrl.js
define GUI.TableCtrl
*/
require.provide("app.gui.table.tableCtrl");
require("app.gui.table.tableModules");

namespace("GUI");
GUI.TableBuilder = function(colsOptions, rowsOptions){
	this.colsOptions = colsOptions;
	this.rowsOptions = rowsOptions;
};
WIN.extend(GUI.TableBuilder.prototype, {
	build : function(data){
		var cm, rm, cols = [], rows = [];
		Array.each(function(rowData, ind){
		  cm = cols[ind];
			if(!cm){//build new ColModule
				cm = cols[ind] = (new GUI.ColModule).initialize(ind, this.colsOptions);
			}
			
		}, data);
	},
	buildCms : function(cmsData){
		var col, cols = this.cols;
		if(!WIN.isArray(cols)){
			cols = this.cols = [];
		}
		Array.each(function(i){
		  col = (new GUI.ColModule).initialize(i[0], i[1], i[2]);
			cols.push(col);
		}, cmsData);
	},
	unknown:null
});

/*
GUI.TableCellBuilder = function(){
	
};
WIN.extend(GUI.TableBuilder.prototype, {
	
});
*/
var tableData = [
  [1, 3, 4, 5],
	[2, 4, 5, 4, 7]
];