/* tblrLayout.js
SV tblrLayout appends toolBar and sideBar;
*/
require.provide("sv.common.layout.tblrLayout");
require("lib.evt.engin");
require("app.gui.layout.tblrLayout");
require("sv.common.layout.cfg");

namespace("SV");
SV.TBLR_Layout = WIN.createClass(function(){
  },{    
    topPanelHeight : 30,
		leftPanelWidth : 200,
		leftPanelBg : "#eee",
		isFrameContent : true,
		initContentUrl : "about:blank",
		autofitLeftPanelOverflow : true,
		
		initialize : function(options){
			SV.TBLR_Layout.$initialize.call(this, options);
			this.addObservers("oncomponentsready");
			if(this.builded) this.initPageComponents();
			else this.addListener("onbuild", Function.bind(this.initPageComponents, this));
			this.leftPanelHeightObserver = new WIN.Observer();
			return this;
    },
		initPageComponents : function(){
			var bp = GUI.Layout.bodyPanel,
					tl = bp.tlPanel,
					br = bp.brPanel,
					brtl = br.tlPanel,
					brbr = br.brPanel,
					cfg = SV.Config,
					tbEle = $(cfg.toolBarId);
			var tbCtnHtml = '<div oncontextmenu="EVT.cancelBnD(event);">'
											+ '<div class="sv_line"></div>'
										+ '</div>';
			var tbCtn = EL.createElementsByHtml(tbCtnHtml)[0];
			tl.dom.appendChild(tbCtn);
			if(WIN.isElement(tbEle)){
				tbCtn.insertBefore(tbEle, tbCtn.firstChild);
			}
			brtl.setStyle({
				background : this.leftPanelBg,
				position : "relative"
			});
			var contentEle;
			if(this.isFrameContent){
				var html = '<iframe style="width:100%; height:100%;" src="' + this.initContentUrl + '" frameborder="0"></iframe>';
				contentEle = EL.createElementsByHtml(html)[0];
			}
			else{
				contentEle = $(cfg.contentDivId);
				if(!WIN.isElement(contentEle)){
					contentEle = EL.c(null, {
					  width : "100%",
						height : "100%"
					});
				}
			}
			brbr.dom.appendChild(contentEle);
			this.contentEle = contentEle;
			if(this.autofitLeftPanelOverflow){
				this._checkLeftPanelOverflow();
			}
			this.fireObserver("oncomponentsready");
		},
		/* {
		():
			{boolean} setContent({HTMLElement | string} content)
		DES:
			set content;
			Note : if this.isFrameContent you should use open method;
		RTN:
			returns true if content setted.
		} */
		setContent : function(content){
			if(this.isFrameContent)return false;
			var ele = this.contentEle;
			if(!WIN.isElement(ele))return false;
			if(WIN.isElement(content)){
				ele.appendChild(content);
			}
			else if(WIN.isString(content)){
				ele.innerHTML = content;
			}
			return true;
		},
		/* {
		():
			{boolean} open({string} url)
		DES:
			open a url;
			Note : if not this.isFrameContent you should use setContent method;
		RTN:
			returns true if content setted.
		} */
		open : function(url){
			if(!this.isFrameContent || !WIN.isString(url))return false;
			this.contentEle.src = url;
			return true;
		},
		/* {
		():
			{boolean} clear()
		DES:
			clear content.
		RTN:
			returns true if content cleared.
		} */
		clear : function(){
			var ele = this.contentEle;
			if(!WIN.isElement(ele))return false;
			if(this.isFrameContent){
				ele.src = "about:blank";
			}
			else{
				ele.innerHTML = "";
			}
			return true;
		},
		/* {
		():
			{boolean} clear()
		DES:
			clear content.
		RTN:
			returns true if content cleared.
		} */
		insertCP : function(CP, refCP){
			if(! (CP && WIN.isFunction(CP.setWidth)))return null;
			var cpEle = CP.dom;
			if(!WIN.isElement(cpEle))return null;
			
			if(!this.collapsablePanels)this.collapsablePanels = [];
			var ele = this.leftPanel.dom,
					cps = this.collapsablePanels;
			if(refCP){
				var refEle = refCP.dom;
				if(WIN.isElement(refEle)){
					ele.insertBefore(cpEle.refEle);
					cps.insertBefore(CP, refCP);
				}
			}
			else{
				ele.appendChild(cpEle);
				cps.push(CP);
			}
			EL.setStyle(cpEle, { margin: "5px"});
			CP.setWidth(this.leftPanel.getWidth() - 12);
			return CP;
		},
		removeCP : function(CP){
			if(! (CP && WIN.isFunction(CP.setWidth)))return null;
			var ele = this.leftPanel.dom,
					cpEle = CP.dom,
					cps = this.collapsablePanels;
			if(WIN.isElement(ele) && WIN.isElement(cpEle) && WIN.isArray(cps)){
				ele.removeChild(cpEle);
				cps.remove(CP);
			}
		},
		autofitTopHeight : function(){
		},
		autofitLeftWidth : function(){
			var panel = this.leftPanel,
					ele = panel.dom,
					w = this._leftPanelOverflowed ? 18 : 0;
			this.setCpsWidth(panel.getWidth() - 12 - w);
		},
		setCpsWidth : function(value){
			var cps = this.collapsablePanels;
			Array.each(function(cp){
			  cp.setWidth(value);
			}, cps);
		},
		onReady : function(f){
			this.addListener("oncomponentsready", f);
		},
		
		_checkLeftPanelOverflow : function(){
			var panel = this.leftPanel,
					ele = panel.dom,
					self = this;
			setInterval(function(){
			  var offsetHeight = ele.offsetHeight,
						scrollHeight = ele.scrollHeight,
						o = self._leftPanelOverflowed,
						oHeight = this._oLeftPanelOffsetHeight;
				if(scrollHeight > offsetHeight){
					self._leftPanelOverflowed = true;
				}
				else if(scrollHeight <= offsetHeight){
					self._leftPanelOverflowed = false;
				}
				if(oHeight != offsetHeight){
					self.leftPanelHeightObserver.execute();
				}
				if(o != self._leftPanelOverflowed){
					self.autofitLeftWidth();
				}
			}, 500);
		},
    toString: function(){return "[object SV.TBLR_Layout]";}
  },
	GUI.TBLR_Layout
);
SV.Config.layoutType = SV.TBLR_Layout;