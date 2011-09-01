/* mainLayout.js
*/
require.provide("sv.common.layout.mainLayout");
require("app.gui.layout.tblrLayout");
require("sv.common.layout.cfg");

(function(){
	var cfg = SV.Config,
			module = cfg.layoutModuleName;
	try{
		require(module);	
	}catch(e){
		throw {description : "Error: cant load module: " + module};
	}
		SV.mainLayout = (new cfg.layoutType).initialize({
			topPanelHeight : cfg.toolBarPanelHeight,
			leftPanelWidth : cfg.sideBarPanelWidth,
			leftPanelBg : cfg.sideBarPanelBg,
			initContentUrl : cfg.contentStartUrl,
			isFrameContent : cfg.isFrameContent
		});
})();

