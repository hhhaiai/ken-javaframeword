/***************************************************************
accordionmenu.js
defined GUI.VerticalMenu module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.menu.accordionmenu");
//require resource
require("app.gui.engin");

GUI.AccordionMenu = function(){
  GUI.AccordionMenu.superClass.apply(this);
  /* 
  ():
    {void} handleOptions()
  DES:
    handle options
  */
	this.handleOptions = function(options){
    if(!options)options ={};
		var opt = WIN.extendExclude({
			container   : document.body,
			startFocusIndex  : 1,
			cmdRender   : null,//menu subItem cmdText render function
			layout      : {
				wrapCss      : "gui_accordionmenu_wrap",
				posWrapCss   : "gui_accordionmenu_pos_wrap",
				barWrapCss   : "gui_accordionmenu_bar_wrap",
				height    : 350,
				width     : "auto",
				itemHeadHeight: 27,//!important,should equal to item layout headHeight().
				unknown : null
			},
			unknown : null			
	}, options, ["layout"]);
		opt.container = $(opt.container);
		WIN.extend(opt.layout, options.layout);
		
		return opt;
	};	
  /*
  ():
    {void} _buildView()
  DES:
    build inner progress: _buildView
  */
  this._buildView = function(){
		this._createWrap();
		if(WIN.isElement(this.container))this.container.appendChild(this.ele);
  };
  /*
  ():
    {void} _createWrap()
  DES:
    _buildView inner progress: _create wrapper
  */
	this._createWrap = function(){
		var layout = this.layout;
    var wrap = this.ele = EL.c({
			className : layout.wrapCss
    });
		if(layout.width)wrap.style.width = EL.parseUnit(layout.width);
		if(layout.height)wrap.style.height = EL.parseUnit(layout.height);
		
		var posWrapEle = this.posWrapEle = EL.c({//relative position wrap
			className : layout.posWrapCss
		});
		
		var barWrapEle = this.barWrapEle = EL.c({//absolute position wrap
			className : layout.barWrapCss
		});
		posWrapEle.appendChild(barWrapEle);
		wrap.appendChild(posWrapEle);
	};
	this.addItem = function(name, item){
		if(!this.items)this.items = {};
		if(!(name && item))return false;
		
		var ele = item.ele, name = name.toLowerCase();
		var itemContainer = this.barWrapEle;
		if(!WIN.isElement(ele))return false;
	  itemContainer.appendChild(ele);
		
		ele.tbItemName = name;
		this.items[name] = item;
		this.initItemEleOnAdd(item);
		this.onItemsChange(item);
		return true;
	};
  this.onItemsChange = Function.empty;
	this.initItemEleOnAdd = function(item){
		if(!item)return;
		var itemNum = this.barWrapEle.childNodes.length;
		var itemHeadHeight = parseInt(this.layout.itemHeadHeight);
		var ele = item.ele;
		
		EL.setStyle(ele,{
			position : "absolute",
			zIndex   : itemNum,
			left     : 0,
			top      : EL.parseUnit((itemNum - 1) * itemHeadHeight)
		});
		
		EL.setAttr(ele,{
			itemIndex   : (itemNum - 1),
			canMoveUp   : false
		});
		this.setItemEle_height();
		item.head.ele.onclick = this.initItemHeadHndOnclick;
	};
	this.initItemHeadHndOnclick = Function.curry(function(obj){
			obj.moveItemEle(this.parentNode);
		}, this);
	
	this.setItemEle_height = function(){
		var itemNum = this.barWrapEle.childNodes.length;
		var itemHeadHeight = parseInt(this.layout.itemHeadHeight);
		var headsHeight = (itemNum - 1) * itemHeadHeight;
		var H = parseInt(this.getHeight()), items = this.items;
		var itemHeight = H - headsHeight;
		this.layout.availScrollHeight = itemHeight - itemHeadHeight;
		for(var i in items){
			items[i].setHeight(itemHeight);
		}
	};
	this.setActiveItem = function(which){
		var item, items = this.items;
		if(!items || !which)return false;
		if(WIN.isString(which)){
			which = which.toLowerCase();
			item = items[which];
		}
		else if(!isNaN(which)){
			which = which - 1;
			if(which >= 0)this.moveItemEle(this.barWrapEle.childNodes[which]);
		}
		else if(WIN.isObject(which)){
			item = which;
		}
		if(!item)return false;
		this.moveItemEle(item.ele);
	};
	/*
	():
		{void} loadItemsData({array} data)
	DES:
		load items data;
	ARG:
		{array} data
		data type:
		[
		  [//item 1
			 
			  "item head 1",//item headText
				
				{//subItem 1
					title : "title1",  //subItem1 title
					icon  : "*.gif",   //subItem1 icon
					cmd   : "alert(0);"//subItem1 command
				},
				
				{//subItem 2
					..
				}
			],
			
			[//item 2
			 ..
			]
		]
	*/
	this.loadItemsData = function(data){
		var autoId1 = autoId2 = 0, _this = this;
		function parse(item){
		  var vm = new GUI.VerticalMenu();
			vm.initialize({
				headText : item[0],
				layout:{width : "100%"}
			});
			Array.each(function(j){
				vm.addItem(("AccordionMenuSubItem" + autoId2), j.title, j.icon, j.cmd);
				autoId2 += 1;
			},item, 1);
			
			_this.addItem(("AccordionMenuItem" + autoId1), vm);
			autoId1 += 1;
		}
		
		Array.each(parse, data);
		this.setActiveItem(this.startFocusIndex);
	};	
	
	this.laodItemsXMLData = function(xml){
		if(!WIN.isObject(xml) && !xml.getElementsByTagName)return false;
		var data = [], items, subItems, cmd, cmdRender = this.cmdRender, menuItemIndex = 0;
		items = xml.getElementsByTagName("items")[0].childNodes;
		
		Array.each(function(i){
			try{
				subItems = i.getElementsByTagName("item");
				if(subItems.length < 1)return ;
				data[menuItemIndex] = [];
				data[menuItemIndex][0] = i.getAttribute("label");
				
				Array.each(function(j, index){
					cmd = j.getAttribute("cmd");
					if(!cmd && WIN.isFunction(cmdRender))cmd = cmdRender(j.getAttribute("path"));
					data[menuItemIndex][index + 1] = {
						title : j.getAttribute("label"),
						icon  : j.getAttribute("icon"),
						cmd   : cmd
					};					
				}, subItems);
				menuItemIndex += 1;
			}catch(e){}
		}, items);
		
		this.loadItemsData(data);
	};
	this.moveItemEle = function(ele){
		if(!WIN.isElement(ele))return ;
		var index = ele.itemIndex, i, target;
		var chd = this.barWrapEle.childNodes, len = chd.length;
		var itemHeight = this.layout.availScrollHeight;
		if(ele.canMoveUp){
			for(i=0; i<=index; i++ ){
				target = chd[i];
				if(target.canMoveUp){
					GUI.AccordionMenu.moveItem(target, itemHeight);
					target.canMoveUp = false;
				}
			}
		}
		else{//moveitemdown
			for(i=index+1; i<len; i++ ){
				target = chd[i];
				if(!target.canMoveUp){
					GUI.AccordionMenu.moveItem(target, (-itemHeight));
					target.canMoveUp = true;
				}
			}
		}
	};
	this.setHeight = function(h){
		if(!h)return ;
		h = parseInt(h);
		var itemNum = this.barWrapEle.childNodes.length;
		var itemHeadHeight = parseInt(this.layout.itemHeadHeight);
		var headsHeight = itemNum  * itemHeadHeight;
		if(headsHeight > h) h = headsHeight;//min height = headsHeight;
		var chgheight = parseInt(this.getHeight()) - h;
		GUI.AccordionMenu.$setHeight.call(this, h);
		if(this.items){
			this.setItemEle_height();
			var chd = this.barWrapEle.childNodes, len = chd.length;
			for(var i=0; i<len; i++){
				if(chd[i].canMoveUp)GUI.AccordionMenu.moveItem(chd[i], chgheight);
			}
		}
	};
};
WIN.extendClass(GUI.AccordionMenu, GUI.Box);

WIN.extend(GUI.AccordionMenu,{
	/*
	bug: during ani moving menu items,if we reset its height it'll ocurr error; we should check whether it is moving;
	*/
  moveItem_ani   : function(ele, distance, callback){
		var y =  parseInt(ele.style.top) - parseInt(distance);
		if(typeof ANI != "undefined"){
			if(WIN.isObject(ANI) && WIN.isFunction(ANI.move))ANI.move(ele, 0, y, 300, 2, callback);
		}
		else ele.style.top = EL.parseUnit(y);
	},
  moveItem : function(ele, distance){
		var y =  parseInt(ele.style.top) - parseInt(distance);
		ele.style.top = EL.parseUnit(y);
	}
});






