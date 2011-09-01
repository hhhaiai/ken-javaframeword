/* treeNode.js
GUI.TreeNode module
*/
require.provide("app.gui.tree.treeNode");
require("lib.dom.style");
require("lib.core.util.SimpleTemplate");

namespace("GUI");
/* {
CLASS:
  GUI.TreeNode
DES:
  treeNode display text, icon and also checkbox info;
	Warn: when you build a treeNode without offering its container, you should append 
	its dom to other element, before you build next;
CFG:
	{function} action
		(null) handler for a tree action event;
		ARG:
			@{custom} actionData
				node's actionData;
			@{GUI.TreeNode} node
				node self
			@{HTMLElement} target
				target which triggered the action event of tree;
		RTN:
		  returns a boolean value to notify tree to stop default nodeAction or not;
			if true default nodeAction would not be triggered;
	{any} actionData
		store any data, it will be passed as first param to node's action or tree's nodeAction;
	{boolean} checkboxChecked
		(false) indecates checkbox( if it has) checked state;
	{boolean} checkboxDisabled
		(false) indecates checkbox( if it has) disabled state;
	{HTMLElement} container
		(null) dom container.
		Warn: if it's not offered, you should append this dom to other element, before you build next
		treeNode;
	{string} icon
		("") node icon src;
	{boolean} showChildrenNum
		(true) show Children Num in node text;
	{boolean} showCheckbox
		(false) show checkbox after node icon;
	{string} text
		("") node text;
	{string} tip
		("") node tip;
	{string} tree_sid
		("") to indentify the dom's associated GUI.TreeNode object; 
		if async load it must be unique;
PROPERTY:
	{int} _childNodesNum
		record childNodes num;
	{string} _collapseType
		("blank") indicates collapse type: 
		"blank" : no children;
		"collapsed" : has children and collapsed;
		"expanded" : has children and expanded;
  {WIN.SimpleTemplate} _htmlTpl  
		node html template;
	{string} _tplIconHtml
		icon html
	
	{HTMLElement} dom
	{HTMLElement} contentCtn
	  ctn for node text, icon and checkbox;
	{HTMLElement} textCtn
	  ctn for text;
	{HTMLElement} childNodesCtn
	  ctn for childNodes;
METHOD:
  {void} _appendChdDom({HTMLElement} ele)
  
  {GUI.TreeNode} appendChild({GUI.TreeNode} node)
  {this} bindInnerDom()
  {this} blur()
  {this} build()
  {this} collapse()
  {void} dispose()
  {this} each({function} f, {GUI.TreeNode} start, {object}scope)
  {this} expand()
  {GUI.TreeNode | null} find({NEString} nodeId [, {string} prop])
  {this} focus()
  {string} getChildrenHtml()
  {boolean} hasChild({GUI.TreeNode} node)
  {boolean} hasChildNodes()
  {GUI.TreeNode} insertBefore({GUI.TreeNode} newNode [, {GUI.TreeNode} targetNode])
  {this} initialize({object} cfg, {boolean} async)
  {void} removeChild({GUI.TreeNode} node)
  {this} setNodeIcon({NEString} src)
  {this} setText({string} text)
  {this} setTip({string} text)
  {this} setCollapseType({string} type)
  {this} toggleCollapse()
  {string} toHtml()
  {this} unBindDom()
} */
GUI.TreeNode = WIN.createClass(function(){
  },{
    action : null,
    actionData : "",
    icon : "",
    text : "",
    tip : "",
    tree_sid : "",
		container : null,
    showChildrenNum : true,
		showCheckbox : false,
		checkboxChecked : false,
		checkboxDisabled : false,
		cascadeCheck : true,
    
    /* {
    ():
      {this} initialize({object} cfg, {boolean} async)
    DES:
      set cfg, and build treeNode dom unless async;
    ARG:
      {object} cfg
        all cfg of treeNode
      {boolean} async
        if async,treeNode's dom will be build and binded later.@see details 
        at GUI.Tree initialize method;
    } */
    initialize : function(cfg, async){
      WIN.extend(this, cfg);
      if(!async)this.build();
      return this;
    },
    /* {
    ():
      {void} dispose()
    DES:
      dispose node; unBindDom and removes it from its parent;
    } */
    dispose : function(){
			try{
				if(this.hasChildNodes()){
					this.each(function(chd){
						chd.dispose();
					});
				}
				if(WIN.isElement(this.dom)){
					EL.destoryNode(this.textCtn);
					EL.destoryNode(this.contentCtn);
					EL.destoryNode(this.childNodesCtn);
					EL.destoryNode(this.dom);
					this.dom.treeNode = null;
					delete this.dom;
				}
				this.unBindDom();
				delete this.parent;
			}catch(e){}
    },
    /* {
    ():
      {this} build()
    DES:
      build and bind node's dom;
    } */
    build : function(){
      var html = this.toHtml();
      var ele = this.dom = EL.createElementsByHtml(html)[0];
      if(WIN.isElement(this.container))this.container.appendChild(ele);
      this.bindInnerDom();
      return this;
    },
    /* {
    ():
      {this} bindInnerDom()
    DES:
      bind inner dom struct, includes binding
      contentCtn, textCtn, childNodesCtn
    } */
    bindInnerDom : function(){
      var css, self = this, ele = this.dom;
      if(WIN.isElement(ele)){
				ele.treeNode = this;
        this.contentCtn = ele.firstChild;
        //this.textCtn = this.contentCtn.lastChild;
        Array.each(function(node){
          css = node.className;
          if(/textCtn/i.test(css))self.textCtn = node;
        }, this.contentCtn.childNodes);
        this.childNodesCtn = ele.lastChild;
      }
      return this;
    },
    /* {
    ():
      {this} unBindDom()
    DES:
      release dom binding;
    } */
    unBindDom : function(){
      delete this.contentCtn;
      delete this.textCtn;
      delete this.childNodesCtn;
    },
    /* {
    ():
      {string} toHtml()
    DES:
      return treeNode's and its children's html;
    } */
    toHtml : function(){
      var values = {
        text : this.text,
        inputHtml : (this.inputHtml || ""),
        chdHtml : this.getChildrenHtml()
      };
      if(this.tree_sid){
        values.sid = " tree_sid='" + this.tree_sid + "'";
      }
      if(this.tip){
        values.tip = " title='" + this.tip + "'";
      }
      if(this.icon){
        values.iconHtml = this._tplIconHtml.replace("{src}", this.icon);
      }
      return this._htmlTpl.apply(values);
    },
    /* {
    ():
      {string} getChildrenHtml()
    DES:
      return children's html;
    } */
    getChildrenHtml : function(){
      if(!this.hasChildNodes())return "";
      var n = this.firstChild, 
          html = [];
      while(n){
        html.push(n.toHtml());
        n = n.nextSibling;
      } 
      return html.join("");
    },
    /* {
    ():
      {this} each({function} f, {GUI.TreeNode} start, {object}scope)
    DES:
      iterate over all the childNodes by applying the the function you pass;
      the function will be called with parameters (scope || this, child).
    ARG:
      {function} f
        a function like a iterator
      {GUI.TreeNode} start
        child node to start;
    } */
    each : function(f, start, scope){
      var chd = this.hasChild(start) ? start : this.firstChild;
      try{
        while(chd){
          f.call(scope || this, chd);
          if(chd.hasChildNodes()){
            chd.each(f, start, scope);
          }
          chd = chd.nextSibling;
        }
      }catch(e){
        if(e != Object)throw e;//break
      }
    },
    /* {
    ():
      {GUI.TreeNode | null} find({NEString} nodeId [, {string} prop])
    DES:
      returns child node searched by specifid attribute or null if not found;
    ARG:
      {NEString} nodeId
        atrribute value to search by.
			{string} prop
        ("sid") atrribute to search by.
    } */
    find : function(nodeId, prop){
      var re = null;
			prop = String.notEmpty(prop) ? prop : "sid";
      if(String.notEmpty(nodeId)){
        this.each(function(node){
          if(node[prop] == nodeId){
            re = node;
            throw Object;
          }
        });
      }
      return re;
    },
    /* {
    ():
      {boolean} hasChild({GUI.TreeNode} node)
    DES:
      returns true if it has direct child node specified;
    } */
    hasChild : function(node){
      return (node instanceof GUI.TreeNode && node.parent == this);
    },
    /* {
    ():
      {boolean} hasChildNodes()
    DES:
      returns true if it has any child;
    } */
    hasChildNodes : function(){
      return !!(this.firstChild);
    },
    /* {
    ():
      {GUI.TreeNode} appendChild({GUI.TreeNode} node)
    DES:
      Adds the node to the end of the list of children of this node.
    ARG:
      {GUI.TreeNode} node
        The node to add
    RTN:
      returns the node added.
      it throws exception when :
      Invalid node type;
    } */
    appendChild : function(node){
      if(!node instanceof GUI.TreeNode){
        throw {description : this.toString() + " -> appendChild() : Invalid node type!"} ;
      };
      
      if(this.hasChildNodes()){
        var last = this.lastChild;
        last.nextSibling = node;
        node.previousSibling = last;
        this.lastChild = node;
      }
      else{
        this.firstChild = this.lastChild = node;
        this.setCollapseType("collapsed");
      }
      node.parent = this;
      this._appendChdDom(node.dom);
      this._childNodesNum ++;
      this._updateTextOnChdNumChange();
      return node;
    },
    /* {
    ():
      {GUI.TreeNode} insertBefore({GUI.TreeNode} newNode [, {GUI.TreeNode} targetNode])
    DES:
      Inserts the node before the existing child node targetNode. 
      If targetNode is not this child, insert newChild at the end of the list of children.
    ARG:
      {GUI.TreeNode} newNode 
        The node to insert;
      {GUI.TreeNode} targetNode
        The node before which newNode is inserted;
    RTN:
      returns the node added.
      it throws exception when :
      Invalid node type;
    } */
    insertBefore : function(newNode, targetNode){
      if(!newNode instanceof GUI.TreeNode){
        throw {description : this.toString() + " -> insertBefore() : Invalid node type!"} ;
      };
      if(!this.hasChild(targetNode)) return this.appendChild(newNode);
      
      var pre = targetNode.previousSibling;
      if(this.hasChild(pre)){
        newNode.previousSibling = pre;
      }
      else{
        this.firstChild = newNode;
      }
      targetNode.previousSibling = newNode;
      newNode.nextSibling = targetNode;
      newNode.parent = this;
      this._addChdDom(newNode.dom);
      this._childNodesNum ++;
      this._updateTextOnChdNumChange();
      
      return newNode;
    },
    /* {
    ():
      {void} removeChild({GUI.TreeNode} node)
    DES:
      Removes the child node from the list of children, and returns it.
    RTN:
      returns the node added.
      it throws exception when :
      Raised if node is not this child;
    } */
    removeChild : function(node){
      if(!this.hasChild(node)){
        throw{description : this.toString() + " -> removeChild() : node isnt its child!"} ;
      }
      var pre = node.previousSibling,
          next = node.nextSibling;
      
      if(pre && next){
        pre.nextSibling = next;
        next.previousSibling = pre;
      }
      else{
        if(pre){//lastChild
          this.lastChild = pre;
          delete pre.nextSibling;
        }
        else if(next){//firstChild
          this.firstChild = next;
          delete next.previousSibling;
        }
        else{//only one child
          this.firstChild = this.lastChild = null;
          this.setCollapseType("blank");
        }
      }
      if(WIN.isElement(this.childNodesCtn)){
        if(WIN.isElement(node.dom))EL.removeNode(node.dom);
      }
      node.parent = node.previousSibling = node.nextSibling = null;
      this._childNodesNum --;
      this._updateTextOnChdNumChange();
      return node;
    },
    /* {
    ():
      {this} setNodeIcon({NEString} src)
    DES:
      set node icon src;
    } */
    setNodeIcon : function(src){
      if(String.notEmpty(src)){
        var ele = this.contentCtn;
        if(WIN.isElement(ele)){
          ele.style.backgroundImage = "url(" + src + ")";
        }
        this.icon = src;
      }
      return this;
    },
    /* {
    ():
      {this} setText({string} text)
    DES:
      set node text;
    } */
    setText : function(text){
      if(WIN.isString(text)){
        var ele = this.textCtn;
        this.text = text;
        if(WIN.isElement(ele)){
          if(this.showChildrenNum){
						var n = this._childNodesNum;
						if(n > 0) text += "(" + n + ")";
					}
          ele.innerHTML = text;
        }
      }
      return this;
    },
    /* {
    ():
      {this} setTip({string} text)
    DES:
      set node tip;
    } */
    setTip : function(text){
      if(WIN.isString(text)){
        var ele = this.contentCtn;
        if(WIN.isElement(ele)){
          ele.title = text;
        }
        this.tip = text;
      }
      return this;
    },
    /* {
    ():
      {this} setCollapseType({string} type)
    DES:
      set collapse type
    ARG:
      {string} type
        one of following value: "blank", "collapsed", "expanded";
    } */
    setCollapseType : function(type){
      if(this._collapseType == type)return this;
      if(String.notEmpty(type)){
        var ele = this.dom, re;
        if(ele){
          EL.swapClass(ele, this._collapseType, type);
        }
        this._collapseType = type;
      }
      return this;
    },
    /* {
    ():
      {this} collapse()
    DES:
      collapse node;
    } */
    collapse : function(){
      if(this.hasChildNodes()){
        var ele = this.childNodesCtn;
        if(WIN.isElement(ele)){
          ele.style.display = "none";
        }
        this.setCollapseType("collapsed");
      }
      return this;
    },
    /* {
    ():
      {this} expand()
    DES:
      expand node;
    } */
    expand : function(){
      if(this.hasChildNodes()){
        var ele = this.childNodesCtn;
        if(WIN.isElement(ele)){
          ele.style.display = "block";
        }
        this.setCollapseType("expanded");
      }
      return this;
    },
    /* {
    ():
      {this} toggleCollapse()
    DES:
      toggle collapse and expand;
    } */
    toggleCollapse : function(){
      if(this.hasChildNodes()){
        if(this._collapseType == "expanded")this.collapse();
        else this.expand();
      }
      return this;
    },
    /* {
    ():
      {this} focus()
    DES:
      sets focus;
    } */
    focus : function(){
      var ele = this.textCtn;
      if(WIN.isElement(ele)){
        EL.addClass(ele, "focused");
        ele.focus();
      }
    },
    /* {
    ():
      {this} blur()
    DES:
      sets blur;
    } */
    blur : function(){
      var ele = this.textCtn;
      if(WIN.isElement(ele)){
        EL.removeClass(ele, "focused");
        ele.blur();
      }
    },
    setCheckedState : function(checked){
			if(checked) this.setChecked();
			else this.unChecked();
		},
    setChecked : function(){
			if(this.checkboxChecked)return this;
			this._setCheckboxAttribute("checked", true);
			if(this.cascadeCheck) this.each(function(node){ node.setChecked(); });
			this.checkboxChecked = true;
			return this;
		},
		unChecked : function(){
			if(!this.checkboxChecked)return this;
			this._setCheckboxAttribute("checked", false);
			if(this.cascadeCheck) this.each(function(node){ node.unChecked(); });
			this.checkboxChecked = false;
			return this;
		},
		disableCheckbox : function(){
			if(this.checkboxDisabled)return this;
			this._setCheckboxAttribute("disabled", true);
			this.checkboxDisabled = true;
			return this;
		},
		enableCheckbox : function(){
			if(this.checkboxDisabled)return this;
			this._setCheckboxAttribute("disabled", false);
			this.checkboxDisabled = false;
			return this;
		},		
		
    _collapseType : "blank",
    _tplIconHtml : ' style =" padding-left:16px; background-image:url({src});"',
    _childNodesNum : 0,
    _htmlTpl : new WIN.SimpleTemplate('<li class="blank" {sid}><div class="contentCtn" {tip} {iconHtml}>{inputHtml}<span class="textCtn">{text}</span></div><ul class="childNodesCtn">{chdHtml}</ul></li>'),
		
    /* {
    ():
      {void} _appendChdDom({HTMLElement} ele)
    DES:
      append ele to childNodesCtn;
    } */
    _appendChdDom : function(ele){
      if(WIN.isElement(this.childNodesCtn)){
        if(WIN.isElement(ele))this.childNodesCtn.appendChild(ele);
      }
    },
    _updateTextOnChdNumChange : function(){
      if(!this.showChildrenNum)return ;
      var text = this.text;
      this.setText(text);
    },
    _getCheckboxEle : function(){
			var ctn = this.contentCtn;
			if(!WIN.isElement(ctn))return null;
			return this.checkboxEle = ctn.getElementsByTagName("input")[0];
		},
    _setCheckboxAttribute : function(name, value){
			var ele = this.checkboxEle;
			if(!ele) ele = this._getCheckboxEle();
			if(WIN.isElement(ele)){
				ele[name] = value;
				WIN.debug('name = ' + name + '<br />value = ' + value);
			}
		},
    toString: function(){return "[object GUI.TreeNode]";}
  }
);
