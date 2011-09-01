/* SimpleTemplate.js
*/
require.provide("lib.core.util.SimpleTemplate");

WIN.SimpleTemplate = WIN.createClass(function(text){
		this.tpl = text;
  },{
		re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
		apply : function(values){
			return (this.tpl.replace(this.re, 
				function(m, m1) {
					var v = values[m1];
					if(v === undefined)v = "";
					return v;
				}
			));
		},
    toString: function(){return "[WIN.SimpleTemplate]";}
  }
);