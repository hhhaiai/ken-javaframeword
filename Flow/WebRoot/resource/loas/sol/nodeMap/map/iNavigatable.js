/* iNavigatable.js
*/
require.provide("sol.nodeMap.map.iNavigatable");
require("lib.core.util.methodPool");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iNavigatable
DES:
  map that with zoomable bg;
REQUIRE:
  {NodeMap.BaseMap} this
PROPERTY:
  {__datatype} __property_name
    __decription
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
NodeMap.iNavigatable = WIN.MethodPool.declare({
		navigatorMap : null,
		
		initNavigatorMap : function(){
			var navMap = this.navigatorMap;
			if(navMap instanceof NodeMap.BaseMap){
				navMap.navigatingMap = this;
				this.showNavMap();
			}
		},
		showNavMap : function(){
			var navMap = this.navigatorMap;
			if(navMap instanceof NodeMap.BaseMap){
				EL.setStyle(navMap.dom, {
					zIndex : 2,
					visibility : "visible"
				});
				EL.setStyle(this.dom, {
					zIndex : 1,
					visibility : "hidden"
				});
				this.navigatorShowing = true;
				this.fireObserver("onNavigatorShow");
			}
		},
		hideNavMap : function(){
			var navMap = this.navigatorMap;
			if(navMap instanceof NodeMap.BaseMap){
				EL.setStyle(navMap.dom, {
					zIndex : 1,
					visibility : "hidden"
				});
				EL.setStyle(this.dom, {
					zIndex : 2,
					visibility : "visible"
				});
				this.navigatorShowing = false;
				this.fireObserver("onNavigatorHide");
			}
		},
		
		back : function(){
			this.showNavMap();
		},
		goto : function(node){
			if(this.hasChild(node)){
				this.hideNavMap();
				this.standOut(node);
				this.lastViewingNode = node;
			}
		},
		forward : function(){
			this.goto(this.lastViewingNode);
		},
		getActiveMap : function(){
			return this.navigatorShowing ? this.navigatorMap : this;
		},
				
		toNavigatable : function(options){
			if(!this.iNavigatable_initialized){
				this.addObservers("onNavigatorShow", "onNavigatorHide");
				this.initNavigatorMap();
				this.iNavigatable_initialized = true;
			}
			return this;
		}
		
	}, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);