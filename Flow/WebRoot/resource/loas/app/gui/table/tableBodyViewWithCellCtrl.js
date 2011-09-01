/* tableBodyViewWithCellCtrl.js
add cells ctrl
*/

/*
CLASS:
  GUI.TableBodyViewWithCellCtrl 
SUPERCLASS:
  GUI.TableBodyView
DES:
  table with inner cell ctrl, can be well ctrl,e.g. we can ctrl its height by setting its inner 
div's height.	
PROPERTY:
  {boolean} nowrapWhiteSpace
    only works when this.cellCtrl is true;it determines the line mode of the cell content display. if it's true the content supports multiple-line, we can show the content by changing the height of inner div; else the content can only be single-line, the extras will be clip with ellipsis;
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.TableBodyViewWithCellCtrl = function(){
  GUI.CellCtrlTableBodyView.superClass.apply(this);
	
	this.nowrapWhiteSpace = false;
};
WIN.extendClass(GUI.CellCtrlTableBodyView , GUI.TableBodyView);
WIN.extend(GUI.TableBodyView.prototype, {
	setRowHeight: function(){},
	unknown: null
});

