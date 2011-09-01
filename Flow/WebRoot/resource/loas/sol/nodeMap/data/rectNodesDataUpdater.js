/* rectNodesDataUpdater.js
*/
require.provide("sol.nodeMap.data.rectNodesDataUpdater");
require("sol.nodeMap.data.baseNodesDataUpdater");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.RectNodesDataUpdater
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
NodeMap.RectNodesDataUpdater = WIN.createClass(function(){
  },{
    primaryKey : "nodeId",
    recordTag : "node",
    nodesIdAttribute : "nodeId",
		defaultUpdateProps : [],
    updatePropsAndHandlers : {
			left: "setLeft",
			top: "setTop",
			description: "setDescription",
			initStatus: "setStatus"
		},
    
    toString: function(){return "[object NodeMap.RectNodesDataUpdater ]";}
  },
  NodeMap.BaseNodesDataUpdater
);