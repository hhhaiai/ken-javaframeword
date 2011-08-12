/**
 * @fileOverview App main ui.
 */
/**
rl.provided("nf:mui");
*/

rl.importJs("lib.rpc.engine");
rl.importJs("gui.dialog.Dialog");
rl.importJs("app.opoa.mui.Muqtle");

(function(){
var muiInited,
	config = nf.config,
	muiConfig = {
		m : {//sys menu
			action : function(){},
			items : []
		},
		
		u : {//user name ctrl
			text : config.userName || "",
			tip : "打开我的帐户",
			icon : nf.mapIcon("user.gif"),
			action : function(){}
	
		},
		
		q : {//quick access bar
			action : function(){},
			items : []
		},
		
		t : {//tabpanel
			
		},
		
		l : {//logo ctrl
			
		},
		
		e : {//exit ctrl
			tip : "注销",
			action : function(){
				alert("Logout success!");
			}
		}
	};

nf.initMui = function (){
	if(muiInited) return;
	rl.page.setWindowsMgr(rl.gui.dialog.dialogMgr);
	rl.page.setTabsMgr(rl.gui.tab.tabFrameMgr);	
	
	nf.mui = new rl.opoa.mui.Muqtle(muiConfig);
	rl.gui.tab.tabFrameMgr.tabPanelProxy = nf.mui.tabPanel;
	
	openStartUp();
	Function.delay(function(){
		loadSysMenuData();
	}, 1000);
	
	muiInited = true;
}

function loadSysMenuData(){
	var url = config.urlOfSysMenuData;
	if(!rl.isNonNullStr(url)) return;
	var menu = nf.mui.menu,
		o = {
			async : true,
			method : "get",
			onSuccess : function(response){
				try{
					var text = response.responseText;
					var items = eval("([" + text + "])");
					menu.loadItemNodes(items);
				}catch(e){
					rl.dir(e, "loadSysMenuData error");
					o.onFailure(response);
				}
			},
			onFailure : function(response){
				menu.dw.setInnerHTML('加载菜单数据出错');
			}
		};
	rl.rpc.xhr(url, o);
}

function openStartUp(){
	rl.page.openTab(config.urlOfHomepage, "homepage", { text: "首 页", closable : false});
	Array.each(function(action){
		try{
			if(rl.isFunction(action)){
				action();
			}else if(rl.isNonNullStr(action)){
				eval(action);
			}
		}catch(e){rl.dir(e, "Startup action error!");}
	}, config.startupActions);
}

})();

rl.onCssReady(function(){
	nf.initMui();
});
