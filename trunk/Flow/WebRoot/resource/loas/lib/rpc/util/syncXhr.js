/***************************************************************
syncXhr.js
define synchornic request;
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.rpc.util.syncXhr");

/*
NAMESPACE extend :
  RPC
DES:
  provide util for synchornic xmlhttp request ;
FUNCTION:
  {string} RPC.getResponseText({string} url [, {object} options])
  {string} RPC.getResponseXml({string} url [, {object} options])
  {object} RPC.getResponseText({string} url [, {object} options])
	{boolean} RPC.confirmResponse({string} url , {string} text)
*/
WIN.extend(RPC, function(){
  /*
  ():
    {xmlHttpRequest} getRsp({string} type, {string} url ,{function} handler [,{object} options])
  DES:
    get a async xmlHttp request's response text or xml.
  */
  var getRsp = function(type, url, options){
    var o = WIN.extend({
      method : "get",
      listen : false,
      cache : false
    }, options);
    o.bAsync = false;
    var req =  RPC.xhr(url, o);
    return req[type];
  };
  return {
    /*
    ():
      {string} RPC.getResponseText({string} url [, {object} options])
    ARG:
      {object} options
        see also RPC.xhr;
    */
    getResponseText : Function.curry(getRsp, "responseText"),
    /*
    ():
      {string} RPC.getResponseXml({string} url [, {object} options])
    */
    getResponseXml : Function.curry(getRsp, "responseXML"),
    /*
    ():
      {string} RPC.getResponseJson({string} url [, {object} options])
    */
    getResponseJson : function(url, options){
      return eval( "(" + getRsp("responseText", url, options) + ")");
    },
    /*
    ():
      {boolean} RPC.confirmResponse({string} url , {string} text)
    */
    confirmResponse : function(url, text){
			try{return (String.trim(RPC.getResponseText(url)) == text);}catch(e){return false;}
    }
  };
}());
