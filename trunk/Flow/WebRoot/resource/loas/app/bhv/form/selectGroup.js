/* selectGroup.js
defines group selcet behavior module;
*/
require.provide("app.bhv.form.selectGroup");

/*
CLASS:
  BHV.Form.SelectGroup
DES:
  SelectGroup is a group of checkboxs, whcih contains a header to select or unselect other checkbox selector items;
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
namespace("BHV.Form");
BHV.Form.SelectGroup = WIN.createClass(
	function(){
	}, {
		/*
		P:
			{int} selectedNum
		DES:
			num of selected items.
		*/
		selectedNum : 0,
		/*
		P:
			{int} selectorNum
		DES:
			num of selector items.
		*/
		selectorNum : 0,
		/*
		():
			{this} initialize({HTMLInputElement} header, {array}items)
		DES:
			setHeader n setItems;
		ARG:
			see method setHeader n setItems;
		*/
		initialize : function(header, items){
			this.setHeader(header);
			this.setItems(items);
			return this;
		},
		/*
		():
			{this} setHeader({HTMLInputElement} header)
		DES:
			set group header;
		ARG:
		  {HTMLInputElement} header
				a checkbox input element;
		*/
		setHeader :  function(header){
			if(WIN.isElement(header)){
				this.header = header;
				EVT.observe(header, "click", Function.bind(this.toggleSelectAll, this));
			}
			return this;
		},
		/*
		():
			{this} setItems({array}items)
		DES:
			set group items;
		ARG:
			{array}items
			  array of checkbox inputs
		*/
		setItems :  function(items){
			if(items){
				var _this = this;
				this.items = items;
				Array.each(function(i){
					_this.addItem(i);
				}, items);
			}
			return this;
		},
		/*
		():
			{this} addItem({HTMLInputElement} item)
		DES:
			add a item;
		*/
		addItem : function(item){
			if(WIN.isElement(item)){
				this.selectorNum += 1;
				EVT.observe(item, "click", Function.bind(this.onItemChanged, this, item));
			}
			return this;
		},
		/*
		():
			{this} toggleSelectAll()
		DES:
			behavior of toggle selectAll;
		*/
		toggleSelectAll : function(){
			var _this = this;
			if(this.isAllSelected()){
				Array.each(function(i){ _this.selectA(i, false); }, this.items);
				this.selectedNum = 0;
			}
			else{
				Array.each(function(i){ _this.selectA(i, true); }, this.items);
				this.selectedNum = this.selectorNum;
			}
			return this;
		},		
		/*
		():
			{boolean} isAllSelected()
		DES:
			returns true when group's all items are selected;
		*/
		isAllSelected : function(){
			return (this.selectorNum && (this.selectorNum == this.selectedNum));
		},
		/*
		():
			{this} selectA({HTMLInputElement} item, {boolean} toSelect)
		DES:
			select a checkbox element no matter it's a header or a item;
		*/
		selectA : function(item, toSelect){
			if(WIN.isElement(item)){
				item.checked = toSelect;
			}
			return this;
		},
		/*
		():
			{this} onItemChanged({HTMLInputElement} item)
		DES:
			triggered when a item's onchange occurs;
		*/
		onItemChanged : function(item){
			if(WIN.isElement(item)){
				if(item.checked){
					this.selectedNum += 1;
					if(this.isAllSelected())this.selectA(this.header, true);	
				}
				else{
					if(this.isAllSelected()){
						this.selectA(this.header, false);	
					}
					this.selectedNum -= 1;
				}
			}
			return this;
		},
		unknown : null
  }
);