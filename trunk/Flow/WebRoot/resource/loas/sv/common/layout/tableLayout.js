/* tableLayout.js
*/
require.provide("sv.common.layout.tableLayout");
require("app.gui.layout.tableLayout");
require("sv.common.layout.cfg");

EVT.domLoadedObserver.add(function(){
  var p = new GUI.LR_TableLayout,
			cfg = SV.Config;
	p.initialize({
		initContentUrl : cfg.contentStartUrl ,
		leftPanelWidth : cfg.sideBarPanelWidth,
		leftPanelTitle : cfg.resTreeTitle,
		treeDataXml : cfg.resTreeDataUrl,
		treeXmlFieldMapping : cfg.resTreeXmlFieldMapping
	});
});
