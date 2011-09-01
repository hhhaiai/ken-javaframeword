/* engin.js
*/
require.provide("lib.core.debug.engin");
require("lib.core.debug.timer");
require("lib.core.debug.sleep");
require("lib.core.debug.console");
/*
extend WIN namespace functions
FUNCTION:
  {void} WIN._debug({string} debugInfo)
  {void} WIN._debugFn({function} fn[,{Error} e, {string} moreInfo])
  {void} WIN.assert({boolean expression} condition [,{string} message] [,{Error} Err])
  {void} dir({object} o);
  {string} WIN.getCallerBacktrack({function} fn)
  {void} getObjDetails({object} o);
	{void} WIN.loop({int} n);
*/
WIN.extend(WIN,{
  /*
  ():
    {void} WIN._debug({string} debugInfo [, {string} type])
  DES:
    output debug info,you should prepare a div and set the debugMode.
  ARG:
    {string} debugInfo
      info you want to output
		{string} type
		  (undefined) 
  */
  _debug    : function (debugInfo, type){
		return WIN.Console.debug(debugInfo, type);
  },
  /*
  ():
    {void} WIN._debugFn({function} fn[,{Error} e, {string} moreInfo])
  DES:
    debug a function by outputing its caller backtrack and error description.
  ARG:
    {function} fn
      function name that you're debuging
    {Error} e
      optional,
    {string} moreInfo
      options,
  */
  _debugFn  : function (fn,e,moreInfo){
    var debugInfo = "";
    var fnCaller = arguments.callee.caller;

    debugInfo += "FUNCTION:<b style='color:red'>" + fn +  "</b><br />";
    if(fnCaller){debugInfo += WIN.getCallerBacktrack(fnCaller);}
    if(e){debugInfo += "<b>ERROR:</b>" + e + "->"+ e.description + "<br />";}
    if(moreInfo){debugInfo += "<b>MORE:</b>" + moreInfo;}
    WIN.debug(debugInfo + "<br />");
  },
  /*
  ():
    {void} WIN.assert({boolean expression} condition [,{string} message] [,{Error} Err])
  DES:
    assert condition to be true or throw new error;
  ARG:
    condition:
    message: error info to be throw
    Err: custom error obj
  */
  assert    : function (condition, message, Err){
    if (!condition) {
      throw new (Err || Error)(message || "Assertion failed.");
    }
  },
  createHtml: function (){
		var html = '<div id="debugLogBar" style="position:absolute;bottom:0px; z-index:11;left:0px;width:16px; height:140px; padding-top:60px;line-height:16px; background-color:#ccc; text-align:center;">≤‚ ‘–≈œ¢</div>'
		+ '<div style="position:absolute;bottom:0px; z-index:10;width:100%;height:200px;overflow:hidden; background-color:#eee; ">'
		+ '<div id="debugLog" style=" margin-bottom:10px; width:auto; height:200px; padding-left:20px;border-top:solid 1px #ccc;overflow:auto; " >'
		+ '</div></div>';
  },
  /*
  ():
		{void} WIN.dir({object} o);
  DES:
    output obj's details(a table return from WIN.getObjDetails)
  */
  dir  :function(o){
    WIN.debug(WIN.getObjDetails(o));
  },
  /*
  ():
    {string} WIN.getCallerBacktrack({function} fn)
  DES:
    return function caller backtrack
  */
  getCallerBacktrack:function (fn){
    var str = "";
    try{
      while(fn = fn.caller){
        str += "<b style='color:red'>Caller:</b>" + fn + "<br />";
      }
    }catch(e){}
    return str;
  },
  /*
  ():
    {void} WIN.getObjDetails({object} o);
  DES:
    return a table about the obj Property & Value
  */
  getObjDetails: function (o){
    var info = "<table border='1' style='border-collapse:collapse' ><thead><caption>" 
						 + (o ? (o.toString ? o.toString(): o) : "undefined")
		         + "</caption><tr><th>Property</th><th>Value</th></tr></thead>";
		if(WIN.isArray(o)){
			for(var i=0; i<o.length; i++){
				info += "<tr><td>" + i + "</td><td>" + o[i] + "</td></tr>";
			}
		}
		else{
			for(var i in o){
				info += "<tr><td>" + i + "</td><td>" + o[i] + "</td></tr>";
			}
		}
    info += "</table>";
    return info;
  },
  /*
  ():
    {void} WIN.loop({int} n);
  DES:
    create new object for (n * 1000) times;
  */
	loop : function(n){
		if(isNaN(n))return;
		for(var i=0; i< (n * 1000); i++){
			var o = {};
		}
	},
	unknown: null
});
