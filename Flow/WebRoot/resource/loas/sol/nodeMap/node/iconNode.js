/* iconNode.js
*/
require.provide("sol.nodeMap.node.iconNode");
require("lib.core.util.SimpleTemplate");
require("lib.dom.style");
require("app.gui.indicator.textMonitor");
require("sol.nodeMap.node.linkableNode");

/* {
CLASS:
  NodeMap.IconNode
SUPERCLASS:
  NodeMap.LinkableNode
DES:
  IconNode is node formed of an icon and text and its position is absolute;
CFG:
  {int} initWidth
		(100) node init width;
 
  {string} icon
		("") node icon src;
  {int} left
		(0) node position left;
  {string} title
		("") node title;
  {int} top
		(0) node position top;
PROPERTY:
  {HTMLElement} dom
	{boolean} focused
	  indicates node focused
	{HTMLElement} iconEle
	  icon element reference
	{boolean} selected
	  indicates node selected
	{HTMLElement} titleEle
	  title element reference

	{string} _selectedCss
		("iconNode_selected") css for node selected;
	{string} _blurCss
		("iconNode_blur") css for node blur;
  {string} _focusedCss
		("iconNode_focused") css for node focused;
  {WIN.SimpleTemplate} _htmlTpl
		node html template ;
  {string} _normalStatusCss
		("iconNode_normal") css for node on normal status;
METHOD:
	{this} blur()
  {this} build()
	{this} cancelSelected()
  {void} dispose()
  {this} focus()
  {this} setIcon({string} src)
	{this} setSelected()
  {this} setTitle({string} text)
	{this} updateDemension()
  
  {this} _bindDom()
} */
NodeMap.IconNode = WIN.createClass(function(){
  },{
    initWidth : 100,
    left : 0,
    top : 0,
    icon : "",
    title : "",    
    
    /* {
    ():
      {void} dispose()
    DES:
      dispose node;
    } */
    dispose : function(){
			try{
				EL.destoryNode(this.iconEle);
				EL.destoryNode(this.titleEle);
				delete this.iconEle;
				delete this.titleEle;
				NodeMap.IconNode.$dispose.call(this);
			}catch(e){}
    },
    /* {
    ():
      {this} build()
    DES:
      build, init and bind dom;
    } */
    build : function(){
      var ele,
          ctn = this.container,
          html = this._htmlTpl.apply({
            icon : this.icon,
            title : this.title,
            normalCss : this._normalStatusCss,
            left : parseInt(this.left),
            top : parseInt(this.top),
            width : parseInt(this.initWidth)
          });
      
      ele = this.dom = EL.createElementsByHtml(html)[0];
      if(WIN.isElement(ctn))ctn.appendChild(ele);
      
      this._bindDom();
      this._initDom();
			this._initInfoMonitor();
     
      return this;
    },
    /* {
    ():
      {this} setIcon({string} src)
    DES:
      set node icon
    } */
    setIcon : function(src){
      var ele = this.iconEle;
      if(WIN.isElement(ele) && String.notEmpty(src)){
        this.icon = ele.src = src;
      }
      return this;
    },
    /* {
    ():
      {this} setTitle({string} text)
    DES:
      set node title
    } */
    setTitle : function(text){
      var ele = this.titleEle;
      if(WIN.isElement(ele)){
        this.title = ele.innerHTML = text;
      }
      return this;
    },
    /* {
    ():
      {this} updateDemension()
    DES:
      update node dimension;
    } */
    updateDemension : function(){
      NodeMap.IconNode.$updateDemension.call(this);
			var ele = this.iconEle;
      if(WIN.isElement(ele)){
				var d =	this._dismension,
						h = (ele.offsetHeight || this._recordOffsetSize().height);
				d.c.y = d.t + h/2;
			}
      return this;
    },
    /* {
    ():
      {this} focus()
    DES:
      focus on node;
    } */
    focus : function(){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        EL.addClass(ele, this._focusedCss);
        ele.focus();
        this.focused = true;
      }
      return this;
    },
    /* {
    ():
      {this} blur()
    DES:
      blur node;
    } */
    blur : function(){
      var ele = this.dom;
      if(WIN.isElement(ele)){
        EL.removeClass(ele, this._focusedCss);
        ele.blur();
        this.focused = false;
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
      if(this.selected)return this;
      var ele = this.dom;
      if(WIN.isElement(ele)){
        EL.addClass(ele, this._selectedCss);
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
      if(!this.selected)return this;
			var ele = this.dom;
      if(WIN.isElement(ele)){
        EL.removeClass(ele, this._selectedCss);
        this.selected = false;
      }
      return this;
    },
    
    _normalStatusCss : "iconNode_normal",
    _focusedCss : "iconNode_focused",
    _blurCss : "iconNode_blur",
    _selectedCss : "iconNode_selected",
    _htmlTpl : new WIN.SimpleTemplate(''
        + '<div class="iconNode {normalCss}" style="width:{width}px;left:{left}px;top:{top}px;">'
          + '<img class="icon" src="{icon}" />'
          + '<div class="title">{title}</div>'
        + '</div>'),
    /* {
    ():
      {this} _bindDom()
    DES:
      bind elements reference;
    } */
    _bindDom : function(){
      var css,
          ele = this.dom;
      Array.each(function(node){
        css = node.className;
        if(String.notEmpty(css)){
          this[css + "Ele"] = node;
        }
      }, ele.childNodes, 0, this);
    },
    toString: function(){return "[object NodeMap.IconNode]";}
  },
  NodeMap.LinkableNode
);