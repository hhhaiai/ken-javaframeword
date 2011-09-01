/***************************************************************
system.js
system module of pages communication,include this file in system page.
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("sol.page_comm.system");
//require resource
require("lib.core.string.parameter");
require("sol.page_comm.history");

namespace("PAGE_COMM", {
  system   : function(){
		//private
		var pages = {};
		var pageTypes = ["tab", "window"];
		var pageMgrs = {};
		//public
		return {
			alert : function(message){
				alert((message ||""));
			},
			beforePageInit : function(){
				this.resetPAGE_COMMId();
			},
			close : function(pageCommId){
				var mgr = this.getPageMgrById(pageCommId);
				if(!mgr || !mgr.close)return ;
				mgr.close(pageCommId);
			},
			confirm : function(message){
				return confirm((message||""));
			},
			
			getPageWindow : function(pageCommId){
				try{
					return window.frames[pageCommId];					
				}catch(e){return null;}
			},
			getPageType : function(pageCommId){
				if(!String.notEmpty(pageCommId))return "";
				pageCommId = pageCommId.toLowerCase();
				return pages[pageCommId];
			},
			getPageMgr : function(type){
				return pageMgrs[type];
			},
			getPageMgrById : function(pageCommId){
				var pType = this.getPageType(pageCommId);
				return this.getPageMgr(pType);
			},
			initHistoryMgr    : function(){
				var mgr = this.historyMgr = new PAGE_COMM.HistoryMgr;
				var _this = this;
				mgr.load = function(name, url){
					var win = _this.getPageWindow(name);
					if(win)win.location.href = url;
				};
				return mgr;
			},
			initPagesMgr: function(tabMgr, winMgr){
				this.setPageMgr(pageTypes[0], tabMgr);
				this.setPageMgr(pageTypes[1], winMgr);
				
				if(tabMgr){
					var obv;
					var onClose = Function.bind(function(pageCommId){
						this.historyMgr.remove(pageCommId);
						this.unRegisterPage(pageCommId);
						this.onCloseTab(pageCommId);
					}, this);
					var onOpen = Function.bind(function(pageCommId, title, url){
						this.onOpenNewTab(pageCommId, title, url);
					}, this);
					if(obv = tabMgr.onCloseObserver) obv.add(onClose);
					if(obv = tabMgr.onAddObserver) obv.add(onOpen);
				}
				if(winMgr){
				}
			},
			initialize : function(tabPagesMgr, windowPagesMgr){
				this.initPagesMgr(tabPagesMgr, windowPagesMgr);
				this.initHistoryMgr();
				this.beforePageInitObserver = new WIN.Observer();
			},
			onCloseTab : Function.empty,
			onOpenNewTab : Function.empty,
			onPageStateChange : function(pageCommId, state, value){
				if(!String.notEmpty(pageCommId))return ;				
				var p = "onPage" + String.capitalize(state) + "Change";
				if(WIN.isFunction(this[p]))	this[p](pageCommId, value);
			},
			onPageFocus : function(pageCommId){
				this.pageFocusObserver.execute(pageCommId);
			},
			
			open : function(url, name, features){
				if(!String.notEmpty(url))return null;
				if(!name)name = url;
				try{
					var options = String.parseKVString(features, ",");
					var T_tab = pageTypes[0], T_window = pageTypes[1];
					switch(options.type){
						case T_tab:{
							var opt = WIN.extend({
									title   : url,
									forceNew: false,
									active  : true
								}, options);
							if(opt.forceNew)name = name + new Date().getTime();
							//important to avoid the name == window which will make a endless loop.
							name = "customTab_" + name;
							return this._open(T_tab, url, name, opt);
						};
						
						case T_window:{
							name = "customWindow_" + name;
							return this._open(T_window, url, name, options);
						};
						
						default: {//open system default window
							var pageCommId = options.pagecommid;
							if(!String.notEmpty(pageCommId))break;
							return this.getPageWindow(pageCommId).open(url, name, features);
						}
					}
				}catch(e){
					return window.open(url, name, features);
				};
			},
			_open : function(type, url, name, options){
				name = name.toLowerCase();
				this.registerPage(name, type);
				var mgr = this.getPageMgr(type);
				if(mgr) return mgr.open(url, name, options);
			},
			pageFocusObserver : new WIN.Observer,
			prompt : function(message, inputDefault){
				return prompt((message||""), inputDefault ||"");
			},
			resetPAGE_COMMId : function(){
				var iframes = document.getElementsByTagName("iframe");
				Array.each(Function.bind(this._resetIframePAGE_COMMId, this), iframes);
			},
			_resetIframePAGE_COMMId : function(i){
				var name = i.getAttribute("name"), win;
				if(name){
					win = this.getPageWindow(name);
					if(win && !win.PAGE_COMMId){
						win.PAGE_COMMId = name;
					}
				}
			},
			
			/*
			():
				{boolean} registerPage({string} pageCommId, {object} pageCommContainer)
			DES:
				add a page.
			ARG:
				{string} pageCommId
				  In system point of view, page is an iframe which has a id attribute for communication with system, we call the id "pageCommId";
				{object} pageCommContainer
			*/
			registerPage : function(pageCommId, pageType){
				if(!String.notEmpty(pageCommId) && !String.notEmpty(pageType) )return false;
				pageCommId = pageCommId.toLowerCase();
				if(pages[pageCommId])return true;
				pages[pageCommId] = pageType;
				return true;
			},
			setTitle   : function(pageCommId, title){
				var mgr = this.getPageMgrById(pageCommId);
				if(mgr)mgr.setTitle(pageCommId, title);
			},
			setIcon    : function(pageCommId, iconUrl){},
			setPageMgr : function(type, mgr){
				pageMgrs[type] = mgr;
			},
			setFocusOnPage : function(pageCommId){
				var mgr = this.getPageMgrById(pageCommId);
				if(mgr && mgr.setActive){
					//check page focusable here
					mgr.setActive(pageCommId);
				}
			},
			setProgress: Function.empty,			
			unRegisterPage : function(pageCommId){
				if(!String.notEmpty(pageCommId))return false;
				pageCommId = pageCommId.toLowerCase();
				delete pages[pageCommId];
			},
			unkonw : null
		};
	}()
});
