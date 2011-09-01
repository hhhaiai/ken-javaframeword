/* richMap.js
*/
require.provide("sol.nodeMap.map.richMap");
require("lib.core.util.methodPool");
require("sol.nodeMap.map.baseMap");
require("sol.nodeMap.map.iSmoothScrollable");
require("sol.nodeMap.map.iDragable");
require("sol.nodeMap.map.iZoomable");
require("sol.nodeMap.map.iContextMenuMgr");
require("sol.nodeMap.map.iNodesFocusable");
require("sol.nodeMap.map.iNodesSelectable");
require("sol.nodeMap.map.iNodesDragable");
require("sol.nodeMap.map.iNodesDesDisplayMgr");
require("sol.nodeMap.map.iNavigatable");
require("sol.nodeMap.map.mapBgSetter");

//add GUI.LayerCascading to mgr nodes zIndex;
/* {
CLASS:
  NodeMap.RichMap
SUPERCLASS:
  NodeMap.BaseMap
DES:
  RichMap provides as mush map function as possible. It implements following methodPool:
	NodeMap.iSmoothScrollable,
	NodeMap.iDragable,
	NodeMap.iZoomable,
	NodeMap.iContextMenuMgr,
	NodeMap.iNodesFocusable,
	NodeMap.iNodesDesDisplayMgr,
	NodeMap.iNodesDragable,
	NodeMap.iNodesSelectable
CFG:
  {string} startDNDMode
    ("drag") init DND mode;
PROPERTY:
METHOD:
  {__returntype} __function_name({__datatype} __argment1)
} */
NodeMap.RichMap = WIN.createClass(function(){
  },{
		startDNDMode : "drag",
		bgSetterOpt : null,
		bgSetter_bgSrc : "",
		
    initialize : function(options){
			NodeMap.RichMap.$initialize.call(this, options);
			this.toNodesFocusable()
		    	.toNodesDragable()
			    .toNodesSelectable()
			    .toDragable()
			    .toNodesDesDisplayMgr()
			    .toContextMenuMgr()
			    .toSmoothScrollable()
					.toNavigatable()
					
					.initMapBgSetter()
			    .setDNDMode(this.startDNDMode);
			return this;
		},
		initMapBgSetter : function(){
			var opt = WIN.extend({
				map : this,
				bgSrc : this.bgSetter_bgSrc,
				bgPosition : "zoom"
			}, this.bgSetterOpt);
			this.mapBgSetter = (new NodeMap.MapBgSetter).initialize(opt);
			
			return this;
		},
		standOut : function(node){
			if(this.hasChild(node) && (node instanceof NodeMap.BaseNode)){
				node.show();
				this.focusChild(node)
						 .cancelAllSelectedExcept(node)
						 .setSelectedChild(node)
						 .scrollChildToCenter(node);
			}
			return this;
		},
		displayBatchNodes : function(nodes, show){
			if(WIN.isArray(nodes) && nodes.length > 0){
				var display = show ? "show" : "hide";
				Array.each(function(node){node[display]();}, nodes);
				if(show){
					node = nodes[0];
					this.standOut(node);
				}
			}
		},
		setDNDMode : function(mode){
			if(String.notEmpty(mode)){
				mode = mode.toLowerCase();
				var ele = this.nodesCtnEle;
				if(!WIN.isElement(ele))return this;
				
				var	s = ele.style,
						rs = ele.runtimeStyle;
				if(mode == "drag"){
					this.enableDrag = true;
					this.enableDrawSelect = false;
					this.setDragStyle("drag");
				}
				else if(mode == "drawselect"){
					this.enableDrawSelect = true;
					this.enableDrag = false;
					this.setDragStyle("drawselect");
				}
			}
			return this;
		},
    toString: function(){return "[object NodeMap.RichMap]";}
  },
  NodeMap.BaseMap
);
WIN.MethodPool.extendsPools(NodeMap.RichMap, 
	NodeMap.iSmoothScrollable,
	NodeMap.iDragable,
	NodeMap.iZoomable,
	NodeMap.iContextMenuMgr,
	NodeMap.iNodesFocusable,
	NodeMap.iNodesDesDisplayMgr,
	NodeMap.iNodesDragable,
	NodeMap.iNavigatable,
	NodeMap.iNodesSelectable
);