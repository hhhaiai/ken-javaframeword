/* iNodesSelectable.js
*/
require.provide("sol.nodeMap.map.iNodesSelectable");
require("lib.core.util.methodPool");
require("lib.evt.engin");
require("app.bhv.dnd.select");
require("lib.dom.layout.position");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iNodesSelectable
DES:
  nodes selectable mechanism for a map;
REQUIRE:
  __requireRule
PROPERTY:
  {boolean} enableDrawSelect
    (true) enable draw(dnd) to select nodes Behaviour
  {boolean} selectHolding
    (true) if select holding(ctrlKey pressed), then mutil select is enable;
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
OBSERVER:
  onselectchange : triggers when select node changed;
} */
NodeMap.iNodesSelectable = WIN.MethodPool.declare({
		enableDrawSelect : true,
		selectHolding : false,
		
		drawSelectHandler : function(l, t, w, h){
			var D = this.viewportDimension;
			l = D.l + l;
			t = D.t + t;
			var d = {
				t : t,
				r : l + w,
				b : t + h,
				l : l
			};
			var self = this;
			Array.each(function(node){
				if(self.isDimensionalNodeInview(node, d)){
					self.setChildSelectState(node, !node._selectedBeforeDND);
				}
				else{
					self.setChildSelectState(node, node._selectedBeforeDND);
				}
			}, this.visiableDimensionalNodes);
		},
		doDrawSelectBehaviour : function(targetNode, evt){
			this.updateVisiableDimensionalNodes();
			this._updateNodesSelectState_b4DS();
			BHV.DND.Select.drawSelect({
				updateHandler : Function.bind(this.drawSelectHandler, this),
				instantUpdate : true,
				scopeNode : this.dom
			}, evt);
		},
		hasSeletedChild : function(node){
			var sel = this.selectedChildren;
			if(WIN.isArray(sel))return sel.contains(node);
			return false;
		},
		setSelected : function(nodeId){
			var node = this.find(nodeId);
			return this.setSelectedChild(node);
		},
		setSelectedChild : function(node){
			if(this.hasChild(node) && node.showing && WIN.isFunction(node.setSelected)){
				if(!this.hasSeletedChild(node)){
					var selected = this.selectedChildren;
					selected.push(node);
					node.setSelected();
          this.fireObserver("onselectchange", selected, node);
				}
			}
			return this;
		},
		cancelSelected : function(nodeId){
			var node = this.find(nodeId);
			return this.cancelSelectedChild(node);
		},
		cancelSelectedChild : function(node){
			if(this.hasChild(node) && WIN.isFunction(node.setSelected)){
				if(this.hasSeletedChild(node)){
					var selected = this.selectedChildren;
					selected.remove(node);
					node.cancelSelected();
					this.fireObserver("onselectchange", selected, node);
				}
			}
			return this;
		},		
		toggleSelect : function(node){
			if(this.hasSeletedChild(node))this.cancelSelectedChild(node);
			else this.setSelectedChild(node);
		},
		selectInvert : function(){
			this.each(this.toggleSelect, 0, this);
		},
		selectAll : function(){
			this.each(this.setSelectedChild, 0, this);
			return this;
		},
		cancelAllSelectedExcept : function(exceptNode){
			var node, 
				selected = this.selectedChildren,
				has = this.hasSeletedChild(exceptNode);
			if(has)selected.remove(exceptNode);
			while(node = selected[0]) this.cancelSelectedChild(node);
			if(has)selected.push(exceptNode);
			return this;
		},
		setChildSelectState : function(node, state){
			if(state)this.setSelectedChild(node);
			else this.cancelSelectedChild(node);
		},
		updateVisiableDimensionalNodes : function(){
			this.updateViewportDimension();
			this.visiableDimensionalNodes = this.filter(this.isDimensionalNodeInview, 0, this);
		},
		/* {
		():
			{boolean} isDimensionalNodeInview({object} node, {object} dimension)
		DES:
			returns true if the node is visiable in the specified view (dimension);
		ARG:
			{object} node
			  node should implements getDimension method;
			{object} dimension
			  (this.viewportDimension) view dimension;
		} */
		isDimensionalNodeInview : function(node, dimension){
			if(this.hasChild(node) && node.showing && WIN.isFunction(node.getDimension)){
				var D = WIN.isObject(dimension) ? dimension : this.viewportDimension;
						d = node.getDimension();
				return EL.overlap(D, d);
			}
		},
		toNodesSelectable : function(){
			if(!this.iNodesSelectable_initialized){
        this.addObservers("onselectchange");
				this.selectedChildren = [];
        /*//this.addListener to be removed...
        this.addListener("onselectchange", Function.bind(this._hndSelectChange, this) );*/
				if(this.hasObserver("onnodesdrag"))
					this.addListener("onnodesdrag", Function.bind(this._hndNodesdrag_nodesSelect, this) );
				var ele = this.nodesCtnEle;
				if(WIN.isElement(ele)){
					EVT.observe(ele, "mousedown", Function.bind(this._hndMousedown_nodesSelect, this) );
					EVT.observe(ele, "click", Function.bind(this._hndClick_nodesSelect, this) );
				}
				this.iNodesSelectable_initialized = true;
			}
			return this;
		},
		
		_hndMousedown_nodesSelect : function(evt){
			var e = EVT.Event.fix(evt, true),
					target = e.target,
					//isNodesCtn = this._isTriggerOnNodesCtn(target),
					node = this._getOwnerObject(target);
			//if(!e.leftClick)return ;
			this.selectHolding = e.ctrlKey;
			if(!this.selectHolding){
				if(this.hasChild(node) && WIN.isFunction(node.setSelected)){
					if(!this.hasSeletedChild(node)){
						this.cancelAllSelectedExcept(node);
						this.setSelectedChild(node);
					}
				}
				else {//if(isNodesCtn)
					this.cancelAllSelectedExcept();
					if(this.enableDrawSelect)this.doDrawSelectBehaviour(node, evt);
				}
			}
			else if(this.enableDrawSelect){//isNodesCtn && 
				this.doDrawSelectBehaviour(node, evt);
			}
		},
		_hndClick_nodesSelect : function(evt){
			var e = EVT.Event.fix(evt, true),
					target = e.target,
					node = this._getOwnerObject(target);
			if(!e.leftClick)return ;
			this.selectHolding = e.ctrlKey;
			if(this.hasChild(node) &&
				 WIN.isFunction(node.setSelected) &&
				 !this.nodesDraggedAfterSelect){
				if(this.selectHolding){
					this.toggleSelect(node);
				}
				else{
					this.cancelAllSelectedExcept(node);
					this.setSelectedChild(node);
				}
			}
			this.nodesDraggedAfterSelect = false;
		},
		_hndNodesdrag_nodesSelect : function(){
			this.nodesDraggedAfterSelect = true;
		},
		_handlerDrawSelect : Function.empty,
		/* {
		():
			{void} _updateNodesSelectState_b4DS()
		DES:
			update select state of every child nodes which are selectable before draw select;
		} */
		_updateNodesSelectState_b4DS : function(){
			this.each(this._setNodeSelectState_b4DS, 0, this);
		},
		/* {
		():
			{void} _setNodeSelectState_b4DS({NodeMap.BaseNode} node)
		DES:
			set node select state  before draw select (a property named "_selectedBeforeDND");
		} */
		_setNodeSelectState_b4DS : function(node){
			if(this.hasChild(node) && WIN.isFunction(node.setSelected)){
				if(this.hasSeletedChild(node))node._selectedBeforeDND = true;
				else node._selectedBeforeDND = false;
			}
		}
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);