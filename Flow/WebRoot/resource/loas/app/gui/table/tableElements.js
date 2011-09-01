/* tableElements.js
define GUI.TableCellModule
*/
require.provide("app.gui.table.tableElements");

namespace("GUI");
/*
CLASS:
  GUI.TableModule
SUBCLASS:
  GUI.ColModule, GUI.RowModule
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableElementBase = function(){
	
};
WIN.extend(GUI.TableElementBase.prototype, {
	align : "inherit",
	vAlign: "inherit",
	lineHeight: "inherit",
	
	editable: undefined,
	contentType: "inherit",
	
	initialize: function(options){
		WIN.extend(this, options);
		return this;
	},
	
	unknown: null
});

/*
CLASS:
  classname
SUPERCLASS:
  superclass
SUBCLASS:
  subclass
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableModule = function(){
  GUI.TableModule.superClass.apply(this);
	this.initialize = function(options){
		var opt = WIN.extend({
			cms: null,//2D array
			rmsOptions:null,
			cellsOptions:null,
			cellsData:null,//2D array
			unknown: null
		}, options);
		
		GUI.TableModule.$initialize.call(this, opt);
		this.rows = [];
		this.insertRow();
		this.build();
		
		return this;
	};	
};
WIN.extendClass(GUI.TableModule , GUI.TableElementBase);
WIN.extend(GUI.TableModule.prototype, {
	align : "left",
	vAlign: "middle",
	width : "auto",
	height : "auto",
	lineHeight: "auto",
	
	editable: false,
	contentType: "text",
	
	build: function(){
		this.batchInsertRows(0, this.cellsData, this.rmsOptions, this.cellsOptions);
		delete this.cellsData;
		delete this.rmsOptions;
		delete this.cellsOptions;
	},
	batchInsertRows: function(index, cellsData, rmsOptions, cellsOptions){
		var row, rows = this.rows, tmpNewRows = [], tmpSpliceRows;
		var cell;
		
		var start = index = GUI.TableBuilder.ensureIndex(index, rows);
		
		Array.each(function(i){
			row = new GUI.TableRowModule;
			tmpNewRows.push(row);
			row.rowIndex = index;
			row.cells = [];
			
			Array.each(function(j, cIndex){
				cell = new GUI.TableCellModule(i);
				row.cells.push(cell);
				cell.cellIndex = cIndex;
				cell.value = j;
			}, i);
			
			index ++;
		}, cellsData);
		
		this.setRowsAttr(rmsOptions, tmpNewRows);
		this.setCellsAttr(cellsOptions, tmpNewRows);
		
		tmpSpliceRows = rows.splice(start, (rows.length - start));
		this.rows = rows.concat(rows, tmpNewRows, tmpSpliceRows);
		
		this._updateRowIndex((start + index - 1 ));
/*
		Array.each(function(row){
		  WIN.dir(row);
		}, this.rows);		
*/
	},
	loadData: function(cellsData, rmsOptions, cellsOptions){
		
	},
	deleteRow : function(index){
		var opt, options = this.rmsOptions;
		var row, rows = this.rows;//A table row cannot be empty according to HTML 4.0 Recommendation.
		
		opt = ptions[String(index)];
		row = ((new GUI.TableRowModule).initialize(opt));
		row.rowIndex = index;
		rows.push(row);
		
		return row;
	},
	
	insertRow : function(index){
		var row, rows = this.rows;//A table row cannot be empty according to HTML 4.0 Recommendation.So rows is at least an empty array.
		
		index = GUI.TableBuilder.ensureIndex(index, rows);
		row = new GUI.TableRowModule;
		rows.insertAt(row, index);
		row.rowIndex = index;
		row.cells = [];
		
		return row;
	},
	
	getInheritProperty: function(){
		
	},
	setRowsAttr: function(rmsOptions, rowsRange){
		var opt, p, row, rows = rowsRange || this.rows;
		for(p in rmsOptions){
			opt = rmsOptions[p];
			row = rows[parseInt(p)];
			if(row)WIN.extend(row, opt);
		}
	},
	setCellsAttr: function(cellsOptions, rowsRange){
		var opt, p, cell, cells, row, rows = rowsRange || this.rows;
		for(p in cellsOptions){
			opt = cellsOptions[p];
			p = p.split("_");
			row = rows[parseInt(p[0])];
			if(row && row.cells){
			  cell = row.cells[parseInt(p[1])];
				if(cell)WIN.extend(cell, opt);
			}
		}
	},
	_updateRowIndex: function(start){
		if(isNaN(start) || start < 0)start = 0;
		Array.each(function(row, index){
		  row.rowIndex = index;
		}, this.rows, start);
	},
	unknown: null
});

/*
CLASS:
  classname
SUPERCLASS:
  superclass
SUBCLASS:
  subclass
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableColumnModule = function(){
  GUI.TableColumnModule.superClass.apply(this);
	
};
WIN.extendClass(GUI.TableColumnModule , GUI.TableElementBase);
WIN.extend(GUI.TableColumnModule.prototype, {
	width : "auto",
	
	unknown: null
});

/*
CLASS:
  classname
SUPERCLASS:
  superclass
SUBCLASS:
  subclass
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableRowModule = function(){
  GUI.TableRowModule.superClass.apply(this);	
};
WIN.extendClass(GUI.TableRowModule , GUI.TableElementBase);
WIN.extend(GUI.TableRowModule.prototype, {
	insertCell : function(index){
		var cell, cells = this.cells;
		
		index = GUI.TableBuilder.ensureIndex(index, cells);		
		cell = new GUI.TableCellModule;
		cells.insertAt(index, cell);
		cell.cellIndex = index;
		
		return row;
		
	},
	deleteCell : function(index){},
	unknown: null
});
GUI.TableRowModule.prototype.toString = function(){return "[object GUI.TableRowModule]";};
/*
CLASS:
  classname
SUPERCLASS:
  superclass
SUBCLASS:
  subclass
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableCellModule = function(){
  GUI.TableCellModule.superClass.apply(this);
	
};
WIN.extendClass(GUI.TableCellModule , GUI.TableElementBase);
WIN.extend(GUI.TableCellModule.prototype, {
	width : "inherit",
	height : "inherit",
	colSpan : "inherit",
	rowSpan : "inherit",
	value: "",
	unknown: null
});
GUI.TableCellModule.prototype.toString = function(){
	return "<td>" + this.value + "</td>";
};

GUI.TableBuilder = function(){};
WIN.extend(GUI.TableCellModule.prototype, {
	initialize: function(options){
		
		return this;
	},
/*
	buildColumns: function(cmsOptions){
		this.cms = [];
		Array.each(function(option){
		  this.cms.push((new GUI.TableColumnModule).initialize(option));
		}, cmsOptions);
	},
*/
	unknown: null
});

GUI.TableBuilder.ensureIndex = function(index, arr){
	if(isNaN(index))index = -1;//append
	else if(index < -1 || index > arr.length)throw new Error("INDEX_SIZE_ERR");
	if(index == -1)index = arr.length;
	
	return index;
};