/* iZoomable.js
*/
require.provide("sol.nodeMap.map.iZoomable");
require("lib.core.util.methodPool");

namespace("NodeMap");
/* {
MPOOL:
  NodeMap.iZoomable
DES:
  map zoom display;
REQUIRE:
  {NodeMap.BaseMap} this
PROPERTY:
  {__datatype} __property_name
    __decription
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
NodeMap.iZoomable = WIN.MethodPool.declare({
    scale : 1,
		zoomStep : 0.2,
		miniScale : 0,
		maxiScale : 5,
		onMiniScale : null,
		onMaxiScale : null,
		
    setScale : function(scale){
			var mini = this.miniScale || this._getMiniScale() || 1,
					maxi = this.maxiScale;
			if(scale < mini){
				scale = mini;
			}
			else if(scale > maxi){
				scale = maxi;
			}
			if(scale == this.scale)return this;
			var l, t,
					oScale = this.scale,
					zoom = scale/oScale,
					w = this.getWidth() * zoom,
					h = this.getHeight() * zoom;
			this.scale = scale;
			this.each(function(node){
			  if(node instanceof NodeMap.LinkableNode){
					l = node.left * zoom,
					t = node.top * zoom;
					node.setLeft(l);
					node.setTop(t);
				}
			});
			this.setHeight(h);
			this.setWidth(w);
			return this;
		},
		
    zoomIn : function(value){
			return this._zoom("in", value);
		},
    zoomOut : function(value){
			return this._zoom("out", value);
		},
    fullSize : function(){
			return this.setScale(1);
		},
    fitHeight : function(){
			this._fitMapSize("height");
		},
    fitWidth : function(){
			this._fitMapSize("width");
		},
		bestFit : function(){
			var s = this._getMiniScale();
			this.setScale(s);
		},		
		
		_zoom : function(type, value){
			var	scale = this.scale,
					step = this.zoomStep;
			if(type == "in"){
				scale += isNaN(value) ? step : value;
			}
			else if(type == "out"){
				scale -= isNaN(value) ? step : value;
			}
			return this.setScale(scale);
		},
    _fitMapSize : function(type){
			var ele = this.dom;
			if(WIN.isElement(ele) && String.notEmpty(type)){
				var cType = String.capitalize(type),
						offSize = ele["offset" + cType],
						ie = BROWSER.IE,
						extra = ie ? offSize/3 : 0,
						size = (this["get" + cType]()/ this.scale) - extra ;
				var scale = offSize / size;
				this.setScale(scale);
			}
		},
		_getMiniScale : function(){
			var m = 0, ele = this.dom;
			if(WIN.isElement(ele)){
				var offsetWidth = ele.offsetWidth,
						offsetHeight = ele.offsetHeight,
						ie = BROWSER.IE,
						extraW = ie ? offsetWidth/3 : 0,
						extraH = ie ? offsetHeight/3 : 0,
						width = (this.getWidth() / this.scale) - extraW,
						height = (this.getHeight() / this.scale) - extraH,
						wScale = offsetWidth / width,
						hScale = offsetHeight / height;
				m = Math.min(wScale, hScale);
			}
			return m;
		}
		
	}, function(obj){
    if(!(obj instanceof NodeMap.BaseMap) )return false;
    return true;
  }
);