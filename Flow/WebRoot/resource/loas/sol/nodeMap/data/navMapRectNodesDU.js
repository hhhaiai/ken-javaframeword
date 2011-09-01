/* navMapRectNodesDU.js
*/
require.provide("sol.nodeMap.data.navMapRectNodesDU");
require("sol.nodeMap.data.rectNodesDataUpdater");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.NavMapRectNodesDU
SUPERCLASS:
  DATA.NodesDataUpdater
DES:
  map rect Nodes Data Updater;
CFG:
  {NodeMap.BaseMap} nodesContainer
    nodes container(map);
  {string} primaryKey
   ("nodeId") records primaryKey;
METHOD:
} */
NodeMap.NavMapRectNodesDU = WIN.createClass(function(){
  },{
		defaultUpdateProps : ["underlings_normal", "underlings_alarm", "underlings_stop", "underlings_down"],
    updatePropsAndHandlers : {
			left: "setLeft",
			top: "setTop"
		},
    initialize : function(options){
      NodeMap.NavMapRectNodesDU.$initialize.call(this, options);
			this.addListener("onContainerNodeUpdate", this._hndNodeUpdate_NavMap);
      return this;
    },
    _hndNodeUpdate_NavMap : function(node, changedList){
			if(node){
        if(WIN.isFunction(node.makeupStatus)) node.makeupStatus();
        if(WIN.isFunction(node.makeupDescription)){
					node.makeupDescription(true);
				}
			}
      return node;
		},
    
    toString: function(){return "[object NodeMap.NavMapRectNodesDU ]";}
  },
  NodeMap.RectNodesDataUpdater
);