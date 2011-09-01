/* filePathMapper.js
*/
require.provide("lib.core.string.filePathMapper");
require("lib.core.string.pathMapper");

String.FilePathMapper = WIN.createClass(
	function(url){
		url = this.url = String.notEmpty(path) ? path : location.href;
		this.ext = url.substring(url.lastIndexOf(".") + 1);
	},{
		map : function(url){}
	},
	String.PathMapper
);