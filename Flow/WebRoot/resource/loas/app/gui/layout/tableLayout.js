/* tableLayout.js
*/
require.provide("app.gui.layout.tableLayout");
require("lib.core.util.ObserverProvider");
require("lib.core.util.SimpleTemplate");
require("lib.rpc.util.asyncXhr");
require("app.gui.layout.collapsablePanel");
require("app.gui.tree.tree");


GUI.LR_TableLayout = WIN.createClass(function(){
  },{    
		initContentUrl : "about:blank",
		leftPanelWidth : 200,
		leftPanelTitle : "",
		treeDataXml : "",
		treeXmlFieldMapping : "",
		
    htmlTpl : new WIN.SimpleTemplate('<table class="gui_tableLayout" style="width:100%; height:{height}" border="0" cellspacing="0" cellpadding="0">'
			+	'<tr>'
			+ ' <td valign="middle" class="header">{title}</td>'
			+	'	<td rowspan="2" valign="top" style="height:100%; border-left:solid #7F9DB9 1px;">'
			+	'		<iframe frameborder="0" src="{src}" style="width:100%; height:100%;">'
			+	'		</iframe>'
			+	'	</td>'
			+	'</tr>'
			+	'<tr>'
			+	'	<td valign="top" style="width:{leftPanelWidth}; height:{treeHeight}; background-color:#D7E5F5;">'
			+ '		<div style=" width:100%; height:100%; overflow:auto; position:relative;">'
			+	'		</div>'
			+	'	</td>'
			+	'</tr>'
			+	'</table>'),
		treeNodesAction : function(actionData, node){
			if(WIN.isString(actionData) && (this.contentUrl != actionData)){
				this.contentUrl = actionData;
				this.contentEle.src = actionData;
			}
		},
		
    initialize : function(options){
			WIN.extend(this, options);
			this.build();
			return this;
    },
    build : function(){
      var H = DOC.getClientHeight();
			var values = {
        src : this.initContentUrl,
				title : this.leftPanelTitle,
				height : EL.parseUnit(H),
				treeHeight : EL.parseUnit(H - 20),
				leftPanelWidth : EL.parseUnit(this.leftPanelWidth)
      };
			var self = this,
					html = this.htmlTpl.apply(values),
					ele = this.dom = EL.createElementsByHtml(html)[0];
			document.body.appendChild(ele);
			this._bindDom();
			
			this.tree = (new GUI.Tree).initialize({
				container : this.leftPanelEle,
				nodeAction : Function.bind(this.treeNodesAction, this)
			});
			EL.setStyle(this.tree.dom, {height : "100%"});
			RPC.onResponseXml(this.treeDataXml, function(xmlDoc){
				self.tree.loadXmlData(xmlDoc, self.treeXmlFieldMapping);
			});
			EVT.observe(window, "resize", Function.bind(this.autoHeight, this));
			return this;
    },
		autoHeight : function(){
			var H = DOC.getClientHeight();
			this.setHeight(H);
			var panelEle = this.leftPanelCtnEle,
					titleEle = this.leftPanelTitleEle;
			EL.setStyle(titleEle, {height : "20px"});
			var h = titleEle.offsetHeight;
			EL.setStyle(panelEle, {height : EL.parseUnit(H - h)});
		},
		setHeight : function(value){
			EL.setStyle(this.dom, EL.parseUnit(value));
			return this;
		},
		_bindDom : function(){
			var ele = this.dom;
			this.leftPanelTitleEle = ele.rows[0].cells[0];
			this.leftPanelEle = ele.getElementsByTagName("div")[0];
			this.leftPanelCtnEle = this.leftPanelEle.parentNode;
			this.contentEle = ele.getElementsByTagName("iframe")[0];
		},
    toString: function(){return "[object SV.LR_TableLayout]";}
  },
  WIN.ObserverProvider
);
