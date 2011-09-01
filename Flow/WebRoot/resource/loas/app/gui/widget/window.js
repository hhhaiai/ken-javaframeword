/***************************************************************
window.js
create window gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.widget.window");
//require resource
require("lib.dom.engin");
require("lib.dom.style");
require("lib.dom.layout.size");
require("lib.evt.engin");
require("app.dnd.engin");
require("app.ani.engin");
require("app.eff.engin");
require("app.gui.widget.engin");
/*
CLASS:
  GUI.window
DES:
  window class,singleton,craete a gui window;window id = idPrefix+ winId;
*/
(function(){
	function win(/*options*/ opt){//base on someother source
	  //dependent variant
			//options variant
		if(!opt)var opt = {};
		var winId  = opt.windowStartId || 0;
		var windowTopZindex = opt.windowTopZindex || 10000;//window top zIndex,
		var modalZindex = opt.modalZindex || 20000; //modal window zIndex
		var gradualTime = opt.gradualTime || 400;//ani action time;waring:title bar maximize's gradualTime must >= its drag's gradualTime,if not when you dblclick the titlebar it will first maximize then moveto old position but not (0,0);
		var idPrefix = opt.idPrefix ||"GUIwindow";
		var imgPath = opt.imgRootPath ||"../../../../resource/loas/app/resource/gui/win/default/";
		//btnImgArr = [normal,mouseover,mouseout,down,clicked],different events imgSrc;
		var btnImgArr = opt.btnImgArr ||["c.gif","c1.gif","c.gif","c2.gif","c.gif"];
		var winLayout = WIN.extend({//window layout options
				minWidth : function(){//width minimized
						return 220;
					},
				minHeight : function(){
						return 65;
					},
				minLeft : function(){
						return 0;
					},
				minTop : function(){
						return 0;
					},
				maxWidth : DOC.getClientWidth,//width maximized
				maxHeight : DOC.getClientHeight,
				maxLeft : function(){
						return 0;
					},
				maxTop : function(){
						return 0;
					}
			},opt.windowLayout || {});
		var windowDef = WIN.extend({
				width :350,//window default width on create
				height:150,
				title :"无标题文档",
				iconSrc:"defaultIcon.gif",
				body  :" <p align='center'>正在载入环境项…</p>",
				btnDisableTip:"不可用"				
			},opt.windowDef || {});
		var cssDef = WIN.extend({
			  window :"win",
				titleWrapper:"tie",
				body   :"boy",
				botttom:"bom",
				titleBar:"wtt",
				titleTxt:"wttxt",
				icon   :"wicon",
				btnMin :"wmin",
				btnMax :"wmax",
				btnClose:"wclo",
				btnDisable:"btnDisable",
				windowUnfocus:"wUnFocus"				
			},opt.css||{});
		//not options variant
		var ff = BROWSER.Gecko;
		var ie = BROWSER.IE;
		var IEversion = BROWSER.IEversion;
		//independent variant
		var zIndexQueue = {
			windowIdArr  :[],
			push :function(id){
				this.windowIdArr.push(id);
			},
			skipToEnd  :function(id){
				this.remove(id);
				this.push(id);
			},
			remove     :function(id){
				this.windowIdArr.remove(id);
			},
			getZfromInd :function(ind){
				var z = windowTopZindex - (this.windowIdArr.length - 1 )+ ind;
				if(z < 1)throw("Can't open any more window,it reaches to maximum!");
			  return z;
			},
			getIndFromZ :function(z){
				var ind = (this.windowIdArr.length - 1 ) + z - windowTopZindex;
			  return ind;
			},
			getLastId   :function(){
				var arr = this.windowIdArr;
				return arr[arr.length - 1];
			}
			
		};
		var btnCssArr = [cssDef.btnMin,cssDef.btnMax,cssDef.btnClose];//we need this to identify different btn;
		var openedWindowArr = [];// to record created windows;
		var objCache = {
			drag:null,
			resize:null,
			modal:null
		};
		//
		/*param type rule:
		  	obj: winObj( GUIwindow obj)|| btnObj( minimize,maximize,close Btn obj);
				o  : string( GUIwindow.id) || winObj( GUIwindow obj)
				id : string( GUIwindow.id)
		*/
		//private fns -- no need to check
		function cMain(/*string*/ id,opt){//
			//if(typeof id != "string" )return;
			var mywin = $(id);
			//if (!mywin) return;
			var w = opt.w, h = opt.h, l = opt.l, t = opt.t;
			var resizeable = opt.resizeable;
			var mytie = DOC.c("DIV");
			var myboy = DOC.c("DIV");
			var mybom = DOC.c("DIV");
			mytie.className = cssDef.titleWrapper;
			myboy.className = cssDef.body;
			mybom.className = cssDef.botttom;
			mywin.appendChild(mytie);
			mywin.appendChild(myboy);
			mywin.appendChild(mybom);
			//winTag = [obj,cursorStyle, height, width, backgroundImage]
			var winTag = [ [mytie, "nw", 30,   15,   "t1"],
										 [mytie, "n" , 30,   w-30, "t2"], 
										 [mytie, "ne", 30,   15,   "t3"], 
										 [myboy, "w" , h-45, 15,   "l1"], 
										 [myboy, ""  , h-47, w-32      ], 
										 [myboy, "e" , h-45, 15,   "r1"], 
										 [mybom, "sw", 15,   15,   "l2"], 
										 [mybom, "s" , 15,   w-30, "b1"], 
										 [mybom, "se", 15,   15,   "r2"] ];
			for (var i = 0; i < 9; i++){
				var temp = DOC.c("DIV");
				temp["Fid"] = id;
				winTag[i][0].appendChild(temp);
				if (winTag[i][4]){//window wrapper
				  if(ie){						
					temp.style.cssText = "float:left;height:"+ winTag[i][2] +"px;width:"+ winTag[i][3] +"px;" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgPath + winTag[i][4] + ".png', sizingMethod='scale');";
					}
					else{
					temp.style.cssText = "float:left;height:"+ winTag[i][2] +"px;width:"+ winTag[i][3] +"px;" + "background:url('" + imgPath + winTag[i][4] + ".png');";
					}
				}
				else{//window content
					temp.style.cssText = "float:left;height:"+ winTag[i][2] +"px;width:"+ winTag[i][3] +"px;background:#fff;border:1px solid #666;overflow:hidden;padding:0px";
				}
				
				if(i == 1){//title bar events 
					temp.onmousemove = Function.curry(Mmove_titleBar,winTag[1][1]);//set cursor
					temp.onmousedown = Function.curry(Mdown_titleBar,winTag[1][1]);//resize || drag
					temp.ondblclick = function(evt){GUI.window.max(id);};
				}
				else if(i != 4){//window wrapper except title bar events
					temp.onmousedown = Function.curry(Mdown_wrapper,winTag[i][1]);
					temp.onmousemove = Function.curry(Mmove_wrapper,winTag[i][1]);
				}
			}
		}		
		function cBody(/*string*/ id, wbody){
			//if(typeof id != "string" )return;
			var mywin = $(id);
			//if (!o) return;
			var contentPart = mywin.childNodes[1].childNodes[1];
			if (wbody.slice(0, 4) == "[pg]"){
				contentPart.innerHTML = "<iframe onfocus=\"GUI.window.setTop('"+ id +"',this)\" src='"+ wbody.slice(4) +"' frameBorder='0' marginHeight='0' marginWidth='0' width='100%' height='100%'></iframe>";
				mywin.windowType = "iframe";
				}
			else{
				contentPart.innerHTML = wbody;
				mywin.windowType = "div";
			}
		}
		function cBtn(/*string*/ id, options){
			//if(typeof id != "string" )return;
			var mywin = $(id);
			//if (!mywin) return;
			var opt = WIN.extend({
					hasBtnMin:true,
					hasBtnMax:true,
					hasBtnClose:true
				},options||{});
			//btnTag = [class,title,clickHnd];
			var btnTag = [[btnCssArr[0],"最小化","GUI.window.min('" + id + "',this);"],
										[btnCssArr[1],"最大化","GUI.window.max('" + id + "',this);"],
										[btnCssArr[2],"关闭窗口","GUI.window.close('" + id + "');"]];
			var btnHtml = "";
			if(!opt.hasBtnMin && !opt.hasBtnMin){
				btnTag = btnTag.slice(2);
				if(!opt.hasBtnClose)btnTag.length = 0;
			}
			for (var i = 0; i < btnTag.length; i++){
			  btnHtml += "<div class =\"" + btnTag[i][0] + "\" title=\"" + btnTag[i][1] + "\" Fid = " + id
				        + " onclick =\"" + btnTag[i][2] + "\" GUI.window.setBtnStyle(this,4);"
								+ " ondblclick =\"EVT.cancelB();\" "
								+ " onmouseover =\"GUI.window.setBtnStyle(this,1); \" "
								+ " onmouseout =\"GUI.window.setBtnStyle(this,2); \" "
								+ " onmousedown =\"GUI.window.setBtnStyle(this,3);GUI.window.setTop('" + id + "');EVT.cancelB(); \" "
								+ "></div>";
			}
			//
			var title = mywin.childNodes[0].childNodes[1];
			title.innerHTML = "<div class=\"" + cssDef.icon + "\"></div>" 
											+ "<div style=\"position:relative;left:0px;top:8px;height:23px;overflow: hidden;"
											+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgPath
										  + "tt.png',sizingMethod=scale);cursor:default; \"></div>"
											+ btnHtml;
		}
		function cTitleTxt(/*winObj*/ obj, title){
			title = "<div class=\"" + cssDef.titleTxt + "\">" + title + "</div>"
			obj.childNodes[0].childNodes[1].childNodes[1].innerHTML = title;
		}
		function callbackOnClose(/*winObj*/ obj){
			var iframes = obj.getElementsByTagName("IFRAME");
			if (iframes.length != 0){iframes.src = "about:blank";}
			obj.innerHTML = "";
			zIndexQueue.remove(obj.id);
			openedWindowArr.remove(obj.id);
			document.body.removeChild(obj);
			obj = undefined;
			//set focus on last window
			GUI.window.setTop(zIndexQueue.getLastId());
		}
		function getBTN(o,type){//type:0,1,2 --> min,max,close
			var fNodes = o.childNodes[0].childNodes[1].childNodes;
			var re;
			for(var i = 0; i< fNodes.length; i++){
				re = new RegExp(btnCssArr[type],"ig");
				if(re.test(fNodes[i].className))return fNodes[i];
			}
		}
		function Mmove_wrapper(direction,evt){
			var o = $(this["Fid"]);
			if(!o)return;
			if (o["max"] != 0 || o["min"] != 0  || !o.resizeable){;
				this.style.cursor = "default";
			}else{
				this.style.cursor = direction + "-resize";
			}
		}
		function Mdown_wrapper(direction,evt){
			GUI.window.setTop(this["Fid"]);
			GUI.window.resize(this['Fid'],direction,null,evt);			
		}
		function Mmove_titleBar(direction,evt){
			evt = EVT.getEvt(evt);
			var src = EVT.getEvtSrc(evt);
			if(src != this)return
			var offY = evt.offsetY;
			var o = $(this["Fid"]);
			if(!o)return;
			if(ff)offY = o.offsetTop - evt.clientY;
			if(offY < 5 && o.resizeable && (o["max"] == 0) && (o["min"] == 0))
				this.style.cursor = direction + "-resize";
			else this.style.cursor = "default";
		}
		function Mdown_titleBar(direction,evt){
			GUI.window.setTop(this["Fid"]);
			evt = EVT.getEvt(evt);
			var offY = evt.offsetY;
			var o = $(this["Fid"]);
			if(ff)offY = o.offsetTop - evt.clientY;
			var src = EVT.getEvtSrc(evt);
			if(offY < 5 && o.resizeable && src == this){
				GUI.window.resize(this['Fid'],direction,null,evt);
			}else{
				if (!o) return;
				if (o["max"] != 0 || o["min"] != 0) return;
				DND.drag(o);
			}
		}
		function setBTNbgSrc(/*btnObj*/ obj,src){
			obj.style.backgroundImage = "url(" + src + ")";
		}
		function setBTNbgPos(/*btnObj*/ obj,pos){
			obj.style.backgroundPosition = pos;
		}
		function setBtnDisable(/*string || winObj*/o,typeArr,disable){//typeArr = [0,1,2] ->[min,max,close]
			if (!(o = $(o))) return;
			var mytieChd = o.childNodes[0].childNodes[1].childNodes;
			var btn,cssName,type;
			var disableTip = windowDef.btnDisableTip;
			for(var j = 0; j < typeArr.length; j++){
				type = typeArr[j];
				cssName =  btnCssArr[type];
				for(var i=0; i<mytieChd.length; i++){
					btn = mytieChd[i];
					if(btn.className == cssName){//if btn node
					  //set btn style and property;
						if(disable){
							btn.disable = true;
							btn.title = btn.title + disableTip;
							EL.addClass(btn,cssDef.btnDisable);
						}
						else{
							btn.disable = false;
							btn.title = btn.title.replace(disableTip,"");
							EL.removeClass(btn,cssDef.btnDisable);
						}
						//associated update window property;
						if(type == 0)o.minimizeable = !disable;
						else if(type == 1)o.maximizeable = !disable;
						else if(type == 2)o.closeable = !disable;
						break;
				  }
		    }
			}
		}
		function setMinStyle(o,btn){
			var state = o["min"];
			if(state == 1){
				btn.title = "最小化";
				setBTNbgPos(btn,"-91px");
			}
			else{
				btn.title = "恢复";
				setBTNbgPos(btn,"0px");
			}
		}
		function setMaxStyle(o,btn){
			var state = o["max"];
			if(state == 1){
				btn.title = "最大化";
				setBTNbgPos(btn,"-94px");
			}
			else{
				btn.title = "恢复";
				setBTNbgPos(btn,"-26px");
			}
		}
		function setPosAndSize(o,/*layoutArray*/ s,callback,This,isReset){
			var stateMax = o["max"];
			var stateMin = o["min"];
			
			var tmp = EFF.cloneLayerFromObj(o,{backgroundColor:"#ccc",opacity:20});
			if(isReset){
				var stateReset = o["reset"].split(",");
				s = [stateReset[0],stateReset[1],stateReset[2],stateReset[3]];
			}
			else if(stateMax != 1 && stateMin !=1){//record new Reset state when normal
				var l = o.offsetLeft;
				var t = o.offsetTop;

				var w = o.offsetWidth;
				var h = o.offsetHeight;
				o["reset"] = (l +","+ t +","+ w +","+ h);
			}
			//set whatever the state to be normal first,then set it again in callback if it's mini or maxi;
			if(stateMax == 1 )o["max"] = 0;
			if(stateMin == 1 )o["min"] = 0;
			ANI.move(tmp,s[0],s[1],gradualTime,2);
			ANI.resize(tmp, s[2], s[3],gradualTime,2,_callback);			
			function _callback(){
				GUI.window.moveto(o, s[0], s[1]);
				GUI.window.resizeTo(o, s[2], s[3]);
				document.body.removeChild(tmp);
				tmp = undefined;
				if(WIN.isFunction(callback))callback(o);
			}
		}
		function setResizeDisable(/*string || winObj*/o,disable){
			if (!(o = $(o))) return;
			o.resizeable = !disable;
		}
		function setWindowFocusStyle(/*winObj*/ o, /*boolean*/isSetFocus){
			var aimObj,css;
			css = cssDef.windowUnfocus;
			if(ie){
				aimObj = o.childNodes;
				for(var j = 0; j<aimObj.length; j ++){
					if(isSetFocus) EL.removeClass(aimObj[j],css);
					else EL.addClass(aimObj[j],css);
				}
			}else{
				if(isSetFocus)EL.removeClass(o,css);
				else EL.addClass(o,css);
			}
		}
		//public fns
		this.create = function(windowId,iconUrl,title, wbody,options){
			if(WIN.isString(windowId) && String.trim(windowId)!= ""){
				if(openedWindowArr.contains(windowId))return;//window exist
			}
			else{
				winId = ++winId;
				var windowId = idPrefix + winId;
			}
			WIN.debug('windowId =' + windowId);
			openedWindowArr[openedWindowArr.length] = windowId;
			iconUrl = iconUrl || imgPath + windowDef.iconSrc;
			title = title || windowDef.title;
			wbody = wbody || windowDef.body;//content if it starts with "[pg]" we create a iframe instead of div.
			if(!options)options = {};
			var opt = WIN.extend({
					w						:windowDef.width,
					h						:windowDef.height,
					//hasBtnMin:true,defaultValue
					//hasBtnMax:true,
					//hasBtnClose:true,
					//isMaxMode:false,
					//isModalMode:false,
					resizeable  : true
				},options);
			if(!options.l)opt.l = (DOC.getClientWidth() - opt.w)/2;
			if(!options.t)opt.t = (DOC.getClientHeight() - opt.h)/3;
			//
			var mywin = DOC.c("DIV");
			EL.setAttr(mywin,{
			  id 		   		:windowId,
				resizeable  :true,
				minimizeable:true,
				maximizeable:true,
				closeable   :true,
				max   :0,
				min   :0,
				reset :(opt.l + "," + opt.t + "," + opt.w + "," + opt.h),
				className:cssDef.window
			});
			mywin.onmousedown = function(){GUI.window.setTop(this["id"]); };
			mywin.style.cssText = "position:absolute;width:"+ opt.w +"px;height:"+ opt.h +"px;left:"+ opt.l + "px;top:" + opt.t + "px";			
			
			document.body.appendChild(mywin);
			cMain(windowId,opt);//3 parts: tie(title bar),boy(body),bom(bottom)
			cBtn(windowId,opt.onlyClose);
			cTitleTxt(mywin, title);
			cBody(windowId, wbody);
			//set			
			this.setTitleWidth(windowId,opt);
			this.setIcon(windowId,iconUrl);
			//update view
			if(opt.isMaxMode)this.max(windowId);
			if(opt.isModalMode){
				mywin.isModalMode = true;
				this.setModalMode(windowId);
			}
			else this.setTop(windowId);
			return(windowId);
		};
		this.disableBtn = function(o,typeArr){//typeArr = [0,1,2] ->[min,max,close]
			setBtnDisable(o,typeArr,true);
		};
		this.enableBtn = function(o,typeArr){
		  setBtnDisable(o,typeArr);
		};
		this.enableResize = function(o){
		  setResizeDisable(o);
		};
		this.disableResize = function(o){
		  setResizeDisable(o,true);
		};
		this.close = function(o,callback){
			if (!(o = $(o)) || !o.closeable) return;
			var _callback = function(){
				if (WIN.isFunction(callback)) callback(o);
				else if (WIN.isString(callback)) eval(callback);
				callbackOnClose(o);//remove o;
			};
			if(ie){//fix ie png fiter bug:if the img that has opacity filter is above another png img,it will be transparent.
			  var titleBar = o.childNodes[0].childNodes[1];
				titleBar.innerHTML = "";
				//when we clear its innerHTML we should set its ondblclick = null to stop it;
				titleBar.ondblclick = null;
			}
			ANI.fadeOut(o,gradualTime,2,_callback);
			if(o.isModalMode)this.unsetModalMode();
		};
		this.max = function(o,This,callback){
			function _callback(state){
				o["max"] = state;
				setMaxStyle(o,This);
				setMinStyle(o,This.previousSibling);
				if(WIN.isFunction(callback))callback(o);
			}
			if (!(o = $(o)) || !o.maximizeable) return;
			if(!This)This = getBTN(o,1);//get max BTN
			var state = o["max"];
			if (state == 0){//if normal then maximize
				var s = [winLayout.maxLeft(),winLayout.maxTop(),winLayout.maxWidth(),winLayout.maxHeight()];
				setPosAndSize(o,s,function(){_callback(1);},This);
			}
			else{//if maximize then reset  
				var stateReset = o["reset"].split(",");
				setPosAndSize(o,stateReset,function(){_callback(0);},This,true);
			}
		};
		this.min = function(o,This,callback){
			if (!(o = $(o)) || !o.maximizeable) return;
			if(!This)This = getBTN(o,0);//get max BTN
			var state = o["min"];
			if (state == 0){//if normal then minimize
				var s = [winLayout.minLeft(),winLayout.minTop(),winLayout.minWidth(),winLayout.minHeight()];
				setPosAndSize(o,s,function(){_callback(1);},This);
			}
			else{//if minimize then reset  
				var stateReset = o["reset"].split(",");
				setPosAndSize(o,stateReset,function(){_callback(0);},This,true);
			}
			function _callback(state){
				o["min"] = state;
				setMinStyle(o,This);
				setMaxStyle(o,This.nextSibling);
				if(WIN.isFunction(callback))callback(o);
			}
		};
		this.moveto = function(o,l,t){
			if (!(o = $(o))) return;
			if(/px/.test(l)){
				o.style.left = l;
				o.style.top = t;
			}
			else{
				o.style.left = l + "px";
				o.style.top = t + "px";
			}
		};
		this.resize = function(o,direct,options,evt){
			if (!(o = $(o))) return;
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
			if (tmp.setCapture)
				tmp.setCapture(); 
			else
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			var t,r,b,l;//original top,right,bottom,left
			l = parseInt(s.left);
			r = l + parseInt(s.width);
			t = parseInt(s.top);
			b =t + parseInt(s.height);
			var sw = EL.width(o);//original width,height
			var sh = EL.height(o);
			var w,h;
			function _inFmove(evt){
				EVT.cancelB(evt);				
				var x = EVT.pointerX(evt);
				var y = EVT.pointerY(evt);
		
				if(x > 0 && y > 0 && x < opt.maxAreaWidth && y < opt.maxAreaHeight){
					switch(direct){
						case "se":{
							w = x - l;
							h = y - t;
							if(x > l ){
								if(_checkWidth(w)){_set("width",w);}
							}
							if(y > t){								
								if(_checkHeight(h)){_set("height",h);}
							}
							break;
						};
						case "sw":{
							w = r - x;
							h = y - t;
							if(r > x){
								if(_checkWidth(w)){_set("left",x);_set("width",w);}
							}
							if(y > t){
								if(_checkHeight(h)){_set("height",h);}
							}
							break;
						};
						case "nw":{
							w = r - x;
							h = b - y;
							if(r > x){
								if(_checkWidth(w)){_set("left",x);_set("width",w);}
							}
							if(b > y){
								if(_checkHeight(h)){_set("top",y);_set("height",h);}
							}
							break;
						};
						case "n":{
							h = b - y;
							if(b > y && _checkHeight(h)){_set("top",(b - h));_set("height",h);}
							break;
						};
						case "e":{
							w = x - l;
							if(x > l && _checkWidth(w)){_set("width",w);}
							break;
						};
						case "s":{
							w = r - l;
							h = y - t;
							if(y > t && _checkHeight(h)){_set("height",h);}
							break;
						};
						case "w":{
							w = r - x;
							if(r > x && _checkWidth(w)){_set("left",x);_set("width",w);}
							break;
						};
						default:{//"ne"
							w = x - l;
							h = b - y;
							if(x > l){
								if(_checkWidth(w)){_set("width",w);}
							}
							if(b > y){
								if(_checkHeight(h)){_set("top",y);_set("height",h);}
							}
						};
					};
				}
			};
			function _set(type, n){
				s[type] = n + "px";
			}
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
		this.resizeTo = function(o, w, h){
			if (!(o = $(o)) || !o.resizeable) return;
			o.style.height = h +"px";
			o.childNodes[1].childNodes[0].style.height = (h - 45) +"px";
			o.childNodes[1].childNodes[1].style.height = (h - 47) +"px";
			o.childNodes[1].childNodes[2].style.height = (h - 45) +"px";
			o.style.width = w +"px";
			o.childNodes[0].childNodes[1].style.width = (w - 30) +"px";
			o.childNodes[2].childNodes[1].style.width = (w - 30) +"px";
			o.childNodes[1].childNodes[1].style.width = (w - 32) +"px";	
			GUI.window.setTitleWidth(o);
		};
		this.open = function(url,windowId,iconUrl,title,options){
			var content = "[pg]" + url;
			if(!openedWindowArr.contains(windowId)){//window not exist then create new
			  return this.create(windowId,iconUrl,title, content,options);
			}
			else{
				var o = $(windowId);
				if(o && (o.windowType == "iframe")){
					this.openUrl(windowId,url);
				}
				else {
					WIN.debug('Window which id == "' +  windowId + '"is exist but not a iframe type!');
					return null
				}
			}
		};
		this.openDiv = function(content,windowId,iconUrl,title,options){
			if(!openedWindowArr.contains(windowId)){//window not exist then create new
			  return this.create(windowId,iconUrl,title, content,options);
			}
			else{
				var o = $(windowId);
				if(o && (o.windowType == "div")){
					this.setContent(windowId,setContent);
				}
				else {
					WIN.debug('Window which id == "' +  windowId + '"is exist but not a div type!');
					return null
				}
			}
		};
		//set
		this.setContent = function(o,content){
			if (!(o = $(o))) return;
			var contentPart = o.childNodes[1].childNodes[1];//window.body.div2.
			contentPart.innerHTML = content;
		};
		this.openUrl = function(o,url){
			if (!(o = $(o))) return;
			var contentPart = o.childNodes[1].childNodes[1];//window.body.div2.
			contentPart.childNodes[0].src = url;
		};
		this.setBtnStyle = function(o,type){
			if (!(o = $(o)) || o.disable) return;
			setBTNbgSrc(o,(imgPath + btnImgArr[type]));
		};
		this.setIcon = function(o,url){
			if (!(o = $(o))) return;
			o.childNodes[0].childNodes[1].childNodes[0].style.backgroundImage = "url(" + url + ")";
		};
		this.setTitle = function(o,title){
			if (!(o = $(o))) return;
			//mywin.mytie.titleTxt.span.innerHTML
			o.childNodes[0].childNodes[1].childNodes[1].childNodes[0].innerHTML = title;
		};
		this.setTitleWidth = function(o){
			if (!(o = $(o))) return;
			var titleMaxWidth = EL.width(o.childNodes[0]) - 150;
			var txtNode = o.childNodes[0].childNodes[1].childNodes[1].childNodes[0];//title bar text node
			txtNode.style.width = "auto";
			var txtNodeWidth = EL.width(txtNode);//get auto width;
			if(txtNodeWidth > titleMaxWidth)EL.width(txtNode,titleMaxWidth);
		};		
		this.setTop = function(o){
			if (!(o = $(o))) return;
			if(o.isModalMode)return;//when window is on modalMode no need to set top;
			var cZindex = parseInt(o.style.zIndex || 0);
			if(cZindex == windowTopZindex)return true;
			//blur lastWindow
			var lastWindow = $(zIndexQueue.getLastId());
			if(lastWindow)setWindowFocusStyle(lastWindow,false);
			//update (subtract 1) all zIndex of the windows whose zIndex are greater than cZindex;
			var upWindow;
			var arr = zIndexQueue.windowIdArr;
			var ind;//array index
			if(cZindex == 0) ind = -1;//if new window update all above
			else ind = zIndexQueue.getIndFromZ(cZindex);
			for(var i = ind + 1; i < arr.length; i ++){
				upWindow = $(arr[i]);
				if(upWindow)upWindow.style.zIndex -= 1;
			}
			if(cZindex != 0){//if old window then skiptotop
				zIndexQueue.skipToEnd(o.id);
			}
			else{//new window
				zIndexQueue.push(o.id);
			}
			//set current window to top
			o.style.zIndex = windowTopZindex;
			setWindowFocusStyle(o,true);
			return true;			
		};
		this.setModalMode = function(o){
			if (!(o = $(o))) return;
			o.style.zIndex = modalZindex;
			if(!objCache.modal){
				objCache.modal = EFF.cloneLayerFromObj(document.body,{
																							opacity:1,
																							zIndex :modalZindex - 1});
			}
			else{
				objCache.modal.style.display = "block";
			}
			ANI.fade(objCache.modal,1,50,gradualTime,2);
			EFF.setSelectElementVisibility();//hidden
		};
		this.unsetModalMode = function(){
			var modalObj = objCache.modal;
			if(!modalObj)return false;			
			ANI.fade(objCache.modal,50,1,gradualTime,2,function(){modalObj.style.display = "none";});
			EFF.setSelectElementVisibility(true);//visible
		};
		//private data rw
		this.getOpenedWindowId = function(){
		  return openedWindowArr.slice(0);
		};
		EVT.observe(window,"resize",function (){//window resize event
     		var arr = GUI.window.getOpenedWindowId();
				var win;
				for(var i = 0 ; i <arr.length; i++ ){
					win = $(arr[i]);
					if(win && (win.max == 1)){
						GUI.window.resizeTo(win,winLayout.maxWidth(),winLayout.maxWidth());
					}
				}
			});
	};
	GUI.initWindow= function(opt){
		GUI.window = new win(opt);
	};
})();
