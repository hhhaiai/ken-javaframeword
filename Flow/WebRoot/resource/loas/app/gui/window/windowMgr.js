/* windowMgr.js
*/
require.provide("app.gui.window.windowMgr");
require("app.gui.window.LayerCascading");

namespace("GUI");
/* {
Singleton:
  GUI.windowMgr
DES:
  window manager; manage panels's cascad, startup position, etc.
  windowMgr contains 3 types cascading :
  normalCascading, topmostCascading and dialogCascading ;
PROPERTY:
  {__datatype} __property_name
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
GUI.windowMgr = {
  /*
  PROPERTY:
    {GUI.LayerCascading} _normalCascading
  DES:
    cascad mgr for normal panels;
  */
  _normalCascading : new GUI.LayerCascading(1000),
  /*
  PROPERTY:
    {GUI.LayerCascading} _topmostCascading
  DES:
    cascad mgr for topmost panels;
  */
  _topmostCascading : new GUI.LayerCascading(5000),
  /*
  PROPERTY:
    {GUI.LayerCascading} _dialogCascading
  DES:
    cascad mgr for dialog panels;
  */
  _dialogCascading : new GUI.LayerCascading(6000),
  /*
  PROPERTY:
    {array} _panels
  DES:
    stores registered panels;
  */
  _panels : [],
  /*
  PROPERTY:
    {object} _autoPositionOptions
  DES:
    stores options of auto create startup position for panels whose startupPostionType are "auto";
		it contains these options:
		{int} left
		  panel left
		{int} top
		  panel top
		{int} groupFirstLeft
		  the left of first panel in panels group;
			When a _autoPositionOptions.top oversteps viewport height, 
			we need to reset the opt's top and left; Top is defaultly set to 0, but left should
			be (groupFirstLeft + groupSpacing).
			So the panels whose left is base on the same groupFirstLeft forms a group;
			When the groupFirstLeft oversteps viewport width, it's reset to 0;		
		{int} groupSpacing
		  group spacing
		{int} hSpacing
		  horizonal spacing bt 2 panels in the same group ;
		{int} hSpacing
		  vertical spacing bt 2 panels in the same group ;
  */
  _autoPositionOptions : {
    left : 0,
    top : 0,
    groupFirstLeft : 0,
    groupSpacing : 100,
    hSpacing : 15,
    vSpacing : 25
  },
  /* {
  ():
    {panel} registerPanel({object} panel)
  DES:
    register panel;
  ARG:
    {object} panel
      panel to be managed; it should implements setZIndex method and has cascadingType property;
  } */
  registerPanel : function(panel){
    if(this.hasRegistered(panel)) return panel;
    
    var mgr = GUI.windowMgr,
        cascading = mgr.getCascading(panel),
        panels = mgr._panels;
    
    if(!cascading) throw{description : "Invalid cascadingType!"};
    
    cascading.append(panel);
    panels.push(panel);
    
    return panel;
  },
  /* {
  ():
    {panel} unRegisterPanel({object} panel)
  DES:
    unregister panel;
  } */
  unRegisterPanel : function(panel){
    if(!this.hasRegistered(panel)) return panel;
    
    var mgr = GUI.windowMgr,
        cascading = mgr.getCascading(panel),
        panels = mgr._panels;
    
    if(cascading){
      cascading.remove(panel);
      panels.remove(panel);
    }
    return panel;
  },
  /* {
  ():
    {GUI.LayerCascading | null} getCascading({object} panel)
  DES:
    return cascad mgr for panel by panel's cascadingType;
  RTN:
     if not find return null;
  } */
  getCascading : function(panel){
    if(!panel) return null;
    var type = panel.cascadingType,
        cascading = GUI.windowMgr["_" + type + "Cascading"];
    return (cascading instanceof GUI.LayerCascading) ? cascading : null;
  },
  /* {
  ():
    {boolean} hasRegistered({object} panel)
  DES:
    retrun true if panel has registered;
  } */
  hasRegistered : function(panel){
    return GUI.windowMgr._panels.contains(panel);
  },
  /* {
  ():
    {panel} bringToFront({object} panel)
  DES:
    bring layer to the front of any other layers;
  } */
  bringToFront : function(panel){
    var cascading = GUI.windowMgr.getCascading(panel);
    if(cascading){
      cascading.bringToFront(panel);
    }
    return panel;
  },
  /* {
  ():
    {panel} getAutoPosition()
  DES:
    returns a object contains left and top property whose value are auto created;
  } */
  getAutoPosition : function(){
    var mgr = GUI.windowMgr,
        pos = mgr._autoPositionOptions;
    
    pos.left += pos.hSpacing;
    pos.top += pos.vSpacing;
    
    if(pos.top > DOC.getClientHeight()){
      pos.top = 0;
      pos.left = pos.groupFirstLeft += pos.groupSpacing;
      return mgr.getAutoPosition();
    }
    if(pos.left > DOC.getClientWidth()){
      pos.left = 0;
      pos.top = pos.groupFirstLeft = 0;
      return mgr.getAutoPosition();
    }
    return pos;
  },
	openDialog : function(url, name, options){
		var w = new GUI.Dialog;
		w.initialize(options).open(url);
		var ele = w.bodyEle;
		if(ele){
			try{
				var win = ele.contentWindow;
				WIN.extend(win, {
					opener : window,
					_customWindow : dialog
				});
			}catch(e){
			}
		}
	},
	open : function(url, name, options){
		var w = new GUI.WndPanel;
		w.initialize(options).open(url);
		var ele = w.bodyEle;
		if(ele){
			try{
				var win = ele.contentWindow;
				WIN.extend(win, {
					opener : window,
					_customWindow : w
				});
			}catch(e){
			}
		}
	},
	close : function(){
		
	},
	setTitle : function(){
		
	},
  toString : function(){return "[object GUI.windowMgr]";}
};
