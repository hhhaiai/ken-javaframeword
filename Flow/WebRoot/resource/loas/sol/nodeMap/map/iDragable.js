/* iDragable.js
*/
require.provide("sol.nodeMap.map.iDragable");
require("lib.core.util.methodPool");
require("lib.evt.engin");
require("app.bhv.dnd.engin");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iDragable
DES:
  auto scrollable mechanism for a map;
REQUIRE:
  {NodeMap.BaseMap} this
PROPERTY:
  {__datatype} __property_name
    __decription
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
NodeMap.iDragable = WIN.MethodPool.declare({
		enableDrag : false,
		dragCursor : "url(" + GUI.systemPathmapper.map("../openhand.cur") + "),default",
		dragingCursor : "url(" + GUI.systemPathmapper.map("../closedhand.cur") + "),default",
		
		_hndMousedown_drag : function(evt){
			var e = EVT.Event.fix(evt, true),
					target = e.target,
          node = this._getOwnerObject(target);
			if(!this.hasChild(node) && this.enableDrag){//isNodesCtn && 
				var opt = {
					useDNDGhost : false,
					map : this
				};
				BHV.DND.start(this.nodesCtnEle, NodeMap.iDragable.dragHandler, opt, evt);
			}
		},
		setDragStyle : function(mode){
			var ele = this.nodesCtnEle;
			if(WIN.isElement(ele) && String.notEmpty(mode)){
				mode = mode.toLowerCase();
				var s = ele.style;
				if(mode == "drag"){
					s.cursor = this.dragCursor;
				}
				else if(mode == "drawselect"){
					s.cursor = "default";
				}
				else if(mode == "draging"){
					s.cursor = this.dragingCursor;
				}
			}
		},
		toDragable : function(options){
			if(!this.iDragable_initialized){
				WIN.extend(this, options);
				var ele = this.nodesCtnEle;
				if(WIN.isElement(ele)){
					EVT.observe(ele, "mousedown", Function.bind(this._hndMousedown_drag, this) );
				}
				this.iDragable_initialized = true;
			}
			return this;
		}
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);
NodeMap.iDragable.dragHandler = {
	onDNDStart : function(dataStore){	
	  var opt = dataStore.options,
				map = opt.map;
		map.setDragStyle("draging");
    return true;
	},
  onDND: function(dataStore, clientX, clientY){
		var ele = dataStore.target, 
				p = ele.parentNode;
		var x = (clientX - dataStore.lastClientX);
		var y = (clientY - dataStore.lastClientY);
		dataStore.lastClientX = clientX;
		dataStore.lastClientY = clientY;
		p.scrollLeft -= x;
		p.scrollTop -= y;
	},
  onDNDEnd: function(dataStore){
	  var opt = dataStore.options,
				map = opt.map;
		map.setDragStyle("drag");
	}
};