/***************************************************************
engin.js
window and dialog gui base
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.widget.engin");
//register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
require.registerPackage("app.gui.win",{
  files   :["window","tab","dialog"]
});
//require resource
require("lib.dom.engin");
require("lib.dom.style");
require("lib.dom.layout.size");
require("lib.evt.engin");
require("app.dnd.engin");
require("app.ani.engin");
require("app.eff.engin");
require("app.gui.engin");

function GUIwndBaseModel(){//window & dialog common methods
	this.close = function(){
		
	};
}
/*
():
  setPNGbackground(ele, url)
DES:
  set a png image as background,compatible with ie; 
*/
function setPNGbackground(ele, url){
	var stl = ele.style;
	if(BROWSER.IE){
		stl.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "', sizingMethod='scale');"
	}
	else{
		stl.backgroundImage = "url('" + url + "');";
	}
}
function GUIwndViewBuilder(){//common view
	var def_EV = {//default set for environmental variance
		};
	var def_RES = {//default set for resouces
		imgPath   	: "../../../../loas/app/resource/gui/win/default/",//image path
		//biStatusBG = [normal,mouseover,mouseout,down,clicked],different events imgSrc;
		biStatusBG 	:{
			  normal    : "c.gif",
			  mouseover : "c1.gif",
			  mousedown : "c2.gif",
				disable   : "c.gif"
			},
		css   			: {
			window       :"win",
			titleWrapper :"tie",
			body         :"boy",
			botttom      :"bom",
			titleBar     :"wtt",
			titleTxt     :"wttxt",
			icon         :"wicon",
			btnContainer :"wbtnWrap",
			biMinimize   :"wmin",
			biMaximize   :"wmax",
			biSystemMenu :"wclo",
			biHelp       :"whelp",
			btnDisable   :"btnDisable",
			windowUnfocus:"wUnFocus"
		}
	};
	var def_INS = {//default set for win view instance
	};
	var def_INTERFACE = {//default interface
	};
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
	var biCssArr = [def_RES.css.btnMin,def_RES.css.btnMax,def_RES.css.btnClose];//we need this to identify different btn;
	var openedWindowArr = [];// to record created windows;
	var objCache = {
		drag:null,
		resize:null,
		modal:null
	};
	this.initialize = function(options){
		if(!WIN.isObject(options))return this;
		var opt = WIN.clone(options);
		WIN.extend(def_EV,opt.def_EV || {});
		WIN.extend(def_RES,opt.def_RES || {});
		WIN.extend(def_INS,opt.def_INS || {});
		WIN.extend(def_INTERFACE,opt.def_INTERFACE || {});
		return this;
	};
	this.create = function( title, iconUrl, wBody, options){
		var opt = WIN.clone(def_INS);
		if(!options)options = {};
		WIN.extend(opt, options);
		iconUrl = iconUrl || def_RES.imgPath + opt.iconSrc;
		title = title || opt.title;
		wBody = wBody || opt.body;
		if(!opt.id)opt.id = opt.autoCreateId(def_EV.idPrefix, def_EV);
		if(!opt.left)opt.left = opt.autoLeft(opt.width);
		if(!opt.top)opt.top = opt.autoTop(opt.height);
		//
		var viewIns = new def_EV.wndViewCarrier();
		cMain(viewIns,opt);//window wrapper 
		cTitleBar(viewIns, title, iconUrl);//set title,icon
		this.initBody(viewIns, wBody);//set body content
		this.initBorderIcons(viewIns, opt.biOptions, opt.biDisableOptions, opt.biClickHnds);
		return viewIns;	
	};
	this.cBody = function(ins, content, contentType){
		var wndMain = ins.vMain.ele;
		var winBody = wndMain.childNodes[1].childNodes[1];
		var v = ins.vBody = new viewMgr();
		v.extend({
			ele 		: winBody,
			tag		  : contentType,//content tagName
			setContent   :function(content){
				if(WIN.isElement(winBody)){
					var tag = this.tag;//can't use v to replace ins.vBody
					try{
						if( tag == "iframe"){
							winBody.childNodes[0].src = content;
						}
						else if( tag == "div"){
							winBody.innerHTML = content;
						}
					}catch(e){WIN.debugFn("setContent",e,"check content type!");}
				}
			}
		});
		if (contentType == "iframe"){
			winBody.innerHTML = "<iframe src='"+ content +"' frameBorder='0' marginHeight='0' marginWidth='0' width='100%' height='100%'></iframe>";
			}
		else{
			winBody.innerHTML = content;
		}
		v = null;
	};
	this.cBorderIcon = function(ins, type, isDisable, clickHnd){
		var wndMain = ins.vMain.ele;
		var biContainer = ins.vTitleBar.ele.childNodes[2];
		var title,vProperty;
		switch(type){
			case "biSystemMenu":{
				title = "关闭窗口";
				break;
			};
			case "biMinimize":{
				title = "最小化";
				break;
			};
			case "biMaximize":{
				title = "最大化";
				break;
			};
			default:{
				title = "帮助";
			}
		}
		var bi = new viewMgr();
		bi.initElement({
				className : def_RES.css[type],
				wndId		  : wndMain.id,
				biType    : type,
				disable   : isDisable,
				title     : title
			},null,{
				click     : clickHnd,
				dblclick  : EVT.cancelB,
				mouseover : function(){setBIstatusStyle(this, "mouseover");},
				mouseout  : function(){setBIstatusStyle(this, "normal");},
				mousedown : function(){setBIstatusStyle(this, "mousedown");EVT.cancelB();},
				mouseup   : function(){setBIstatusStyle(this, "normal");}
			});
		bi.extend({
			  disable    : function(){
					this._setBIStatus(true);
					this._setBIstyle(true);
				},
			  enable     : function(){
					this._setBIStatus(false);
					this._setBIstyle(false);
				},
				_setBIstyle :function(isDisable){
					var ele = this.ele;
					if(!ele)return;
					if(isDisable)setBIstyleByStatus(ele, "disable");
					else setBIstyleByStatus(ele, "normal");
				},
				_setBIStatus :function(isDisable){
					var ele = this.ele;
					if(ele)ele.disable = isDisable;
				}
			});
		bi._setBIstyle(isDisable);
		biContainer.appendChild(bi.ele);
		vProperty = "v" + String.capitalize(type);//vBiSystemMenu||vBiMinimize
		ins[vProperty] = bi;
		function setBIstatusStyle(ele, status){
			if(ele.disable)return;
			setBIstyleByStatus(ele, status);
		}
		function setBIstyleByStatus(ele, status){
			var url = def_RES.imgPath + def_RES.biStatusBG[status];
			ele.style.backgroundImage = "url(" +  url + ")";
		}
		return bi;
	};
	function cMain(ins, opt){//
		function cMain_Inner(ins,opt){//3 parts: tie(title bar),boy(body),bom(bottom)
			var wndMain = ins.vMain.ele;
			var id = wndMain.id;
			WIN.debug('id= ' + id);
			var w = opt.width, h = opt.height, l = opt.left, t = opt.top;			
			var winTie = EL.c({className:def_RES.css.titleWrapper});
			var winBoy = EL.c({className:def_RES.css.body});
			var winBom = EL.c({className:def_RES.css.botttom});
			
			wndMain.appendChild(winTie);
			wndMain.appendChild(winBoy);
			wndMain.appendChild(winBom);
			//winTag = [obj,cursorStyle, height, width, backgroundImage]
			var winTag = [ [winTie, "nw", 30,   15,   "t1"],
										 [winTie, "n" , 30,   w-30, "t2"], 
										 [winTie, "ne", 30,   15,   "t3"], 
										 [winBoy, "w" , h-45, 15,   "l1"], 
										 [winBoy, ""  , h-47, w-32      ], 
										 [winBoy, "e" , h-45, 15,   "r1"], 
										 [winBom, "sw", 15,   15,   "l2"], 
										 [winBom, "s" , 15,   w-30, "b1"], 
										 [winBom, "se", 15,   15,   "r2"] ];
			for (var i = 0; i < 9; i++){
				var temp = EL.c({
					  wndId		 :id,
						direction:winTag[i][1]
					});
				winTag[i][0].appendChild(temp);
				var commonCss = "float:left;height:"+ winTag[i][2] +"px;width:"+ winTag[i][3] +"px;";
				if (winTag[i][4]){//window wrapper
					temp.style.cssText = commonCss;
				  setPNGbackground(temp ,def_RES.imgPath + winTag[i][4] + ".png");
				}
				else{//window body
					temp.style.cssText = commonCss +"background:#fff;border:1px solid #666;overflow:hidden;padding:0px";
				}
				if(i == 1){//title bar events
					var o = def_INTERFACE.titleBar;
					for(var j in o){
						if(WIN.isFunction(o[j])){
							temp[j] = o[j];
						}
					}
				}
				else if(i != 4){//windowFrame events except title bar and content 
					var o = def_INTERFACE.windowFrame;
					for(var j in o){
						if(WIN.isFunction(o[j])){
							temp[j] = Function.curry(o[j],winTag[i][1]);
						}
					}
					if(i == 8 && !def_EV.noneResize){//setResizeFlag
						ins.vResizeFlag = new viewMgr();
						ins.vResizeFlag.extend({
								ele 		: temp,
								img     :[winTag[8][4],""],
								setFlag : function(resizeable){
									var ind = resizeable ? 0 : 1;
									setPNGbackground(this.ele, (def_RES.imgPath + this.img[ind] + ".png"));
								}
							});
						ins.vResizeFlag.setFlag(opt.resizeable);
					}
				}
			}
		}
		var v = ins.vMain = new viewMgr();
		v.initElement({
				id 		   		:opt.id,
				className   :def_RES.css.window,
				resizeable  :opt.resizeable,
				minimizeable:opt.minimizeable,
				maximizeable:opt.maximizeable,
				max					:0,
				min					:0,
				reset :(opt.left + "," + opt.top + "," + opt.width + "," + opt.height)
		  },{
				position: "absolute",
				width   : opt.width + "px",
				height  : opt.height + "px",
				left    : opt.left + "px",
				top     : opt.top + "px"
			},def_INTERFACE.windowWrapper);
		v.extend({
			  moveTo  :function(l, t){
					var ele = this.ele;
					if(!WIN.isElement(ele))return;
					var stl = ele.style;
					if(!isNaN(l))stl.left = l + "px";
					if(!isNaN(t))stl.top = t + "px";
				},
				wndType	:def_EV.wndType
			});
		document.body.appendChild(v.ele);
		cMain_Inner(ins,opt);
		v = null;
	}
	function cTitleBar(ins, title,iconUrl){
		var wndMain = ins.vMain.ele;
		var titleBar = wndMain.childNodes[0].childNodes[1];
		titleBar.innerHTML = "<div class=\"" + def_RES.css.icon + "\"></div>" 
										+ "<div style=\"position:relative;left:0px;top:8px;height:23px;overflow: hidden;"
									  	+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + def_RES.imgPath
										  + "tt.png',sizingMethod=scale);cursor:default; \">"
											+ "<div class=\"" + def_RES.css.titleTxt + "\" style=\"background-color:#eee;\"></div>"
										+ "</div>"
										+ "<div class=\"" + def_RES.css.btnContainer + "\"></div>";
		var v = ins.vTitleBar = new viewMgr();
		v.extend({
			ele:titleBar,
			setTitle   :function(title){
				if(WIN.isElement(titleBar))titleBar.childNodes[1].childNodes[0].innerHTML = title;
			},
			setIcon		 :function(url){
				if(WIN.isElement(titleBar))titleBar.childNodes[0].style.backgroundImage = "url(" + url + ")";
			},
			updateBarWidth:function(){
				if(WIN.isElement(titleBar)){
					var titleMaxWidth = EL.width(titleBar) - 150;
					var txtNode = titleBar.childNodes[1].childNodes[0];//title bar text node
					txtNode.style.width = "auto";
					var txtNodeWidth = EL.width(txtNode);//get auto width;
					if(txtNodeWidth > titleMaxWidth)EL.width(txtNode,titleMaxWidth);
				}
			}
		});
		v.setTitle(title);
		v.setIcon(iconUrl);
		v.updateBarWidth();
		v = null;
	}
}


function GUIbutton(){
	
}
GUIbutton.prototype = new viewMgr();
/*
CLASS:
  
DES:
  
P_priv:
  
P_publ:
	ele:
  biType:
M_priv:

M_publ:
  
*/

function GUIborderIcon(){
	
}
GUIborderIcon.prototype = new GUIbutton();

function GUIwndInstanceBase(){//window & dialog instance common actions
	this.initialize = function(name, view, hwnd){
		this.name = name;
		this.view = view;
		if(hwnd)this.hwnd = hwnd;
		this.inheritFromHwnd(this.hwnd);
	};
	this.inheritFromHwnd = function(hwnd){
		//inherit from hwnd(GUI.window||dialog) public functions whose first variant are curried by this.name
		for(var i in hwnd){
			(i.indexOf("_") != -1 )//pseudo-private fns
			|| (i == "initialize")
			|| (this[i] = Function.bind(hwnd[i],hwnd,this.name))
		}
	};
}

function GUIwndViewCarrier(){
	this.initialize = function(wndElement){
	};
	this.moveTo = function(left, top){
		this.vMain.moveTo(left, top);
	};
	this.setContent = function(content){
		this.vBody.setContent(content);
	};
	this.setIcon = function(url){
		this.vTitleBar.setIcon(url);
	};
	this.setTitle = function(title){
		this.vTitleBar.setTitle(title);
	};
	this.updateBarWidth = function(){
		this.vTitleBar.updateBarWidth();
	};
}


function GUIdialogViewCarrier(){
	
}
GUIdialogViewCarrier.prototype = new GUIwndViewCarrier();


