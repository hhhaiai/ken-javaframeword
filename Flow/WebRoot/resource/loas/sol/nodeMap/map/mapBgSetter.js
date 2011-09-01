/* mapBgSetter.js
*/
require.provide("sol.nodeMap.map.mapBgSetter");
require("lib.core.util.methodPool");

namespace("NodeMap");
NodeMap.MapBgSetter = WIN.createClass(function(){
  },{
    map : null,
		bgSrc : "",
		nodeCss : "mapBg",
		bgPosition : "auto",// "streching", "center", "zoom";
		
		initialize : function(options){
      WIN.extend(this, options);
			var map = this.map;
			if(!(map instanceof NodeMap.BaseMap)) throw{
				description : this.toString() + " -> initialize(): invalid map!"
			};
			map.addListener("onResize", Function.bind(this._hndMapResize, this));
			this.build();
			this._updateBgPosition();
      return this;
    },
		build : function(){
			var map = this.map,
					ctn = map.nodesCtnEle;
			var ele = this.dom = EL.c({
			  className : this.nodeCss,
				src : this.bgSrc
			}, null, null, "img");
			if(ctn){
				ctn.appendChild(ele);
			}
			return this;
		},
		setBgPosition : function(value){
			var p = this.bgPosition;
			if(!String.notEmpty(value) || (value == p)) return this;
			
			this._updateBgPosition();
			
			this.bgPosition = value;
			return this;
		},
		
		_updateBgPosition : function(){
			this._resetBgStyle();
			var f = this["_" + this.bgPosition + "Bg"];
			if(WIN.isFunction(f)) f.call(this);
		},
		_centerBg : function(){
			var map = this.map;
			if(map instanceof NodeMap.BaseMap){
				var ele = this.dom,
						w = ele.offsetWidth,
						h = ele.offsetHeight,
						mapW = map.getWidth(),
						mapH = map.getHeight();
				if(mapW > w){
					EL.setStyle(ele, {left : EL.parseUnit((mapW - w)/2) });
				}
				if(mapH > h){
					EL.setStyle(ele, {top : EL.parseUnit((mapH - h)/2) });
				}
			}
		},
		_strechingBg : function(){
		},
		_zoomBg : function(){
			var map = this.map;
			if(map && map.scale) EL.setStyle(this.dom, {zoom : map.scale});
		},
		_resetBgStyle : function(){
			EL.setStyle(this.dom, {
				left : 0,
				top : 0,
				zoom : 1
			});
		},
		_hndMapResize : function(type, newValue, oldValue){
			this._updateBgPosition();
		},
		
    toString: function(){return "[object NodeMap.MapBgSetter]";}
  }
);
