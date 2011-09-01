/* tableSorter.js
local sort table

Base on Army(http://www.ffsky.com), 
Stuart LanGridge( http://www.kryogenix.org/code/browser/sorttable/)
*/

require.provide("app.gui.table.tableSorter");
require("lib.dom.engin");
require("app.gui.systemPathmapper");

/*
NAMESPACE:
  GUI.TableSorter
DES:
  local sort table manager;
PROPERTY:
  {datatype} property_name
FUNCTION:
  {returntype} function_name({datatype} argment1)
*/
namespace("GUI.TableSorter", {
  /*
  ():
    {string} GUI.TableSorter.convert({string} text)
  DES:
    convert ip, float-like or date-like text;
  */
  convert : function (text) {
    if(!text)return "";
    if(GUI.TableSorter.ipReg.test(text)){//ip
      var fill = GUI.TableSorter.fillIp;
      var r = parseInt(fill(RegExp.$1) + fill(RegExp.$2) + fill(RegExp.$3) + fill(RegExp.$4));
      return r;
    }
    if(/^-?[??[\d,.]+%?$/.test(text))
      return parseFloat(text);//num
    if(/^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/.test(text))
      return new Date(Date.parse(text));//Date
    return text.toString();  
  },
  ipReg : /^([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)\.([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)\.([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)\.([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)/,
  fillIp : function(num){
    num = "00" + num;
    return num.substr(num.length - 3);
    /*
    num = 1000 + parseInt(num);
    return String(num).substr(1);
    */
  },
  /*
  ():
    {int} GUI.TableSorter.compareTRs({HTMLRowElement} oTR1, {HTMLRowElement} oTR2)
  DES:
    compare rows;
  */
  compareTRs : function(iCol, oTR1, oTR2) {
    var vValue1, vValue2, sorter = GUI.TableSorter;
    vValue1 = sorter.convert(sorter.getInnerText(oTR1.cells[iCol]));
    vValue2 = sorter.convert(sorter.getInnerText(oTR2.cells[iCol]));
    
    if(vValue1.localeCompare || vValue2.localeCompare ){
      if(!vValue1.localeCompare)vValue1 = String(vValue1);
      return vValue1.localeCompare(vValue2);
    }
    else if (vValue1 < vValue2){
      return -1;
    }
    else if (vValue1 > vValue2) {
      return 1;
    }
    else {
      return 0;
    }
  },
  
  /*
  ():
    {void} GUI.TableSorter.init({HTMLTableElement} table, {array} overrides, {object} options)
  DES:
    init table head sort action;
  ARG:
    {HTMLTableElement} table
      table to be sort
    {array} overrides
      the index of the table columns dont need handle sort action;
    {object} options
      defaults to {
        autoAddSortArrow : true, //auto add sort arrow img to the sort th;
        cursorStyle : "default", //cursor of the sort th;
        onSort : null, //triggered on table sorted, accept 3 parameters : 
                    {HTMLTableElement} table, {int} sort cellIndex and {boolean} isDescending sort;
        getArrowContainer: Function.K //get a container for sort arrow,accept sort th as only param;
      }
  */
  init : function(table, overrides, options){
    if(!WIN.isElement(table) || table.tagName.toLowerCase() != "table") return ;
    var row = table.rows[0];
    if(!row)return ;
    options = WIN.extend({
      autoAddSortArrow : true,
      cursorStyle : "default",
      onSort : null,
      getArrowContainer: Function.K
    },options);
    
    var f = _f = function(cell){
      cell.onclick = Function.curry(GUI.TableSorter.hndTHClick, options);
      if(options.cursorStyle)cell.style.cursor = options.cursorStyle;
    };
    if(WIN.isArray(overrides)) f = function(cell, index){
      if(!overrides.contains(index))_f(cell);
    };
    Array.each(f, row.cells);
  },
  /*
  ():
    {void} GUI.TableSorter.hndTHClick({object} options)
  DES:
     hnd table thead cell(TH) onClick event, fires options.onSort event by 
     passing 3 parameters:table, sort cellIndex and isDescending sort;
  */
  hndTHClick : function(options){        
    var table = EL.getParentByAttr(this, "tagName", "table");
    if(table) {
      var sorter = GUI.TableSorter, iCol = this.cellIndex;
      var descSort = !!(this.isAscSort && (table.sortColumnIndex == iCol) );
      
      if(options.autoAddSortArrow){
        var img = sorter.getSortArrow(descSort);
        this.isAscSort = !(descSort);
        var ele = options.getArrowContainer(this);
        ele.appendChild(img);
      }
      sorter.sort(table, iCol);
      if(WIN.isFunction(options.onSort))options.onSort(table, iCol, descSort);
    }
  },
  /*
  ():
    {HTMLImageElement} GUI.TableSorter.getSortArrow({boolean} isDesc)
  DES:
     return an sort arrow img;
  ARG:
    {boolean} isDesc
      specify the src of sort arrow img;
  */
  getSortArrow : function(isDesc){
    var sorter = GUI.TableSorter;
    var img = sorter.sortArrowImg;
    if(!img){
      img = sorter.sortArrowImg = DOC.c("img");
    }
    var src = isDesc ? sorter.sortArrowImgSrc_down : sorter.sortArrowImgSrc_up ;
    img.setAttribute("src", src );
    return img;
  },
  sortArrowImgSrc_up : GUI.systemPathmapper.map("../up.gif"),
  sortArrowImgSrc_down : GUI.systemPathmapper.map("../down.gif"),
  /*
  ():
    {string} GUI.TableSorter.getInnerText({HTMLElement} node)
  DES:
     gets the node innerText || innerHTML
  */
  getInnerText : function (node) {    
    var text = String.trim(node.innerText || node.textContent || node.text);
		if(String.notEmpty(text))return text;
		else return String.trim(node.innerHTML);
  },
  
  /*
  ():
    {string} GUI.TableSorter.sort({HTMLElement || id} sTableID, {int} iCol, {int} iTbody)
  DES:
    sortTable;
  */
  sort : function (sTableID, iCol) {
    var start=new Date();
    //get all rows
    var oTable = $(sTableID);
    if(!oTable)return;
    var oTBody = oTable.tBodies[0];
    var colDataRows = oTable.rows;
    var aTRs = [], len = colDataRows.length - 1;
    if(len < 0)return ;
    
    for (var i=0; i < len; i++) {
      aTRs[i] = colDataRows[i + 1];
    }
    
    if (oTable.sortColumnIndex == iCol) {
      aTRs.reverse();
    } else {
      aTRs.sort(Function.curry(GUI.TableSorter.compareTRs, iCol));
    }
    
    var oFragment = document.createDocumentFragment();
    for (var i=0; i < aTRs.length; i++) {
      oFragment.appendChild(aTRs[i]);
    }
    oTBody.appendChild(oFragment);
  
    oTable.sortColumnIndex = iCol; //identify wheter this row has been sorted
  }
});