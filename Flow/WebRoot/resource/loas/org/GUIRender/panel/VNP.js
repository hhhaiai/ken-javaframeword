/***************************************************************
VNP.js
defined GUI.VNP module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("org.GUIRender.panel.VNP");
//require resource
require("org.GUIRender.engin");
require("lib.evt.engin");
require("lib.dom.engin");

/*
CLASS:
  GUIRender.VNP 
DES:
  VNP is a vertical navigation panel
METHOD:
  {void} _buildView()
  {string} _createNavListHtml()
  {void} build()
  {void} initActive({HTMLElement} navItem, {HTMLElement} contentItem)
  {void} initActive({HTMLElement} navItem, {HTMLElement} contentItem)
  {this} initialize({object} options)
  {void} handleOptions()
  {void} onBuild()
  {boolean} setActive({int} index)
  {void} setActiveByNavListEvt({event} evt)
  {boolean} setActiveByNavListItem({HTMLElement} ele)
*/
GUIRender.VNP = function(){
 GUIRender.VNP.superClass.apply(this);
  /*
  ():
    {this} initialize({object} options)
  ARG:
		{object} options
			PROPERTY:
				{HTMLElement}container
					required, container for panel
				{string}eventName
					event that will trigger the setActive, without the "on" prefix (default: "click")
  */
  this.initialize = function(options){
    WIN.extend(this, this.handleOptions(options));
    
    this.activeSL = [];
    this.build();
		this.setActive(0);
    return this;
  };
  /*
  ():
    {void} _buildView()
  DES:
    buildView and reference dom
  */
  this._buildView = function(){
    var container = this.container || this.renderTarget;	
		if(!WIN.isElement(container))container = DOC.c("div") ;
		
    var html = '<div class="GUIRender_vnp_wrap"><div class="GUIRender_vnp_navlist"><ul>'
    html += this._createNavListHtml(this.menuData);    
    html += '</ul></div><div class="GUIRender_vnp_content">'
    html += container.innerHTML;
		html += '</div></div>';
		
		container.innerHTML = html;
    var wrap = this.ele = container.firstChild;
    var content = wrap.childNodes[1];//second chd
		
    if(!BROWSER.IE){
      EL.cleanWhitespace(content);
    }
    Array.each(function(i){
      try{i.style.display = "none";}catch(e){}
    }, content.childNodes);
    
    this.list = wrap.firstChild.firstChild;
    this.content = content;
    wrap.appendChild(content);/*container.firstChild is panel content part*/
    container.appendChild(wrap);
    
    this.list["on" + (this.eventName || "click")] = this.setActiveByNavListEvt;
  };
  /*
  ():
    {string} _createNavListHtml()
  DES:
    create navigation list html, in buildView progress
  ARG:
    {array} navListData
      menu item list html array.
  */
  this._createNavListHtml = function(navListData){
    var html = "";
    Array.each(function(i){
      html += "<li>" + i + "</li>";
    }, navListData);
    return html;
  };
  /*
  ():
    {void} initActive({HTMLElement} navItem, {HTMLElement} contentItem)
  DES:
    set active targets style
  */
  this.initActive = function(navItem, contentItem){
    if(WIN.isElement(navItem)){
			navItem.className = "focus";
		}
    if(WIN.isElement(contentItem))contentItem.style.display = "block";
  };
  /*
  ():
    {void} initActive({HTMLElement} navItem, {HTMLElement} contentItem)
  DES:
    set last active nodes style
  */
  this.restoreActive = function(navItem, contentItem){
    if(WIN.isElement(navItem)){
			navItem.className = "";
			navItem.style.filter = "";
		}
    if(WIN.isElement(contentItem))contentItem.style.display = "none";
  };
  /*
  ():
    {boolean} setActive({int} index)
  DES:
    set Active by index
  ARG:
    {int} index
      (optional,default 0) navigation menu list item index;
  */
  this.setActive = function(index){
    if(isNaN(index))index = 0;
    if(this.activeIndex == index)return true;
    try{
      var navItem = this.list.childNodes[index], 
        contentItem = this.content.childNodes[index],
        SL = this.activeSL;
      
      if(WIN.isElement(SL[0]))this.restoreActive(SL[0], SL[1]);
      this.initActive(navItem, contentItem);
      this.activeSL = [navItem, contentItem];
      
      this.activeIndex = index;
      return true;
    }catch(e){
      return false;
    }
  };
  /*
  ():
    {boolean} setActiveByNavListItem({HTMLElement} ele)
  DES:
    setActive By navListItem node,we get the index from the node then setActive by index;
  */
  this.setActiveByNavListItem = function(ele){
    if(!WIN.isElement(ele))return false;
    var index = GUIRender.VNP.getNodeIndex(ele);
    this.setActive(index);
  };
  /*
  ():
    {void} setActiveByNavListEvt({event} evt)
  DES:
    setActive By the event of navList, this method can only be applied to this.navListEle's event;like this.navListEle.onclick = this.setActiveByNavListEvt;
  */
  this.setActiveByNavListEvt = Function.curry(function(obj, evt){
    var target = EVT.getEvtSrc(evt);
    if(!/li/i.test(target.tagName ))  target = EL.getParentByAttr(target, "tagName", "li");
    obj.setActiveByNavListItem(target);
  }, this);
};
WIN.extendClass(GUIRender.VNP, GUIRender.Base);

WIN.extend(GUIRender.VNP, function(){
    return {
      getNodeIndex : function(ele){
        if(!WIN.isElement(ele))return false;
        var p = ele.parentNode, chd = p.childNodes;
        var index = 0;
        Array.each(function(i, ind){
          if(i == ele){
            index = ind;
            throw Object;//break Array.each
          }
        }, chd);
        return index;
      },
      unknown : null
    };
  }()
);

