/* KVSet.js
KVSet
*/
require.provide("lib.core.util.KVSet");
var KVSet = WIN.createClass(function(){
		this._items = [];
  },{
    indexOf : function(key){
			var k, 
					ind = -1,
					items = this._items;
			Array.each(function(item, index){
			  k = item.key;
				if(k == key){
					ind = index;
					throw Object;
				}
			}, items);
			return ind;
    },
    contains : function(key){
      return (this.indexOf(key) > -1);
    },
    find : function(key){
			var ind = this.indexOf(key),
					items = this._items;
      if(ind > -1)return items[ind];
			return null;
    },
    each : function(f, scope, start){
      var items = this._items;
			Array.each(function(item, index){
			  f.call(scope, item.value, index, items);
			}, items, start);
      return this;
    },
    filter : function(f, scope, start){
      var v,
					res = [],
					items = this._items;
			Array.each(function(item, index){
			  v = item.value
				if(f.call(scope, v, index, items)) res.push(v);
			}, items, start);
			return res;
    },
    add : function(key, value){
			var ind = this.indexOf(key),
					items = this._items,
					item = {key : key, value : value};
			if(ind > -1) items[ind] = item;
			else items.push(item);
      return item;
    },
    remove : function(key){
			var item = this.find(key);
			if(item) return items.remove(item);
			return null;
    },
    toString: function(){return "[object KVSet]";}
  }
);
