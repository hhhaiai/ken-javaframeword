/**
 * @fileOverview App page inc, reg and import common resources.
 */
/**
rl.provided("nf:pageInc");
*/
rl.importJs("lib.util.PathMapping");
rl.importJs("gui.engine");
rl.importJs("gui.ctype2Modules");
rl.importJs("app.opoa.page");

/**
 * Create project ns and defines configs.
 */
rl.createNamespace("nf", {
	jsRoot : "../../nf/",
	
	cssRoot : "../../../css/",
	
	iconRoot : "../../../image/icons/",
	
	failureRequestMsg : "无法连接服务器，\n请检查网络连接和服务器！",
	
	failureRequestHandler : function(){
		alert(nf.failureRequestMsg);
	}
});

/**
 * Returns icon physical src;
 * @param {String} path Img src relative to directory of project icon root;
 * @return {String}
 */
nf.mapIcon = function(){
	var pm = new rl.util.PathMapping(rl.mapPath(nf.iconRoot));
	
	return Function.bind(pm.mapping, pm);
}()
rl.regJsRoot("nf", nf.jsRoot);
rl.regCssRoot("nf", nf.cssRoot);
rl.importCss("nf:page_inc");

