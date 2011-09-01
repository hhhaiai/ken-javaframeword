/* mapMgr.js
*/
require.provide("sol.nodeMap.mgr.mapMgr");
require("lib.core.util.ObserverProvider");

namespace("NodeMap");

NodeMap.MapMgr = WIN.createClass(function(){
		this.maps = [];
  },{
    activeMap : null,
		mapContainer : null,
		
    initialize : function(options){
      WIN.extend(this, options);
			this.addObservers("onActiveChange");
			this.addListener("onActiveChange", Function.bind(this._hndActiveChange, this));
      return this;
    },
		
		appendChild : function(map){
			if(!(map instanceof NodeMap.BaseMap)){
				throw{
					description : this.toString + " -> addMap(): invalid map!"
				};
			}
			var maps = this.maps;
			if(!map.contains(map)){
				map.parent = this;
				maps.push(map);
				var ctn = this.mapContainer;
				if(WIN.isElement(ctn)) ctn.appendChild(map.dom);
			}
			return map;
		},
		removeChild : function(map){
			if(!this.hasChild(map)){
				throw{
					description : this.toString + " -> removeChild(): map isnt its child!"
				};
			}
			delete map.parent;
			this.maps.remove(map);
			if(WIN.isElement(this.mapContainer)) EL.removeNode(map.dom);
			return map;
		},
		hasChild : function(map){
			return (map && map.parent == this);
		},
		each : function(f, start, scope){
			Array.each(f, this.maps, start, scope || this);
			return this;
		},
		find : function(prop, value){
      var re = null;
			this.each(function(map){
				if(map[prop] == value){
					re = map;
					throw Object;
				}
			});
      return re;
		},
		
		setActive : function(map){
			if(!this.hasChild(map)) return false;
			var oActive = this.activeMap;
			if(oActive == map) return true;
			
			this.activeMap = map;
			this.fireObserver("onActiveChange", oActive);
			return true;
		},
		addActive : function(map){
			this.appendChild(map);
			return this.setActive(map);
		},
		hideMap : function(map){
			if(this.hasChild(map)){
				var ele = map.dom;
				EL.setStyle(map.dom, {display : "none"});
			}
		},
		showMap : function(map){
			if(this.hasChild(map)){
				var ele = map.dom;
				EL.setStyle(map.dom, {display : ""});
			}
		},
		
		
		_hndActiveChange : function(originActive){
			var active = this.activeMap;
			if(originActive)this.hideMap(originActive);
			this.showMap(active);
		},
		
    toString: function(){return "[object NodeMap.MapMgr]";}
  },
	WIN.ObserverProvider
);