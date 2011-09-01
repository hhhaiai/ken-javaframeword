/* resTree_tblr.js
*/
require.provide("sv.common.layout.resTree_tblr");
require("app.gui.layout.collapsablePanel");
require("app.gui.tree.tree");
require("lib.rpc.util.asyncXhr");
require("sv.common.layout.mainLayout");

SV.mainLayout.onReady(function(){
  var panel = new GUI.Layout.CollapsablePanel,
			l = SV.mainLayout,
			cfg = SV.Config;
	panel.initialize({
		title : cfg.resTreeTitle,
		autofitPanelHeight : function(){
			this.setHeight(SV.mainLayout.leftPanel.dom.offsetHeight - 10);
		}
	});
	l.insertCP(panel);
	SV.tree = (new GUI.Tree).initialize({
		container : panel.contentEle,
		nodeAction : function(actionData, node){
			SV.mainLayout.open(actionData);
		}
	});
	RPC.onResponseXml(cfg.resTreeDataUrl, function(xmlDoc){
		SV.tree.loadXmlData(xmlDoc, cfg.resTreeXmlFieldMapping);
	});
	SV.mainLayout.leftPanelHeightObserver.add(function(){
		panel.autofitPanelHeight();
	});
});
