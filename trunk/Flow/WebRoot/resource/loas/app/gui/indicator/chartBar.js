/* chartBar.js
*/
require.provide("app.gui.indicator.chartBar");
require("lib.core.util.SimpleTemplate");
require("lib.core.util.ObserverProvider");

namespace("GUI");
GUI.ChartBar = WIN.createClass(function(){
  },{
    barWidth : 100,
		container : null,		
		categroies : null,
		mormalBgList : ["#00FF00", "#FFFF00", "#FF0000", "#CAC8BB", "#0000FF", "#FF00FF"], //green, yellow, red, gray, blue, pink;
		
		initialize : function(options){
      WIN.extend(this, options);
			if(!WIN.isArray(this.categroies)){
				throw{
					description : this.toString() + " -> initialize() categroies isnt array!"
				};
			}
			this.addObservers("onCategoryChange");
			this.addListener("onCategoryChange", Function.bind(this._hndCategoryChange, this));
			this.build();
      return this;	
    },
		build : function(){
			var html = this._createCategoriesHtml();
			if(!String.notEmpty(html)){
				throw {
					description : this.toString() + " -> build() cant create categories html!"
				};
			}
			var ele = this.dom = EL.createElementsByHtml(html)[0],
					ctn = this.container;
			if(WIN.isElement(ctn)){
				ctn.appendChild(ele);
			}
			this._bindDom();
			this.fireObserver("onCategoryChange");
    },
		
		setCategoryValue : function(name, value){
			var ctg = this.getCategory(name);
			if(ctg){
				var oVal = ctg.value;
				if(oVal != value){
					ctg.value = value;
					this.fireObserver("onCategoryChange", ctg, value);
				}
			}
			return this;
    },
		getCategory : function(name){
			var ctg, cName,
					ctgs = this.categroies;
			if(!WIN.isArray(ctgs)) return this;
			Array.each(function(c, index){
			  cName = c.name || index;
				if(cName == name){
					ctg = c;
					throw Object;
				}
			}, ctgs);
			return ctg;
		},
		
		_total : 0,
		
		_bindDom : function(){
			var ele = this.dom;
			if(ele){
				this.categoryElementsCtn = ele.getElementsByTagName("tr")[0];
			}
    },
		_createCategoriesHtml : function(){
			var name, bg, values, html,
					categoriesHtml = "",
					bgList = this.mormalBgList,
					ctgs = this.categroies;
			if(!WIN.isArray(ctgs)) return ;
			
			Array.each(function(c, index){
				if(!c)return ;
				bg = c.bg || bgList[index];
				if(!bg){
					var ind = (bgList.length - 1) * Math.random();
					bg = bgList[ind] || "#fff";
				}
				bg = "background:" + bg + ";";
				name = c.name || index;
				categoriesHtml += '<td categoryName="' + name + '" style="' + bg + '">&nbsp;</td>';
			}, ctgs, 0, this);
			
			values = {
				width : EL.parseUnit(this.barWidth),
				categoriesHtml : categoriesHtml
			};
			html = this._htmlTpl.apply(values);
			return html;
    },
		_hndCategoryChange : function(category, value){
			var val, node, s, display,
					total = this._getTotal(),
					ele = this.categoryElementsCtn,
					nodes = ele.childNodes,
					ctgs = this.categroies;
			if(!total) return ;
			Array.each(function(c, index){
				node = nodes[index];
				s = node.style;
			  val = parseFloat( (c.value/total) * 100 ) ;
				s.display = (val == 0) ? "none" : "";
				s.width = val + "%" ;
				//WIN.debug('s.width = ' + s.width + '<br />' + 'index = ' + index);
			}, ctgs, 0);
    },
		_getTotal : function(){
			var ctgs = this.categroies;
			if(!WIN.isArray(ctgs)) return 0;
			var val,
					t = 0;
			Array.each(function(c){
			  val = parseInt(c.value);
				t += isNaN(val) ? 0 : val;
			}, ctgs);
			return t;
    },
		_htmlTpl : new WIN.SimpleTemplate(''
			+ '<div class="gui_chartBar" style="width:{width};">'
				+ '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
					+ '<tr>{categoriesHtml}</tr>'
				+ '</table>'
			+ '</div>'),
    toString: function(){return "[object GUI.ChartBar]";}
  },
	WIN.ObserverProvider
);
