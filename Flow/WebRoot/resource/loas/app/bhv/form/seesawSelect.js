/* seesawSelect.js
defines BHV.Form.SeesawSelect and BHV.Form.SeesawSelectItem;
*/
require.provide("app.bhv.form.seesawSelect");
require("lib.dom.engin");

namespace("BHV.Form");
/*
CLASS:
  BHV.Form.SeesawSelect
DES:
  seesawSelect is form of a source and a dest select list .
PROPERTY:
  {object BHV.Form.SeesawSelectItem} source
    source SeesawItem
  {object BHV.Form.SeesawSelectItem} dest
    dest SeesawItem
METHOD:
  {this} initialize({BHV.Form.SeesawSelectItem || HTMLElement || id} sourceMS,
                    {BHV.Form.SeesawSelectItem || HTMLElement || id} destMS)
  {void} initBehaviors()
  {void} hndDblclickSource()
  {void} hndDblclickDest()
	{boolean} seesaw([{boolean} fromDest, {int} index])
  {void} selectAll()
  {void} unSelectAll()
*/
BHV.Form.SeesawSelect = WIN.createClass(
  function(){
  },{
    /*
    ():
      {this} initialize({BHV.Form.SeesawSelectItem || HTMLElement || id} sourceMS,
                         {BHV.Form.SeesawSelectItem || HTMLElement || id} destMS)
    DES:
      initialize ams with source and dest;if source or dest is not an SeesawItem, then we treat it as SeesawItem's initialize parameter.so you can pass HTMLElement or id to build a new SeesawItem;
			Note: make sure SeesawItem's ele attribute must be a valid HTMLElement, or we cant init its behaviors automatically.
    */
    initialize : function(sourceMS, destMS){
      var SeesawItem = BHV.Form.SeesawSelectItem;
      this.source = sourceMS instanceof SeesawItem ? sourceMS : (new SeesawItem).initialize(sourceMS);
      this.dest = destMS instanceof SeesawItem ? destMS : (new SeesawItem).initialize(destMS);      
      this.initBehaviors();
      
      return this;
    },
    /*
    ():
      {void} initBehaviors()
    DES:
      set source ele and dest ele behavior:ondblclick to add or remove items;
    */
    initBehaviors:function(){
      var sEle = this.source.ele, dEle = this.dest.ele;
      if(!sEle || !dEle)return ;
      this.source.Seesaw = this;
      this.dest.Seesaw = this;
      sEle.ondblclick = this.hndDblclickSource;
      dEle.ondblclick = this.hndDblclickDest;
    },
    /*
    ():
      {void} hndDblclickSource()
    DES:
      handler hndDblclickSource;
    */
    hndDblclickSource: function(){
      this._this.Seesaw.seesaw();
    },
    /*
    ():
      {void} hndDblclickDest()
    DES:
      handler hndDblclickDest;
    */
    hndDblclickDest: function(){
      this._this.Seesaw.seesaw(true);
    },
		/*
		():
			{boolean} seesaw([{boolean} fromDest, {int} index])
		DES:
			append item from source to dest or reverse;
		ARG:
			{boolean} fromDest
			  (optional,defaults to false)
			{int} index
			  sepcify list item index(within zero);
		*/
		seesaw : function(fromDest, index){
			var sNode = this.source, dNode = this.dest;
			if(fromDest){
			  sNode = dNode;
				dNode = this.source;
			}
      var option = sNode.remove(index);
      if(option){
        dNode.add(option);
        return true;
      }
      return false;
		},
    /*
    ():
      {void} selectAll()
    DES:
      add all source's items to dest list;
    */
    selectAll : function(){
      while(this.seesaw(false, 0)){}
    },
    /*
    ():
      {void} unSelectAll()
    DES:
      remove all dest's items to source list;
    */
    unSelectAll : function(){
      while(this.seesaw(true, 0)){}
    }
  }
);
/*
CLASS:
  BHV.Form.SeesawSelectItem
DES:
  item of BHV.Form.SeesawSelect;
PROPERTY:
  {HTMLElement} ele
    list's dom reference
    ele has _this attribute to reference this obj;
METHOD:
  {this} initialize({HTMLElement || id} ele)
	{boolean} add({HTMLOptionElement} option)
	{HTMLOptionElement} addOptionBy({string} text, {string} value)
	{HTMLOptionElement} remove([{int} index])
  {object} remove({int} index)
	{void} dispose()
*/
BHV.Form.SeesawSelectItem = WIN.createClass(
  function(){
  },{
    /*
    ():
      {this} initialize({HTMLElement || id} ele)
    DES:
      initialize SeesawItem by a HTMLElement or id;
    */
    initialize : function(ele){
      ele = this.ele = $(ele);
			if(!WIN.isElement(ele) || ele.tagName.toLowerCase() != "select"){
				throw {	description : "initialize BHV.Form.SeesawSelectItem Error!"};
			}
			EL.cleanWhitespace(ele);
      ele._this = this;
      EVT.observe(window, "unload", function(){
        ele._this.dispose();
      });
      return this;
    },
    /*
    ():
      {boolean} add({HTMLOptionElement} option)
    DES:
      add a new option;
    */
		add: function(option){
			if(!WIN.isElement(option) || option.tagName.toLowerCase() != "option") return false;
			var ele = this.ele;
			ele.appendChild(option);
			ele.selectedIndex = -1;
			return true;
		},
    /*
    ():
      {HTMLOptionElement} addOptionBy({string} text, {string} value)
    DES:
      add a new option by given option's text and option's value;
    */
    addOptionBy : function(text, value){
      var opt = WIN.extend(new Option(),{
        text : text,
        value : value
      });
      this.ele.options.add(opt);
      return opt;
    },
    /*
    ():
      {HTMLOptionElement} remove([{int} index])
    DES:
      (optional,defaults to list selectedIndex) remove sepcified index item;
    */
		remove: function(index){
      var ele = this.ele;
      index = index > -1 ? index : ele.selectedIndex;
      if(index > -1){
        var node = ele.childNodes[index];
        if(!node)return null;
        ele.removeChild(node);
				if(ele.childNodes[index])ele.selectedIndex = index;
				else ele.selectedIndex = index - 1;
        return node;
      }
      return null;
		},
    /*
    ():
      {void} dispose()
    DES:
      dispose this;
    */
    dispose : function(){
      this.ele._this = null;
      this.ele = undefined;
    }
  }
);
