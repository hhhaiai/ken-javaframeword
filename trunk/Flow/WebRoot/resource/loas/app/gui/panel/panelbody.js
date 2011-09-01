/***************************************************************
panelbody.js
defined panelbody module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.panel.panelbody");
//require resource
require("app.gui.engin");
require("app.gui.panel.box");
require("lib.core.util.singlelast");

GUI.PanelBody = function(){
  GUI.PanelBody.superClass.apply(this);
  /*
  ():
    ?{this} initialize({object} options)
  DES:
    description
  ARG:
    {object} options
      Box's properties,default value:
      {
        
      }
  */
  this.initialize = function(options){    
    WIN.extend(this, this.handleOptions(options));
		this.activeBodySL = new WIN.SingleLast();
		this.activeBodySL.initialize(this.initActiveBody, this.restoreActiveBody);
		
    this.build();
    return this;
  };
  /*
  ():
    {void} _buildView()
  DES:
    build box dom; here we just create a div;
  */
  this._buildView = function(){
    this.ele = EL.c({
		  className  : "gui_panelbody_wrap"
		});
		if(WIN.isElement(this.container))this.container.appendChild(this.ele);
  };
  /* 
  ():
    ?{void} handleOptions()
  DES:
    handle options
  */
  this.handleOptions = function(options){
    if(!options)options ={};
    var opt = WIN.extendExclude({
			isIframe   : false,
			unknown : null
      }, options, ["layout"]);
    WIN.extend(opt.layout, options.layout);
		opt.container = $(opt.container);
		return opt;
  };
	
	this.initActiveBody = Function.bind(function(ele){
		EL.setStyle(ele,{
		  zIndex : 1,
			visibility : "visible"
		});
	}, this);	
	
	this.restoreActiveBody = Function.bind(function(ele){
		EL.setStyle(ele,{
		  zIndex : 0,
			visibility : "hidden"
		});
	}, this);
	
	this.addActive = function(name, content){
		if(!this.addBody(name, content))return false;
		return this.setActive(name);
	};
	
	this.addBody = function(name, content){
		if(!this.items)this.items = {};
		if(!(name && content))return false;
		
		var ele = this.ele, name = name.toLowerCase();
		if(!WIN.isElement(this.ele))return false;
		var itemEle;
		
		var attr = {
			className : "gui_panelbody_item"	,
			pbItemName: name
		};
		
		if(this.isIframe){
			var ifrHtml = '<iframe frameborder="0" name="' + name + '" src="' + content +'"></iframe>';
			itemEle = EL.createElementsByHtml(ifrHtml)[0];
			EL.setAttr(itemEle , attr);
		}
		else{
			attr.innerHTML = content;
			itemEle = EL.c(attr);
		}
		
		if(!itemEle)return false;
		ele.appendChild(itemEle);
		
		this.items[name] = itemEle;
		this.onItemsChange();
		return true;
	};
	this.getItem = function(name){
		try{return this.items[name.toLowerCase()];}catch(e){return null;}
	};
	this.removeItem = function(name){
		var items = this.items;
		if(!items || !name)return false;
		name = name.toLowerCase();
		var itemEle = this.getItem(name);
		if(!WIN.isElement(itemEle))return false;
		
		var name = itemEle.getAttribute("name");
		if(this.isIframe){
			try{//cross-domain
				var d = window.frames[name].document;
				d.write("");
				d.clear();
				itemEle.src = "about:blank";
			}catch(e){}
		}
		
		EL.removeNode(itemEle);
		itemEle = undefined;
		items[name] = null;
		delete items[name];		
		if(this.isIframe)delete window.frames[name];//firefox 
		
		this.onItemsChange();
		return true;
	};
	this.onItemsChange = Function.empty;
	
  this.setActive = function(name){
		if(!name)return false;
		var ele = this.getItem(name);
		if(!ele)return false;
		this.activeBodySL.set(ele);
		return true;
  };
	this.setContent = function(name, content){
		var items = this.items;
		if( !(items && String.notEmpty(name) && String.notEmpty(content)) )return false;
		name = name.toLowerCase();
		var itemEle = this.getItem(name);
		if(!WIN.isElement(itemEle))return false;
		
		if(this.isIframe)itemEle.src = content;
		else itemEle.innerHTML = content;
		return true;
	};
	
	/*
	():
		{returntype} createItemEle({string} content)
	DES:
		create HTMLelement of panelbody's item;
	ARG:
		{string} content
	RTN:
		return_value_description
	*/
	this.createItemEle = function(content){
		if(!String.notEmpty(content))return null;
		var itemEle;
		var attr = {className: "gui_panelbody_item"};
		if(this.isIframe){
			attr.src = content;
			itemEle = GUI.PanelBody.createIframe(attr);
		}
		else{
			attr.innerHTML = content;
			itemEle = EL.c(attr);
		}
		return itemEle;
	};
	
};
WIN.extendClass(GUI.PanelBody, GUI.Box);

/*
():
  {HTMLElement} GUI.PanelBody.createIframe({object} attr, {object} style)
DES:
  create a iframe which frameborder is 0.
*/
GUI.PanelBody.createIframe = function(attr, style){
	var ifrHtml = '<iframe frameborder="0" id="' + attr.id + ' name="' + attr.name +'"></iframe>';
	var iframe = EL.createElementsByHtml(ifrHtml)[0];
	if(!attr.src)attr.src = "about:blank";
	EL.setAttr(iframe,attr);
	EL.setStyle(iframe,style);
	return iframe;
};
