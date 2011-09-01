/* baseMap.js
*/
require.provide("sol.nodeMap.map.baseMap");
require("lib.core.util.ObserverProvider");
require("lib.evt.engin");

namespace("NodeMap");
/* {
CLASS:
  NodeMap.BaseMap
SUPERCLASS:
  WIN.ObserverProvider
DES:
  map is a container for nodes(NodeMap.BaseNode);BaseMap defines operation to access childNodes;
CFG:
  {string} initActionEventName
    ("dblclick") action event name;
  {function} nodeAction
    (Function.empty) default action for node if it is not spcified;
		ARG:
		  {NodeMap.BaseNode} node
			  action event target's ownerObject;
			{NodeMap.BaseMap} this
			  map self;
			{object} evt
			  event obj;
  
	{HTMLElement} container
    dom container;
	{object} viewportDimension
	  map viewport dimension info:
		{
			t : {int} top
			r : {int} right
			l : {int} left
			b : {int} bottom
			c : {
				x : {int} left + width/2,
				y : {int} top + height/2
			}
		}
PROPERTY:
  {object} _idNodes
    stores nodes which contain "nodeId" property;
  {object} _nodesList
    nodes list;
  {NodeMap.BaseNode} _lastFocused
    reference of last focused node;
  {string} _mapCss
    ("NodesMap") css for map's dom;
  {string} _nodesCtnCss
    ("nodesCtn") css for nodes container dom;
  
  {HTMLElement} dom
  {HTMLElement} nodesCtnEle
    reference of nodes element container;
METHOD:
	{object} append({object} nodeCfg, {class} nodeType, {boolean} batchMode)
	{NodeMap.BaseNode} appendChild({NodeMap.BaseNode} node, {boolean} batchMode)
  {this} batchAppend({array} nodesData)
  {this} build()
  {void} dispose()
  {this} each({function} f, {int} start, {object} scope)
  {NodeMap.BaseNode} find({NEStirng} nodeId)
  {int} getHeight()
  {object} getNodeCenterXY({NodeMap.BaseNode} node)
  {int} getWidth()
  {boolean} hasChild({NodeMap.BaseNode} node)
  {this} initialize({object} cfg)
	{NodeMap.BaseNode} remove({NEStirng} nodeId, {boolean} batchMode)
	{NodeMap.BaseNode} removeChild({NodeMap.BaseNode} node, {boolean} batchMode)
  {this} updateMapSize()
  
  {void} _initDom()
  {void} _bindDom()
  {NodeMap.BaseNode | null} _getOwnerObject({HTMLElement} target)
  {void} _appendChdDom({HTMLElement} ele)
} */
NodeMap.BaseMap = WIN.createClass(function(){
    this._nodesList = [];
    this._idNodes = {};
  },{
    nodeAction : null,
    initActionEventName : "dblclick",
    container : null,
    
    /* {
    ():
      {this} initialize({object} cfg)
    } */
    initialize : function(cfg){
      WIN.extend(this, cfg);
      this.build();
			this.addObservers("onBeforeDispose", "onDispose", "onResize");
			this.addListener("onResize", Function.bind(this.updateViewportDimension, this));
      EVT.observe(window, "unload", Function.bind(this.dispose, this) );
      return this;
    },
    /* {
    ():
      {void} dispose()
    } */
    dispose : function(){
			try{
				this.fireObserver("onBeforeDispose");
				this.each(function(node){node.dispose(); });
				EL.destoryNode(this.nodesCtnEle);
				EL.destoryNode(this.dom);
				this.dom[this.initActionEventName] = null;
				this.dom.onselectstart = null;
				delete this.nodesCtnEle;
				delete this.dom;
				delete this._nodesList;
				delete this._idNodes;
				this.fireObserver("onDispose");
				//alert("map disposed, dispose " + len + " childNodes !");
			}catch(e){}
    },
    /* {
    ():
      {this} build()
    } */
    build : function(){
      var ele = this.dom = EL.c({
            className : this._mapCss,
            innerHTML : '<div class="' + this._nodesCtnCss + '" style="left:0; top:0;"></div>'
          }),
          ctn = this.container;
      if(WIN.isElement(ctn))ctn.appendChild(ele);
      this._initDom();
      this._bindDom();
      return this;
    },
    /* {
    ():
      {this} batchAppend({array} nodesData)
    DES:
      fast to append nodes, fires onload observer;
    ARG:
      {array} nodesData
        two-dimensional array, like:
        [
         [node1Cfg, node1Type], 
         [node2Cfg, node2Type],
         ...
        ]
    } */
    batchAppend : function(nodesData){
      if(!nodesData)return this;
      Array.each(function(i){
        this.append(i[0], i[1], true);
      }, nodesData, 0, this);
      this.updateMapSize();
      return this;
    },
    /* {
    ():
      {object} append({object} nodeCfg, {class} nodeType, {boolean} batchMode)
    DES:
      append a new node by specified cfg;
    ARG:
      {object} nodeCfg
        cfg for new node;
      {class} nodeType
        node class, should be or subClass of NodeMap.BaseNode.
			{boolean} batchMode
			  @see method appendChild.
    RTN:
      a instance of specified nodeType.
    } */
    append : function(nodeCfg, nodeType, batchMode){
			if(!WIN.isFunction(nodeType)){
				throw{
					description : this.toString() + " -> append() : Invalid nodeType!"
				};
			}
      var node = (new nodeType).initialize(nodeCfg);
      return this.appendChild(node, batchMode);
    },
    /* {
    ():
      {NodeMap.BaseNode} appendChild({NodeMap.BaseNode} node, {boolean} batchMode)
    DES:
      append a new node;if node contains a NEStirng property named "nodeId", it should be unique;
    ARG:
      {NodeMap.BaseNode} node
        instanceof NodeMap.BaseNode
			{boolean} batchMode
			  (false) if ture we wont update map view(size) after appended;
    RTN:
      it raises a error when:
      the node is not instanceof NodeMap.BaseNode;
      the node contains a NEStirng property named "nodeId" which already exists in the map.
    } */
    appendChild : function(node, batchMode){
      if(!(node instanceof NodeMap.BaseNode))
        throw {description : this.toString() + " -> appendChild() : Invalid node !"};
      if(this.hasChild(node))return node;
      
      var list = this._nodesList,
          nodeId = node.nodeId,
          nodes = this._idNodes;
      
      if(String.notEmpty(nodeId)){
        if(nodes[nodeId] instanceof NodeMap.BaseNode)
          throw {description : this.toString() + " -> appendChild() : Same nodeId exists!"};
        nodes[nodeId] = node;
      }
      node.parent = this;
      list.push(node);
      
      this._appendChdDom(node.dom);
			if(!batchMode) this.updateMapSize();
      return node;
    },
    /* {
    ():
      {NodeMap.BaseNode} remove({NEStirng} nodeId, {boolean} batchMode)
    DES:
      remove a node by specified nodeId;
    ARG:
      {NEStirng} nodeId
        unique node id in the map;
			{boolean} batchMode
			  @see method appendChild.
    RTN:
      the node removed;
    } */
    remove : function(nodeId, batchMode){
      var node = this.find(nodeId);
      return this.removeChild(node, batchMode);
    },
    /* {
    ():
      {NodeMap.BaseNode} removeChild({NodeMap.BaseNode} node, {boolean} batchMode)
    DES:
      remove specified node.
    ARG:
      {NodeMap.BaseNode} node
        childNode of map;
			{boolean} batchMode
			  @see method appendChild.
    RTN:
      the node removed;
    } */
    removeChild : function(node, batchMode){
      if(!this.hasChild(node)){
        throw{description : this.toString() + " -> removeChild() : node isnt its child!"} ;
      }
      var nodeId = node.nodeId;
      
      if(String.notEmpty(nodeId)){
        delete this._idNodes[nodeId];
      }
      this._nodesList.remove(node);
      delete node.parent;
      if(WIN.isElement(node.dom)){
				EL.removeNode(node.dom);
			}
			if(!batchMode) this.updateMapSize();
      return node;
    },
    /* {
    ():
      {NodeMap.BaseNode} find({NEStirng} nodeId, {int} start, {object} scope)
    DES:
      find a node by specified nodeId;
    ARG:
      {NEStirng} nodeId
        unique node id in the map;
    } */
    find : function(nodeId, start, scope){
      var re = null;
      if(String.notEmpty(nodeId)){
        this.each(function(node){
          if(node.nodeId == nodeId){
            re = node;
            throw Object;
          }
        }, start, scope);
      }
      return re;
    },
    /* {
    ():
      {this} each({function} f, {int} start, {object} scope)
    DES:
      Iterates this childNodes list calling the passed function with each child, stopping
      if the function throw Object.
    } */
    each : function(f, start, scope){
      Array.each(f, this._nodesList, start, scope);
      return this;
    },
    /* {
    ():
      {this} filter({function} f, {int} start, {object} scope)
    DES:
      Return a array contains the appropriate child nodes.
    } */
    filter : function(f, start, scope){
			return Array.filter(f, this._nodesList, start, scope);
    },
    /* {
    ():
      {boolean} hasChild({NodeMap.BaseNode} node)
    DES:
      returns true if map has specifid child;
    } */
    hasChild : function(node){
      return (node && node.parent == this);
    },
    /* {
    ():
      {object} getNodeCenterXY({NodeMap.BaseNode} node)
    DES:
      return a node's centerXY position: 
      {
        x : {int}
        y : {int}
      }
    } */
    getNodeCenterXY : function(node){
      var xy;
      if(node){
        if(WIN.isFunction(node.getDimension)){
          var d = node.getDimension();
          if(d)return d.c;
        }
        var ele = node.dom;
        if(WIN.isElement(ele)){
          var s = ele.style;
          xy = {
            x : parseInt(s.left) + ele.offsetWidth/2,
            y : parseInt(s.top) + ele.offsetHeight/2
          };
        }
      }
      return xy;
    },
    /* {
    ():
      {int} getWidth()
    DES:
      return map's (nodesCtn's) width.
    } */
    getWidth : function(){
      var ele = this.nodesCtnEle;
			if(!WIN.isElement(ele))return -1;
      return parseInt(ele.style.width);
    },
    /* {
    ():
      {int} getHeight()
    DES:
      return map's (nodesCtn's) height.
    } */
    getHeight : function(){
      var ele = this.nodesCtnEle;
			if(!WIN.isElement(ele))return -1;
      return parseInt(ele.style.height);
    },
    /* {
    ():
      {this} setWidth({int} value)
    DES:
      set map's width.
    } */
    setWidth : function(value){
			value = parseInt(value);
      var ele = this.nodesCtnEle;
			if(WIN.isElement(ele) && !isNaN(value)){
				var min = this.dom.offsetWidth;
				if(value < min)value = min;
				var s = ele.style,
						oValue = s.width;
				s.width = value + "px";
				this.fireObserver("onResize", "width", value, oValue);
			}
			return this;
    },
    /* {
    ():
      {this} setHeight({int} value)
    DES:
      set map's height.
    } */
    setHeight : function(value){
			value = parseInt(value);
      var ele = this.nodesCtnEle;
			if(WIN.isElement(ele) && !isNaN(value)){
				var min = this.dom.offsetHeight;
				if(value < min)value = min;
				var s = ele.style,
						oValue = s.height;
				s.height = value + "px";
				this.fireObserver("onResize", "height", value, oValue);
			}
			return this;
    },
    /* {
    ():
      {this} updateMapSize()
    DES:
      keep map size larger than map nodesCtnEle scroll size;
    } */
    updateMapSize : function(){
      var ele = this.nodesCtnEle;
      if(WIN.isElement(ele)){
        var ie = BROWSER.IE
						dom = this.dom,
						s = ele.style,
						w = ele.scrollWidth,
            h = ele.scrollHeight,
						W = dom.scrollWidth,
						H = dom.scrollHeight,
						extraW = ie ? dom.offsetWidth/3 : 0,
						extraH = ie ? dom.offsetHeight/3 : 0;
				if(W - w < extraW)this.setWidth(w + extraW);
        if(H - h < extraH)this.setHeight(h + extraH);
      }
			return this;
    },
    /* {
    ():
      {this} updateViewportDimension()
    DES:
      update viewportDimension;
    } */
		updateViewportDimension : function(){
			var t, r, b, l, w, h, 
					ele = this.dom,
					nodesCtn = this.nodesCtnEle,
					s = nodesCtn.style;
			l = - parseInt(s.left) + ele.scrollLeft;
			t = - parseInt(s.top) + ele.scrollTop;
			w = ele.offsetWidth;
			h = ele.offsetHeight;
			r = l + w;
			b = t + h;
			this.viewportDimension = {
				t : t,
				r : r,
				l : l,
				b : b,
				c : {
					x : l + w/2,
					y : t + h/2
				}
			};
			return this;
		},
    
    _mapCss : "NodesMap",
    _nodesCtnCss : "nodesCtn",
    _mapBgCss : "mapBg",
		
    _hndActionEvent : function(evt){
      var e = EVT.Event.fix(evt, true),
          target = e.target,
          node = this._getOwnerObject(target);
      if(this.hasChild(node)){
				var f = node.nodeAction || this.nodeAction;
				if(WIN.isFunction(f)){
					f.call(this, node, evt);
				}
      }
    },
    /* {
    ():
      {void} _initDom()
    DES:
      set dom actionEvent;
    } */
    _initDom : function(){
      var ele = this.dom,
          eName = "on" + this.initActionEventName;
      ele[eName] = Function.bind(this._hndActionEvent, this);
			if(BROWSER.IE)ele.onselectstart = function(){return false;};
			EVT.observe(ele, "scroll", Function.bind(this.updateViewportDimension, this) );
			this.setWidth(ele.offsetWidth);
			this.setHeight(ele.offsetHeight);
    },
    /* {
    ():
      {void} _bindDom()
    } */
    _bindDom : function(){
      var ele = this.dom;
      this.nodesCtnEle = ele.firstChild;
    },
    /* {
    ():
      {NodeMap.BaseNode | null} _getOwnerObject({HTMLElement} target)
    DES:
      return a element or its ancestor's ownerObject;
    ARG:
      {HTMLElement} target
        element in the map; if element doesnt have associated ownerObject, 
        we'll up its ancestors until the ancestor has the ownerObject;
    } */
    _getOwnerObject : function(target){
      var node;
      while(target && target != this.dom){
        node = target.ownerObject;
        if(node instanceof NodeMap.BaseNode){
          return node;
        }
        target = target.parentNode;
      }
      return null;
    },
    /* {
    ():
      {void} _appendChdDom({HTMLElement} ele)
    DES:
      append child element;
    } */
    _appendChdDom : function(ele){
      var ctn = this.nodesCtnEle;
      if(WIN.isElement(ele)){
        ctn.appendChild(ele);
      }
    },
    toString: function(){return "[object NodeMap.BaseMap]";}
  },
  WIN.ObserverProvider
);
