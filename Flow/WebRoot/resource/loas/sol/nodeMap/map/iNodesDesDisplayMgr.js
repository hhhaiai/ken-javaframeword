/* iNodesDesDisplayMgr.js
*/
require.provide("sol.nodeMap.map.iNodesDesDisplayMgr");
require("lib.core.util.methodPool");
require("lib.evt.engin");
require("app.gui.indicator.textMonitor");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iNodesDesDisplayMgr
DES:
  nodes description display mechanism for a map;
  Note: call method toNodesDesDisplayMgr to initialize;
REQUIRE:
  {NodeMap.BaseMap} this
CFG:
PROPERTY:
		
  {NodeMap.BaseNode} _desShowingNode
	  reference of node whose description is showing.
	{GUI.TextMonitor} _linkStartNodeInfoTM
	  a monitor for display link startNode's info
	{GUI.TextMonitor} _linkEndNodeInfoTM
	  a monitor for display link endNode's info
FUNCTION:
	{this} hideLinkEndsInfo({NodeMap.LinkNode} link)
	{this} hideShowingNodeDes()
	{this} showLinkEndsInfo({NodeMap.LinkNode} link)
	{this} showNodeDescription({NodeMap.BaseNode} node)
	{this} toNodesDesDisplayMgr()
	
	{void} _hndMouseover_nodesDDM({object} event)
	{void} _hndMouseout_nodesDDM({object} event)
	{void} _showLinkEndsNodeInfo({NodeMap.LinkNode} link, {string} type)
	{string} _getLinkEndsNodeInfo({NodeMap.LinkNode} link, {string} type)
} */
NodeMap.iNodesDesDisplayMgr = WIN.MethodPool.declare({
    /* {
    ():
      {this} showLinkEndsInfo({NodeMap.LinkNode} link)
    DES:
      show specified link EndsNodes info.
    } */
		showLinkEndsInfo : function(link){
			if(this.hasChild(link) && link instanceof NodeMap.LinkNode){
				this._showLinkEndsNodeInfo(link, "start");
				this._showLinkEndsNodeInfo(link, "end");
				link.strongWeight();
			}
			return this;
		},
    /* {
    ():
      {this} hideLinkEndsInfo({NodeMap.LinkNode} link)
    DES:
      hide specified link EndsNodes info.
    } */
		hideLinkEndsInfo : function(link){
			if(this.hasChild(link) && link instanceof NodeMap.LinkNode){
				this._linkStartNodeInfoTM.hide();
				this._linkEndNodeInfoTM.hide();
				link.normalWeight();
			}
			return this;
		},
    /* {
    ():
      {this} showNodeDescription({NodeMap.BaseNode} node)
    DES:
      show the specified childNode description ;
    ARG:
      {NodeMap.BaseNode} node
        childNode of map;
    } */
		showNodeDescription : function(node){
      if(this.hasChild(node) && (node instanceof NodeMap.BaseNode)){
        var last = this._desShowingNode;
        if(WIN.isFunction(node.showDescription)){
          this.hideShowingNodeDes();
          this._desShowingNode = node;
          node.showDescription();
					if(node instanceof NodeMap.LinkNode){
						this.showLinkEndsInfo(node);
					}
        }
      }
      return this;
		},
    /* {
    ():
      {this} hideShowingNodeDes()
    DES:
      delay hide showing node description ;
    } */
    hideShowingNodeDes : function(){
      var node = this._desShowingNode;
      if(node && WIN.isFunction(node.delayHideDescription)){
				if(node instanceof NodeMap.LinkNode){
					this.hideLinkEndsInfo(node);
				}
        node.delayHideDescription();
      }
      return this;
    },
    /* {
    ():
      {this} toNodesDesDisplayMgr()
    DES:
      initialize NodesDesDisplayMgr;
    } */
    toNodesDesDisplayMgr : function(){
      if(!this.iNodesDesDisplayMgr_initialized){
        this._linkStartNodeInfoTM = (new GUI.TextMonitor).initialize();
        this._linkEndNodeInfoTM = (new GUI.TextMonitor).initialize();
        var ele = this.dom;
        if(WIN.isElement(ele)){
          EVT.observe(ele, "mouseover", Function.bind(this._hndMouseover_nodesDDM, this) );
          EVT.observe(ele, "mouseout", Function.bind(this._hndMouseout_nodesDDM, this) );
          EVT.observe(ele, "scroll", Function.bind(this._hndMouseout_nodesDDM, this) );
        }
				this.updateViewportDimension();
        this.iNodesDesDisplayMgr_initialized = true;
      }
      return this;
    },
		
    /* {
    ():
      {void} _hndMouseover_nodesDDM({object} event)
    DES:
      handler for onmouseover node to show node description;
    } */
    _hndMouseover_nodesDDM : function(evt){
      var e = EVT.Event.fix(evt),
          target = e.target,
          node = this._getOwnerObject(target);
      if(this.hasChild(node)){
        this.showNodeDescription(node);
      }
    },
    /* {
    ():
      {void} _hndMouseout_nodesDDM({object} event)
    DES:
      handler for onmouseover node to hide node description;
    } */
    _hndMouseout_nodesDDM : function(evt){
      var e = EVT.Event.fix(evt),
          target = e.relatedTarget,
          node = this._getOwnerObject(target);
      if(!this.hasChild(node)){
				this.hideShowingNodeDes();
      }
    },
    /* {
    ():
      {void} _showLinkEndsNodeInfo({NodeMap.LinkNode} link, {string} type)
    DES:
      display link endsNode info;
		ARG:
		  {string} type
			  sepcifys end node type:"start" or "end";
    } */
		_showLinkEndsNodeInfo : function(link, type){
			var info,
					cType = String.capitalize(type),
					node = link[type + "Node"],
					TM = this["_link" + cType + "NodeInfoTM"];
			if(!node)return ;
			info = this._getLinkEndsNodeInfo(link, type);
			if(String.notEmpty(info)){
				TM.setText(info);
				var ele = (node.iconEle || node.dom),
						D = this.viewportDimension,
						x =  EL.getPageX(ele) + ele.offsetWidth - D.l,
						y =  EL.getPageY(ele) + ele.offsetHeight/2 - D.t;
				TM.showAt(x, y, true);
			}
		},
    /* {
    ():
      {string} _getLinkEndsNodeInfo({NodeMap.LinkNode} link, {string} type)
    DES:
      retrun link endsNode info;
		ARG:
		  {string} type
			  sepcifys end node type:"start" or "end";
    } */
		_getLinkEndsNodeInfo : function(link, type){
			return link[type + "NodeInfo"];
		}
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);