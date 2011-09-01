/***************************************************************
localFilter.js
window and dialog gui base
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.table.localFilter");
require("lib.dom.engin");

namespace("GUI");
/*
CLASS:
  GUI.TableLocalFilter
DES:
  table local view filter
PROPERTY:
  {int}defFilterColIndex
    default filter column index;with zero index.-1 means search all cols in table
  {int}defFilterStartRowIndex
    default filter row start;with zero index.1 search from second row;
METHOD:
  {this} initialize({string | HTMLelement} table, {int} colIndex, int} startRow)
  {void} filterByStr({string} str, {int} colIndex, {int}startRow)
  {void} applyFilterBehavior({HTMLElement} ele)
  {void} cancelFilter()
  {void} discardFilterBehavior({HTMLElement} ele)
*/
GUI.TableLocalFilter = function (){}
WIN.extend(GUI.TableLocalFilter.prototype, {
  /*
  ():
    {void} initialize({string | HTMLelement} table, {int} colIndex, {int} startRow)
  DES:
    initialize myTableFilter
  ARG:
    {string | HTMLelement} tableId
      target table id | element
    {int} colIndex
      see filterByStr method;
    {int} startRow
      see filterByStr method;
  */
  initialize : function(table, colIndex, startRow){
    ele = $(table);
    if(!WIN.isElement(ele))return this;
    this.ele = ele;
    this.defFilterColIndex = isNaN(colIndex) ? -1 : colIndex;
    this.defFilterStartRowIndex = isNaN(startRow) ? 1 : startRow;
    return this;
  },
  
  /*
  ():
    {void} filterByStr({string} str, {int} colIndex, {int}startRow)
  DES:
    filter Rows By spcifid string
  ARG:
    {string} str
      key words for filter
    {int} colIndex
      optional,default is -1
      Specify which column is to be search, if it's -1 then search whole table.
      it's within zero index,that means 0 stands for first.
    {int} startRow
      optional,default is 1
      specify the start row to search.within zero index.
  */
  filterByStr : function(str, colIndex, startRow){
    if(!WIN.isString(str))str = "";
    str = str.toLowerCase();
    str = String.trim(str);
    var row, rows = this.ele.rows;
    //replace illegal char for RegExp "+","/","?","[","]"
    str = str.replace(/\+|\\|\?|\[|\]/g,"");
    var re = new RegExp(str);
    if(isNaN(startRow) || startRow < 0){
      startRow = this.defFilterStartRowIndex;
    }
    if(isNaN(colIndex)){
      colIndex = this.defFilterColIndex;
    }
    for(var i=startRow, len = rows.length; i<len; i++){
      row = rows[i];
      if(!GUI.TableLocalFilter.isRowContains(row, re, colIndex)){
        this.applyFilterBehavior(row);
      }
      else {
        this.discardFilterBehavior(row);
      }
    }
  },
  
  /*
  ():
    {void} applyFilterBehavior({HTMLElement} ele)
  DES:
    behavior for element which fits the filter rule
  ARG:
    {HTMLElement} ele
      filtered element
  */
  applyFilterBehavior : function(ele){
    ele.style.display = "none";
  },
  
  /*
  ():
    {void} cancelFilter()
  DES:
    behavior for element which fits the filter rule
  */
  cancelFilter : function(){
    this.filterByStr("");
  },
  
  /*
  ():
    {void} discardFilterBehavior({HTMLElement} ele)
  DES:
    behavior for element which doesnt fit the filter rule
  */
  discardFilterBehavior : function(ele){
    ele.style.display = "";
  },
  unknown: null
});
/*
NAMESPACE:
  GUI.TableLocalFilter
FUNCTION:
  {boolean} GUI.TableLocalFilter.isRowContains({HTMLTableRowElement}row, {RegExp}pattern, {int}colIndex)
  {boolean} GUI.TableLocalFilter.initSelectColIndex({HTMLSelectElement | string} select, 
                               {HTMLtableElement | string} table)
  {boolean} GUI.TableLocalFilter.isCellContains({HTMLTableCellElement}cell, {RegExp}pattern)
*/
WIN.extend(GUI.TableLocalFilter, {
  /*
  ():
    {boolean} GUI.TableLocalFilter.isRowContains({HTMLTableRowElement}row, {RegExp}pattern, {int}colIndex)
  DES:
    return ture if the assign row contains the keyword given by;
  ARG:
    {HTMLTableRowElement}row
      row to be search 
    {RegExp}pattern
      search pattern
    {int}colIndex
      optional,Specify which column is to be search, if it's -1 then search whole table.
      within zero index
  */
  isRowContains: function (row, pattern, colIndex){
    var cells = row.cells;
    if(isNaN(colIndex) || colIndex < 0 || colIndex >= cells.length){
      return pattern.test(EL.getInnerText(row).toLowerCase());
    }
    else{
      return GUI.TableLocalFilter.isCellContains(cells[colIndex], pattern);
    }
  },
  /*
  ():
    {boolean} GUI.TableLocalFilter.initSelectColIndex({HTMLSelectElement | string} select, 
                                 {HTMLtableElement | string} table)
  DES:
    use the cloumn num of given table to init options of select element.
  ARG:
    {HTMLSelectElement | string} select
      element to be added new options
    {HTMLtableElement | string} table
      the target table to be filter
  RTN:
     return true when init success.
  */
  initSelectColIndex : function (select, table){
    select = $(select);
    table = $(table);
    if(!(WIN.isElement(table) || WIN.isElement(select)))return false;
    try{
      var len = table.rows[0].cells.length;
      var selectOptions = select.options;
      var optionText;
      if(len > 0){//or no need to add options
        for(var i=0; i<len ; i++){
          optionText = "第" + (i + 1) + "列";
          selectOptions.add(new Option(optionText,i)); 
        }
      }else return false;
      return true;
    }catch(e){
      return false;
    }
  },
  /*
  ():
    {boolean} GUI.TableLocalFilter.isCellContains({HTMLTableCellElement}cell, {RegExp}pattern)
  DES:
    return ture if the assign cell contains the keyword given by;
  ARG:
    {HTMLTableCellElement}cell
      cell to be search 
    {RegExp}pattern
      search pattern
  */
  isCellContains: function (cell, pattern){
    return pattern.test(EL.getInnerText(cell).toLowerCase());
  }
});
/*
CLASS:
  GUI.TableLocalFilterConsole
DES:
  manage filter components.
PROPERTY:
  {string} keywordId
  {string} btnGoId
  {string} btnCancelId
  {string} advanceAreaId
  {string} instantFilterId
  {string} selectColIndexId
METHOD:
  {void} initialize({string | HTMLelement} table, {int} colIndex, {int} startRow)
  {void} initCompontents()
  {void} dispose()
  {void} txt_kw_onclick()
  {void} txt_kw_onkeyup({event} evt)
  {void} btn_go_onclick()
  {void} btn_cc_onclick()
  {boolean} btn_optCtrl_onclick()
  {void} sel_colInd_onchange()
*/
GUI.TableLocalFilterConsole = function(){};
WIN.extend(GUI.TableLocalFilterConsole.prototype, {
  /*
  PROPERTY:
    {string} advanceAreaId
      (optional)id of advance filter options area
  */
  advanceAreaId : "advanceFilterArea",
  /*
  PROPERTY:
    {string} advanceAreaId
      (optional)control advanceArea display;
  */
  advanceAreaHndId : "advanceFilterAreaHnd",
  /*
  PROPERTY:
    {string} btnGoId
      (optional)id of go button
  */
  btnGoId       : "btnGo",
  /*
  PROPERTY:
    {string} btnCancelId
      (optional)id of cancel filter button
  */
  btnCancelId   : "btnCancel",
  /*
  PROPERTY:
    {string} instantFilterId
      (optional)id of checkbox to enable instant filter 
  */
  instantFilterId : "chkInstantFilter",
  /*
  PROPERTY:
    {string} keywordId
      id of text component for user input keyword
  */
  keywordId : "textKeyword",
  keywordDefaultValue: "请输入关键字",
  /*
  PROPERTY:
    {string} selectColIndexId
      (optional)id of select component to select filter table column index
  */
  selectColIndexId: "selectColIndex",
  
  /*
  ():
    {void} initialize({string | HTMLelement} table, {int} colIndex, {int} startRow)
  DES:
    create a new tableFilter and init console compontents;
  ARG:
    see GUI.TableLocalFilter initialize method;
  */
  initialize : function(table, colIndex, startRow){
    this.filter = (new GUI.TableLocalFilter).initialize(table, colIndex, startRow);
    GUI.TableLocalFilter.initSelectColIndex(this.selectColIndexId, table);
    this.initCompontents();
    var _this = this;
    EVT.observe(window, "unload", function(){
      _this.dispose();
    });
    return this;
  },
  /*
  ():
    {void} initCompontents()
  DES:
    init console compontents;
  */
  initCompontents : function(){
    var txt_kw = $(this.keywordId),
        btn_go = $(this.btnGoId),
        btn_cc = $(this.btnCancelId),
        btn_optCtrl = $(this.advanceAreaHndId),
        sel_colInd = $(this.selectColIndexId);
    if(WIN.isElement(txt_kw)){
      txt_kw._this = this;
      txt_kw.onclick = this.txt_kw_onclick;
      txt_kw.onkeyup = this.txt_kw_onkeyup;
    }
    if(WIN.isElement(btn_go)){
      btn_go._this = this;
      btn_go.onclick = this.btn_go_onclick;
    }
    if(WIN.isElement(btn_cc)){
      btn_cc._this = this;
      btn_cc.onclick = this.btn_cc_onclick;
    }
    if(WIN.isElement(btn_optCtrl)){
      btn_optCtrl._this = this;
      btn_optCtrl.onclick = this.btn_optCtrl_onclick;
    }
    if(WIN.isElement(sel_colInd)){
      sel_colInd._this = this;
      sel_colInd.onchange = this.sel_colInd_onchange;
    }
  },
  /*
  ():
    {void} dispose()
  DES:
    dispose obj;
  */
  dispose : function(){
    var txt_kw = $(this.keywordId),
        btn_go = $(this.btnGoId),
        btn_cc = $(this.btnCancelId),
        btn_optCtrl = $(this.advanceAreaHndId),
        sel_colInd = $(this.selectColIndexId);
    if(txt_kw)txt_kw._this = null;
    if(btn_go)btn_go._this = null;
    if(btn_cc)btn_cc._this = null;
    if(btn_optCtrl)btn_optCtrl._this = null;
    if(sel_colInd)sel_colInd._this = null;
  },
  /*
  ():
    {void} txt_kw_onclick()
  DES:
    handler for textKeyword onclick; if the value is default then clear it;
  */
  txt_kw_onclick :function(){
    if(this.value == this._this.keywordDefaultValue) this.value = "";
  },
  /*
  ():
    {void} txt_kw_onkeyup({event} evt)
  DES:
    handler for textKeyword(it's a HTMLInputElement id) onkeyup.if autoFilter is enable,
    it will filter table on any keyup, else it just answers for the 'enter' key.
  ARG:
    {event} evt
  */
  txt_kw_onkeyup : function(event){
    var evt = event || window.event;
    var obj = this._this;
    var str = this.value, chk_instant = $(obj.instantFilterId);
    var auto = (chk_instant && chk_instant.checked) ? true : false;
    var filter = obj.filter;
    if(auto){
      filter.filterByStr(str);
    }
    else if(evt.keyCode == 13){// enter    
      filter.filterByStr(str);
    }
  },
  /*
  ():
    {void} btn_go_onclick()
  DES:
    set empty for textKeyword on focus
  */
  btn_go_onclick : function(){
    var obj = this._this;
    var txt_kw = $(obj.keywordId);
    var filter = obj.filter;
    filter.filterByStr(txt_kw.value);
  },
  /*
  ():
    {void} btn_cc_onclick()
  DES:
    cancel filter action, show whole table view.
  */
  btn_cc_onclick : function(){
    var filter = this._this.filter;
    filter.cancelFilter();
  },
  /*
  ():
    {boolean} btn_optCtrl_onclick()
  DES:
    show AdvanceArea whose visibility is hidden on page start.
  */
  btn_optCtrl_onclick : function(){
    var obj = this._this;
    this.style.display = "none";
    var ele = $(obj.advanceAreaId);
    if(!WIN.isElement(ele)){
      alert("抱歉，装载过滤选项发生错误!请尝试刷新页面！");
      return false;
    }
    ele.style.visibility = "visible";  
    return true;
  },
  /*
  ():
    {void} sel_colInd_onchange()
  DES:
    change search column index
  */
  sel_colInd_onchange : function(){
    var obj = this._this;
    var sValue = parseInt(this.options[this.selectedIndex].value);
    var filter = obj.filter;
    if(!isNaN(sValue))filter.defFilterColIndex = sValue;
  },
  unknown: null
});
