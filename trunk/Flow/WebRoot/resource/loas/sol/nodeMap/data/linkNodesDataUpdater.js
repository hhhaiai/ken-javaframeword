/* linkNodesDataUpdater.js

*/
require.provide("sol.nodeMap.data.linkNodesDataUpdater");
require("sol.nodeMap.data.baseNodesDataUpdater");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.LinkNodesDataUpdater
SUPERCLASS:
  NodeMap.BaseNodesDataUpdater
DES:
  map Link Nodes Data Updater
CFG:
  {string} primaryKey
   ("linkId") records primaryKey;
METHOD:
  {NodeMap.LinkNode} appendContainerNode({object} record)
  {this} loadNodes()
} */
NodeMap.LinkNodesDataUpdater  = WIN.createClass(function(){
  },{
    primaryKey : "linkId",
    recordTag : "line",
    nodesIdAttribute : "nodeId",
		defaultUpdateProps : [],
    updatePropsAndHandlers : {
			description: "setDescription",
			initStatus: "setStatus"
		},
    
    /* {
    ():
      {this} loadNodes()
    DES:
      load Nodes
    } */
    loadNodes : function(){
      var ctn = this.nodesContainer;
			if(!ctn) return this;
			
      Array.each(function(record){
        ctn.bindNewLinkById(record.sid, record.eid, record);
      }, this.records, 0, this);
			
			return this;
    },
    /* {
    ():
		{NodeMap.LinkNode} appendContainerNode({object} record)
    DES:
      call map append method.
    } */
    appendContainerNode : function(record){
      var ctn = this.nodesContainer;
			if(!ctn || !WIN.isFunction(ctn.bindNewLinkById)) return null;
			var node = ctn.bindNewLinkById(record.sid, record.eid, record);
			if(node) this.fireObserver("onContainerNodeAdd", node);
      return node;
    },
    toString: function(){return "[object NodeMap.LinkNodesDataUpdater ]";}
  },
  NodeMap.BaseNodesDataUpdater
);
 