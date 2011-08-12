/**
 * @fileOverview  Encapsulate tree model for convenience.
 */
/*
rl.provided("nf:treeNav");
*/
rl.importJs("lib.data.XJSON");
rl.importJs("lib.rpc.engine");
rl.importJs("lib.rpc.XHRequest");
rl.importJs("gui.box.body");
rl.importJs("gui.Iframe");
rl.importJs("gui.tree.Tree");
rl.importJs("gui.menu.PopupMenu");

//update page title and icon on sub page(main) property change.
rl.page.on("subpagepropertychange", function(pageElement, 
											 property, value, oValue){
	if(!rl.isNonNullStr(property)) return ;
	property = property.toLowerCase();
	
	if(property == "icon"){
		var defIcon = rl.page.defaultPageIcon || "",
			categoryIcon = nf.subpageCategoryIcon;
		
		if(String(value) === defIcon &&
		   rl.isNonNullStr(categoryIcon)){
			value = categoryIcon;
		}
	}else if(property === "status"){
		rl.debug('value = ' + value + '');
		if((value==="unload") || (value==="init")){
			value = rl.page.defaultPageLoadingIcon;
			property = "icon";
		}else if(value === "load"){
			value = categoryIcon;
			property = "icon";
		}
	}
	
	var m = "set" + property.capitalize();
	if(value && rl.isFunction(rl.page[m])) rl.page[m](value);
});

var mainFrame = new rl.gui.Iframe;
var menuTree = new rl.Tree({
	autoPrefixId : false,
	iniOpenTo : nf.config.menuTreeIniOpenTo,
	iconRoot : nf.config.menuTreeIconRoot,
	actionDataRoot : nf.config.menuTreeActionDataRoot,
	deferRenderNodes : false,
	orderBranchesFirst : false,
	autoRenderOnReady : false,
	lazyRender:true,
	dataSource : null,
	/*contextmenu : new rl.gui.menu.PopupMenu({
		items : [
			{
				text : "打开",
			 	action : function(evt){
					var item = menuTree.cus_contextNode;
					rl.debug('item = ' + item);
					if(item){
						menuTree.openTo(item);
					}
				 }
			},
			{
				text : "在新标签中打开",
				action : function (evt){
					return nf.openAtTopTab("../admin/userList.jsp", "userList");
					var name, url,
						item = menuTree.cus_contextNode;
					
					if(item){
						//use url as name;
						url = name = rl.rpc.appendUrlRandom(item.actionData, null);
						nf.openAtTopTab(url, name);
					}
				}
			}
		]
	}),*/
	action : function(itemData, item){
		var data = item.actionData;
		if(!rl.isNonNullStr(data)) return;
		url = rl.rpc.appendUrlRandom(data, null);
		
		mainFrame.open(url);
		
		rl.page.setTitle(item.text);
		rl.page.setIcon(rl.page.defaultPageLoadingIcon);
		//cache category icon, because so far we havenot provide
		//page icon in every pages.
		nf.subpageCategoryIcon = item.icon;
	},
	xjsonItemName : "item"
});

menuTree.on("render", function(){
	menuTree.dw.on("contextmenu", function(evt){
		var menu = this.contextmenu;
		menu.showAtEvent(evt);
		rl.ew.stopDefault();
		menuTree.cus_contextNode = menuTree.getNodeByEvent(evt);
		
	}, menuTree);	
});

rl.body.layoutConfig = {
	west : {
		iniSize : 180,
		comp : menuTree
	},
	center : {
		comp : mainFrame
	}
};


rl.onReady(function(){
	var xhr = new rl.rpc.XHRequest({
		url : nf.config.urlOfSysMenu,
		responseType : "xml",
		method : "get",
		async : true,
		successHandler : function(rspContent, response){
			var ds = rl.toXjson(rspContent);
			rl.debug(this + ' ds = ' + ds + '');
			
			if(!rspContent || rspContent.nodeType ===9){//error response
				var msg,
					rsp = response.responseText;
				
				msg = "加载模块菜单出错:\n 服务器处理菜单数据发生错误！";
				alert(msg);
				
				return ;
			}
			
			menuTree.dataSource = ds;
			rl.body.render();
		},
		
		failureHandler : function(){
			alert("加载模块菜单出错:" + nf.failureRequestMsg);
		}
	});
	xhr.request();
});

