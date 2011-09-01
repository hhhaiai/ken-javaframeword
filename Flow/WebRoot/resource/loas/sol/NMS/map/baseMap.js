/* baseMap.js
defined map base model: NMS.BaseMap;
*/
require.provide("sol.NMS.map.baseMap");
require("sol.NMS.node.baseNode");

/*
CLASS:
  NMS.BaseMap
SUPERCLASS:
  NMS.BaseNode
DES:
  map node base model
PROPERTY:
  {object} items
    map items(instanceof NMS.BaseNode)
METHOD:
  {boolean} addItem({string} name, {NMS.BaseNode} item)
  {boolean} removeItem({string} name)
  {boolean} removeItem({string} name)
  {boolean} onItemsChange({object} item)
*/
namespace("NMS");
NMS.BaseMap = WIN.createClass(
  function(){
    this.items = {};
    //this.itemsObserver = new WIN.Observer;
  },{
    /*
    ():
      {boolean} addItem({string} name, {NMS.BaseNode} item)
    DES:
      add an item
    ARG:
      {string} name
        name for item;
      {NMS.BaseNode} item
        instanceof NMS.BaseNode
    */
    addItem : function(name, item){
      if(!(String.notEmpty(name)) && (item instanceof NMS.BaseNode)) return false;
      var items = this.items, name = name.toLowerCase();
      
      items[name] = item;
      var ele = this.ele;
      ele.appendChild(item.ele);
      this.onItemsChange(item);
      
      return true;
    },
    /*
    ():
      {boolean} removeItem({string} name)
    DES:
      remove specify item if the item is not existed, return false;
    */
    removeItem : function(name){
      var item = this.getItem(name);
      if(!item)return false;
      this.removeItemElements(item);
      this.onItemsChange(item);
      return true;
    },
    /*
    ():
      {boolean} getItem({string} name)
    DES:
      getItem by name;
    */
    getItem : function(name){
      if(!String.notEmpty(name)) return null;
      var items = this.items, name = name.toLowerCase();
      return items[name];
    },
    /*
    ():
      {boolean} onItemsChange({object} item)
    DES:
      event on items change, accepts new item as its param;
    onItemsChange : function(item){
      this.itemsObserver.execute(item);
    },
    */
    onItemsChange : Function.empty,
    unknown: null
  },
  NMS.BaseNode
);