/* iStratifiable.js
*/
require.provide("sol.nodeMap.map.iStratifiable");
require("lib.core.util.methodPool");
require("app.gui.tree.tree");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iStratifiable
DES:
  iStratifiable: statify nodes by specified logic;
REQUIRE:
  {NodeMap.BaseMap} this
PROPERTY:
  {GUI.Tree} nodesTree
    exhibit map nodes in a tree;
  {object} nodesTreeOpt
    options for nodesTree;
  
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
NodeMap.iStratifiable = WIN.MethodPool.declare({
    nodesTreeOpt : null,
    
    generateTree : function(){
      if(!this.nodesTree){
        var treeNode, 
            tree = this.nodesTree = new GUI.Tree;
        tree.initialize(this.nodesTreeOpt);
        Array.each(function(strtf){
          treeNode = strtf.generateTreeNode();
          if(treeNode instanceof GUI.TreeNode){
            tree.appendNode(treeNode);
          }
        }, this._stratifications, 0, this);
      }
      return this.nodesTree;
    },
    regStratification : function(strtf){
      if(!WIN.isArray(this._stratifications)) this._stratifications = [];
      var s = this._stratifications;
      if(!s.contains(strtf))s.push(strtf);
      return strtf;
    },
    unRegStratification : function(strtf){
      if(!WIN.isArray(this._stratifications)) return this;
      var s = this._stratifications;
      s.remove(strtf);
      return strtf;
    }
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);