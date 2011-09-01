/* systemPathmapper.js
define common icon pathmapper;
*/
require.provide("app.gui.systemPathmapper");
require("lib.core.string.pathMapper");

namespace("GUI", {
	/*
	PROPERTY:
		{String.PathMapper} GUI.systemPathmapper
	DES:
		common icon pathmapper
	*/
	systemPathmapper : (function(){
		var theme = "default";//sys.getTheme() ? ;
		var iconRoot = require._rootUrl + "resouce/img/" + theme + "/gui/button/system/";
		var pm = new String.PathMapper(iconRoot);
		return pm;
	})()
});