/* tableColorer.js
*/
require.provide("app.gui.table.tableColorer");

namespace("GUI.TableColorer",{
	/*
	():
		{boolean} GUI.TableColorer.paintRows({HTMLTableElement} table, {object}options)
	DES:
		paint table Rows width alternate color;
	ARG:
		{object}options
			default value is:{
				start : 1,//first always is th;
				oddLineColor : color.ODDLINE,
				evenLineColor: color.EVENLINE
			}
	*/
  paintRows : function(table, options){
		if(!WIN.isElement(table))return false;
		var rows = table.rows;
		if(!rows)return false;
		function getColor(index){
			var f = (((i + 1 - start) % 2) == 1);
			return (f ? opt.oddLineColor : opt.evenLineColor)
		}
		
		var color = GUI.TableColorer.COLOR;
		var opt = WIN.extend({
			startRowIndex : 1,//first always is th;
			oddLineColor : color.ODDLINE,
			evenLineColor: color.EVENLINE
		}, options);
		var start = opt.startRowIndex;
		
		for(var i = start, len=rows.length; i<len; i++){
			rows[i].style.backgroundColor = getColor(i);
		}
		
		return true;		
	},
	COLOR : {
		ODDLINE  : "#fff",
		EVENLINE : "#eee"
	}
});