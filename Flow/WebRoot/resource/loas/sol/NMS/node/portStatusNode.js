/* portStatusNode.js
defined NMS.PortStatusNode;
*/
require.provide("sol.NMS.node.portStatusNode");
require("sol.NMS.node.baseStatusNode");

/*
CLASS:
  NMS.PortStatusNode
SUPERCLASS:
  NMS.StatusNode
DES:
  node for display backboard port status;Here we just define some behaviors for it;
METHOD:
  {void} initBehaviors()
  {void} onmouseover()
  {void} onmouseout()
  {void} onclick()
  {void} showDetails()
*/
NMS.PortStatusNode = WIN.createClass(
  function(){
  },{
		/*
		cfg:
			{string} nodeCss
		DES:
			css for this ele
		*/
		nodeCss : "NMS_portStatusNode",
    /*
    ():
      {void} initBehaviors()
    */
    initBehaviors : function(){
      var ele = this.ele;
      ele.onmouseover = this.onmouseover;
      ele.onmouseout = this.onmouseout;
    },
    /*
    ():
      {void} onmouseover()
    */
    onmouseover : function(){
      this._this.showNodeDescription();
    },
    /*
    ():
      {void} onmouseout()
    */
    onmouseout : function(){
      this._this.hideNodeDescription();
    }
  },
  NMS.StatusNode
);