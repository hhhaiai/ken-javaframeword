/* iNodesDragable.js
*/
require.provide("sol.nodeMap.map.iNodesDragable");
require("lib.core.util.methodPool");
require("lib.evt.engin");
require("app.bhv.dnd.drag");

namespace("NodeMap");
NodeMap.iNodesDragable = WIN.MethodPool.declare({
    /* {
    ():
      {void} _hndMousedown_nodesDrag({object} event)
    DES:
      handler for on node drag;
    } */
    _hndMousedown_nodesDrag : function(evt){
      var e = EVT.Event.fix(evt, true),
          target = e.target,
          node = this._getOwnerObject(target);
      if(!e.leftClick)return ;
      if(this.hasChild(node)){
				this.doNodesDragBehaviour(node, evt);
      }
			else{
				
			}
    },
		doNodesDragBehaviour : function(handlerNode, evt){
			var opt = {
						useDNDGhost : false,
						map : this,
						handlerNode : handlerNode,
						selectedChildren : this.selectedChildren
					},
					dragHandler = NodeMap.iNodesDragable.dragHandler;
			BHV.DND.start(handlerNode.dom, dragHandler, opt, evt);
		},
		toNodesDragable : function(){
			if(!this.iNodesDragable_initialized){
        this.addObservers("onnodesdrag");
				var ele = this.nodesCtnEle;
				if(WIN.isElement(ele)){
					EVT.observe(ele, "mousedown", Function.bind(this._hndMousedown_nodesDrag, this) );
				}
				this.iNodesDragable_initialized = true;
			}
			return this;
		}
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);
NodeMap.iNodesDragable.dragHandler = {
	setNodePosition : function(node, chgX, chgY){
		if(node instanceof NodeMap.LinkableNode){
			var l = node.left + chgX,
					t = node.top + chgY;
			if(l < 0) l = 0;
			if(t < 0) t = 0;
			node.setLeft(l).setTop(t);
		}
	},
	onDNDStart : function(dataStore){
    return true;
	},
	/* {
	():
		{void} onDND({object} dataStore, {int} clientX, {int} clientY)
	DES:
		__description
	} */
	onDND : function(dataStore, clientX, clientY){
		var slef = this,
				opt = dataStore.options,
				nodes = opt.selectedChildren,
				handlerNode = opt.handlerNode,
				map = opt.map,
				chgX = (clientX - dataStore.lastClientX),
				chgY = (clientY - dataStore.lastClientY);
		map.fireObserver("onnodesdrag");
		if(WIN.isArray(nodes)){
			Array.each(function(node){
			  slef.setNodePosition(node, chgX, chgY);
			},nodes); 
		}
		else{
			this.setNodePosition(handlerNode, chgX, chgY);
		}
		dataStore.lastClientX = clientX;
		dataStore.lastClientY = clientY;
	},
	onDNDEnd : function(dataStore){
	  var opt = dataStore.options,
				map = opt.map;
		map.updateMapSize();
	}
};