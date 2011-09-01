/* linkableNode.js
*/
require.provide("sol.nodeMap.node.linkableNode");
require("sol.nodeMap.node.baseNode");

/* {
CLASS:
  NodeMap.LinkableNode
SUPERCLASS:
  NodeMap.BaseNode
DES:
  LinkableNode is the node which can own links;
PROPERTY:
  {object} _dismension
    node dimension, @see method getDimension;
	{int} _demensionOffsetWidth, _demensionOffsetHeight
    when node is not showing, we cant get dom's offset size, so these two properties are used for
		cashing dom's offset size when node is showing;
		
  {array} bindedLinks
    stores binded links;
  {int} left
    left position
	{boolean} showing
	  indicates node display;
  {int} top
    top position
	
METHOD:
	{void} _updateLinkPosition({NodeMap.LinkNode} link)
	{void} _showLink({NodeMap.LinkNode} link)
	{void} _hideLink({NodeMap.LinkNode} link)
	
	
  {NodeMap.LinkNode} addBindLink({NodeMap.LinkNode} link)
  {void} dispose()
	{NodeMap.LinkNode | null} findBindedLink({function} f, {int} start, {object} scope)
	{NodeMap.LinkNode | null} findBindedLinkById({NEString} id, {int} start, {object} scope)
	{this} forEachBindedLinks({function} f, {int} start, {object} scope)
  {object} getDimension()
	{this} hide()
	{this} hideAllBindedLinks()
  {this} initialize({object} cfg)
  {array} removeAllBindedLinks()
  {NodeMap.LinkNode} removeBindedLink({NodeMap.LinkNode} link)
  {this} setLeft({int} value)
  {this} setTop({int} value)
	{this} show()
	{this} showAllBindedLinks()
  {this} updateBindedLinks()
  {this} updateDemension()
OBSERVER:
  ondimensionchange : triggers when node dimension(left, top, width, height) changed;
} */
NodeMap.LinkableNode = WIN.createClass(function(){
  },{
    /* {
    ():
      {this} initialize({object} cfg)
    } */
    initialize : function(cfg){
      NodeMap.LinkableNode.$initialize.call(this, cfg);
      this.bindedLinks = [];
      this.addObservers("ondimensionchange");
      this.addListener("ondimensionchange", Function.bind(this.updateBindedLinks, this));
			this._recordOffsetSize();
      return this;
    },
    /* {
    ():
      {void} dispose()
    } */
    dispose : function(){
      this.removeAllBindedLinks();
      NodeMap.LinkableNode.$dispose.call(this);
    },
    /* {
    ():
      {NodeMap.LinkNode | null} findBindedLink({function} f, {int} start, {object} scope)
    DES:
      find binded link by the specified method;
    } */
    findBindedLink : function(f, start, scope){
      var re = null;
			this.each(function(node){
				if(f.call(scope, node)){
					re = node;
					throw Object;
				}
			}, start, scope);
      return re;
    },
    /* {
    ():
      {NodeMap.LinkNode | null} findBindedLinkById({NEString} id, {int} start, {object} scope)
    DES:
      find binded link by the specified id;
		ARG:
		  {NEString} id
			  link linkId property;It is unique in a node;
    } */
    findBindedLinkById : function(id, start, scope){
			return this.findBindedLink(this._findNodeBindedLinkById, start, scope);
    },
    /* {
    ():
      {this} forEachBindedLinks({function} f, {int} start, {object} scope)
    DES:
      Iterates this binded links calling the passed function with each item, stopping
			if the function throw Object.
    } */
    forEachBindedLinks : function(f, start, scope){
      var links = this.bindedLinks;
			Array.each(f, links, start, scope);
			return this;
    },
    /* {
    ():
      {NodeMap.LinkNode} addBindLink({NodeMap.LinkNode} link)
    DES:
      add a bind link node;
    RTN:
      the link being added;
    } */
    addBindLink : function(link){
      var links = this.bindedLinks;
      if(!links.contains(link)) links.push(link);
      return link;
    },
    /* {
    ():
      {NodeMap.LinkNode} removeBindedLink({NodeMap.LinkNode} link)
    DES:
      remove a binded link node;
    RTN:
      the link being removed;
    } */
    removeBindedLink : function(link){
      var links = this.bindedLinks;
      links.remove(link);
      return link;
    },
    /* {
    ():
      {array} removeAllBindedLinks()
    DES:
      remove all binded links;
    RTN:
      list of all binded links;
    } */
    removeAllBindedLinks : function(){
      var links = this.bindedLinks;
      this.bindedLinks.length = 0;
      return links;
    },
    /* {
    ():
      {this} setLeft({int} value)
    DES:
      set node left position ;
    } */
    setLeft : function(value){
      var ele = this.dom;
      value = parseInt(value);
      if(WIN.isElement(ele) && !isNaN(value) && (this.left != value)){
        var original = this.left;
        this.left = value;
        ele.style.left = value + "px";
        this.updateDemension().fireObserver("ondimensionchange", "left", value, original);
      }
      return this;
    },
    /* {
    ():
      {this} setTop({int} value)
    DES:
      set node top position ;
    } */
    setTop : function(value){
      var ele = this.dom;
      value = parseInt(value);
      if(WIN.isElement(ele) && !isNaN(value) && (this.top != value)){
        var original = this.top;
        this.top = value;
        ele.style.top = value + "px";
        this.updateDemension().fireObserver("ondimensionchange", "top", value, original);
      }
      return this;
    },
    /* {
    ():
      {object} getDimension()
    DES:
      return node dimension:
      {
        t : {int} top
        r : {int} right
        b : {int} botteom
        l : {int} left
        c : {
          x : {int} center x
          y : {int} center y
        }
      }
    } */
    getDimension : function(){
      if(!this._dismension)this.updateDemension();
			return this._dismension;
    },
    /* {
    ():
      {this} updateDemension()
    DES:
      update node dimension;
    } */
    updateDemension : function(){
      var t, r, b, l, s, w, h, xy,
          ele = this.dom;
      if(WIN.isElement(ele)){
        s = ele.style;
        w = ele.offsetWidth || this._recordOffsetSize().width;
        h = ele.offsetHeight || this._recordOffsetSize().height;
        l = parseInt(s.left);
        t = parseInt(s.top);
        b = t + h;
        r = l + w;
        xy = {
          x : l + w/2,
          y : t + h/2
        };
        this._dismension = {
          t : t,
          r : r,
          b : b,
          l : l,
          c : xy
        };
      }
      return this;
    },
    /* {
    ():
      {this} updateBindedLinks()
    DES:
      update all binded links position,
    } */
    updateBindedLinks : function(){
			this.forEachBindedLinks(this._updateLinkPosition, 0, this);
      return this;
    },
    /* {
    ():
      {this} hideAllBindedLinks()
    DES:
      hide all binded links.
    } */
    hideAllBindedLinks : function(){
			this.forEachBindedLinks(this._hideLink, 0, this);
      return this;
    },
    /* {
    ():
      {this} showAllBindedLinks()
    DES:
      show all binded links.
    } */
    showAllBindedLinks : function(){
			this.forEachBindedLinks(this._showLink, 0, this);
      return this;
    },
    /* {
    ():
      {this} hide()
    DES:
      hide node and binded links;
    } */
    hide : function(){
			NodeMap.LinkableNode.$hide.call(this);
			this.hideAllBindedLinks();
			return this;
    },
    /* {
    ():
      {this} show()
    DES:
      show node and binded links;
    } */
    show : function(){
			NodeMap.LinkableNode.$show.call(this);
			this.showAllBindedLinks();
			return this;
    },
		
		_findNodeBindedLinkById : function(link){
			return (link && link.linkId == id);
		},
    /* {
    ():
      {void} _updateLinkPosition({NodeMap.LinkNode} link)
    DES:
      update link position
    } */
    _updateLinkPosition : function(link){
			if(link && WIN.isFunction(link.updateEndsPosition)){
				link.updateEndsPosition((link.endNode == this));
			}
    },
    /* {
    ():
      {void} _hideLink({NodeMap.LinkNode} link)
    } */
    _hideLink : function(link){
			if(link && WIN.isFunction(link.hide)){
				link.hide();
			}
    },
    /* {
    ():
      {void} _showLink({NodeMap.LinkNode} link)
    } */
    _showLink : function(link){
			if(link && WIN.isFunction(link.show)){
				link.show();
			}
    },
    _recordOffsetSize : function(){
			if(!this._offsetSize)this._offsetSize = {};
			var size = this._offsetSize;
			if(this.showing){
				var ele = this.dom,
						s = ele.style;
				if(WIN.isElement(ele)){
					size.width = ele.offsetWidth || parseInt(s.width);
					size.height = ele.offsetHeight || parseInt(s.height);
				}
			}
			return size;
    },
    toString: function(){return "[object NodeMap.LinkableNode]";}
  },
  NodeMap.BaseNode
);