/* engin.js
*/
require.provide("app.bhv.ani.engin");
namespace("BHV.ANI");
BHV.ANI.BaseAnimation = WIN.createClass(function(){
  
  }, {
    totalTime : 500,
		interval : 10,
		running : false,
		transformation : Function.empty,
		getOrigin : Function.empty,
		equation : Function.K,
		
		initialize : function(options){
      WIN.extend(this, options);
      return this;
    },
		getRuntime : function(currentTime, total){
			var totalTime = this.totalTime,
					eq = this.equation,
					value = (total/totalTime) * currentTime;
			value = eq(value, currentTime, totalTime, total);
			return value;
		},
		run : function(){
			if(this.running) this.stop();
			if(WIN.isFunction(this.getOrigin))this.getOrigin();
			var arg = arguments,
					totalTime = this.totalTime,
					currentTime = 0,
					interval = this.interval;
			
			this.aniTimer = setInterval(Function.bind(function(){
				if(totalTime < currentTime)return this.stop();
				var f = Function.bind(function(total){
				  return this.getRuntime(currentTime, total);
				}, this);
				var values = Array.map(f, arg, 0, this);
				this.transformation.apply(this, values);
				currentTime += interval;
			}, this), interval);
			
			this.running = true;
		},
		stop : function(){
			clearInterval(this.aniTimer);
			this.running = false;
			if(WIN.isFunction(this.onStop))this.onStop();
		},
    
    toString : function(){return "[object BHV.ANI.BaseAnimation]";}
  }
);

WIN.extend(BHV.ANI, {
	_sin : function(exponent, v, currentTime, totalTime, total){
		var s = ((Math.PI/2)/totalTime) * currentTime;
		var sined = Math.pow(Math.sin(s), exponent);
		return sined * v;
	},
	_cos : function(exponent, v, currentTime, totalTime, total){
		var s = ((Math.PI/2)/totalTime) * currentTime;
		var cosed = Math.pow(Math.cos(s), exponent);
		return (total - cosed *(total - v));
	},
	xy : Function.K
});
(function(){
	var ANI = BHV.ANI,
	    _sin = ANI._sin,
			_cos = ANI._cos,
			curry = Function.curry;
	WIN.extend(ANI, {
		sin : curry(_sin, 1),
		cos : curry(_cos, 1),
		sin_pow2 : curry(_sin, 2),
		sin_pow3 : curry(_sin, 3),
		cos_pow2 : curry(_cos, 2),
		cos_pow3 : curry(_cos, 3)
	});
})();
