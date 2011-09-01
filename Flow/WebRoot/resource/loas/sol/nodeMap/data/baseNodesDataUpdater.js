/* baseNodesDataUpdater.js
*/
require.provide("sol.nodeMap.data.baseNodesDataUpdater");
require("lib.data.nodesDataUpdater");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.BaseNodesDataUpdater
SUPERCLASS:
  DATA.NodesDataUpdater
DES:
  map base Nodes Data Updater;
CFG:
  {NodeMap.BaseMap} nodesContainer
    (null) nodes container(map);
METHOD:
  {NodeMap.LinkableNode} appendContainerNode({object} record)
  {this} loadNodes()
  {NodeMap.LinkableNode | null} removeContainerNode({object} record)
  {NodeMap.LinkableNode | null} updateContainerNode({object} record)
} */
NodeMap.BaseNodesDataUpdater = WIN.createClass(function(){
  },{
    nodesContainer : null,
		nodesType : null,
		defaultUpdateProps : null,
		updatePropsAndHandlers : null,
    nodesIdAttribute : "nodeId",
    recordTag : "node",
    
    initialize : function(options){
      NodeMap.BaseNodesDataUpdater.$initialize.call(this, options);
			this.addObservers("onContainerNodeAdd", "onContainerNodeRemove", "onContainerNodeUpdate");
      return this;
    },
    /* {
    ():
      {this} loadNodes()
    DES:
      load Nodes
    } */
    loadNodes : function(){
      var data = [],
          ctn = this.nodesContainer,
          Type = this.nodesType;
      
      Array.each(function(record){
        data.push([record, Type]);
      }, this.records, 0, this);
      ctn.batchAppend(data);
      
      return this;
    },
    /* {
    ():
      {NodeMap.LinkableNode} appendContainerNode({object} record)
    } */
    appendContainerNode : function(record){
      var ctn = this.nodesContainer;
			var node = ctn.append(record, this.nodesType);
			if(node) this.fireObserver("onContainerNodeAdd", node);
      return node;
    },
    /* {
    ():
      {NodeMap.LinkableNode | null} removeContainerNode({object} record)
    DES:
      call ctn removeNode method.
    } */
    removeContainerNode : function(record){
      var  ctn = this.nodesContainer;
      var node = this.findContainerNode(record);
			if(node && ctn && WIN.isFunction(ctn.removeChild) ){
        ctn.removeChild(node);
        node.dispose();
				this.fireObserver("onContainerNodeRemove", node);
      }
      return node;
    },
    /* {
    ():
      {NodeMap.LinkableNode | null} updateContainerNode({object} record)
    DES:
      update ctn node info;
    } */
    updateContainerNode : function(record, changedList){
      var node = this.findContainerNode(record);
      if(node && WIN.isArray(changedList) ){
        node.sourceNode = record.sourceNode;
				var p, value, fn,
						hnds = this.updatePropsAndHandlers || {},
						defUpdates = this.defaultUpdateProps;
				Array.each(function(p){
					value = record[p];
					if(defUpdates.contains(p)){
						node[p] = value;
					}
					else{
						fn = hnds[p];
						if(fn && WIN.isFunction(node[fn])){
							node[fn](value);
						}
					}
				}, changedList);
				this.fireObserver("onContainerNodeUpdate", node, changedList);
      }
      return node;
    },
    toString: function(){return "[object NodeMap.BaseNodesDataUpdater ]";}
  },
  DATA.NodesDataUpdater
);
 