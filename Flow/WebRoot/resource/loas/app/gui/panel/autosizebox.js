/***************************************************************
autosizebox.js
defined GUI.AutosizeBox module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.panel.autosizebox");
//require resource
require("app.gui.engin");
require("app.gui.panel.box");

/*
CLASS:
  GUI.AutosizeBox
SUPERCLASS:
  GUI.Box
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.AutosizeBox = function(){
  GUI.AutosizeBox.superClass.apply(this);
	
};
WIN.extendClass(GUI.AutosizeBox, GUI.Box);
