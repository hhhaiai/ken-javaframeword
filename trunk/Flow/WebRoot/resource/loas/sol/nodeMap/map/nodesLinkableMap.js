/* nodesLinkableMap.js
*/
require.provide("sol.nodeMap.map.nodesLinkableMap");
require("sol.nodeMap.map.richMap");
require("sol.nodeMap.node.linkNode");
require("sol.nodeMap.node.linkableNode");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.NodesLinkableMap
SUPERCLASS:
  NodeMap.RichMap
DES:
  map that nodes linkable, it contains 2 types of nodes: deviceNode(iconNode) deviceLink(linkNode);
CFG:
  {NodeMap.LinkNode} linkType
    link node type for binding nodes;
METHOD:
  {NodeMap.LinkNode} bindNewLink({NodeMap.LinkableNode} sNode, 
                                 {NodeMap.LinkableNode} eNode, {object} linkCfg)
  {NodeMap.LinkNode} bindNewLinkById({NEString} sid, {NEString} eid, {object} linkCfg)
  {NodeMap.LinkNode} linkNodes({NodeMap.LinkableNode} sNode, 
                               {NodeMap.LinkableNode} eNode, {NodeMap.LinkNode} link)
  {NodeMap.LinkNode} linkNodesById({NEString} sid, {NEString} eid, {NodeMap.LinkNode} link)
  {NodeMap.LinkNode | null} removeLinksBetween({NodeMap.LinkableNode} sNode, 
                                              {NodeMap.LinkableNode} eNode)
  {NodeMap.LinkNode | null} removeLinksBetweenById({NEString} sid, {NEString} eid)
} */
NodeMap.NodesLinkableMap = WIN.createClass(function(){
    this._deviceNodes = {};
    this._deviceLinks = {};
		this._deviceNodesNum = this._deviceLinksNum = 0;
  },{	
		linkType : null,
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
			{NodeMap.LinkNode | null} removeLinksBetweenById({NEString} sid, {NEString} eid)
		DES:
			remove link between 2 nodes by specified nodeId;
		} */
		removeLinksBetweenById : function(sid, eid){
			var sNode = this.find(sid),
					eNode = this.find(eid);
			return this.removeLinksBetween(sNode, eNode);
		},
		/* {
		():
			{NodeMap.LinkNode | null} removeLinksBetween({NodeMap.LinkableNode} sNode, 
																									 {NodeMap.LinkableNode} eNode)
		DES:
			remove link between 2 nodes.
		} */
		removeLinksBetween : function(sNode, eNode){
			var links = this.getLinksBetween(sNode, eNode);
			Array.each(this.removeChild, links, 0, this);
		},
		/* {
		():
			{NodeMap.LinkNode | null} getLinksBetween({NodeMap.LinkableNode} sNode, 
																								{NodeMap.LinkableNode} eNode)
		DES:
			returns links between 2 nodes.
		} */
		getLinksBetween : function(sNode, eNode){
			var re = [],
					LinkableNode = NodeMap.LinkableNode;
			if(sNode instanceof LinkableNode && eNode instanceof LinkableNode){
				var sLine, eLine,
						sLinks = sNode.bindedLinks,
						eLinks = eNode.bindedLinks.concat();
				Array.each(function(link, index){
				  if(eLinks.contains(link)){
						re.push(link);
						eLinks.splice(index, 1);
					}
				}, sLinks);
			}
			return re;
		},
    appendChild : function(node, batchMode){
      if(!(node instanceof NodeMap.BaseNode))
        throw {description : this.toString() + " -> appendChild() : Invalid node !"};
      var nodeId = node.nodeId,
					f = NodeMap.NodesLinkableMap.$appendChild;
			if(!String.notEmpty(nodeId)){
				return f.apply(this, arguments);
			}
			
			if(node instanceof NodeMap.LinkableNode){	
			  if(this.hasChild(this._deviceNodes[nodeId])){
					throw {description : this.toString() + " -> appendChild() : Same deviceNodes nodeId exists!"};
				}
				f.apply(this, arguments);
				this._deviceNodes[nodeId] = node;
				this._deviceNodesNum += 1;
			}
			else if(node instanceof NodeMap.LinkNode){
			  if(this.hasChild(this._deviceLinks[nodeId])){
					throw {description : this.toString() + " -> appendChild() : Same deviceLinks nodeId exists!"};
				}
				f.apply(this, arguments);
				this._deviceLinks[nodeId] = node;
				this._deviceLinksNum += 1;
			}
			return node;
		},
		removeChild : function(node, batchMode){
			if(!this.hasChild(node)){
				throw{description : this.toString() + " -> removeChild() : node isnt its child!"} ;
			}
      var nodeId = node.nodeId,
					f = NodeMap.NodesLinkableMap.$removeChild;
			if(!String.notEmpty(nodeId)){
				return f.apply(this, arguments);
			}
			if(node instanceof NodeMap.LinkableNode){
				var l, links = node.bindedLinks;
				while(l = links[0]){
					this.removeChild(l, true);
				}
				f.apply(this, arguments);
				delete this._deviceNodes[nodeId];
				this._deviceNodesNum -= 1;
			}
			else if(node instanceof NodeMap.LinkNode){
				f.apply(this, arguments);
				node.unBind();
				delete this._deviceLinks[nodeId];
				this._deviceLinksNum -= 1;
			}
			return node;
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
		},
		getDeviceNodes : function(){
			return this._deviceNodes;
		},
		getDeviceNodesList : function(){
			var re = [],
					nodes = this._deviceNodes;
			for(var i in nodes){
				re.push(nodes[i]);
			}
			return re;
		},
		getDeviceLinks : function(){
			return this._deviceLinks;
		},
		getDeviceLinksList : function(){
			var re = [],
					nodes = this._deviceLinks;
			for(var i in nodes){
				re.push(nodes[i]);
			}
			return re;
		},
		getDeviceNodesCount : function(){
			return this._deviceNodesNum;
		},
		getDeviceLinksCount : function(){
			return this._deviceLinksNum;
		},
    toString: function(){return "[object NodeMap.NodesLinkableMap]";}
  },
	NodeMap.RichMap
);