/***************************************************************
main.js
source flow client frame control;
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("sv.system.main");
require("sv.commonPages.md5");

namespace("SV", {
	activePageWindow : null,
	activePageBack : function(n){
		SV.activePageGo( - Math.abs(n));
	},
	activePageForward : function(n){
		SV.activePageGo(Math.abs(n));
	},
	activePageGo : function(which){
		PAGE_COMM.system.historyMgr.go(SV.tabPanel.activeItemName, which);
	},
	autoLoadResource: function(){
		//Array.intervalEach({function} f,{array} sequence, {int}t)
		Array.intervalEach(require, SV.modulesRequire, 300);
	},
	displayTopBarAndModuleMenu : function(display){
		var topBar = SV.ele.topBar, moduleMenu = SV.ele.moduleMenu;
		var stl = {display : display};
		
		EL.setStyle(topBar, stl);
		EL.setStyle(moduleMenu, stl);//note:it should be before SV.updateComponentsHeight
		
		SV.updateComponentsHeight();
		SV.updateStandarToolBarWidth();		
		SV.updateTabPanelWidth();
	},
	/*
	():
		{int} SV.getFixedBarsHeight()
	DES:
		SV layout is form of 3 parts:topBar , mainWrap and statusBar; thereinto, the height of topBar and statusBar is fixed while mainWrap's height is alterable; when window resize, we need to reset mainWrap height;
	*/
	getFixedBarsHeight:function(){
		var h = 0;
		var topBar = SV.ele.topBar, statusBar = SV.ele.statusBar;
		if(WIN.isElement(topBar) && topBar.style.display != "none")h += parseInt(topBar.style.height);
		if(WIN.isElement(statusBar) && statusBar.style.display != "none")h += parseInt(statusBar.style.height);
		return h;
	},
	hndOC_separator : function(evt){
		evt = EVT.getEvt();
	  SV.toggleModuleMenuDisplay();
		EVT.cancelB();
	},
	hdnOMD_splitBar : function(evt){
	  var ele = this, moduleMenu = SV.ele.moduleMenu;
		if(!WIN.isElement(moduleMenu))return;
		var menuStyle = moduleMenu.style;
		if(menuStyle.display == "none"){
		  menuStyle.display = "";
		  menuStyle.width = EL.parseUnit( SV.userConfig.moduleMenu.minWidth);
			SV.updateTabPanelWidth();
		}
		evt = EVT.getEvt();
		if(!(evt.button == 1 || evt.button == 0))return;
		
		var d = document, x_,
				moduleMenu = SV.userConfig.moduleMenu, 
				minW = moduleMenu.minWidth, maxW = moduleMenu.maxWidth;
		EVT.observe(d,'mousemove', _inFmove,true);
		EVT.observe(d,'mouseup', _inFup,true);
		if (ele.setCapture) ele.setCapture(); 
		
		EVT.cancelB();
		function _inFmove(evt){
			x_ =evt.clientX;
			if(x_ > minW && x_ < maxW){	
				menuStyle.width = x_ + "px";
				SV.updateTabPanelWidth();
			}
			EVT.cancelB();
		};
		function _inFup(){
			EVT.stopObserving(d,'mousemove', _inFmove,true);
			EVT.stopObserving(d,'mouseup', _inFup,true);
			if(ele.releaseCapture) ele.releaseCapture(); 
			EVT.cancelB();
		};
	},
	hndOL_require : function(){},
	hndOS_require : function(){},
	hndOF_require : function(){},
	hndOUL_window : function(evt){
		if(!SV.logout.isNormalExit){
			SV.logout.onExit();
		}
	},
	/*
	():
		{void} SV.hndOAPC_setHistoryBtnsEnable()
	DES:
		hnd for active page change(APC) to setHistoryBtnsEnable
	*/
	hndOAPC_setHistoryBtnsEnable: function(){
		try{
			var history = PAGE_COMM.system.historyMgr.get(SV.tabPanel.activeItemName);
			var bar = SV.standardToolbar.bar;
			var backBtn = bar.getItem("back");
			var forwardBtn = bar.getItem("forward");
			if(history.previous)backBtn.enable();
			else backBtn.disable();
			if(history.next)forwardBtn.enable();
			else forwardBtn.disable();
		}catch(e){};
	},
	hndOAPC_setProgressBarDisplay : function(){
		var win = SV.activePageWindow;
		if(!win)return ;
		
		var page = win.page;
		var pro = page ? page.getProgress() : win.__progress_onRequstSend;
		var pb = SV.progressBar;
		if(pro == 100)pb.hide();
		else{
			pb.setValue(pro);
			pb.show();
		}
	},
	hndOAPC_setSystemStatus : function(){
		var win = SV.activePageWindow;
		if(!win)return ;
		
		var page = win.page;
		var s = page ? page.getStatus() : win.__status_onRequstSend;
		SV.showSystemStatus(s);
	},
	/*
	():
		{void} SV.initDomReference()
	DES:
		init layout elements Dom Reference after dom loaded;
	*/
	initDomReference: function(){
	  if(!SV.ele)SV.ele = {};
		var id = SV.systemConfig.layout.containersId;
		WIN.extend(SV.ele,{
			contentWrap     : $(id.contentWrap),
			moduleMenu      : $(id.moduleMenu),
			progressBar     : $(id.progressBar),
			separator       : $(id.separator),
			splitbar        : $(id.splitbar),
			systemStatus    : $(id.systemStatus),
			systemTray      : $(id.systemTray),
			standardToolbar : $(id.standardToolbar),
			statusBar       : $(id.statusBar),
			tabPanel        : $(id.tabPanel),
			topBar          : $(id.topBar),
			unknown			    : null
		});
	},
	initHelpMenu : function(){
		var PMI = GUI.PopupMenuItem;
		var b1 = (new PMI).initialize("", SV.showHelp, "SourceFlow 2.0 帮助");
		var b2 = (new PMI).initialize("", SV.showAboutMore, "更多阳光耐特软件");
		var b3 = (new PMI).initialize("", SV.showAbout, "关于 SourceFlow");
		var cm = SV.helpMenu = (new GUI.PopupMenu).initialize();
		cm.addItem("item1", b1);
		cm.addItem("item2", b2);
		cm.addSeparator(2);
		cm.addItem("item2", b3);
	},
	initModuleMenu: function(){
		var mm = SV.moduleMenu = new GUI.AccordionMenu();
		mm.initialize({
			container : SV.ele.moduleMenu,
			cmdRender : function(url){
				return "SV.openTab('" + url + "')";
			}
		});
		mm.laodItemsXMLData(SV.systemConfig.dataSource.moduleMenuItemsData);
	},
	initProgressbar : function(){
		var pb = SV.progressBar = new GUI.ProgressBar();
		pb.initialize({
			container : SV.ele.progressBar,
			showText  : false
		});
	},
	initPAGE_COMM: function(){
		var sys = PAGE_COMM.system;
		sys.initialize(SV.tabPanel, GUI.windowMgr);
		sys.beforePageInitObserver.add(SV.hndOAPC_setHistoryBtnsEnable);
		sys.onPageProgressChange = function(pageCommId, value){
			if(!String.notEmpty(pageCommId))return ;
			var act = SV.tabPanel.activeItemName;
			if(pageCommId == act){
				var pb = SV.progressBar;
				pb.setValue(value);
				pb.show();
			}
		};
		sys.onPageStatusChange = function(pageCommId, value){
			if(!String.notEmpty(pageCommId))return ;
			var act = SV.tabPanel.activeItemName;
			if(pageCommId == act){
				SV.showSystemStatus(value);
			}
		};
		sys.pageFocusObserver.add(GUI.PopupMenu.hideLast);
		sys.onCloseTab = function(pageCommId){
			var pb = SV.progressBar;
			pb.hide();
			SV.showSystemStatus("");
		};
		sys.onOpenNewTab = function(pageCommId, title, url){
			var win = sys.getPageWindow(pageCommId);
			//alert(pageCommId + "|" +  title + "|" + url + "|" +  win);
			if(!win) return ;
			win.__progress_onRequstSend = 0;
			win.__status_onRequstSend = "等待" + (title || url);
			var pb = SV.progressBar;
			pb.setValue(0);
			pb.show();
			SV.showSystemStatus(win.__status_onRequstSend);
		};
	},
	/*
	():
		{void} SV.initSystem()
	DES:
		init system
	*/
	initSystem: function(){
		SV.initDomReference();
		
		SV.initProgressbar();
		SV.initSplitbar();
		SV.initSeparator();
		SV.initTabPanel();
		SV.initStandardToolbar();
		SV.initModuleMenu();
		SV.initHelpMenu();
		SV.initSystemTray();
		SV.initPAGE_COMM();

		SV.updateComponentsHeight();
		EVT.observe(window, "resize", SV.updateViewOnWindowResize);
		EVT.observe(window, "unload", SV.hndOUL_window);
	},
	initSystemTray: function(){
		var ele = SV.ele.systemTray;
		if(ele){
			var userName = SV.user.name;
			ele.innerHTML += userName;
			ele.title = userName;
		}
	},
	initTabPanel: function(){
		var tp = SV.tabPanel = new GUI.TabPanel();
		var tb = new GUI.TabBarMgr().initialize();
		var pb = new GUI.PanelBody().initialize({
			isIframe  : true
		});
		tp.initialize({
			container: SV.ele.tabPanel,
			head   : tb,
			body   : pb
		});
		var obv = tp.onActiveChangeObserver;
		obv.add(SV.setActivePageWindow);
		obv.add(SV.hndOAPC_setHistoryBtnsEnable);
		obv.add(SV.hndOAPC_setProgressBarDisplay);
		obv.add(SV.hndOAPC_setSystemStatus);
		try{
			var iconMaxiPanelHtml = "<img  class='gui_tabbarmgr_maximize_icon' title='最大化'   src='" + rootPath + "/resource/image/common/icon/maxiWindow.gif' onclick='SV.toggleMaxiContentArea(this);'  onmouseover='EL.setOpacity(this, 100);' onmouseout='EL.setOpacity(this, 80);' />";
			var iconMaxiPanel = EL.createElementsByHtml(iconMaxiPanelHtml)[0];
			EL.setOpacity(iconMaxiPanel, 80);
			tb.posWrapEle.appendChild(iconMaxiPanel);
			var iconCloseTabHtml = "<img  class='gui_tabbarmgr_closetab_icon' title='关闭全部标签'   src='" + rootPath + "/resource/image/common/icon/closeTab.gif' ondblclick='SV.tabPanel.closeAll();'  onmouseover='EL.setOpacity(this, 100);' onmouseout='EL.setOpacity(this, 80);' />";
			var iconCloseTab = EL.createElementsByHtml(iconCloseTabHtml)[0];
			EL.setOpacity(iconCloseTab, 80);
			tb.posWrapEle.appendChild(iconCloseTab);				
		}catch(e){};
	},
	initStandardToolbar: function(){
		var tb = SV.standardToolbar = new GUI.HorizontalMenu();
		var cfg = SV.systemConfig;
		tb.initialize({
			container : cfg.layout.containersId.standardToolbar
		});
		tb.loadItemsData(cfg.dataSource.standardToolbarItemsData);
	},
	initSplitbar: function(){
		var ele = SV.ele.splitbar;
		if(WIN.isElement(ele))	ele.onmousedown = SV.hdnOMD_splitBar;
	},
	initSeparator: function(){
		var ele = SV.ele.separator;
		if(WIN.isElement(ele)){
		  ele.onclick = SV.hndOC_separator;
			ele.onmousedown = EVT.cancelB;
		}
	},
	loadResource    : function(){
		Array.each(require, SV.modulesRequire);
	},
	login : {
	  check    : function(){
			var mainForm = document.forms["mainForm"];
			var userid = mainForm.userid.value;
			var password = mainForm.password.value;
			if(userid == ""){
				SV.login.showInfo("请输入用户名!", true);
			}
			else if(password == ""){
				SV.login.showInfo("请输入密码!", true);
			}
			else{
				SV.login.showInfo("正在验证...");
				password = gMD5(password);
				var url = "" + rootPath + "/manage/logService_logOn.action?user.userName=" + userid + "&user.password=" + password;
				RPC.xhr(url,{
					bAsync    : true,//是否为异步请求。
					onFailure : SV.login.onRequestFailed,
					onSuccess : SV.login.onRequestSuccess
				});
			}
			return false;//cancel form submit
		},
		cleanLoginArea : function(){
		  var loginArea = $("sv_login_area");
			loginArea.innerHTML = "";
			EL.removeNode(loginArea);
			loginArea = undefined;
		},
		handleFailedLogin : function(failInfo){
		  SV.login.showInfo(failInfo, true);
		},
		handleSuccessLogin: function(xmldoc){
			SV.systemConfig.dataSource.moduleMenuItemsData = xmldoc;
			setTimeout(SV.main, 10);
		},
		onRequestFailed : function(){
		  SV.login.handleFailedLogin("发送XmlHttp请求出错！<br />请检查网络连接和服务器!");
		},
		onRequestSuccess: function(req){
		  var xmldoc = req.responseXML;
			try{
				if(!xmldoc)throw{description : "load xml error !"};
				var loginStatus = xmldoc.getElementsByTagName("login")[0];
			}catch(e){
				SV.login.handleFailedLogin("加载登陆xml文件出错！");
				return ;
			};
			if(BROWSER.IE)loginStatus = loginStatus.text;
			else loginStatus = loginStatus.textContent;
			if(String.notEmpty(loginStatus) && loginStatus.toLowerCase() == "true"){
			  SV.login.showInfo("验证成功！");
				SV.user.name = document.mainForm.userid.value;
				SV.login.handleSuccessLogin(xmldoc);
			}
			else SV.login.handleFailedLogin("用户名和密码不正确！");
		},
		showInfo : function(html, showBackBtn){
			var tip = $("sv_login_control_tip");
			var backBtn = $("sv_login_control_back");
			
			tip.innerHTML = html;
			SV.login.switchFormAndInfoPanel();
			if(showBackBtn)backBtn.style.display = "";
			else backBtn.style.display = "none";
		},
		switchFormAndInfoPanel : function(showForm){
			function focusElement(ele){
				try{
					ele.focus();
					if(BROWSER.IE) setTimeout(ele.focus, 100);//setTimeout to fix ie6 bug,but ie7 still not work 
				}catch(e){};
			}
			var form = document.forms["mainForm"],formStl = form.style;
			var userid = form.userid;
			var password = form.password;
		  var ctrl = $("sv_login_control"), ctrlStl = ctrl.style,
			    backBtn = $("sv_login_control_back");
			if(showForm){
				formStl.display = "block";
				ctrlStl.display = "none";
				if(userid.value == "") focusElement(userid);
				else{
					password.value = "";
					focusElement(password);
				}
			}
			else{
				formStl.display = "none";
				ctrlStl.display = "block";
				
				focusElement(backBtn);
			}
		}
	},
	
	
	logout : {
		exit : function(){
			var logout = SV.logout;
		  if(confirm("确定退出 SourceFlow？")){
				try{
					logout.onExit();//push all things to SV.logout.exitObserver on exit pls;
				}catch(e){}
				logout.isNormalExit = true;//when window onunload we need to check whether it's normal exit or we call logout.onExit;
				logout.closeWin();
			}
		},
		closeWin : function(){
			window.onbeforeunload = Function.empty;
			if(BROWSER.IE){
				if(BROWSER.IEversion < 7){
					window.opener = self;
				}
				else window.open('','_parent','');
			}
			window.close();
		},
		exitObserver : new WIN.Observer,
		onExit : function(){
			SV.logout.exitObserver.execute();
		}
	},

	/*
	():
		{void} SV.main()
	DES:
		system main.
	*/
	main : function(){
		SV.showLoadInfo("正在加载脚本模块...");
		setTimeout(function(){
			SV.loadResource();
			SV.showLoadInfo("正在初始化系统...");				
			setTimeout(function(){
				SV.initSystem();
				SV.showLoadInfo("正在加载个人设置...");	
				SV.login.cleanLoginArea();
				SV.openStartup();
				setTimeout(function(){
					require("sv.commonPages.alarm");
					SV.Alarm.setOptions(SV.Alarm.options);
					SV.Alarm.run();
				}, 200);
			}, 10);
		}, 10);
	},	
	/*
	():
		{void} SV.maximizeContentArea({HTMLElement} ele)
	DES:
		maximize Content Area
	ARG:
		{HTMLElement} ele
		  icon element
	*/
	maximizeContentArea : function(ele){
		SV.displayTopBarAndModuleMenu("none");
		SV.isContentAreaMaximized = true;
		if(WIN.isElement(ele)){
			ele.src = "" + rootPath + "/resource/image/common/icon/resetWindow.gif";
			ele.title = "还原";
		}
	},
	
	modulesRequire : function(){
		var res = Array.map(function(i){return "app.gui." + i;}, 
								["indicator.progressBar", "menu.horizontalmenu", "menu.verticalmenu", 
								 "menu.popupMenu", "menu.accordionmenu", "panel.tabpanel", "window.wndPanel"]
							);
		res.push("sol.page_comm.system");
		return res;
	}(),
	/*
	():
		{string} SV.openTab({string} url, {string} name, {object} options)
	DES:
		open tab
	ARG:
		{string} name
		  (optional), default is "customTab_" + url;
		{object} options
		  (optional), default is:{
			  title   : url,
				forceNew: false,
				active  : true
			}
	RTN:
		tab name which is unique.
	*/
	openTab : function(url, name, features){
		var svFeatures = "type = tab"; 
		if(String.notEmpty(features)){
			if(!String.contains(features, "type"))features += "," + svFeatures;
		}
		else features = svFeatures;
		return PAGE_COMM.system.open(url, name, features);
	},
	/*
	():
		{void} SV.open({string} url)
	DES:
		open gui window
	*/
	open : function(url, name){
/*		if(!name)name = "customWindow_" + url;
		PAGE_COMM.system.open(url, url);
*/	},
	openStartup : function(){
		var cfg = SV.userConfig.startup;
		var act = cfg.openAction;
		switch (act){
			default:{// 0
				setTimeout(SV.openHomepage, 100);
			}
		}
	},
	openHomepage : function(){
		var homePage = SV.userConfig.startup.homePage;
		SV.openTab(homePage, "homepage");
	},
	refreshPage : function(name){
		var win = PAGE_COMM.system.getPageWindow(name);
		if(win)win.location.reload();
	},
	refreshCurrent : function(){
		var cName = SV.tabPanel.activeItemName;
		SV.refreshPage(cName);
	},
	/*
	():
		{void} SV.resetContentArea({HTMLElement} ele)
	DES:
		reset Content Area size
	ARG:
		{HTMLElement} ele
		  icon element
	*/
	resetContentArea : function(ele){
		SV.displayTopBarAndModuleMenu("");
		SV.isContentAreaMaximized = false;
		if(WIN.isElement(ele)){
			ele.src = "" + rootPath + "/resource/image/common/icon/maxiWindow.gif";
			ele.title = "最大化";
		}
	},
	require : function(module,options){
		var opt = WIN.extend({
		  onLoading : function(req){
			
			},
		  onSuccess : function(req){},
		  onFailure : function(req){}
		}, options);
		require(module, opt);
	},
	setActivePageWindow : function(activeItemName){
		SV.activePageWindow = PAGE_COMM.system.getPageWindow(activeItemName);
	},
	showAbout : function(){
		SV.openTab("" + rootPath + "/common/about.jsp");
	},
	showAboutMore : function(){//? ip 
		var w = window.open("http://192.168.2.132/software.html");
		if(!w)alert("弹出窗口已被拦截，请禁用拦截再重试!");
	},
	showHelp : function(id){
		SV.openTab("" + rootPath + "/common/help.jsp?id=" + id);
	},
	showHelpMenu : function(){
		var help = SV.standardToolbar.bar.getItem("help");
		if(help){
			var ele = help.ele;
			var P = EL.getPageXY(ele);
      var offH = ele.offsetHeight;
			SV.helpMenu.showAt(P.x, (P.y + offH));
		}
		EVT.cancelB();
	},
	showLoadInfo : function(html){
		SV.login.showInfo(html);
	},
	showSystemStatus : function(text){
		if(WIN.isString(text)){
			var ele = SV.ele.systemStatus;
			if(ele)ele.innerHTML = text;
		}
	},
	/*
	OBJECT:
		systemConfig
	DES:
		sv system Config
	PROPERTY:
		{object} layout
		{object} dataSource
	*/
	systemConfig:{
		/*
		OBJECT:
			layout
		DES:
			layout Config 
		PROPERTY:
			{object} containersId
			  layout containers's id config
		*/
		layout: {
			containersId :{
				contentWrap    : "sv_content_wrap",
				moduleMenu     : "sv_module_menu",
				progressBar    : "sv_progressbar",
				separator      : "sv_separator",
				splitbar       : "sv_splitbar",
				systemStatus   : "sv_system_status",
				systemTray     : "sv_system_tray",
				statusBar      : "sv_statusbar",
				standardToolbar: "sv_standard_toolbar",
				tabPanel       : "sv_tabpanel",
				topBar         : "sv_topbar",
				unknown				 : null
			}
		},
		/*
		OBJECT:
			dataSource
		DES:
			dataSource Config 
		PROPERTY:
			{string} moduleMenuItemsData
			{two-dimensional array} standardToolbarItemsData
		*/
		dataSource : {
			moduleMenuItemsData : null,
			moduleMenuItemsDataId : "moduleMenuItemsDataId",
			standardToolbarItemsData : [
			 ["home", "首页",  "" + rootPath + "/resource/image/common/icon32/home.gif", "SV.openHomepage()"],
			 /*["back", "后退",  "" + rootPath + "/resource/image/common/icon32/back.gif", "SV.activePageBack(1)"],
			 ["forward", "前进",  "" + rootPath + "/resource/image/common/icon32/forward.gif", "SV.activePageForward(1)"],*/
			 ["refresh", "刷新",  "" + rootPath + "/resource/image/common/icon32/refresh.gif", "SV.refreshCurrent()"],
			 //["help", "帮助",  "" + rootPath + "/resource/image/common/icon32/help.gif", "SV.showHelp();", "SV.showHelpMenu();"],
			 ["exit", "退出",  "" + rootPath + "/resource/image/common/icon32/exit.gif", "SV.logout.exit();"]
			]
		},
		unknown:null
	},
	toggleMaxiContentArea : function(ele){
		if(SV.isContentAreaMaximized)SV.resetContentArea(ele);
		else SV.maximizeContentArea(ele);//
	},
	toggleModuleMenuDisplay : function(){
	  var ele = SV.ele.moduleMenu;
		if(!WIN.isElement(ele))return;
		var style = ele.style;
		style.display = (style.display != "none") ? "none" : "";
		SV.updateTabPanelWidth();
	},
	updateComponentsHeight:function(){
		var h = DOC.getClientHeight();
		h = h - SV.getFixedBarsHeight();
		if(h > 0){
		  SV.ele.contentWrap.style.height = h + "px";
			SV.moduleMenu.setHeight(h - 10);
			SV.tabPanel.setHeight(h - 9);//tabPanel border-top is none, so (h-9);
		}
	},
	updateTabPanelWidth : function(){
		SV.tabPanel.head.bar.onResize();
	},
	updateStandarToolBarWidth : function(){
		SV.standardToolbar.bar.autoDisplayScrollArrows();
	},
	/*
	():
		{void} updateModuleMenuWidth()
	DES:
		updateModuleMenuWidth on window resize to fix unknown bug under ie7.
	*/
	updateModuleMenuWidth : function(){
		var style = SV.ele.moduleMenu.style;
		var rnd = (new Date().getTime()) % 2 == 1 ? 1 : -1 ;
		style.width = (parseInt(style.width) + rnd) + "px";
	},
	/*
	():
		{void} SV.updateViewOnWindowResize()
	DES:
		 update View On Window Resize, include:
		   updateComponentsHeight, updateStandarToolBarWidth,updateModuleMenuWidth(under ie7), updateTabPanelWidth
	*/
	updateViewOnWindowResize:function(){
		SV.updateComponentsHeight();
		SV.updateStandarToolBarWidth();
		if(BROWSER.IEversion == 7)SV.updateModuleMenuWidth();//fix unkown bug under ie7 
		setTimeout(SV.updateTabPanelWidth, 1);//setTimeout 1ms to fix maxthon bug
	},
	user:{
		name : ""
	},
  userConfig : {
	  moduleMenu :{
		  maxWidth : 300,
			defWidth : 150,
		  minWidth : 50
		},
		startup  : {
			homePage   : "" + rootPath + "/page/home.action",
			openAction : 0 //0 (default: open homepage),for more refer maxthon config
		},
		tabPanel  :{
			defTabWidth  : 150,
			maxNumOfTab  : 20,
			minWidthOfTab: 50,
			unknown:null
		},
		unknown:null
	},
	unkonw: null
});
//EVT.domLoadedObserver.add(SV.main);

