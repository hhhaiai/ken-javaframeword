/* tableAutoWidther.js
formateTable display of the table expecially whose cells content may take up mutilline;
*/
require.provide("app.gui.table.tableAutoWidther");
require("lib.dom.style");

namespace("GUI");
GUI.TableAutoWidther = WIN.createClass(function(){
	}, {
		/*
		cfg:
			{string} collapseCss
		DES:
			css for collapsed row, defaults to "gui_table_widther_collapse"
		*/
		collapseCss : "gui_table_widther_collapse",
		/*
		cfg:
			{string} expandCss
		DES:
			css for expanded row, defaults to "gui_table_widther_expand"
		*/
		expandCss : "gui_table_widther_expand",
		/*
		cfg:
			{string} eventName
		DES:
			event name of expanding overflowed row, without "on";defaults to "click";
		*/
		eventName : "click",
		/*
		cfg:
			{boolean} autoCollapseLast
		DES:
			Defautly when a row of autoWidther's target was clicked, it will be expanded(we 
			call it focused) while the last expanded row will be collapsed; defaults to true
		*/
		autoCollapseLast : true,
		/*
		cfg:
			{Array} widthOverrides
		DES:
			index of the columns which neednt to be rewidth and just left to be auto width
			defaults to null
		*/
		widthOverrides : null,
		/*
		cfg:
			{Array} wrapOverrides
		DES:
			index of the columns which neednt to be wrapped by a div;
			Note: AutoWidther will defautly add a div wrap for each cell's children to control the 
			cell width to be good performance.defaults to null
		*/
		wrapOverrides : null,
		/*
		PROPERTY:
			{HTMLDivElement} divWrapCache
		DES:
			div element to wrap a cell children;
		*/
		divWrapCache : EL.c(),
		/*
		PROPERTY:
			{HTMLTableElement} target
		DES:
			autoWidther's target table, inited by initialize method;
		*/
		target : null,
		/*
		PROPERTY:
			{HTMLRowElement} lastFocusRow
		DES:
			last focused row;	see also cfg autoCollapseLast.
		*/
		lastFocusRow : null,
		
		/*
		():
			{this} initialize({HTMLTableElement} table, 
												{array} widthOverrides, {array} wrapOverrides)
		DES:
			initialize this.widthOverrides and this.wrapOverrides and formateTable;
		ARG:
			see widthOverrides and wrapOverrides property;
		*/
		initialize : function(table, widthOverrides, wrapOverrides){
			this.target = table;
			this.widthOverrides = widthOverrides;
			this.wrapOverrides = wrapOverrides;
			this.formateTable(table);
			return this;
		},
		collapseRow : function(row){
			if(row)EL.swapClass(row, this.expandCss, this.collapseCss);
			//if(row)row.className = this.collapseCss;
		},
		collapseAll : function(table){
			table = table || this.target;
			if(!this.isTable(table))return ;
			
			//auto tableLayout is imporant for ie,or ie will Breakdown with fixed tableLayout
			table.style.tableLayout = "auto";
			var f = Function.bind(this.collapseRow, this);
			Array.each(f, table.rows, 1);
			this._fixedTableLayout(table);
			this.lastFocusRow = null;
			
			this.expanded = false;
		},
		expandRow : function(row){
			if(row)EL.swapClass(row, this.collapseCss, this.expandCss);
			//if(row)row.className = this.expandCss;
		},
		expandAll : function(table){
			table = table || this.target;
			if(!this.isTable(table))return ;
			
			//auto tableLayout is imporant for Gecko,or Gecko's overflow hidden property wont work;
			table.style.tableLayout = "auto";
			var f = Function.bind(this.expandRow, this);
			Array.each(f, table.rows, 1);
			this._fixedTableLayout(table);
			
			this.expanded = true;
		},
		_fixedTableLayout : function(table){
			if(!this.isTable(table))return ;
			var s = table.style;
			if(BROWSER.Gecko)	setTimeout(function(){s.tableLayout = "fixed";},1);
			else s.tableLayout = "fixed";
		},
		formateRow : function(row){
			if(!WIN.isElement(row))return ;
			EL.addClass(row, this.collapseCss);
			// row.className = this.collapseCss;
			EVT.observe(row, this.eventName, Function.curry(this.hndClickRow, row, this));
			this.wrapCells(row.cells, this.wrapOverrides);
			/*var f = Function.bind(this.wrapCellWithDiv, this);
			Array.each(f, row.cells);*/
		},
		formateThead : function(thead){
			if(!WIN.isElement(thead))return ;
			EL.addClass(thead, this.collapseCss);
			//thead.className = this.collapseCss;
			var w , maxWidthIndex = 0, maxWidth = 0, wList = [], _this = this,
			    wdSkips = this.widthOverrides, wrSkips = this.wrapOverrides;
			
			//wrap cell childNodes with a div, get columns width and its max;
			Array.each(function(cell, index){
				w = parseInt(cell.style.width || cell.offsetWidth);
				if(!(WIN.isArray(wrSkips) && wrSkips.contains(index) )) _this.wrapCellWithDiv(cell);			
				if(WIN.isArray(wdSkips) && wdSkips.contains(index)){
					wList.push( -1);
				}
				else wList.push(w);
				if(w > maxWidth){
					maxWidth = w;
					maxWidthIndex = index;
				}
			}, thead.cells);
			wList[maxWidthIndex] = - 1;
			
			//reset all columns width except the max width column(leave it as auto);
			Array.each(function(cell, index){
				w = wList[index];
				if(w > 0){
					cell.style.width = EL.parseUnit(w);
				}
			}, thead.cells);
		},
		formateTable : function(table){
			if(!this.isTable(table) || table.formatedByAutoWidther) return this;
			
			this.formateThead(table.rows[0]);
			var f = Function.bind(this.formateRow, this);
			Array.each(f , table.rows, 1);
			table.style.tableLayout = "fixed";
			table.formatedByAutoWidther = true;
			return this;
		},
		hndClickRow : function(row, thisObj){
			var lastFocusRow = thisObj.lastFocusRow;
			if(lastFocusRow == row)return ;
			
			var table = row.parentNode.parentNode;
			table.style.tableLayout = "auto";
			
			if(thisObj.autoCollapseLast)thisObj.collapseRow(lastFocusRow);
			thisObj.expandRow(row);
			thisObj.lastFocusRow = row;
			
			thisObj._fixedTableLayout(table);
		},
		isTable : function(ele){
			return (WIN.isElement(ele) && ele.tagName.toLowerCase() == "table" );
		},
		toggle : function(){
			if(this.expanded)this.collapseAll();
			else this.expandAll();
		},
		wrapCells : function(cells, overrides){
			var f = Function.bind(this.wrapCellWithDiv, this);
			if(WIN.isArray(overrides))f = Function.bind(function(cell, index){
			  if(!overrides.contains(index))this.wrapCellWithDiv(cell);
			}, this);
			
			Array.each(f, cells);
		},
		wrapCellWithDiv : function(cell){
			/* in old version we use innerHTML to recreate cell chileNodes, but it will works well only when there're only text nodes in the cell;
			var tpl = "<div>inner</div>";
			cell.innerHTML = tpl.replace("inner", cell.innerHTML);*/			
			var wrap, sibNode;
			wrap = this.divWrapCache.cloneNode(false);
			cell.insertBefore(wrap, cell.firstChild);
			while(sibNode = wrap.nextSibling){
				wrap.appendChild(sibNode);
			}
		},
		toString : function(){
			return "[object GUI.TableAutoWidther]";
		}
	}
);

GUI.basicTableAutoWidther = new GUI.TableAutoWidther;