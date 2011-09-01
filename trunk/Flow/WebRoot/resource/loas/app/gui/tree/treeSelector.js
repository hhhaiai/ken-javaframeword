/* treeSelector.js
*/
require.provide("app.gui.tree.treeSelector");
require("app.gui.tree.tree");

/* {
CLASS:
  GUI.TreeSelector
SUPERCLASS:
  GUI.Tree
DES:
  tree selector;
CFG:
  {boolean} multiple
    (true) specify input type, true to "checkbox" false to "radio";
PROPERTY:
  {__datatype} __propertyname
    __description
METHOD:
  {__returntype} __function_name({__datatype} __argment1)
} */
GUI.TreeSelector = WIN.createClass(function(){
  },{
    multiple : true,
		
		initialize : function(options, async){
      GUI.TreeSelector.$initialize.call(this, options, async);      
      
      return this;
    },
    toString: function(){return "[object GUI.TreeSelector]";}
  },
	GUI.Tree
);
