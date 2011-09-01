/* iBgZoomable.js
*/
require.provide("sol.nodeMap.map.iBgZoomable");
require("lib.core.util.methodPool");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iBgZoomable
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
NodeMap.iBgZoomable = WIN.MethodPool.declare({
    zoomableBgCss : "mapBg",
		zoomableBgSrc : "",
		bgPosition : "",
		
		toBgZoomable : function(options){
			if(!this.iBgZoomable_initialized){
				/*WIN.extend(this, options);
				this._appendZoomableBg();
				this.addListener("onScaleChange", Function.bind(this._hndScaleChange_iBgZoomable, this));
				this.iBgZoomable_initialized = true;*/
			}
			return this;
		},
		
		_hndScaleChange_iBgZoomable : function(oScale){
			EL.setStyle(this.zoomableBgEle, {zoom : this.scale});
		},
		_appendZoomableBg : function(){
			var ele = this.zoomableBgEle = EL.c({
			  className : this.zoomableBgCss,
				src : this.zoomableBgSrc
			}, null, null, "img");
			var ctn = this.nodesCtnEle;
			if(ctn){
				ctn.appendChild(ele);
			}
		}
		
		
	}, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);