/* bodyPanel.js
define layout panel
*/
require.provide("app.gui.layout.bodyPanel");
require("app.gui.layout.splitPanel");

/*
Singleton:
  GUI.Layout.bodyPanel
DES:
  bodyPanel is a GUI.Layout.SplitPanel, used for building fullscreen page, 
	it will auto fit size to document body;
  Note : remove all the children of body except those position are absolute ,
  or there'll be compatibility problem cross browsers;
PROPERTY:
  {int} autofitDelay
FUNCTION:
  {this} _fixBug_AppendPanels()
  {this} autofit()
  {this} fireAutofit()
*/
(function(){
  var getW = DOC.getClientWidth,
      getH = DOC.getClientHeight;
  var bp = GUI.Layout.bodyPanel = WIN.extend(new GUI.Layout.SplitPanel, {
   isReady : false,
	 /*
    PROPERTY:
      {int} autofitDelay
    DES:
      time delay for firing the autofit action;
    */
    autofitDelay : 200,
    /*
    ():
      {this} autofit()
    DES:
      auto fit size to document body;
    */
    autofit : function(){
      bp.setWidth(getW());
      bp.setHeight(getH());
      if(!BROWSER.IE)setTimeout(function(){
        bp.setWidth(getW());
        bp.setHeight(getH());
      }, 0)
      return this;
    },
    /*
    ():
      {this} _fixBug_AppendPanels()
    DES:
      there's a bug on setInnerPanels;remember calling this method after you calling setInnerPanels;
    */
    _fixBug_AppendPanels : function(){
      bp.refresh();
      setTimeout(function(){bp.appendTo(bp.dom.parentNode);}, 1);
      return this;
    },
    /*
    ():
      {this} fireAutofit()
    DES:
      fire autofit action;
    */
    fireAutofit : function(){
      if(bp._firing)return ;
      bp._firing = true;
      setTimeout(function(){
        bp.autofit();
        bp._firing = false;
      }, bp.autofitDelay);
    },
    toString : function(){return "[object GUI.Layout.bodyPanel]";}
  });
  
  EVT.observe(window, "resize", bp.fireAutofit);
	if(BROWSER.IEversion == 6){// fix ie6 iframe window onrize bug;
		var lastWidth = getW(), 
				lastHeight= getH();
		setInterval(function(){
		  var resized = false;
			if(getW() != lastWidth){
				lastWidth = getW();
				resized = true;
			}
			if(getH() != lastHeight){
				lastHeight = getH();
				resized = true;
			}
			if(resized)bp.fireAutofit();
		}, 1000);
	}
  bp.addObservers("onready");
  EVT.domLoadedObserver.add(function(){
    bp.initialize(document.body, {
      initWidth : getW(),
      initHeight : getH()
    });
		bp.isReady = true;
    bp.fireObserver("onready");
  });
})();
