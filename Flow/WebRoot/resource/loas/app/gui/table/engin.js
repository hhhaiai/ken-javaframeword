/***************************************************************
engin.js
window and dialog gui base
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.table.engin");

namespace("GUI");
/*
NAMESPACE:
	GUI.TableMgr
DES:
	table common methods
PROPERTY:
  {NAMESPACE} GUI.TableMgr.TableCreator
FUNCTION:
	{int} GUI.TableMgr.getValidIndex({int} index, {int} len)
*/
GUI.TableMgr = {
	/*
	():
		{int} GUI.TableMgr.getValidIndex({int} index, {int} len)
	DES:
		get valid table index; if index is NaN,
	ARG:
		{int} index
		  index to be validated;
		{int} len
		  length of table rows or tBodies;
	RTN:
		if index is case of NaN, <= -1, >len return len;
		else return index
	*/
	getValidIndex: function(index, len){
		if(isNaN(len))return 0;
		if(isNaN(index) || (index <= -1) || (index > len))index = len;
		return index;
	},
	/*
	NAMESPACE:
		GUI.TableMgr.TableCreator
	DES:
		create table elements by rows html string;
	FUNCTION:
		{array} GUI.TableMgr.TableCreator.getRows({string} html)
		{HTMLTbodyElement} GUI.TableMgr.TableCreator.getTbody({string} html)
		{HTMLTableElement} GUI.TableMgr.TableCreator.getTable({string} html)
	*/
  TableCreator : function(){
    var table, tmpHtml = "<table><tbody>rowsHtml<tbody></table>", re = /rowsHtml/;
    var c = function(html){
      if(!WIN.isString(html)) return null;
      html = tmpHtml.replace(re, html);
      return EL.createElementsByHtml(html)[0];
    };
  
    return {
      /*
      ():
        {array} GUI.TableMgr.TableCreator.getRows({string} html)
      DES:
        ie cant create table rows by innerHTML which is readonly for table.This method let you create rows elements by html string;
      ARG:
        {string} html
          table rows html
      RTN:
        rows elements array,
      */
      getRows  : function(html){return c(html).rows; },
      /*
      ():
        {HTMLTbodyElement} GUI.TableMgr.TableCreator.getTbody({string} html)
      DES:
        See also getRows
      */
      getTbody : function(html){return c(html).tBodies[0]; },
      /*
      ():
        {HTMLTableElement} GUI.TableMgr.TableCreator.getTable({string} html)
      DES:
        See also getRows
      */
      getTable : c
    };
  }()

};
WIN.extend(GUI, {
});