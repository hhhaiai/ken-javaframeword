/***************************************************************
VNP.js
defined GUI.VNP module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.GUIRender.VNP");
//require resource
require("app.gui.plugin.engin");
require("lib.evt.engin");
require("lib.dom.engin");

/*
CLASS:
  GUIRender.VNP 
DES:
  VNP
PROPERTY:
  {datatype} propertyname
    description
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
  /*
  ():
    {this} initialize({object} options)
  ARG:
    like
    {  container : target,  //required, {HTMLElement}
      eventName : eventName,//event that will trigger the setActive, without the "on" prefix (default: "click")
      menuData  : menuData, //required, navigation menu item html array;
			wrapBgImg : wrapBgImg //required under ie6,bgimg for panel
			
    }
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
    {void} handleOptions()
  DES:
    handle options
  */
  this.handleOptions = function(options){
    var opt = WIN.extend({
      unknown : null      
    }, options);
    
    return opt;
  };
  /*
  ():
    {void} build()
  DES:
    build box;You should define onBuild method in subClass;
  */
  this.build = function(){
    this._buildView();
    this.onBuild();
  };
  /*
  ():
    {void} _buildView()
  DES:
    buildView and reference dom
  */
  this._buildView = function(){
    var html = '<div class="GUIRender_VNP_wrap">'
             +  '<div class="GUIRender_VNP_navlist"><ul>';
    html += this._createNavListHtml(this.menuData);    
    html += '</ul></div></div>';
    
    var wrap = this.ele = EL.createElementsByHtml(html)[0];
    var content = this.container.firstChild;
    
    if(!BROWSER.IE){
      this.container = EL.cleanWhitespace(this.container);
      content = this.container.firstChild;
      EL.cleanWhitespace(content);
    }
		if(BROWSER.IEversion == 6){
			wrap.style.filter = GUIRender.VNP.patchFilterString(this.wrapBgImg);
		}
    Array.each(function(i){
      i.style.display = "none";
    }, content.childNodes);
    
    this.listEle = wrap.firstChild.firstChild;
    this.contentEle = content;
    wrap.appendChild(content);/*container.firstChild is panel content part*/
    this.container.appendChild(wrap);
    
    this.listEle["on" + (this.eventName || "click")] = this.setActiveByNavListEvt;
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
    {void} onBuild()
  DES:
    Function.empty;
  */
  this.onBuild = Function.empty;
  /*
  ():
    {void} initActive({HTMLElement} navItem, {HTMLElement} contentItem)
  DES:
    set active targets style
  */
  this.initActive = function(navItem, contentItem){
    if(WIN.isElement(navItem)){
			navItem.className = "focus";
			if(BROWSER.IEversion == 6){
				navItem.style.filter = GUIRender.VNP.patchFilterString(this.navFocusItemBgImg);
			}
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
    if(WIN.isElement(navItem))navItem.className = "";
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
      var navItem = this.listEle.childNodes[index], 
        contentItem = this.contentEle.childNodes[index],
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
      patchFilterString: function(src){
				return "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ src + "',sizingMethod='crop')";
      },
			/*
			():
				{returntype} GUIRender.VNP.render(target, menuData, eventName, wrapBgImg)
			DES:
				render a panel area with VNP
			ARG:
				see doc at GUIRender.VNP CLASS
			*/
      render : function(target, menuData, eventName, wrapBgImg){
        if(!WIN.isElement(target))return false;
        
        var VNP = new GUIRender.VNP();
        VNP.initialize({
          container : target,
          eventName : eventName,
          menuData  : menuData,
					wrapBgImg : wrapBgImg
        });
      },
      unknown : null
    };
  }()
);

