/* Enumerable.js
define layout panel
*/
require.provide("lib.core.util.Enumerable");

WIN.Enumerable = {
	each : function(f, start, scope){
		var item = start || this.firstChild;
		try{
			while(item){
				f.call(scope || this, item);
				item = item.nextSibling;
			}
		}catch(e){
			if(e != Object)throw e;//break
		}
	},
	every : function(f, start, scope){
		var item = start || this.firstChild;
		while(item){
			if(!f.call(scope || this, item)){ return false;}
			item = item.nextSibling;
		}
	},
	some : function(f, start, scope){
		var item = start || this.firstChild;
		while(item){
			if(f.call(scope || this, item)){ return true;}
			item = item.nextSibling;
		}
		return false;
	},
	select : function(f, start, scope){
		var item = start || this.firstChild;
		var res = [];
		while(item){
			if(f.call(scope || this, item)){ res.push(item);}
			item = item.nextSibling;
		}
		return res;
	},
	toString : function(){
		return "[object WIN.Enumerable]";
	}
};