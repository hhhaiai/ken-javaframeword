/***************************************************************
window.js
create window gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.win._window");
//require resource
require("app.gui.widget.engin");

(function(){//for singleton: GUI.window
	function GUIwindowInstance(){//local function,we cant create a new window instance derectly by new GUIwindowInstance() outside.
		this.hwnd = GUI.window;
	}
	//GUIwindowInstance inherit from base
	GUIwindowInstance.prototype = new GUIwndInstanceBase();
	
	function GUIwindowViewCarrier(){
		this.resize = function(o,direct,options,evt){
			var o = this.vMain.ele
			if(!o)return;
			if (o["max"] != 0 || o["min"] != 0 || !o.resizeable) return;
			evt = EVT.getEvt(evt);
			if(!(evt.button != 1 ||evt.button != 0))return;
			//temp node
			var tmp = EFF.cloneRimFromObj(o);
			var s = tmp.style;
			var d = document;
			//drag options
			var bodyWidth = winLayout.maxWidth();
			var bodyHeight = winLayout.maxHeight();
			var opt = WIN.extend({
					maxAreaWidth :bodyWidth,//page area 
					maxAreaHeight:bodyHeight,
					maxWidth     :bodyWidth,
					maxHeight    :bodyHeight,
					minWidth     :winLayout.minWidth(),
					minHeight    :winLayout.minHeight()
				},options||{})
			//
			EVT.cancelB(evt);
			EVT.observe(d,'mousemove', _inFmove,true);
			EVT.observe(d,'mouseup', _inFup,true);
			if (!window.captureEvents)
				tmp.setCapture(); 
			else
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			function _inFmove(evt){
				EVT.cancelB(evt);
				var t,r,b,l;//top,right,bottom,left
				l = parseInt(s.left);
				r = l + parseInt(s.width);
				t = parseInt(s.top);
				b =t + parseInt(s.height);
				
				var sw = EL.width(o);
				var sh = EL.height(o);
				var w,h;
				var x = EVT.pointerX(evt);
				var y = EVT.pointerY(evt);
		
				if(x > 0 && y > 0 && x < opt.maxAreaWidth && y < opt.maxAreaHeight){
					switch(direct){
						case "se":{
							w = x - l;
							h = y - t;
							if(x > l ){
								if(_checkWidth(w)){EL.width(tmp,w);}
							}
							if(y > t){								
								if(_checkHeight(h)){EL.height(tmp,h);}
							}
							break;
						};
						case "sw":{
							w = r - x;
							h = y - t;
							if(r > x){
								if(_checkWidth(w)){s.left = x + "px";s.width = w + "px";}
							}
							if(y > t){
								if(_checkHeight(h)){s.height = h + "px";}
							}
							break;
						};
						case "nw":{
							w = r - x;
							h = b - y;
							if(r > x){
								if(_checkWidth(w)){s.left = x + "px";s.width = w + "px";}
							}
							if(b > y){
								if(_checkHeight(h)){s.top = y + "px";s.height = h + "px";}
							}
							break;
						};
						case "n":{
							h = b - y;
							if(b > y && _checkHeight(h)){s.height = h + "px";s.top = (b - h) + "px";}
							break;
						};
						case "e":{
							w = x - l;
							if(x > l && _checkWidth(w))s.width = w + "px";
							break;
						};
						case "s":{
							w = r - l;
							h = y - t;
							if(y > t && _checkHeight(h))s.height = h + "px";
							break;
						};
						case "w":{
							w = r - x;
							if(r > x && _checkWidth(w)){s.left = x + "px";s.width = w + "px";}
							break;
						};
						default:{//"ne"
							w = x - l;
							h = b - y;
							if(x > l){
								if(_checkWidth(w)){s.width = w + "px";}
							}
							if(b > y){
								if(_checkHeight(h)){s.top = y + "px";s.height = h + "px";}
							}
						};
					};
				}
			};
			function _checkWidth(w){
				return (w <= opt.maxWidth && w >= opt.minWidth);
			};
			function _checkHeight(h){
				return (h <= opt.maxHeight && h >= opt.minHeight);
			};
			function _inFup(evt){
				EVT.cancelB(evt);
				o.style.left = s.left;
				o.style.top = s.top;
				GUI.window.resizeTo(o, tmp.offsetWidth, tmp.offsetHeight);
				EVT.stopObserving(d,'mousemove', _inFmove,true);
				EVT.stopObserving(d,'mouseup', _inFup,true);
				if (!window.captureEvents)
					tmp.releaseCapture();
				else
					window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
				d.body.removeChild(tmp);
				tmp = undefined;
			};
		};
	}
	GUIwindowViewCarrier.prototype = new GUIwndViewCarrier();
	
	//GUIwindowView is a instance of GUIwndViewBuilder,when craeting a new window view we use GUIwindowView.create() but not new GUIwindowView(),so that we can manage windows easily and saving momery.
	var GUIwindowView = new GUIwndViewBuilder();
	GUIwindowView.initialize({
			def_EV			  : {//default set for environmental variance
				wndType			:"window",
				idPrefix  	:"GUIwindow",//win id prefix
				wndViewCarrier :GUIwndViewCarrier,//window view instance base
				noneResize  :false,//if noneResize all the instance can't be resize;
				winStartId	:0,//win starts id 
				winTopZindex:10000,//window top zIndex,
				modalZindex :20000,//modal window zIndex
				gradualTime :400//ani action time;waring:title bar maximize's gradualTime must >= its drag's gradualTime,if not when you dblclick the titlebar it will first maximize then moveto old position but not (0,0);
			},
			def_INS 			: {//default set for win view instance
				width :550,
				height:250,
				title :"无标题文档",
				iconSrc:"defaultIcon.gif",
				body  :" <p align='center'>正在载入环境项…</p>",//content if it starts with "[pg]" we create a iframe instead of div.
				btnDisableTip:"不可用",
				resizeable  :true,//can be resize or not
				minimizeable:true,
				maximizeable:true,
				biOptions:{//has bi
					biSystemMenu:true,
					biMinimize  :true,
					biMaximize  :true,
					biHelp      :false
				},
				biDisableOptions:{//is disable bi
					biSystemMenu:false,
					biMinimize  :false,
					biMaximize  :false,
					biHelp      :false
				},
				biClickHnds:{//bi onclick handler
					biSystemMenu:function(){
						if(this.diable)return;
					  GUI.window.close();
					},
					biMinimize  :function(){
						if(this.diable)return;
						GUI.window.minimize();
					},
					biMaximize  :function(){
						if(this.diable)return;
					  GUI.window.maximize();
					},
					biHelp      :Function.empty
				},
				openType    :"normal",//"normal","maximize","minimize"
				isModalMode :false,
				max         :0,
				min         :0,
				autoCreateId:function(pre, ev){
					var winId = pre + ev.winStartId;
					ev.winStartId ++;
					return winId;
				},
				autoLeft		:function(w){
					return (DOC.getClientWidth() - w)/2;
				},
				autoTop 		:function(h){
					return (DOC.getClientHeight() - h)/3;
				},
				minWidth    : function(){//width minimized
						return 220;
					},
				minHeight   : function(){
						return 65;
					},
				minLeft     : function(){
						return 0;
					},
				minTop      : function(){
						return 0;
					},
				maxWidth    : DOC.getClientWidth,//width maximized
				maxHeight   : DOC.getClientHeight,
				maxLeft     : function(){
						return 0;
					},
				maxTop      : function(){
						return 0;
					}
			},
			def_INTERFACE : {
				windowWrapper:{
					mousedown : function(){GUI.window.setTop(this["id"]); }
				},
				windowFrame  :{
					onmousemove :function(direction,evt){
					var o = $(this["wndId"]);
					if(!o)return;
					if (o["max"] != 0 || o["min"] != 0  || !o.resizeable){;
						this.style.cursor = "default";
					}else{
						this.style.cursor = direction + "-resize";
					}
				},
					onmousedown :function(direction,evt){
/*
					GUI.window.setTop(this["wndId"]);
					GUI.window.resize(this['wndId'],direction,null,evt);			
*/
				}					
				},
				titleBar     :{
					onmousemove :function(evt){//set cursor style
						evt = EVT.getEvt(evt);
						var src = EVT.getEvtSrc(evt);
						if(src != this)return
						var offY = evt.offsetY;
						var o = $(this["wndId"]);
						if(!o)return;
						if(BROWSER.Gecko)offY = o.offsetTop - evt.clientY;
						if(offY < 5 && o.resizeable && (o["max"] == 0) && (o["min"] == 0))
							this.style.cursor = "n-resize";
						else this.style.cursor = "default";
					},
					onmousedown :function(evt){
						//GUI.window.setTop(this["wndId"]);
						evt = EVT.getEvt(evt);
						var offY = evt.offsetY;
						var o = $(this["wndId"]);
						if (!o) return;
						if(BROWSER.Gecko)offY = o.offsetTop - evt.clientY;
						var src = EVT.getEvtSrc(evt);
						if(offY < 5 && o.resizeable && src == this){
							GUI.window.resize(this['wndId'],"n",null,evt);
						}else{
							if (o["max"] != 0 || o["min"] != 0) return;
							DND.drag(o);
						}
					},
					ondblclick  :function(){GUI.window.max(this["wndId"]);}
				},
				biSystemMenu :{},//has biSystemMenu
				biMinimize   :{},
				biMaximize   :{},
				biHelp       :{}
			}
		});
	GUIwindowView.initBorderIcons = function(ins, biOptions, biDisableOptions, biClickHnds){
		var mini = "biMinimize";
		var maxi = "biMaximize";
		for(var i in biOptions){
			if(!(i == mini || i == maxi )){
				if(biOptions[i]){
					this.cBorderIcon(ins, i , biDisableOptions[i], biClickHnds[i]);
				}
			}
		}
		if(biOptions[mini] || biOptions[maxi]){
			this.cBorderIcon(ins, mini, biDisableOptions[mini], biClickHnds[mini]);
			this.cBorderIcon(ins, maxi, biDisableOptions[maxi], biClickHnds[maxi]);
		}
	};
	GUIwindowView.initBody = function(ins, content){
		var contentHead = content.slice(0, 4);
		if( contentHead == "[pg]"){
			this.cBody(ins, content.slice(4), "iframe");
		}
		else this.cBody(ins, content, "div");
	};
	function GUIwindow(){//singleton
		//independent variant
		var windowDict = {//opened window dictionary with windowName and windowView
			add			:function(key,value){
				if(this.exists(key))throw(key + "exists!");
				this[key] = value;
			},
			exists	:function(key){
				return (this[key]!== undefined);
			},
			remove  :function(key){
				delete this[key];
			}
		};
		//private fns
		function _open(name, title, iconUrl, content, contentType, options){
			var wndView;
			if(windowDict.exists(name)){
				wndView = windowDict[name];
				wndView.setTitle(title);
				wndView.setIcon(iconUrl);
				wndView.setContent(content);
			}
			else{//create new
			  if(contentType == "iframe")content = "[pg]" + content;
				wndView = GUIwindowView.create(title, iconUrl, content, options);
				windowDict.add(name,wndView);
				var winIns = new GUIwindowInstance();
				winIns.initialize(name,wndView);
				return winIns; 
			}
		}
		function _getWndView(name){
			return windowDict[name];
		}
		
		this.initialize = function(options){
			//initialize GUIwindowView
			GUIwindowView.initialize(options);
		};
		this.maximize = function(){
			
		};
		this.minimize = function(){
			
		};
		this.moveTo = function(name, left, top){
			var wndView = _getWndView(name);
			if(wndView)wndView.moveTo(left, top);
		};
		this.open = function(name, url, title, iconUrl, options){
			return _open(name, title, iconUrl, url, "iframe", options);
		};
		this.openDiv = function(name, content, title, iconUrl, options){
			return _open(name, title, iconUrl, content, "div", options);
		};
		this.setContent = function(name, content){
			var wndView = _getWndView(name);
			if(wndView)wndView.setContent(content);
		};
		this.setIcon = function(name, url){
			var wndView = _getWndView(name);
			if(wndView)wndView.setIcon(url);
		};
		this.setTitle = function(name, title){
			var wndView = _getWndView(name);
			if(wndView)wndView.setTitle(title);
		};
	}
	GUIwindow.prototype = new GUIwndBaseModel();
	GUI.window = new GUIwindow();
	/*you can init GUI.window to cover default options
	GUI.window.initialize(opt);
	*/
})();

