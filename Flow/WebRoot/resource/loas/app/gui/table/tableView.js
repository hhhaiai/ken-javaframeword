/* tableView.js
define basic table view;
*/
require.provide("app.gui.table.tableView");

GUI.TableView = function(){
	this.initialize = function(options){
		var opt = WIN.extend({
		  container : document.body,
			showRowNum: true,
			showCellBorder: true,
			style: {
				height: 200,
				width : "100%"
			},
			unknown: null
		}, options);
		return this;
	};
};
WIN.extend(GUI.TableView.prototype, {
  build : function(){
		this.buildView();
		this.onBuild();
	},
  buildView : function(){},
  onBuild : function(){}
	unknown: null
});


GUI.TableHeaderView = function(){
	this.initialize = function(options){
		var opt = WIN.extend({
		  container : document.body,
			style: {
				height: 200,
				width : "100%"
			},
			unknown: null
		}, options);
		return this;
	};
	
};
WIN.extend(GUI.TableHeaderView.prototype, {
  deleteCol : function(){},
	insertCol : function(){},
	setColWidth: function(){},
	unknown: null
});

GUI.TableRowHeaderView = function(){
	
};
WIN.extend(GUI.TableRowHeaderView.prototype, {
  deleteRow : function(){},
	insertRow : function(){},
	setRowHeight: function(){},
	unknown: null
});

