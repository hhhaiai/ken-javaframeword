/***************************************************************
wndCtrl.js
define GUI window control  module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.wnd.wndCtrl");
//require resource
require("lib.evt.engin");
require("app.gui.wnd.wndView");
require("app.bhv.dnd.drag");
require("app.bhv.dnd.resize");


GUI.WndCtrl = function(){
	
};
WIN.extend(GUI.WndCtrl.prototype, {
  /*
  ():
    {void} _handleOptions({object} options)
  DES:
    handle Options
  */
  _handleOptions :function(options){
		if(!options) options ={};
		var opt = WIN.extendExclude({
		  resizable : true,	
			maximizable: false,
			minimizable: true,
			resizeControlLimit : 5,
			unknown: null
		}, options, ["viewOptions"]);
		WIN.extend(this, opt);
		this.viewOptions = options.viewOptions;
	},
  initialize :function(options){
		//wndModule = new GUI.WndModule().initialize(options.module);
    this._handleOptions(options);
    this.build();
		delete this.viewOptions;
    return this;
	},
  initWndStyle :function(){
		if(this.resizable)this.enableResize();
		else this.disableResize();
		if(!this.maximizable)this.disableMaximize();
		else this.enableMaximize();
		if(!this.minimizable)this.disableMinimize();
		else this.enableMinimize();
	},
  /*
  ():
    {string} initDomBehaviors()
  DES:
    init window inner elements's behaviors.
  */
  initDomBehaviors :function(){
		var wndView = this.wndView;
		if(!wndView)return ;
    var ele = wndView.ele, titleEle = wndView.titleEle;
		ele.onmousedown = this._resizeWindow;
		BHV.DND.Resize.initMousemoveCursor(ele, function(){return ele._GUIWndResizable == true;});
		titleEle.onmousedown = this._dragWindow;
		titleEle.onmousemove = this._hndTitleEleMousemove;
		//init bi behaviors
		var statusArr = ["mouseout", "mouseover", "mousedown", "mouseup"];
		var biArr = [wndView.biMiniEle, wndView.biMaxiEle, wndView.biCloseEle];
		Array.each(function(i){
      Array.each(function(ele, ind){
				if(!WIN.isElement(ele))return;
				EVT.observe(ele, i, Function.curry(function(element, status, index){
					EVT.cancelB();
					if(element && !element._GUIWnd_BIDisabled)wndView.setBIStyleByStatus( index + 1, status);
				}, ele, i, ind));
			}, biArr);
		}, statusArr);
	},
  /*
  ():
    {void} build()
  DES:
    build window, fire onBuild event; 
  */
  build : function(){
    this.buildView();
		this.onBuild();
  },
  buildEleEventHnd :function(){
		var resizeControlLimit = this.resizeControlLimit;
		var wndView = this.wndView;
		this._dragWindow = function(evt){
			evt = EVT.getEvt(evt);
			var offY = (evt.offsetY || evt.layerY || 0);
			if(offY > resizeControlLimit)
			  BHV.DND.Drag.drag(wndView.ele, {useDNDGhost:false}, evt);
		};
		
		this._hndTitleEleMousemove = function(evt){
			evt = EVT.getEvt(evt);
			var offY = (evt.offsetY || evt.layerY || 0);
			if(offY <= resizeControlLimit && this._GUIWndResizable)this.style.cursor = "n-resize";
			else this.style.cursor = "default";
			EVT.cancelB();
		};
		
		this._resizeWindow = function(evt){
			if(this._GUIWndResizable){
				BHV.DND.Resize.resize(wndView.ele,
															{
																useDNDGhost:true,
																setH: function(h){wndView.setHeight(h);},
																setW: function(w){wndView.setWidth(w);}
															}, evt );
			}
		};		
	},
  buildView :function(){
		this.wndView = new GUI.WndView();
		this.wndView.initialize(this.viewOptions);
		this.wndView.ele._GUIWndResizable = this.resizable;
		this.buildEleEventHnd();
		this.initDomBehaviors();
		this.initWndStyle();
	},
  disableResize : function(){
		this.resizable = this.wndView.titleEle._GUIWndResizable = this.wndView.ele._GUIWndResizable = false;
	},
	/*
	():
		{void} enableResize()
	DES:
		enable resize window
	*/
  enableResize :function(){
		this.resizable = this.wndView.titleEle._GUIWndResizable = this.wndView.ele._GUIWndResizable = true;
	},
  disableMaximize :function(){
		this.wndView.setBIStyleByStatus(2, "disable");
		this.maximizable = this.wndView.biMaxiEle._GUIWnd_BIDisabled = true;
	},
  enableMaximize :function(){
		this.wndView.setBIStyleByStatus(2, "normal");
		this.maximizable = this.wndView.biMaxiEle._GUIWnd_BIDisabled = false;
	},
  disableMinimize :function(){
		this.wndView.setBIStyleByStatus(1, "disable");
		this.minimizable = this.wndView.biMiniEle._GUIWnd_BIDisabled = true;
	},
  enableMinimize :function(){
		this.wndView.setBIStyleByStatus(1, "normal");
		this.minimizable = this.wndView.biMiniEle._GUIWnd_BIDisabled = false;
	},
	/*
	():
		{void} maximize()
	DES:
		minimize window
	*/
  minimize :function(){
		
	},
	/*
	():
		{void} maximize()
	DES:
		maximize window
	*/
  maximize :function(){
		
	},
  /*
  ():
    {void} onBuild()
  DES:
    event triggered on window view build;
  */
  onBuild : Function.empty,
	/*
	():
		{void} setBIStyleByStatus({int} which, {string} status)
	DES:
		set BI button style by button status
	*/
  setBIStyleByStatus :function(which, status){
		
	},
	unknown: null
});
