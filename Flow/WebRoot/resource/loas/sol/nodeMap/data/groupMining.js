/* groupMining.js
*/
require.provide("sol.nodeMap.data.groupMining");
require("lib.data.simpleXmlRecordset");
require("app.gui.tree.treeNode");

namespace("NodeMap");

NodeMap.GroupMining = WIN.createClass(function(){
  },{
		rootNode : null,
		rootNodeOpt : null,
		rootNodeType : GUI.TreeNode,
		
    groupNodesRecordset : null,
    groupNodesRecordsetOpt : null,
		groupNodesType : GUI.TreeNode,
		groupNodesIdAttribute : "groupNodeId",
		
		miningNodesType : GUI.TreeNode,
		miningNodesIdAttribute : "actionData",
		
    targetNodesDataUpdater : null,
		targetNodesIdAttribute : "nodeId",

    initialize : function(options){
      WIN.extend(this, options);
      var du = this.targetNodesDataUpdater;
      du.addListener("onContainerNodeAdd", Function.bind(this.appendWith, this) );
      du.addListener("onContainerNodeRemove", Function.bind(this.removeWith, this) );
      du.addListener("onContainerNodeUpdate", Function.bind(this.updateWith, this) );
      this.initGroupNodesRecordset();
      return this;
    },
		initGroupNodesRecordset : function(){
			var rs = this.groupNodesRecordset = new DATA.SimpleXmlRecordset;
			rs.initialize(this.groupNodesRecordsetOpt);
			rs.addListener("onLoad", Function.bind(this.initGroupNodes, this));
			rs.load();
		},
		initGroupNodes : function(){
      var node,
					root = this.rootNode,
					rs = this.groupNodesRecordset,
					Type = this.groupNodesType;
			if(!Type){
			  throw{
					description : this.toString() + " -> initGroupNodes() Invalid groupNodesType!"
				};
			}
			if(!root) root = this.createRootNode();
			Array.each(function(values){
				node = (new Type).initialize(values);
				root.appendChild(node);
			}, rs.records, 0, this);
		},
		createRootNode : function(){
      if(!this.rootNode){
				var opt = this.rootNodeOpt;
				if(!WIN.isElement(opt.container)) opt.container = DOC.c("div");
				this.rootNode = (new this.rootNodeType).initialize(opt);
			}
			return this.rootNode; 
		},
		loadTargets : function(targetNodes){
      Array.each(this.appendWith, targetNodes, 0, this);
		},
    appendWith : function(targetNode){
      var group = this.findGroupWith(targetNode);
      if(group){
        var opt = this.getTreeNodeInitOptionsWith(targetNode),
						miningNode = (new this.miningNodesType);
        opt[this.miningNodesIdAttribute] = targetNode[this.targetNodesIdAttribute];
				miningNode.initialize(opt);
        group.appendChild(miningNode);
        return miningNode;
      }
      return null;
    },
    updateWith : function(targetNode){
      var miningNode = this.findWith(targetNode);
      if(miningNode){
        var text = targetNode.deviceAlias || targetNode.title;
        miningNode.setText(text);
        //setNodeIcon...
      }
      return miningNode;
    },
    removeWith : function(targetNode){
      var miningNode = this.findWith(targetNode);
      if(miningNode){
        miningNode.dispose();
      }
    },
    findWith : function(targetNode){
      var group = this.findGroupWith(targetNode);
      if(group instanceof GUI.TreeNode){
				var id = targetNode[this.targetNodesIdAttribute];
        return group.find(id, this.miningNodesIdAttribute);
      }
      return null;
    },
    findGroupWith : function(targetNode){
      var groupId = this.getTargetGroupId(targetNode);
      if(String.notEmpty(groupId)){
        var root = this.rootNode;
        return root.find(groupId, this.groupNodesIdAttribute);
      }
      return null;
    },
    getTreeNodeInitOptionsWith : function(targetNode){
			return {
				actionData : targetNode.nodeId,
				text : targetNode.deviceAlias || targetNode.title
			};
    },
		
    toString: function(){return "[object NodeMap.GroupMining]";}
  }
);