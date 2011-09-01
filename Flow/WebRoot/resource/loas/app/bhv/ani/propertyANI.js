/* propertyANI.js
*/
require.provide("app.bhv.ani.propertyANI");
require("app.bhv.ani.engin");

BHV.ANI.PropertyAnimation = WIN.createClass(function(){
  
  }, {
    target : null,
		reNoUnit : /scroll|opacity/i,
		transformation : function(){
			var k, v, o,
					target = this.target,
					list = this._aniList;
			Array.each(function(i, index){
				k = list[index];
				o = this["_origin_" + k];
				v = o + i;
				if(!this.reNoUnit.test(k))v =  EL.parseUnit(o + i);
				target[k] = v;
			}, arguments, 0, this);
		},
    aniTo : function(props){
			if(!(this.target && props)) return ;
			var v, o,
					arg = [],
					list = this._aniList = [],
					target = this.target;
			for(var i in props){
				o = this["_origin_" + i] = parseFloat(target[i]);
				v = parseFloat(props[i]) - o;
				if(v == 0)continue ;
				arg.push(v);
				list.push(i);
			}
			if(arg.length > 0) return this.run.apply(this, arg);
		},
    toString : function(){return "[object BHV.ANI.PropertyAnimation]";}
  },
	BHV.ANI.BaseAnimation
);