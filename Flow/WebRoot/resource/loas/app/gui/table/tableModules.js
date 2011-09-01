/* tableModules.js
define GUI.TableCellModule
*/
require.provide("app.gui.table.tableModules");
require("app.gui.engin");
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
	
};
WIN.extend(GUI.TableColumnModule.prototype, {
	renderCell   : function(value, cellIndex, rowIndex, rCellsData, cellsData){
	  if(value === null)return null;
		var tdTxt = value, render = this.render;
		if(WIN.isFunction(render))tdTxt = render.apply(this, arguments);
		return tdTxt;
	},
	initialize   : function(options){
	  WIN.extend(this, options);
		return this;
	},
	align       : "left",//more: "left","middle","right".
	contentType : "text",//more: "date(formate:)", "currency", ""
	filed       : "",
	lable       : "",
	render      : null,
	sortable    : true,
	width       : "300px",
	widthFixed  : false,
	visible     : true,
	unknown: null
});

