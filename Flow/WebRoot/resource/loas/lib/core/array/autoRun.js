/* autoRun.js
*/
require.provide("lib.core.array.autoRun");

/* {
():
  {void} Array.autoRun({array} sequence [, {object} scopes, {number} delay, {int} start])
DES:
  delay to call each function in sequence;
ARG:
  {array} sequence
	  list of functions;
	{object} scopes
	  (null) scopes for each function; its property name correspond to the function sequence index;
		you can set a common scope for them; if scope is null, you should specify in scopes;
		e.g.
		{
			"0" : obj0, // scope for the function whose index is 0 in sequence;
			"2" : obj2, // scope for the function whose index is 2 in sequence;
			"3" : null, // set it to null, 
			common : obj //common scope for all;
		}
	{number} delay
	  (1) delay time, it should be greater than 0;
	{int} start
	  (0) sequence start;
} */
Array.autoRun = function(sequence, scopes, delay, start){
	if(!(sequence))return ;
	var f, scope, timer,
			i = isNaN(start) ? 0 : ((start < 0) ? 0 : start),
			delay = isNaN(delay) ? 1 : ((delay <= 0) ? 1 : delay),
			scopes = scopes || {},
			len = sequence.length;
	timer = setInterval(function(){
		if(i >= len){
			clearInterval(timer);
		}
		else {
			f = sequence[i];
			if(!WIN.isFunction(f))return ;
			scope = scopes[i];
			if(scope !== null && !scope) scope = scopes.common;
			f.call(scope);
			i++;
		}
	},delay);
};
