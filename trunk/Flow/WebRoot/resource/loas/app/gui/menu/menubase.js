/***************************************************************
menubase.js
defined GUI.MenuBase module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.menu.menubase");
//require resource
require("app.gui.engin");
require("app.gui.panel.box");
require("app.gui.btn.iconbutton");

GUI.MenuBase = function(){
  GUI.MenuBase.superClass.apply(this);
  /*
  ():
    {void} _buildView()
  DES:
    build inner progress: _buildView
  */
  this._buildView = function(){
		this._createWrap();
		this.setContainer(this.container);
		this._createScrollArrows();
		this._createBar();
  };
  /*
  ():
    {void} _createWrap()
  DES:
    _buildView inner progress: _create wrapper
  */
	this._createWrap = function(){
		var layout = this.layout;
    var wrap = this.ele = EL.c({
			className : layout.wrapCss
    });
		if(layout.width)this.setWidth(layout.width);
		if(layout.height)this.setHeight(layout.height);
		
		var posWrapEle = this.posWrapEle = EL.c({//relative position wrap
			className : layout.posWrapCss
		});
		
		var barWrapEle = this.barWrapEle = EL.c({//absolute position wrap
			className : layout.barWrapCss
		});
		posWrapEle.appendChild(barWrapEle);
		wrap.appendChild(posWrapEle);
	};
	
	this.setContainer = function(container){
		if(!WIN.isElement(container))return;
		this.container = container;
		if(WIN.isElement(this.ele))container.appendChild(this.ele);
	};
	
  this._createScrollArrows = function(){
		var layout = this.layout, w = EL.parseUnit(layout.scrollArrowsWidth), h = EL.parseUnit(layout.scrollArrowsHeight);
		var opt = {
			hasSplit  : false,
			container : this.posWrapEle,
			layout:{
				width  : w,
				height : h
			}
		};
		var btnLeft = new GUI.IconButton().initialize(opt);
		var btnRight = new GUI.IconButton().initialize(opt);
		this.scrollArrows = [btnLeft, btnRight];
	};
	
	this._setScrollArrowsStyle = Function.bind(function(scrollArrows){
		var ele = this.posWrapEle;
		var l = scrollArrows[0], r = scrollArrows[1];
		var lEle = l.ele, rEle = r.ele;
		
		lEle.className += " " + this.layout.scrollArrowsCss[0];
		rEle.className += " " + this.layout.scrollArrowsCss[1];
		lEle.style.display = "none";
		rEle.style.display = "none";
	},this);
};
WIN.extendClass(GUI.MenuBase, GUI.Box);
