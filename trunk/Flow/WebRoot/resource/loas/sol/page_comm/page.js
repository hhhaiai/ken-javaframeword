/***************************************************************
page.js
page module of pages communication,include this file in every sub page.
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("sol.page_comm.page");

namespace("PAGE_COMM", {
  Page   : function(){
		//refer to system
		var system = window;
		//instantMessaging properties,in order to be instant, we call the notify method when setting the properties value.
		//window or operation status which you want to show at system status bar
		var status = "";
		//some operation may need long time,so use it to indicate.
		var progress = "";
		//auto set with document.tile when initializing
		var title = "";
		//if you want to show icon for page in a tab or GUIwindow,you can add this code to your html file <icon src="youricon.gif"></icon>,and it must be added before this script.
		var icon = "";
		var iframeId = "";
		
		
		/*
		():
			{void} alert({string} message)
		DES:
			Override window same name function.Methods close,confirm,open,prompt are the same.
		*/
		
		/*
		():
			{void} alert({any} message)
		DES:
			alert a message
		*/
		this.alert = function(message){
			system.alert(message || "");
		};
		/*
			this.addFavorite = function(){
				
			};
		*/
		/*
		():
			{void} close()
		DES:
			close self window
		*/
		this.close = function(){
			system.close(iframeId);
		};
		this.confirm = function(message){
			return system.confirm(message ||"");
		};
		/*
			this.fullScreen = function(){
				
			};
		*/
		this.getIcon = function(){
			return icon;
		};
		this.getProgress = function(){
			return progress;
		};
		this.getStatus = function(){
			return status;
		};
		this.getTitle = function(){
			return title;
		};
		this.history = window.history;
		this.initialize = function(sys){
			if(WIN.isObject(sys))system = sys;
			else if(WIN.isObject(top.PAGE_COMM) && WIN.isObject(top.PAGE_COMM.system))
			  system = top.PAGE_COMM.system;
			if(system != window){
				system.beforePageInit();
				if(typeof PAGE_COMMId != "undefined"){
					iframeId =  PAGE_COMMId;
					this.setTitle();
					this.setIcon();
					var pType = system.getPageType(iframeId);
					if(pType == "tab"){
						var list = system.historyMgr.get(iframeId);
						if(!list) list = system.historyMgr.add(iframeId);
						list._add(location.href);
						//setTimeout(function(){document.body.appendChild(EL.c({innerHTML : location.href}));}, 1);
						this.history = list;
/*						window.history.__back = window.history.back;
						window.history.back = function(n){
							window.history.back(n);
						};
*/					}
					system.beforePageInitObserver.execute(iframeId);
				}
			}
			return this;
		};
		/*
		():
			{void} notify({string} attrName,[{string} attrName2 ..])
		DES:
			notify system that page data has changed
		*/
		this.notify = function(state, value){
			if(iframeId && system.onPageStateChange)
				system.onPageStateChange(iframeId, state, value);
		};
		
		this.open = function( url, name, features ){
			if(!String.notEmpty(features))features = "";
			features += ",pageCommId = " + iframeId;
			return system.open(url, name, features);
		};
		this.openDialog = function(){
			
		};
		this.reload = window.location.reload;
		this.prompt = function(message, inputDefault){
			return system.prompt(message ||"", inputDefault ||"");
		};
		this.notifyFocused = function(){
			if(iframeId && system.onPageFocus)
				system.onPageFocus(iframeId);
		};
		this.getFocus = function(){
			if(iframeId)system.setFocusOnPage(iframeId);
		};
		this.setIcon = function(src){
			try{
				icon = src || document.getElementsByTagName("icon")[0].getAttribute("src");
				this.notify("icon");
			}catch(e){}
		};
		this.setProgress = function(value){
			progress = value;
			this.notify("progress", value);
		};
		this.setStatus = function(value){
			status = value;
			this.notify("status", value);
		};
		this.setTitle = function(value){
			if(!iframeId)return ;
			
			title = (value || document.title);
			if(!String.notEmpty(title)){
				var lHref = location.href;
				var fPos = lHref.lastIndexOf("/");
				title = lHref.substring(fPos + 1);
			}
			system.setTitle(iframeId, title);
		};
	},
	unknown : null
});

window.page = new PAGE_COMM.Page().initialize();
(function(){
  var obj = {
		msgRender_onRequstSend : function(url){
			var txt = "等待" + (url || "" );
			return txt;
		},
		msgRender_onPageInit : function(page){
			var txt = "正在打开";
			if(page) txt += page.getTitle() + ", 请稍后...";
			return txt;
		},
		msgRender_onLoad : function(page){
			return "完成";
		}
	};
	for(var i in obj){
		if(!PAGE_COMM[i])PAGE_COMM[i] = obj[i];
	}
	
	page.setProgress(PAGE_COMM.progress_onPageInit || 10);
	page.setStatus(PAGE_COMM.msgRender_onPageInit(page) );
	
	EVT.domLoadedObserver.add(function(){
		var pro =(PAGE_COMM.progress_onDomLoad || 50);
		//domLoaded may be occurs after window loaded under ie;
		if(BROWSER.IE && EVT.windowLoaded) pro = (PAGE_COMM.progress_onLoad || 100);
		page.setProgress(pro);
	});
	EVT.observe(window, "load", function(){
		page.setStatus(PAGE_COMM.msgRender_onLoad() );
		page.setProgress(PAGE_COMM.progress_onLoad || 100);
		if(BROWSER.IE)EVT.windowLoaded = true;
	});
	EVT.observe(window, "unload", function(){
		page.setStatus(PAGE_COMM.msgRender_onRequstSend(location) );
		page.setProgress(PAGE_COMM.progress_onRequstSend || 0);
	});
	EVT.observe(document, "mousedown", function(){
		page.notifyFocused();
	});
})()
