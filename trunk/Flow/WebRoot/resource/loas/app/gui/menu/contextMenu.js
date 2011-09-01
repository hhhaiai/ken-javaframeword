/* contextMenu.js
define GUI.ContextMenu model
*/
require.provide("app.gui.menu.contextMenu");
require("app.gui.engin");
require("app.gui.btn.menuitem");
require("app.gui.btn.popupMenuItem");
require("lib.dom.layout.position");
require("lib.evt.engin");
/*
CLASS:
  GUI.ContextMenu
DES:
  description
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
GUI.ContextMenu = WIN.createClass(
  function(){
    this.groups = [];
  },{
    
    initialize : function(options){
      return this;
    },
    insertGroup : function(index){
			var groups = this.groups;
			var g = [];
			if(index >= groups.length){
				index = groups.length;
				groups.push(g);
				
				var sepIndex = 0;
				for(var i=0; i<index; i++){
					var 
				}
				g.addSeparator();
			}
			else{
				groups.insertAt(g, index);
			}
			
    },
		countChildNodes : function(){
			
		},
		addGroupItems : function(index, items){
			var groups = this.groups,
					g = groups[groupName];
			if(g){
				var end = g[g.length - 1];
				if(end instanceof GUI.PopupMenuItem){
					var ele = end.ele;
					
				}
			}
			else{
				
			}
			index = isNaN(index) ? groups.length - 1 : index;
			
		},
		toString : function(){return "[object GUI.ContextMenu]";}
  }
);