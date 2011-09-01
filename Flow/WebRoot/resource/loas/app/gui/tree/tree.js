/* tree.js
*/
require.provide("app.gui.tree.tree");
require("app.gui.tree.treeNode");
require("lib.evt.engin");

namespace("GUI");
/* {
CLASS:
  GUI.Tree
DES:
  tree gui module;
CFG:    
	{NEString} actionEventName
		("click") the name of the event to do the node action;
	{array} dataSource
		(null) tree nodes data;
	{function} nodeAction
		(Function.empty) default action for node if the node's action is not specified;
		ARG:
			@{custom} actionData
				treeNode's actionData;
			@{GUI.TreeNode} node
				treeNode found by the mothod getAssociatedNode;
			@{HTMLElement} target
				target which triggered the action event;
PROPERTY:
  {boolean} _binded
    indicates the association bind or not during the aysnc build;
  {object} _nodes
    stores treeNodes except those were not inserted by this insertion(append, insertBefore etc.)
  {GUI.TreeNode} _rootNode
    tree root node; this node has no dom, only used for organizing child tree nodes;
  {GUI.TreeNode} _lastFocused
    reference of last focused tree node;
METHOD:
  {void} _actionEventHandler({event} evt)
  
  {GUI.TreeNode} append({object} options, {boolean}async [, {boolean} safeCheck])
  {GUI.TreeNode} appendNode({GUI.TreeNode}node, {GUI.TreeNode} pNode)
  {this} build()
  {this} bindAssociation([{boolean} reBind])
  {this} clear()
  {this} collapseAll()
  {void} dispose()
  {this} doNodeAction({GUI.TreeNode} node)
  {this} doTargetAction({HTMLElement} target)
  {this} expandAll()
  {this} expandTo({NEString} nodeId)
  {this} expandToNode({GUI.TreeNode} node)
  {this} focusOn({NEString} nodeId)
  {this} focusOnNode({GUI.TreeNode} node)
  {GUI.TreeNode | null} getAssociatedNode({HTMLElement} target)
  {string} getTreeNodesHtml()
  {GUI.TreeNode | null} find({NEString} nodeId)
  {this} load({array} nodesData, [{boolean} async])
  {this} initialize({object} cfg, [{boolean} async])
  {GUI.TreeNode} insertBefore({GUI.TreeNode}node [, {GUI.TreeNode} targetNode])
  {this} open({NEString} nodeId)
  {this} openNode({GUI.TreeNode} node)
  {GUI.TreeNode | null} remove({NEString} nodeId)
  {GUI.TreeNode | null} removeNode({GUI.TreeNode} node)
  {this} scrollTo({NEString} nodeId)
  {this} scrollToNode({GUI.TreeNode} node)
} */
GUI.Tree = WIN.createClass(function(){
    this._nodes = {};
    this._rootNode = new GUI.TreeNode;
  },{
    nodeAction : Function.empty,
    actionEventName : "click",
    dataSource : null,
    
    /* {
    ():
      {this} initialize({object} cfg, [{boolean} async])
    DES:
      build dom, if dataSource is provided, load the tree;
    ARG:
      {object} cfg
        set this cfg;
      {boolean} async
        (optional, false)
        we has 2 ways to build a tree;
        if true,
          we build the tree by childNodes's html and then bind the association 
          bt treeNode and its dom. This is useful when building a large tree.
          But followings are imortant when using this way:
          1. provides unique sid for each node;
          2. call the bindAssociation method before accessing any tree node;
        if false, we build the treeNode and its dom one by one;
    } */
    initialize : function(cfg, async){
      WIN.extend(this, cfg);
      this.build();
      this.load(this.dataSource, async);
      EVT.observe(window, "unload", Function.bind(this.dispose, this) );
      return this;
    },
    /* {
    ():
      {void} dispose()
    DES:
      dispose tree;
    } */
    dispose : function(){
			try{
				delete this._rootNode.childNodesCtn;
				this.clear();
				delete this._rootNode;
				delete this._nodes;
				EL.destoryNode(this.dom);
				delete this.dom;
			}catch(e){}
    },
    /* {
    ():
      {this} build()
    DES:
      build dom, if dataSource is provided, load the tree;
    } */
    build : function(){
      var html = '<ul class="gui_tree"></ul>';
      this.dom = EL.createElementsByHtml(html)[0];
      this._initDom();
      return this;
    },
    /* {
    ():
      {this} clear()
    DES:
      clear all treeNodes;
    } */
    clear : function(){
      this._nodes = {};
      this._rootNode.dispose();
      this._binded = false;
      delete this._lastFocused;
      return this;
    },
    /* {
    ():
      {this} load({array} nodesData, [{boolean} async])
    DES:
      load tree nodes data
    ARG:
      {array} nodesData
        an array of node options(@see options param of append method);
      {boolean} async
        @see param async of method initialize;
    } */
    load : function(nodesData, async){
      if(!nodesData)return this;
      var self = this;
      Array.each(function(i){          
        self.append(i, async);
      }, nodesData);
      if(async){
        this.dom.innerHTML = this.getTreeNodesHtml();
        setTimeout(function(){self.bindAssociation();}, 0);
      }
      return this;
    },
    /* {
    ():
      {this} loadXmlData({xmlDoc} xmlDoc [, {object} mapping, {string} nodesTag, {boolean} async])
    DES:
      load tree nodes data
    ARG:
      {xmlDoc} xmlDoc 
        xml document
      {object} mapping
        @see param async of method loadXmlNodesData;
      {string} nodesTag
        (undefined) tag for data nodes ;
      {boolean} async
        @see param async of method initialize;
    } */
    loadXmlData : function(xmlDoc, mapping, nodesTag, async){
      if(!xmlDoc)return ;
      var nodes = xmlDoc.getElementsByTagName(nodesTag || "node");
      return this.loadXmlNodesData(nodes, mapping, async)
    },
    /* {
    ():
      {this} loadXmlNodesData({array} xmlNodes [, {object} mapping, {boolean} async])
    DES:
      load tree nodes data
    ARG:
      {xmlDoc} xmlNodes 
        xml nodes array.
      {object} mapping
        (undefined) mapping xml attribute name to treeNode property name;
      {boolean} async
        @see param async of method initialize;
    } */
    loadXmlNodesData : function(xmlNodes, mapping, async){
      var data = [],
          mapping = mapping || {};
          
      var text, tip, pid, sid, icon, actionData, opt;
      var fText = ( mapping.text || "text"),
          fPid = (mapping.pid || "pid"),
          fSid = (mapping.sid || "sid" ),
          fTip = (mapping.tip || "tip"),
          fAct = (mapping.actionData || "actionData"),
          fIcon = (mapping.icon || "icon");
      
      Array.each(function(node){
        sid = node.getAttribute(fSid);
        pid = node.getAttribute(fPid);
        text = node.getAttribute(fText);
        tip = node.getAttribute(fTip);
        icon = node.getAttribute(fIcon);
        actionData = node.getAttribute(fAct);
        opt = {
          sid : sid,
          text : text,
          actionData : actionData
        };
        if(String.notEmpty(tip)){
          opt.tip = tip;
        }
        if(String.notEmpty(icon)){
          opt.icon = icon;
        }
        if(String.notEmpty(pid)){
          opt.pid = pid;
        }
        data.push(opt);
      }, xmlNodes);
      return this.load(data, async);
    },
    /* {
    ():
      {this} bindAssociation([{boolean} reBind])
    DES:
      bind association bt tree nodes and their dom;
      if a tree is async build, you must call this method before you accessing any treeNodes.
    ARG:
      {boolean} reBind
        if true it'll reBind the association again careless of it's binded or not;
    } */
    bindAssociation : function(reBind){
      if(!reBind && this._binded)return this;
      var nodes,nid, treeNode,
          self = this,
          ele = this.dom;
      if(ele){
        nodes = ele.getElementsByTagName("li");
        Array.each(function(node){
          if(node.treeNode instanceof GUI.TreeNode)return ;
          nid = node.getAttribute("tree_sid");
          if(nid){
            treeNode = self._nodes[nid];
            if(treeNode instanceof GUI.TreeNode){
              node.treeNode = treeNode;
              treeNode.dom = node;
              treeNode.bindInnerDom();
              return ;
            }
          }
        }, nodes);
      }
      this._binded = true;
      return this;
    },
    /* {
    ():
      {GUI.TreeNode | null} find({NEString} nodeId)
    DES:
      find node by specified node id(tree_sid);
    ARG:
      {NEString} nodeId
        node tree_sid;
    RTN:
      return node removed or null if node was not found;
    } */
    find : function(nodeId){
      if(!String.notEmpty(nodeId))return null;
      var node = null,
          nodes = this._nodes,
          root = this._rootNode;
      node = nodes[nodeId];
      if(!(node instanceof GUI.TreeNode)){
        node = root.find(nodeId);
      }
      return node;
    },
    /* {
    ():
      {GUI.TreeNode} append({object} options, {boolean}async [, {boolean} safeCheck])
    DES:
      append a tree node to the tree.
    ARG:
      {object} options
        specifys the cfg for the treeNode, besides, you can provides the following options:
        {NEString} sid
          the id for the node self; it's short for the node's tree_sid;
          if async build it must be unique;
        {string} pid
          (optional)
          the id for the node's parent, if not provides, the new node will be appended to root;
      {boolean} async
        @see param async of method initialize;
      {boolean} safeCheck
        (optional, false)
        check unicity of node's sid;
    RTN:
      return the node appended;
      it throws exception when :
      options.sid is not unique or undefined;
      options.pid is provided but cant find the corresponding node;
    } */
    append : function(options, async, safeCheck){
      var p, node, 
          nodes = this._nodes,
          root = this._rootNode,
          pid = options.pid,
          sid = options.sid;
      //check sid
      if(String.notEmpty(sid)){
        options.tree_sid = sid;
        if(safeCheck) node = this.find(sid);
        else node = nodes[sid];
        if(node instanceof GUI.TreeNode){
          throw {description : this.toString() + " -> append() : Same sid exists!"};
        }
      }
      else if(async) throw {description : this.toString() + " -> append() : Invalid sid !"};
      //check pid
      if(String.notEmpty(pid)){
        options.tree_pid = pid;
        p = this.find(pid);
        if(!p)throw {description : this.toString() + " -> append() : Invalid pid !"};
      }
      else{
        p = root;
        if(!async)options.container = this.dom;
      }
      node = (new GUI.TreeNode).initialize(options, async);
      this.appendNode(node, p);
      return node;
    },
    /* {
    ():
      {GUI.TreeNode} appendNode({GUI.TreeNode}node, {GUI.TreeNode} pNode)
    DES:
      append a tree node to pNode.
    ARG:
      {GUI.TreeNode} pNode
        parent node
      {GUI.TreeNode}node
        node to be appended
    RTN:
      return the node appended;
      it throws exception when :
      pNode or node is not instanceof GUI.TreeNode
    } */
    appendNode : function(node, pNode){
      if(!node instanceof GUI.TreeNode){
        throw {description : this.toString() + " -> appendNode() : Invalid node type!"} ;
      };
      pNode = (pNode instanceof GUI.TreeNode) ? pNode : this._rootNode;
      pNode.appendChild(node);
      if(node.tree_sid){
        this._nodes[node.tree_sid] = node;
      }
      return node;
    },
    /* {
    ():
      {GUI.TreeNode} insertBefore({GUI.TreeNode}node [, {GUI.TreeNode} targetNode])
    DES:
      insert a node before target;
    ARG:
      {GUI.TreeNode}node
        node to be appended
      {GUI.TreeNode} targetNode
        The node before which node is inserted;
    RTN:
      return the node inserted;
      it throws exception when :
      targetNode or node is not instanceof GUI.TreeNode
    } */
    insertBefore : function(node, targetNode){
      if(!node instanceof GUI.TreeNode || targetNode instanceof GUI.TreeNode){
        throw {description : this.toString() + " -> insertBefore() : Invalid node type!"} ;
      };
      var pNode = targetNode.parent;
      pNode.insertBefore(node, targetNode);
      if(node.tree_sid){
        this._nodes[node.tree_sid] = node;
      }
      return node;
    },
    /* {
    ():
      {GUI.TreeNode | null} remove({NEString} nodeId)
    DES:
      remove node by specified node id(tree_sid);
    ARG:
      {NEString} nodeId
        node tree_sid;
    RTN:
      return node removed or null if node was not found;
    } */
    remove : function(nodeId){
      var node = this.find(nodeId);
      return this.removeNode(node);
    },
    /* {
    ():
      {GUI.TreeNode | null} removeNode({GUI.TreeNode} node)
    DES:
      remove specified node;
    ARG:
      {GUI.TreeNode} node
        The node being removed.
    RTN:
      return node removed;
    } */
    removeNode : function(node){
      if(node instanceof GUI.TreeNode){
        var pNode = node.parent;
        if(pNode instanceof GUI.TreeNode){
          pNode.removeChild(node);
        }
        if(node.tree_sid){
          delete this._nodes[node.tree_sid];
        }
      }
      return node;
    },
    /* {
    ():
      {GUI.TreeNode | null} getAssociatedNode({HTMLElement} target)
    DES:
      return a element or its ancestor's associated treeNode object;
    ARG:
      {HTMLElement} target
        element in the tree; if element doesnt have associated treeNode object, 
        we'll up its ancestors until the ancestor has the treeNode object;
    } */
    getAssociatedNode : function(target){
      if(WIN.isElement(target)){
        var treeNode;
        while(target && target != this.dom){
          if(target.treeNode instanceof GUI.TreeNode){
            return target.treeNode;
          }
          target = target.parentNode;
        }
      }
      return null;
    },
    /* {
    ():
      {this} doTargetAction({HTMLElement} target)
    DES:
      Executes any html element's associated node's action in the tree when the actionEvent occurs;
    ARG:
      {HTMLElement} target
        @see getAssociatedNode method;
    } */
    doTargetAction : function(target){
      if(!WIN.isElement(target))return this;
      
      var f, treeNode,
          tagName = target.tagName.toLowerCase();
      if(tagName == "ul")return this;//childnodes
      
      treeNode = this.getAssociatedNode(target);
      if(treeNode){
        if(treeNode.hasChildNodes()){
          if(target.tagName.toLowerCase() != "input")treeNode.toggleCollapse();
          if(tagName == "li")return this;
        }
        this.doNodeAction(treeNode, target).focusOnNode(treeNode);
      }
      return this;
    },
    /* {
    ():
      {this} doNodeAction({GUI.TreeNode} node)
    DES:
      do specified node's action;
			if node doesnt offer action, it will up through node ancestors to find the action;
			tree nodeAction will be autoly triggered unless action is found and it returns true;
    } */
    doNodeAction : function(node, target){
      if(node instanceof GUI.TreeNode){
        var p = node.parent, 
						f = node.action;
				while(!WIN.isFunction(f) && (p instanceof GUI.TreeNode)){
					f = p.action;
					p = p.parent;
				}
				var stopped;
				if(WIN.isFunction(f)){
					stopped = f.call(this, node.actionData, node, target);
				}
				if(!stopped)this.nodeAction.call(this, node.actionData, node, target);
      }
      return this;
    },
    /* {
    ():
      {string} getTreeNodesHtml()
    DES:
      return treeNodes's html;
    } */
    getTreeNodesHtml : function(){
      var root = this._rootNode;
      return root.getChildrenHtml();
    },
    /* {
    ():
      {this} open({NEString} nodeId)
    DES:
      opens node by specified node id(tree_sid);
    ARG:
      {NEString} nodeId
        node tree_sid;
    } */
    open : function(nodeId){
      var node = this.find(nodeId);
      return this.openNode(node);
    },
    /* {
    ():
      {this} openNode({GUI.TreeNode} node)
    DES:
      opens specified node; includes following actions:
      expandTo, scrollTo and focusOn the node, and executes the node's action;
    ARG:
      {GUI.TreeNode} node
        node being opened;
    } */
    openNode : function(node){
      if(node instanceof GUI.TreeNode){
        this.expandToNode(node)
        .scrollToNode(node)
        .focusOnNode(node)
        .doNodeAction(node);
      }
      return this;
    },
    /* {
    ():
      {this} focusOn({NEString} nodeId)
    DES:
      sets focus on node by specified node id(tree_sid);
    ARG:
      {NEString} nodeId
        node tree_sid;
    } */
    focusOn : function(nodeId){
      var node = this.find(nodeId);
      return this.focusOnNode(node);
    },
    /* {
    ():
      {this} focusOnNode({GUI.TreeNode} node)
    DES:
      sets focus on specified node;
    ARG:
      {GUI.TreeNode} node
        node being focused;
    } */
    focusOnNode : function(node){
      if(node instanceof GUI.TreeNode){
        if(this._lastFocused)this._lastFocused.blur();
        this._lastFocused = node;
        node.focus();
      }
      return this;
    },
    /* {
    ():
      {this} expandTo({NEString} nodeId)
    DES:
      scrollTo node by specified node id(tree_sid);
    ARG:
      {NEString} nodeId
        node tree_sid;
    } */
    expandTo : function(nodeId){
      var node = this.find(nodeId);
      return this.expandToNode(node);
    },
    /* {
    ():
      {this} expandToNode({GUI.TreeNode} node)
    DES:
      expandTo specified node;
      when expandTo a node, we expand the node and all its ancestors;
    ARG:
      {GUI.TreeNode} node
        node being expanded;
    } */
    expandToNode : function(node){
      while(node instanceof GUI.TreeNode){
        node.expand();
        node = node.parent;
      }
      return this;
    },
    /* {
    ():
      {this} scrollTo({NEString} nodeId)
    DES:
      scrollTo node by specified node id(tree_sid);
    ARG:
      {NEString} nodeId
        node tree_sid;
    } */
    scrollTo : function(nodeId){
      var node = this.find(nodeId);
      return this.scrollToNode(node);
    },
    /* {
    ():
      {this} scrollToNode({GUI.TreeNode} node)
    DES:
      scrollTo specified node;
      when scrollTo a node, we scroll the node's dom intoView and focus on that;
    ARG:
      {GUI.TreeNode} node
        node being scrolled;
    } */
    scrollToNode : function(node){
      if(node instanceof GUI.TreeNode){
        var ele = node.dom;
        if(WIN.isElement(ele)){
          ele.scrollIntoView();
        }
      }
      return this;
    },
    /* {
    ():
      {this} expandAll()
    DES:
      expand all treeNodes;
    } */
    expandAll : function(){
      var root = this._rootNode;
      root.each(function(node){
        node.expand();
      });
      return this;
    },
    /* {
    ():
      {this} collapseAll()
    DES:
      collapse all treeNodes;
    } */
    collapseAll : function(){
      var root = this._rootNode;
      root.each(function(node){
        node.collapse();
      });
      return this;
    },
    
    /* {
    ():
      {void} _actionEventHandler({event} evt)
    DES:
      Handler for actionEvent;
    } */
    _actionEventHandler : function(evt){
      this.doTargetAction(EVT.getEvtSrc(evt));
      if(BROWSER.IE){
        var ele = this.dom,
            s = ele.style;
        s.height = EL.parseUnit(parseInt(s.height) + 1);
        setTimeout(function(){s.height = EL.parseUnit(parseInt(ele.scrollHeight) - 1);}, 1);
      }
    },
    /* {
    ():
      {void} _initDom()
    DES:
      Handler for actionEvent;
    } */
    _initDom : function(){
      var ele = this.dom;
      EVT.observe(ele, this.actionEventName, Function.bind(this._actionEventHandler, this));
      if(WIN.isElement(this.container))this.container.appendChild(ele);
      this._rootNode.childNodesCtn = this.dom;
    },
    toString: function(){return "[object GUI.Tree]";}
  }
);