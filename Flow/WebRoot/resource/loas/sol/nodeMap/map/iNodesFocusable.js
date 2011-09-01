/* iNodesFocusable.js
*/
require.provide("sol.nodeMap.map.iNodesFocusable");
require("lib.core.util.methodPool");
require("lib.evt.engin");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iNodesFocusable
DES:
  nodes focus mechanism for a map;
  Note: call method toNodesFocusable to initialize;
REQUIRE:
  {NodeMap.BaseMap} this
CFG:
  {int} nodeZIndex_blur
    zIndex for node on blur;
  {int} nodeZIndex_focus
    zIndex for node on focus;
PROPERTY:
  {boolean} iNodesFocusable_initialized
    indicates iNodesFocusable initialized or not;
  {object} _focusingNode
    reference of focusing node;
FUNCTION:
  {void} _hndMousedown_nodesFocus({object} event)
  {this} blurFocusing()
  {this} focusChild({NodeMap.BaseNode} node)
  {this} focusOn({NEString} nodeId)
  {this} toNodesFocusable()
} */
NodeMap.iNodesFocusable = WIN.MethodPool.declare({
    nodeZIndex_blur : 11,
    nodeZIndex_focus : 12,
    
    /* {
    ():
      {void} _hndMousedown_nodesFocus({object} event)
    DES:
      handler for on node focus;
    } */
    _hndMousedown_nodesFocus : function(evt){
      var e = EVT.Event.fix(evt, true),
          target = e.target,
          node = this._getOwnerObject(target);
      if(!e.leftClick)return ;
      if(this.hasChild(node)){
        this.focusChild(node);
      }
    },
    /* {
    ():
      {this} focusOn({NEString} nodeId)
    DES:
      focus on the childNode by specified nodeId;
    ARG:
      {NEString} nodeId
        unique node id in the map;
    } */
    focusOn : function(nodeId){
      var node = this.find(nodeId);
      return this.focusChild(node);
    },
    /* {
    ():
      {this} focusChild({NodeMap.BaseNode} node)
    DES:
      focus on the specified childNode;
    ARG:
      {NodeMap.BaseNode} node
        childNode of map;
    } */
    focusChild : function(node){
      if(this.hasChild(node) && (node instanceof NodeMap.BaseNode)){
        var last = this._focusingNode;
        if(last == node)return this;
        if(WIN.isFunction(node.focus)){
          this.blurFocusing();
          this._focusingNode = node;
          node.focus();
          node.setStyle({zIndex : this.nodeZIndex_focus});
        }
      }
      return this;
    },
    /* {
    ():
      {this} blurFocusing()
    DES:
      blur focusing node;
    } */
    blurFocusing : function(){
      var node = this._focusingNode;
      if(node && WIN.isFunction(node.blur)){
        node.blur();
        node.setStyle({zIndex : this.nodeZIndex_blur});
      }
      return this;
    },
    /* {
    ():
      {this} toNodesFocusable()
    DES:
      initialize to be nodesFocusable;
    } */
    toNodesFocusable : function(){
      if(!this.iNodesFocusable_initialized){
        var ele = this.nodesCtnEle;
        if(WIN.isElement(ele)){
          EVT.observe(ele, "mousedown", Function.bind(this._hndMousedown_nodesFocus, this) );
        }
        this.iNodesFocusable_initialized = true;
      }
      return this;
    }
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);