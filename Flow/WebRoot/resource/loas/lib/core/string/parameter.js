/***************************************************************
parameter.js
methods to parse parameter string
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.string.parameter");
/*
Extend NAMESPACE:
  String
FUNCTION:
*/

/*
():
  {object} String.parseKVString({string} kvString, {string} paramSep, {string} kvSep)
DES:
  parse string like "key1=value1&key2=value2" to a obj;,here we call it kvString means key value string.all key and value will transform to lowercase;
ARG:
  {string} kvString
	  string that 
	{string} paramSep
	  (optional,default is "&") separator bt kvString, like "&";
	{string} kvSep
	  (optional,default is "=") separator bt key and value, like "=";
*/
WIN.extend(String,{
	parseKVString: function(kvString, paramSep, kvSep){
		if(!String.notEmpty(kvString))return null;
		if(!String.notEmpty(paramSep))paramSep = "&";
		if(!String.notEmpty(kvSep))kvSep = "=";
		kvString = kvString.toLowerCase().replace(/ /ig,"" );
		var P = {toString:function(){return "[Object kvStringInfo]";}}, key, value;
		Array.each(function(i){
			i = i.split(kvSep);
			key = i[0];
			if(!key)return ;
			value = i[1];
			P[key] = value;
		}, kvString.split(paramSep));
		return P;
	}
});
