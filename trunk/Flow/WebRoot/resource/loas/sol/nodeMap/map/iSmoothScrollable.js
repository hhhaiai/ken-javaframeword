/* iSmoothScrollable.js
*/
require.provide("sol.nodeMap.map.iSmoothScrollable");
require("lib.core.util.methodPool");
require("app.bhv.ani.propertyANI");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iSmoothScrollable
DES:
  auto scrollable mechanism for a map;
REQUIRE:
  {NodeMap.BaseMap} this
PROPERTY:
  {__datatype} __property_name
    __decription
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
NodeMap.iSmoothScrollable = WIN.MethodPool.declare({
		enableAnimation : true,
		aniEquation : BHV.ANI.cos_pow3,
		aniTotalTime : 300,
		aniInterval : 10,
		scrollTo : function(left, top, callback){
			var ele = this.dom;
			if(WIN.isElement(ele)){
				if(this.enableAnimation){
					var ani = this.scrollANI;
					if(callback)ani.onStop = callback;
					ani.aniTo({scrollLeft : left, scrollTop : top});
				}
				else{
					ele.scrollLeft = parseInt(left);
					ele.scrollTop = parseInt(top);
				}
			}
			return this;
		},
		scrollToCenter : function(nodeId){
			var node = this.find(nodeId);
			return this.scrollToChild(node);
		},
		scrollChildToCenter : function(node, callback){
			if(this.hasChild(node) && (node instanceof NodeMap.BaseNode)){
				var l, t,
						xy = this.getNodeCenterXY(node),
						ele = this.dom;
				if(xy){
					l = xy.x - ele.offsetWidth/2 ;
					t = xy.y - ele.offsetHeight/2 ;
					this.scrollTo(l, t, callback);
				}
			}
			return this;
		},
		_disposeSmoothScrollable : function(){
			var ani = this.scrollANI;
			if(ani) delete ani.target;
		},
		toSmoothScrollable : function(){
			if(!this.iAutoScrollable_initialized){
				var ele = this.dom;
				this.scrollANI = (new BHV.ANI.PropertyAnimation).initialize({
					target : ele,
					equation : this.aniEquation,
					totalTime : this.aniTotalTime,
					interval : this.aniInterval
				});
				this.iAutoScrollable_initialized = true;
				this.addListener("onBeforeDispose", Function.bind(this._disposeSmoothScrollable, this));
			}
			return this;
		}
  }, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);