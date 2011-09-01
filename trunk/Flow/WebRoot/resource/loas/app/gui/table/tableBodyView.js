/* tableBodyView.js
define basic table view;
*/
require.provide("app.gui.table.tableBodyView");

require("lib.dom.style");
require("app.gui.engin");
require("app.gui.table.engin");
require("app.gui.table.tableModules");

/*
CLASS:
  GUI.TableBodyView
DES:
  description
PROPERTY:
  ?{boolean} cellCtrl
    determines the table cell ctrl, in order to ctrl the cell(like set height of it)we need to add inner div for every table cell.
  {boolean} showCellBorder
	  show seperate border betwean cells or not;
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableBodyView = function(){
};
WIN.extend(GUI.TableBodyView.prototype, {
	container: document.body,
	wrapCss: "gui_table",
	_TemplatedCellString : "<td>cellText</td>",
	_TemplatedCellRe : /cellText/,
	
	build : function(){
		this.buildView();
		this.onBuild();
	},
	onBuild: Function.empty,	
	buildView: function(){
		this.ele = EL.c({className: this.wrapCss});
		this.table = this.createMainTable();
		this.ele.appendChild(this.table);
		GUI.appendTo.call(this);	
	},
	createMainTable: function(){
		var cbCss = this.viewCfg.showCellBorder ? "withCB" : "withoutCB";
		var w = BROWSER.IE ? "" : " width = '100%' ";//ie default table width is 100% ;
		var html = '<table class="tableBody ' + cbCss  + '" ' + w + ' border="0" cellspacing="0" cellpadding="0"></table>';
		var table = this.table = EL.createElementsByHtml(html)[0];
		return table;
	},
	removeMainTable: function(){
		EL.removeNode(this.table);
		this.table = null;
	},
	clear: function(){
		this.removeMainTable();
		this.table = this.createMainTable();
		this.ele.appendChild(this.table);
	},
	createCellHtml: function(value, cellIndex, rowIndex, rCellsData, cellsData){
		var cm = this.cms[cellIndex];
		if(!cm)return "";
		var tdTxt = cm.renderCell(value, cellIndex, rowIndex, rCellsData, cellsData);
		if(tdTxt === null)return "";
		return this._TemplatedCellString.replace(this._TemplatedCellRe, tdTxt);
	},
	hideCellBorder : function(){
		EL.swapClass(this.table, "withCB" , "withoutCB");
	},
	showCellBorder : function(){
		EL.swapClass(this.table, "withoutCB" , "withCB");
	},
	initialize : function(viewCfg, options){
		this.viewCfg = WIN.extend(this.viewCfg, viewCfg);
		WIN.extend(this, options);
		this.build();
		return this;
	},
  deleteRow : function(index){
		return this.table.deleteRow(index);
	},
	parseCellsData: function(cellsData, startRowIndex){
	  var rows = this.table.rows;
		var col, cLen = this.cms.length, rLen = cellsData.length;
		var html = [], i, j, node, text;
		var reader = this.dataReader;
		startRowIndex = GUI.TableMgr.getValidIndex(startRowIndex, rows.length);
		
		for(i=0; i<rLen; i++){
			try{
				html.push("<tr>");
				node = cellsData[i];
				for(j=0; j<cLen; j++){
					text = reader.getAttribute(node, j);
					//value, cellIndex, rowIndex, rCellsData, cellsData
					text = this.createCellHtml(text , j, (startRowIndex + i), node, cellsData);
					if(!text)continue;
					html.push(text);
				}
				html.push("</tr>");
			}catch(e){}
		}
		return html.join("");
	},
	load: function(cellsData, index, options){
		var oldRows = this.table.rows;
		if(!oldRows)index = 0;
		else index = GUI.TableMgr.getValidIndex(index, oldRows.length);
		var html = this.parseCellsData(cellsData, index);
		var newRows = GUI.TableMgr.TableCreator.getRows(html);
		this.insertRowsAt(newRows, index);
		
/*
		var t0= new Date().getTime();
		var t1= new Date().getTime();
		WIN.debug('parseCellsData cost = ' + (t1 - t0));
		var t2 = new Date().getTime();
		WIN.debug('insert cost = ' + (t2 - t1));
*/
	},
	loadAsWholeTbody:function(cellsData, index, options){
		var startRowIndex, table = this.table, tb, tbs = table.tBodies;
		index = GUI.TableMgr.getValidIndex(index, tbs.length);
		
		tb = this.table.tBodies[index];
		if(tb)startRowIndex = tb.rows[0].rowIndex;
		else startRowIndex = table.rows.length;
		
		var html = this.parseCellsData(cellsData, startRowIndex);
		var tbody = GUI.TableMgr.TableCreator.getTbody(html);
		this.insertTbodyAt(tbody, index);	
	},
	/*
	():
		{boolean} insertRowsAt({HTMLRowElements} rows, {int} index)
	DES:
		append rows to table.
	*/
	insertRowsAt : function(rows, index){
		var table = this.table, oldRows = table.rows, refRow;
		if(!WIN.isElement(table)|| !rows)return false;
		
		var tBody, i, len = rows.length;
		index = GUI.TableMgr.getValidIndex(index, oldRows.length);
		refRow = oldRows[index];

		if(!refRow){
			tBody = table.tBodies[0];
			//ie defaut add TBODY when create a table;
			if(!tBody)tBody = table.appendChild(DOC.c("tbody"));
			while(rows[0])tBody.appendChild(rows[0]);
		}
		else {
			tBody = refRow.parentNode;
			while(rows[0])tBody.insertBefore(rows[0], refRow);
		}
		return true;
	},
	/*
	():
		{boolean} insertRowsAt({HTMLRowElements} rows, {int} index)
	DES:
		append tbody to table.
	*/
	insertTbodyAt : function(tbody, index){
		var table = this.table, refTbody = table.tBodies[index];
		if(refTbody)	table.insertBefore(tbody, refTbody);
		else table.appendChild(tbody);
	},
	setColWidth: function(colIndex, width){
		//if(!isNaN(colIndex))this.cms[colIndex].setWidth(width);
	},
	setRowsAttr: function(rmsOptions, rowsRange){
		var opt, p, row, rows = rowsRange || this.table.rows;
		for(p in rmsOptions){
			opt = rmsOptions[p];
			row = rows[parseInt(p)];
			if(row)WIN.extend(row, opt);
		}
	},
	setCellsAttr: function(cellsOptions, rowsRange){
		var opt, p, cell, cells, row, rows = rowsRange || this.table.rows;
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
	unknown: null
});

