/* iContextMenuMgr.js
*/
require.provide("sol.nodeMap.map.iContextMenuMgr");
require("lib.core.util.methodPool");
require("lib.evt.engin");
require("app.gui.menu.popupMenu");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iContextMenuMgr
DES:
  map contextmenu and nodes contextmenu manager;
  Note: call method toContextMenuMgr to initialize;
REQUIRE:
  {NodeMap.BaseMap} this
CFG:
PROPERTY:
FUNCTION:
} */
NodeMap.iContextMenuMgr = WIN.MethodPool.declare({
		nodesCMItems : [],
		mapCMItems : [],
    /* {
    ():
      {void} _hndContextmenu_CMMgr({object} event)
    DES:
      handler for onmouseover node to show node description;
    } */
    _hndContextmenu_CMMgr : function(evt){
      var e = EVT.Event.fix(evt),
          target = e.target,
          node = this._getOwnerObject(target);
			if(this.hasChild(node)){
				var hndTarget = node;
				if(WIN.MethodPool.hasImplemented(this, NodeMap.iNodesSelectable)){
					hndTarget = this.selectedChildren;
					if(hndTarget.length == 1)hndTarget = node;
				}
        this.nodesCMTarget = hndTarget;
				this.showNodesContextMenu(evt);
      }
			else{
				this.showMapContextMenu(evt);
			}
    },
    /* {
    ():
      {void} _hndContextmenu_CMMgr({object} event)
    DES:
      handler for onmouseover node to hide node description;
    } */
    _hndMousedown_CMMgr : function(evt){
			var m = this.nodesContextMenu;
			if(m && WIN.isFunction(m.hideAll)){
				m.hideAll();
			}
			var m = this.mapContextMenu;
			if(m && WIN.isFunction(m.hideAll)){
				m.hideAll();
			}
    },
    _setItemVisibilityAndEnable : function(item){
			this._setCMItemVisibility(item);
			this._setCMItemEnable(item);
    },
		_setCMItemVisibility : function(item){
			var checkRule = item.checkVisiable;
			if(WIN.isFunction(checkRule) && !checkRule(this.nodesCMTarget)){
				item.hide();
			}
			else item.show();
		},
		_setCMItemEnable : function(item){
			var checkRule = item.checkEnable;
			if(WIN.isFunction(checkRule) && !checkRule(this.nodesCMTarget)){
				item.disable();
			}
			else item.enable();
		},
		initMapCM : function(){
			
		},
		initNodesCM : function(){
			
		},
		showNodesContextMenu : function(evt){
			this.forEachNodesCMI(this._setItemVisibilityAndEnable);
			var m = this.nodesContextMenu;
			if(m && WIN.isFunction(m.showAtEvent)){
				m.showAtEvent(evt);
			}
		},
		showMapContextMenu : function(evt){
			var m = this.mapContextMenu;
			if(m && WIN.isFunction(m.showAtEvent)){
				m.showAtEvent(evt);
			}
		},
		forEachNodesCMI : function(f, start, scope){
			Array.each(f, this.nodesCMItems , start, (scope || this));
		},
		forEachMapCMI : function(f, start, scope){
			Array.each(f, this.mapCMItems , start, (scope || this));
		},
    /* {
    ():
      {this} toContextMenuMgr()
    DES:
      initialize ContextMenuMgr;
    } */
    toContextMenuMgr : function(){
      if(!this.iContextMenuMgr_initialized){
				this.initMapCM();
				this.initNodesCM();
				
				var ele = this.nodesCtnEle;
        if(WIN.isElement(ele)){
          EVT.observe(ele, "contextmenu", Function.bind(this._hndContextmenu_CMMgr, this) );
          EVT.observe(ele, "mousedown", Function.bind(this._hndMousedown_CMMgr, this) );
        }
        this.iContextMenuMgr_initialized = true;
      }
      return this;
    }
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);
