/***************************************************************
asyncXhr.js
define asynchornic request;
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.rpc.util.asyncXhr");

/*
NAMESPACE extend :
  RPC
DES:
  provide util for asynchornic xmlhttp request ;
FUNCTION:
  {xmlHttpRequest} RPC.onResponseText({string} url, {function} handler [,{object} options])
  {xmlHttpRequest} RPC.onResponseXml({string} url, {function} handler [,{object} options])
  {xmlHttpRequest} RPC.onResponseJson({string} url, {function} handler [,{object} options])
*/
WIN.extend(RPC, function(){
  /*
  ():
    {xmlHttpRequest} req({string} type, {string} url ,{function} handler [,{object} options])
  DES:
    send and return a async xmlHttp request.
  */
  var r = function(url, handler, options){
    var o = WIN.extend(options, {
      bAsync : true,
      onSuccess : handler
    });
    return RPC.xhr(url, o);
  };
  return {
    /*
    ():
      {xmlHttpRequest} RPC.onResponseText({string} url, {function} handler [,{object} options])
    ARG:
      {function} handler
        handle success request' responseText;
    */
    onResponseText : function(url, handler, options){
      var h = function(req){handler(req.responseText);};
      return r(url, h, options);
    },
    /*
    ():
      {xmlHttpRequest} RPC.onResponseXml({string} url, {function} handler [,{object} options])
    ARG:
      {function} handler
        handle success request's responseXML;
    */
    onResponseXml : function(url, handler, options){
      var h = function(req){handler(req.responseXML);};
      return r(url, h, options);
    },
    /*
    ():
      {xmlHttpRequest} RPC.onResponseJson({string} url, {function} handler [,{object} options])
    ARG:
      {function} handler
        handle success request's response json;
    */
    onResponseJson : function(url, handler, options){
      var h = function(req){handler(eval("(" + req.responseText + ")") );};
      return r(url, h, options);
    }
  };
}());


