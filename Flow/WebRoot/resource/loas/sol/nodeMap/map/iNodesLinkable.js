/* iNodesLinkable.js
*/
require.provide("sol.nodeMap.map.iNodesLinkable");
require("lib.core.util.methodPool");
require("sol.nodeMap.node.linkNode");
require("sol.nodeMap.node.linkableNode");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iNodesLinkable
DES:
  nodes linkable mechanism for a map;
REQUIRE:
  {NodeMap.BaseMap} this
  {function} linkType
FUNCTION:
  {NodeMap.LinkNode} bindNewLink({NodeMap.LinkableNode} sNode, 
                                 {NodeMap.LinkableNode} eNode, {object} linkCfg)
  {NodeMap.LinkNode} bindNewLinkById({NEString} sid, {NEString} eid, {object} linkCfg)
  {NodeMap.LinkNode} linkNodes({NodeMap.LinkableNode} sNode, 
                               {NodeMap.LinkableNode} eNode, {NodeMap.LinkNode} link)
  {NodeMap.LinkNode} linkNodesById({NEString} sid, {NEString} eid, {NodeMap.LinkNode} link)
  {NodeMap.LinkNode | null} removeLinkBetween({NodeMap.LinkableNode} sNode, 
                                              {NodeMap.LinkableNode} eNode)
  {NodeMap.LinkNode | null} removeLinkBetweenById({NEString} sid, {NEString} eid)
} */
NodeMap.iNodesLinkable = WIN.MethodPool.declare({
    /* {
    ():
      {NodeMap.LinkNode} linkNodesById({NEString} sid, {NEString} eid, {NodeMap.LinkNode} link)
    DES:
      link 2 Nodes By specified startNode and endNode's nodeId with specified link.
    ARG:
      {NEString} sid
        startNode's nodeId.
      {NEString} eid
        endNode's nodeId.
      {NodeMap.LinkNode} link
        link node to bind the 2 linkable nodes;
    } */
    linkNodesById : function(sid, eid, link){
      var sNode = this.find(sid),
          eNode = this.find(eid);
      return this.linkNodes(sNode, eNode, link);
    },
    /* {
    ():
      {NodeMap.LinkNode} linkNodes({NodeMap.LinkableNode} sNode, 
                                   {NodeMap.LinkableNode} eNode, {NodeMap.LinkNode} link)
    DES:
      link 2 Nodes with specified link.
    ARG:
      {NodeMap.LinkableNode} sNode
        startNode.
      {NodeMap.LinkableNode} eid
        endNode.
      {NodeMap.LinkNode} link
        link node to bind the 2 linkable nodes;
    } */
    linkNodes : function(sNode, eNode, link){
      var LinkableNode = NodeMap.LinkableNode;
      if(link instanceof NodeMap.LinkNode &&
         sNode instanceof LinkableNode &&
         eNode instanceof LinkableNode){
        link.bind(sNode, eNode);
      }
      return link;
    },
    /* {
    ():
      {NodeMap.LinkNode} bindNewLinkById({NEString} sid, {NEString} eid, {object} linkCfg)
    DES:
      link 2 Nodes By specified startNode and endNode's nodeId with new link.
    ARG:
      {NEString} sid
        startNode's nodeId.
      {NEString} eid
        endNode's nodeId.
      {object} linkCfg
        Cfg for new link;
    } */
    bindNewLinkById : function(sid, eid, linkCfg){
      var sNode = this.find(sid),
          eNode = this.find(eid);
      return this.bindNewLink(sNode, eNode, linkCfg);
    },
    /* {
    ():
      {NodeMap.LinkNode} bindNewLink({NodeMap.LinkableNode} sNode, 
                                     {NodeMap.LinkableNode} eNode, {object} linkCfg)
    DES:
      link 2 Nodes with new link.
    ARG:
      {NodeMap.LinkableNode} sNode
        startNode.
      {NodeMap.LinkableNode} eid
        endNode.
      {object} linkCfg
        Cfg for new link;
    } */
    bindNewLink : function(sNode, eNode, linkCfg){
      var link = null;
      if(BROWSER.IE && this.hasChild(sNode) && this.hasChild(eNode)){
        link = (new this.linkType).initialize(linkCfg);
        this.appendChild(link);
        this.linkNodes(sNode, eNode, link);
      }
      return link;
    },
    /* {
    ():
      {NodeMap.LinkNode | null} removeLinkBetweenById({NEString} sid, {NEString} eid)
    DES:
      remove link between 2 nodes by specified nodeId;
    } */
    removeLinkBetweenById : function(sid, eid){
      var sNode = this.find(sid),
          eNode = this.find(eid);
      return this.removeLinkBetween(sNode, eNode);
    },
    /* {
    ():
      {NodeMap.LinkNode | null} removeLinkBetween({NodeMap.LinkableNode} sNode, 
                                                  {NodeMap.LinkableNode} eNode)
    DES:
      remove link between 2 nodes.
    } */
    removeLinkBetween : function(sNode, eNode){
      var LinkableNode = NodeMap.LinkableNode;
      if(sNode instanceof LinkableNode &&
         eNode instanceof LinkableNode){
        var sl, el,
            sLinks = sNode.bindedLinks,
            eLinks = eNode.bindedLinks;
        for(var i = 0, sLen = sLinks.length; i < sLen; i++){
          sl = sLinks[i];
          for(var j = 0, eLen = eLinks.length; j < eLen; j++){
            el = eLinks[j];
            if(sl == el){
              return sl.unBind();
            }
          }
        }
      }
      return null;
    },
		removeLinkableNode : function(node){
      if(!this.hasChild(node)){
        throw{description : this.toString() + " -> removeLinkableNode() : node isnt its child!"} ;
      }
			node.forEachBindedLinks(function(link){
			  link.unBind();
			}, 0, node);
			return this.removeChild(node);
		},
		showAllLinks : function(){
			this.each(function(node){
			  if(node instanceof NodeMap.LinkNode){
					node.show();
				}
			});
		},
		hideAllLinks : function(){
			this.each(function(node){
			  if(node instanceof NodeMap.LinkNode){
					node.hide();
				}
			});
		}
    
  },function(obj){
    if(!(obj instanceof NodeMap.BaseMap) || 
        typeof obj.linkType != "function" )return false;
    return true;
  }
);