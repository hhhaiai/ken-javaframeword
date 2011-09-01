/* linkNode.js
*/
require.provide("sol.nodeMap.node.linkNode");
require("sol.nodeMap.node.baseNode");

/* {
CLASS:
  NodeMap.LinkNode
SUPERCLASS:
  NodeMap.BaseNode
DES:
  LinkNode is v:line node;(ie only);It's used to bind 2 nodes by which this postion always updated;
CFG:
  {int} initZIndex
    (0) init line zIndex;
  
  {int} offsetToFirstLine
    (0) indicates line offset to the nodes first binded line;
  {int} strokweight
    (1) init line stroke  weight;
  {string} normalColor
    ("#000")init line stroke color;
  {string} focusedColor
    ("#0000FF")init line focued color;
PROPERTY:
  {string} _nodeCss
    ("linkNode") css for node's dom;
  {string} _domTag
    ("v:line") tag for node's dom;
  
  {int} startX, startY, endX, endY
    line start and end position; 
METHOD:
  {this} build()
  {this} bind()
  {this} cancelSelected()
  {NodeMap.LinkableNode | null} removeEnds([{boolean} isEnd])
  {NodeMap.LinkableNode} removeEndsNode({NodeMap.LinkableNode} node)
  {this} setEnd({int} x, {int} y)
  {this} setEndsNode({NodeMap.LinkableNode} node [, {boolean} isEnd])
  {this} setSelected()
  {this} setStart({int} x, {int} y)
  {this} setStrokecolor({string} value)
  {this} setStrokeweight({int} value)
  {this} setStyle()
  {this} show()
  {this} strongWeight({int} value)
  {this} strongWeight({int} value)
  {this} unBind()
  {this} updateEndsPosition([{boolean} isEnd])

  {void} _initDom()
  {void} _setLineAttribute({string} attribute, {mix} value)
} */
NodeMap.LinkNode = WIN.createClass(function(){
  },{
    strokweight : 1,
    initZIndex : 0,
    offsetToFirstLine : 0,
    normalColor : "#000",
    focuedColor : "#0000FF",
    
    /* {
    ():
      {this} build()
    DES:
      build and init dom;set start and end position.
    } */
    build : function(){
      NodeMap.LinkNode.$build.call(this);
      this._initDom();
      this.setStrokecolor(this.normalColor);
      this.setStrokeweight(this.strokweight);    
      return this;
    },
    /* {
    ():
      {this} bind()
    DES:
      bind two nodes;
    } */
    bind : function(startNode, endNode){
      this.setEndsNode(startNode);
      this.setEndsNode(endNode, true);
      return this;
    },
    /* {
    ():
      {this} unBind()
    DES:
      release binded nodes;
    } */
    unBind : function(){
      this.removeEnds();
      this.removeEnds(true);
      return this;
    },
    /* {
    ():
      {this} setEndsNode({NodeMap.LinkableNode} node [, {boolean} isEnd])
    DES:
      set ends node;
    ARG:
      {NodeMap.LinkableNode} node
        node to be an ends of link;
      {boolean} isEnd
        (false) indicates wheather the node is endNode or startNode;
    } */
    setEndsNode : function(node, isEnd){
      if(node instanceof NodeMap.LinkableNode){
        var type = isEnd ? "end" : "start",
            ends = this[type + "Node"];
        if(ends != node){
          if(ends)ends.removeBindedLink(this);
          this[type + "Node"] = node;
          node.addBindLink(this);
          this.updateEndsPosition(isEnd);
        }
        if(this.startNode && this.endNode)this.show();
      }
      return this;
    },
    /* {
    ():
      {NodeMap.LinkableNode | null} removeEnds([{boolean} isEnd])
    DES:
      remove an ends of link;
    ARG:
      {boolean} isEnd
        (false) indicates which node to be removed; if true removes the endNode;
    RTN:
      node removed or null if the specified node was undefined;
    } */
    removeEnds : function(isEnd){
      var node = isEnd ? this.endNode : this.startNode;
      return this.removeEndsNode(node) || null;
    },
    /* {
    ():
      {NodeMap.LinkableNode} removeEndsNode({NodeMap.LinkableNode} node)
    DES:
      remove specified ends node.
    ARG:
      {NodeMap.LinkableNode} node
        node to be an ends of link;
    RTN:
      node self;
    } */
    removeEndsNode : function(node){
      if(node instanceof NodeMap.LinkableNode){
        var isEnd = this.endNode == node,
            isStart = this.startNode == node;
        if(isEnd || isStart){
          if(isEnd)delete this.endNode;
          else delete this.startNode;
          node.removeBindedLink(this);
          this.hide();
        }
      }
      return node;
    },
    /* {
    ():
      {this} setStart({int} x, {int} y)
    DES:
      set line start absolute postion x, y;      
    } */
    setStart : function(x, y){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        this.startX = parseInt(x);
        this.startY = parseInt(y);
        ele.from = (this.startX + "," + this.startY);
      }
      return this;
    },
    /* {
    ():
      {this} setEnd({int} x, {int} y)
    DES:
      set line end absolute postion x, y;
    } */
    setEnd : function(x, y){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        this.endX = parseInt(x);
        this.endY = parseInt(y);
        ele.to = (this.endX + "," + this.endY);
      }
      return this;
    },
    /* {
    ():
      {this} updateEndsPosition([{boolean} isEnd])
    DES:
      update Ends Position on node dimension changed;
    ARG:
      {boolean} isEnd
        (false) indicates which node's centerXY has changed;
    } */
    updateEndsPosition : function(isEnd){
      var XY, node, 
          map = this.parent;
      if(map && WIN.isFunction(map.getNodeCenterXY)){
        var type = isEnd ? "end" : "start",
            node = this[type + "Node"];
        XY = map.getNodeCenterXY(node);
        if(XY){
          var offset = this.offsetToFirstLine;
          this["set" + String.capitalize(type)](XY.x + offset, XY.y + offset);
        }
      }
      return this;
    },
    /* {
    ():
      {this} setSelected()
    DES:
      select node;
    } */
    setSelected : function(){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        this.strongWeight();
        this.setStrokecolor(this.focuedColor);
        this.selected = true;
      }
      return this;
    },
    /* {
    ():
      {this} cancelSelected()
    DES:
      cancel selecte node;
    } */
    cancelSelected : function(){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        this.normalWeight();
        this.setStrokecolor(this.normalColor);
        this.selected = false;
      }
      return this;
    },
    /* {
    ():
      {this} show()
    DES:
      show node, check canshow before showing: a link if its binded nodes is
    } */
    show : function(){
      var canShow = true,
          sNode = this.startNode,
          eNode = this.endNode;
      if(sNode){
        if(!sNode.showing)canShow = false;
      }
      if(eNode){
        if(!eNode.showing)canShow = false;
      }
      if(canShow) NodeMap.LinkNode.$show.call(this);
      return this;
    },
    /* {
    ():
      {this} setStyle()
    DES:
      set dom style;
    } */
    setStyle : function(style){
      if(style){
        if(!isNaN(style.zIndex))style.zIndex = this.initZIndex;
        EL.setStyle(this.dom, style);
      }
      return this;
    },
    /* {
    ():
      {this} setStrokecolor({string} value)
    DES:
      set line stroke color;
    } */
    setStrokecolor : function(value){
      return this._setLineAttribute("strokecolor", value);
    },
    /* {
    ():
      {this} setStrokeweight({int} value)
    DES:
      set line stroke weight;
    } */
    setStrokeweight : function(value){
      return this._setLineAttribute("strokeweight", EL.parseUnit(value));
    },
    /* {
    ():
      {this} strongWeight({int} value)
    DES:
      bold line stroke weight;
    } */
    strongWeight : function(){
      this.setStrokeweight(this.strokweight + 1);
    },
    /* {
    ():
      {this} strongWeight({int} value)
    DES:
      set line strongWeight to normal;
    } */
    normalWeight : function(){
      this.setStrokeweight(this.strokweight);
    },
    
    _nodeCss : "linkNode",
    _domTag : "v:line",
    /* {
    ():
      {void} _initDom()
    DES:
      init node dom.
    } */
    _initDom : function(){
      var ele = this.dom;
      ele.className = this._nodeCss;
      NodeMap.LinkNode.$_initDom.call(this);
    },
    /* {
    ():
      {void} _setLineAttribute({string} attribute, {mix} value)
    DES:
      set line attribute;
    } */
    _setLineAttribute : function(attribute, value){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        ele.setAttribute(attribute, value);
      }
      return this;
    },
    toString: function(){return "[object NodeMap.LinkNode]";}
  },
  NodeMap.BaseNode
);
