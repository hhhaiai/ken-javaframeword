
/*
 * table.js
 * defined table models, include: ColumnModel, RowModel, TableModel;
 */

//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.ele.table");

/*
Base on Army(http://www.ffsky.com), 
        Stuart LanGridge( http://www.kryogenix.org/code/browser/sorttable/)
*/

function convert(text) {
  if(!text)return "";
	if(/^-?[??[\d,.]+%?$/.test(text))return parseFloat(text);
	if(/^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/.test(text))return new Date(Date.parse(text));
	return text.toString();  
}

function getInnerText(node) {
	// gets the text we want to use for sorting for a cell.
	// strips leading and trailing whitespace.
	// this is *not* a generic getInnerText function; it's special to sorttable.
	// for example, you can override the cell text with a customkey attribute.
	// it also gets .value for <input> fields.
	
	var text,hasInputs = (typeof node.getElementsByTagName == 'function') &&
							 node.getElementsByTagName('input').length;
	if(!hasInputs){
		text = node.innerText || node.textContent || node.text;
		if(WIN.isDefined(text))return String.trim(text);
	}
	switch (node.nodeType) {
		case 3:
			if (node.nodeName.toLowerCase() == 'input') {
				return String.trim(node.value);
			}
		case 4:
			return String.trim(node.nodeValue);
		case 11:
			var innerText = '';
			var len = node.childNodes.length;
			for (var i = 0; i < len; i++) {
				innerText += getInnerText(node.childNodes[i]);
			}
			return String.trim(innerText);
		default:
			return '';
	}
}

function sortTable(sTableID, iCol, iTbody) {
	function compareTRs(oTR1, oTR2) {
    var vValue1, vValue2;
		vValue1 = convert(getInnerText(oTR1.cells[iCol].firstChild));
		vValue2 = convert(getInnerText(oTR2.cells[iCol].firstChild));
		
		if(vValue1.localeCompare){
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
  };
	
	var start=new Date();
  //获取要排序表格的数据行
  var oTable = document.getElementById(sTableID);
	if(!oTable)return;
	iTbody = iTbody ? iTbody : 0;
  var oTBody = oTable.tBodies[iTbody];
  var colDataRows = oTBody.rows;
  var aTRs = []; //创建一个数组将全部<tr />的指针放入
  
  for (var i=0; i < colDataRows.length; i++) {
    aTRs[i] = colDataRows[i];
  }
  if (oTable.sortCol == iCol) {
    aTRs.reverse();
  } else {
    aTRs.sort(compareTRs);
  }
	
  var oFragment = document.createDocumentFragment();
  for (var i=0; i < aTRs.length; i++) {
    oFragment.appendChild(aTRs[i]);
  }
  oTBody.appendChild(oFragment);

  oTable.sortCol = iCol; //identify wheter this row has been sorted
}
