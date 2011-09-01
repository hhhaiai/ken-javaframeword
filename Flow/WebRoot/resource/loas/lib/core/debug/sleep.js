/***************************************************************
sleep.js
sleep script;required web server support;
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.debug.sleep");

/*
():
  {void} WIN.sleep({int} n)
DES:
  sleep some time in script;required web server support; here we use JSP server to sleep.we'll set the window.status to indicates sleep finish or failed!;
ARG:
  {int} n
	  seconds to sleep
*/
WIN.sleep = function(n){
  var url = WIN.sleep_server_filePath + n + "&random=" + Math.random();
	try{
    var req = RPC.xhr(url, {
      bAsync    : false,
      method    : "get"
		});
		window.status = "Sleep finished!";
	}catch(e){
		window.status = "Sleep failed!";
	}
};
WIN.sleep_server_filePath = require._rootUrl + "lib/core/util/sleep.jsp?t=";