/*
 * table.js
 * defined table models, include: ColumnModel, RowModel, TableModel;
 */

//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.ele.table");
//require resource
require("lib.core.util.singlelast");
require("lib.dom.engin");
require("lib.evt.engin");
require("app.gui.engin");
require("app.gui.ele.engin");
require("lib.dom.css");

GUI.grid = {};

GUI.grid.ColumnModel = function(){
	/*
	():
		{this} initialize({object} options)
	DES:
		description
	ARG:
		{object} options
		  {
			  lable: "",
				sot
			}
	*/
	this.initialize = function(options){
		var p = WIN.extend({
				align       : "middle",//more: "left","middle","right".
				contentType : "text",//more: "date(formate:)", "currency", ""
				filed       : "",
			  lable       : "",
				renderer    : null,
				sortable    : true,
				span        : 1,//
				width       : "300px",
				widthFixed  : false,
				visible     : true
		  }, options);
		WIN.extend(this, p);
		return this;
	};
};

GUI.grid.RowNumColumnModel = function(){
	this.initialize = function(options){
		var p = WIN.extend({
			  lable       : "&nbsp;",
				renderer    : function(value, rowIndex, columnIndex){
					  return "<td class='grid-col-rownum'>" + rowIndex + "</td>";
					},
				span        : 1,//
				width       : "30px",
				widthFixed  : true,
				visible     : true
		  }, options);
		WIN.extend(this, p);
		return this;
	};
};
GUI.grid.RowSelectorColumnModel = function(){
	this.initialize = function(type, name, options){
		name = (name ||"selector");
		type = (type || "checkbox");
		var input = "<input type='" + type + "' name='" + name + "' />";
		var tdTxt = "<td style='text-align:center;'>" + input + "</td>";
		
		var p = WIN.extend({
			  lable       : (type=="checkbox") ? input : "&nbsp;",
				renderer    : function(){
					  return tdTxt;
					},
				span        : 1,//
				width       : "30px", 
				widthFixed  : true,
				visible     : true
		  }, options);
		WIN.extend(this, p);
		return this;
	};
};

GUI.grid.TableModel = function(){
	/*
	():
		{this} initialize({object} options)
	DES:
		description
	ARG:
		{object} options
		  {
			  lable: "",
				sot
			}
	*/
	this.initialize = function(options){
		var p = WIN.extend({
				addRowNum    : true,
				caption      : "",
				cms          : null,//[]
				colCSSPrefix : "",
				container    : document.body,//HTMLElement
				data         : null,//[]
				dataReader   : null,//{}
				height       : 200, //more: same as width
				plugins      : null,//[]
				style        : null,//view options
				width        : "100%"//more: "750px", 750.
		  }, options);
		WIN.extend(this, p);
		if(this.addRowNum)this._addRowNumCM();
		this.container = $(this.container);
		if(!this.colCSSPrefix)this.colCSSPrefix = "grid-col-width-" + new Date().getTime() + "-";
		
		this.rowStatusStyle = {};
		this.rowStatusPriority = {};
		this.rowStatusObserver = new WIN.Observer();
		this.rowStatusObserver.add(Function.bind(this.setRowStyle, this));
		this.registerRowStatusStyle("DefaultStatus", {backgroundColor: "#fff"});
		this.registerRowStatusPriority("DefaultStatus", 0);
		
		this.buildView();
		
		if(this.plugins){
			var f = Function.bind(function(plugin){
					if(plugin.execute)plugin.execute(this);
				}, this);
			try{Array.each(f, this.plugins);}catch(e){}
		}
		return this;
	};
	this._addRowNumCM = function(){
		var rowNumCol = [new GUI.grid.RowNumColumnModel().initialize()];
		this.cms = rowNumCol.concat(this.cms);
	};
	this._createContent = function(){
		var cTableWrap = EL.c(null,{
				height     : parseInt(this.height) - 20 + "px",
				overflow   : "auto",
				position   :"relative",
				left       :"0px",
				top        :"0px",
				width      : "100%"
			},{
				scroll   : Function.curry(function(hTable){
						hTable.style.marginLeft = - this.scrollLeft;
					}, this.headerTable)
			});
		this.wapper.appendChild(cTableWrap);
		
		var css, tableHtml = "<table border=1 style='margin-top:-3px;'><tr>";//margin-top for hidden thead
		var j = 1, _this = this;
		Array.each(function(i){
				css = _this.colCSSPrefix + j;
				tableHtml += "<th class='" + css + "'>"
									+ "</th>";
				j += 1;
			}, this.cms);
		tableHtml += "</tr><tbody></tbody></table>";
		cTableWrap.innerHTML = tableHtml;
		
		this.contentTable = cTableWrap.firstChild;
		EVT.observe(window,"resize",Function.bind(this._updateTableWidth,this));
	};
	this._createHeader = function(){//header height : "20px"
		var headerWrap = EL.c(null,{
				height     : "20px",
				lineHeight : "20px",
				overflow   : "hidden",
				backgroundImage:"url(../../../resource/image/skin/default/subpage/bg_table_hrow.gif)",
				width      : "100%"
			});
		this.wapper.appendChild(headerWrap);
		this.headerWrap = headerWrap;
		
		var css, cssText = "",j = 1, _this = this, tableHtml = "<table border=1><tr>";
		Array.each(function(i){
				css = _this.colCSSPrefix + j;
				tableHtml += "<th align='" + i.align + "' class='" + css + "'>"
											+ "<div class='" + css + "'>" + i.lable + "</div>"
									+ "</th>";
				j += 1;
				cssText += "." + css + "{width:" + i.width + ";}";
			}, this.cms);
		
		EL.CSS.createStyleSheet(cssText);
		tableHtml += "</tr></table>";
		headerWrap.innerHTML = tableHtml;
		this.headerTable = headerWrap.firstChild;
	};
	this._createTableWrap = function(){
		var wapper = EL.c(null, {
			width: this.width
		});
		if(WIN.isElement(this.container))this.container.appendChild(wapper);
		this.wapper = wapper;
	};
	this._updateTableWidth = function(){
		var style = this.headerTable.style;
		style.width = "auto";
		var w = this.tableWidth = this.wapper.scrollWidth -17 + "px";
		setTimeout(Function.bind(function(){
			style.width = w;
			this.contentTable.style.width = w;
												}, this),1);
	};
	this.setColumnWidth = function(colIndex, w){
		try{
			var selectorText = "." + this.colCSSPrefix  + colIndex;
			EL.CSS.updateRule(selectorText, "width", w);
		}catch(e){}
	};
	this.buildView = function(){
		this._createTableWrap();
		this._createHeader();
		this._createContent();
	};
	this.deleteColumn = function(colIndex){
		
	};
	this.deleteRow = function(rowIndex){
		
	};
	this.freezeColumnFrom = function(colIndex){
		
	};
	this.freezeRowFrom = function(rowIndex){
		
	};
	this.getColumnWidth = function(colIndex){
		
	};
	this.getRowHeight = function(rowIndex){
		
	};
	this.hideColumn = function(colIndex){
		
	};
	this.insertRow = function(rowIndex){
		
	};
	/*
	():
		{returntype} parseData({string} type, {array} data)
	DES:
		parse data to rows html
	ARG:
		{string} type
		  type has these options: "array"(default), "xml", "json"
	*/
	
	this.parseArrayData = function(data){
		if(!data)return "";
		var html = [], len = data.length, len2, tds, tdTxt;
		for(var i = 0; i<len; i++){
			tds = data[i];
			if(!WIN.isArray(tds))continue;
			len2 = tds.length;
			html.push("<tr>");
			for(var j = 0; j<len2; j++){
				tdTxt = this.cms[j].renderer(tds[j], j);
				if(!tdTxt)tdTxt = tds[j];
			  html.push("<td>" + tdTxt + "</td>");
			}
			html.push("</tr>");
		}
		return html.join("");
	};
	/*
	():
		{HTMLElement} getTbodyByRowIndex({int} index)
	DES:
		when insert a row element,we need to find its parent tbody to do append;
	ARG:
		{int} index
		  row index
	RTN:
		tBody | null
	*/
	this.getTbodyByRowIndex = function(index){
		try{
			var tBody = this.contentTable.rows[index].parentNode;
			if(tBody.tagName.toLowerCase() == "tbody")return tBody;
			return null;
		}catch(e){return null;}
	};
	/*
	():
		{returntype} insertRowsAt({HTMLRowElements} rows)
	DES:
		append rows to contentTable
	ARG:
		{HTMLRowElements} rows
		  
	RTN:
		return_value_description
	*/
	this.insertRowsAt = function(rows, rowIndex){
		try{
			var table = this.contentTable;
			if(!(WIN.isElement(table) && WIN.isArray(rows)))return false;
			var tBody = this.getTbodyByRowIndex(rowIndex);
			var refRow = table.rows[rowIndex];
			var insert = function(i){tBody.insertBefore(i,refRow);}
			if(!tBody){
				tBody = DOC.c("tbody");
				table.appendChild(tBody);
			}
			Array.each(insert, rows)
			return true;
		}catch(e){return false;}
	};
	/*
	():
		{returntype} appendTbody({HTMLRowElements} rows)
	DES:
		append a tbody to contentTable
	ARG:
		{HTMLRowElements} rows
		  
	RTN:
		return_value_description
	*/
	this.insertTbodyAt = function(tBody, tBodyIndex){
		var table = this.contentTable;
		if(!(WIN.isElement(table) && WIN.isElement(tBody)))return false;
		if(!tBodyIndex)table.appendChild(tBody);
		else{
			try{
				table.insertBefore(tBody, table.tBodies[tBodyIndex]);
			}catch(e){return false;}
		}
		return true;
	};
	
	this.loadData = function(data, isAdd){
		var startRowIndex = isAdd ? this.contentTable.rows.length : 1;
		data = this.dataReader.read(this.cms, data, startRowIndex);
		var tbody = GUI.grid.TableModel.tableCache.getTbody(data);
		if(!tbody)return false;
		if(!isAdd)this.clear();
		this.insertTbodyAt(tbody);
		return true;
	};
	
	this.addRowStatus = function(row, status){
		if(!WIN.isElement(row))return ;
		var re = new RegExp( "," + status,"ig");
		if(re.test(row.rowStatus))return;
		if(row.rowStatus)row.rowStatus += "," + status;
		else row.rowStatus = "DefaultStatus," + status;
		this.onRowStatusChange(row);
	};
	this.getMaxPriorityStatus = function(row){
		if(!WIN.isElement(row))return "";
		var s = row.rowStatus;// rowStatus is a string like this: "isMouseover, isFocus, isSelected"
		if(!s)return "";
		
		var sArr = s.split(",");
		var maxs = "", p = - Number.MAX_VALUE, rsp = this.rowStatusPriority;
		Array.each(function(i){
				i = i.toLowerCase();
				if(rsp[i] > p){
					p = rsp[i];
					maxs = i;
				}
			}, sArr);
		return maxs;
	};
	this.removeRowStatus = function(row, status){
		if(!WIN.isElement(row))return ;
		var re = new RegExp( "," + status,"ig");
		if(!re.test(row.rowStatus))return;
		if(row.rowStatus)row.rowStatus = row.rowStatus.replace(re,"");
		else row.rowStatus = "DefaultStatus";
		this.onRowStatusChange(row);
	};
	this.setRowStyle = function(row){
		try{
			EL.setStyle(row, this.rowStatusStyle[this.getMaxPriorityStatus(row)]);
		}catch(e){}
	};
	this.onRowStatusChange = function(row){
		this.rowStatusObserver.execute(row);
	};
	
	/*
	():
		{void} registerRowStatusStyle({string} status, {object} style)
	DES:
		register a style for different row status 
	ARG:
		{string} status
		  row status
		{object} style
		  json style object
	*/
	this.registerRowStatusStyle = function(status, style){
		this.rowStatusStyle[status.toLowerCase()] = style;
	};
	/*
	():
		{void} registerRowStatusPriority({string} status, {int} priority)
	DES:
		The row of contont table(this.contentTable) has different status,we use priority to indicate the importance bt them.This method registers a priority of row status .
	ARG:
		{string} status
		  row status
		{int} priority
		  the row status's priority
	*/
	this.registerRowStatusPriority = function(status, priority){
		this.rowStatusPriority[status.toLowerCase()] = priority;
	};
	
	this.clear = function(){
		var table = this.contentTable;
		if(!WIN.isElement(table))return false;
		var tBodies = table.tBodies;
		var len;
		if(tBodies){
			len = tBodies.length;
			for(var i=1; i<len; i++){
				table.removeChild(tBodies[i]);
			}
		}
		var rows = table.rows;
		len = rows.length;
		for(var i=1; i<len; i++){//i=1,start from second row,for we cant remove the first row;
			table.removeChild(rows[i]);
		}
		return true;
	};
	this.showColumn = function(colIndex){
		
	};
	this.setRowHeight = function(rowIndex, h){
		
	};
	/*
	():
		{returntype} sort({int} colIndex)
	DES:
		sort table
	*/
	this.sort = function(colIndex){
		
	};
}

GUI.grid.ArrayDataReader = function(){
	this.initialize = function(mapping){
		this.mapping = mapping;
		this.type = "array";
		return this;
	};
	this.read = function(cms, data, startRowIndex){
		if(!(cms && data))return "";
		var col, len = cms.length, dataLen = data.length, startRowIndex = (startRowIndex || 0);
		
		var html = [], source, tdTxt, renderer, p;
		for(var i=0; i<dataLen; i++){
			try{
				source = data[i];				
				html.push("<tr>");
				for(var j=0; j<len; j++){
					col = cms[j];
					renderer = col.renderer;
					p = this.mapping[col.filed];
					if(WIN.isDefined(p))tdTxt = source[p];
					if(WIN.isFunction(renderer))tdTxt = renderer(tdTxt, (startRowIndex + i), j);//(value, rowIndex, columnIndex)
					else tdTxt = "<td>" + tdTxt + "</td>";
					html.push(tdTxt);
				}
				
				html.push("</tr>");
			}catch(e){}
		}	
		return html.join("");
	};
	this.toString = function(){
		return "[object ArrayDataReader]";
	};
};
GUI.grid.JSONDataReader = function(){
	this.initialize = function(mapping){
		this.$initialize(mapping);
		return this;
	};
	this.toString = function(){
		return "[object JSONDataReader]";
	};
};
WIN.extendClass(GUI.grid.JSONDataReader, GUI.grid.ArrayDataReader);

GUI.grid.XMLDataReader = function(){
	this.initialize = function(){
		return this;
	};
	this.read = function(cms, data){
	};
	this.toString = function(){
		return "[object XMLDataReader]";
	};
};

GUI.grid.plugin = function(){
	var _getParent = function(target, tagName){
	  return EL.getParentByAttr(target, "tagName", tagName);
	};
	var _isEle = WIN.isElement;
  var _isThead = function(row){
	  try{
		  return Array.some(function(i){
			  var tagName = i.tagName;
				if(tagName && tagName.toLowerCase() == "th")return true;
			}, row.childNodes);
		}catch(e){return false;}
	};
	
	return {
		PrettyRow   : function(){
			this.initialize = function(options){
				var p = WIN.extend({
					styleMouseover  : {backgroundColor: "#EEF7FF"},
					styleIsFocus    : {backgroundColor: "#FFFFCC"}
				},options);
				WIN.extend(this, p);
				return this;
			};
			this.execute = function(host){
				this.host = host;
				EL.setEvent(host.contentTable, {
					mouseover  : Function.bind(this._hndTableOMO, this),
					click      : Function.bind(this._hndTableOC, this)
				});
				var regStyle = Function.bind(host.registerRowStatusStyle, host);
				var regPriority = Function.bind(host.registerRowStatusPriority, host);
				regStyle("PR_mouseover", this.styleMouseover);
				regStyle("PR_isFocus", this.styleIsFocus);
				regPriority("PR_mouseover", 1);
				regPriority("PR_isFocus", 2);
			};
			this._hndTableOC = function(evt){
				evt = EVT.Event.fix(evt);
				var target = evt.target;
				var eleTR = _getParent(target, "tr");
				
				if(_isEle(eleTR) && !_isThead(eleTR)){
					this._hndTrOC(eleTR, target);	
				}
			};
			this._hndTableOMO = function(evt){
				evt = EVT.Event.fix(evt);
				var target = evt.target;
				var eleTR = _getParent(target, "tr");
				if(_isEle(eleTR) && !_isThead(eleTR)){
					this._hndTrOMO(eleTR, target);	
				}
			};
			this._hndTrOC = function(row, target){
				if(!isNaN(row)){
					var table = this.host.contentTable;
					if(!_isEle(table))return;
					row = table.rows[row];
				}
				this.rowOC_SingleLast.set(row);
			};
			this._hndTrOMO = function(ele, target){
				this.rowOMO_SingleLast.set(ele);
			};
			var _this = this;
			var _osl = this.rowOMO_SingleLast = WIN.extend(new WIN.SingleLast(), {
				_set :function(row){
					if(!_isEle(row))return;
					_this.host.addRowStatus(row, "PR_mouseover");
				},
				_restore: function(lastRow){
					if(!(_isEle(lastRow)))return;
					_this.host.removeRowStatus(lastRow, "PR_mouseover");
				}
			});
			var _csl = this.rowOC_SingleLast = WIN.extend(new WIN.SingleLast(), {
				_set :function(row){
					if(!_isEle(row))return;
					_this.host.addRowStatus(row, "PR_isFocus");
				},
				_restore: function(lastRow){
					if(!(_isEle(lastRow)))return;
					_this.host.removeRowStatus(lastRow, "PR_isFocus");
				}
			});
			_osl.initialize(_osl._set, _osl._restore);	
			_csl.initialize(_csl._set, _csl._restore);
		}
	};
}();

EVT.domLoadedObserver.add(function(){
	GUI.grid.TableModel.tableCache = function(){//on domLoaded,and it must be triggered before any GUI.grid.TableModel initialize.
		var container = EL.c(null,{
			display : "none"
		});
		var appended = false;
		var warpperHtml_1 = "<table id='__TableModel__tableCache__table'><tbody>";
		var warpperHtml_2 = "<tbody></table>";
		var createEles = function(type, html){
			if(!html) return null;
			if(!appended){
				document.body.appendChild(container);
				appended = true;
			}
			html = warpperHtml_1 + html + warpperHtml_2;
			container.innerHTML = html;
			var table = $("__TableModel__tableCache__table");
			if(!(WIN.isElement(table) && table.tagName.toLowerCase() == "table"))return null;
			if(type == "rows")return table.rows;
			else if(type == "tbody") return table.tBodies[0];
		};
	
		return {
			/*
			():
				{array} GUI.grid.TableModel.tableCache.getRows({string} html)
			DES:
				ie cant create table rows by setting innerHTML which can only create a table;
			ARG:
				{string} html
					rows html
			RTN:
				rows array,
			*/
			getRows  : Function.curry(createEles, "rows"),
			/*
			():
				{HTMLElement} GUI.grid.TableModel.tableCache.getTbody({string} html)
			DES:
				See also getRows
			RTN:
				table tBody;
			*/
			getTbody : Function.curry(createEles, "tbody")
		};
	}();
});

