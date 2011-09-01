/* nodesDataUpdater.js
*/
require.provide("lib.data.nodesDataUpdater");
require("lib.data.xmlDataUpdater");

namespace("DATA");
/* {
CLASS:
  DATA.NodesDataUpdater
SUPERCLASS:
  DATA.XmlDataUpdater
DES:
  NodesDataUpdater used to send its update events to nodesContainer;
CFG:
  {string} nodesContainer
    (null) nodes container;the property name of nodeId.
  {string} nodesIdAttribute
    ("") the id attribute name of nodes.    
METHOD:
  {object} appendContainerNode({object} record)
  {this} initialize({object} options)
  {this} loadNodes()
  {object | null} removeContainerNode({object} record)
  {object | null} updateContainerNode({object} record)
} */
DATA.NodesDataUpdater  = WIN.createClass(function(){
  },{
    nodesContainer : null,
    nodesIdAttribute : "",
    
    /* {
    ():
      {this} initialize({object} options)
    DES:
      bind updater's observer;
    } */
    initialize : function(options){
      DATA.NodesDataUpdater.$initialize.call(this, options);
      this.addListener("onLoad",  Function.bind(this.loadNodes, this) );
      this.addListener("onSourceRemoveRecord", Function.bind(this.removeContainerNode, this) );
      this.addListener("onSourceAddRecord", Function.bind(this.appendContainerNode, this) );
      this.addListener("onSourceUpdateRecord", Function.bind(this.updateContainerNode, this) );
      return this;
    },
    /* {
    ():
      {this} loadNodes()
    DES:
      implement in subclasses, method for load nodes on records load;
    } */
    loadNodes : Function.empty,
    /* {
    ():
      {object} appendContainerNode({object} record)
    DES:
      implement in subclasses, method for add a new node to nodesContainer.
    ARG:
      {object} record
        new record object;
    RTN:
      node appended;
    } */
    appendContainerNode : Function.empty,
    /* {
    ():
      {object | null} removeContainerNode({object} record)
    DES:
      implement in subclasses, method for remove nodesContainer's node;
    ARG:
      {object} record
        removed record object;
    RTN:
      node removed or null;
    } */
    removeContainerNode : Function.empty,
    /* {
    ():
      {object | null} updateContainerNode({object} record)
    DES:
      implement in subclasses, method for update nodesContainer's node info;
    ARG:
      {object} record
        updated record object;
    RTN:
      node updated or null;
    } */
    updateContainerNode : Function.empty,
    /* {
    ():
      {object | null} findContainerNode({object} record)
    DES:
      returns container node by specified record;
    RTN:
      node finded or null;
    } */
    findContainerNode : function(record){
      if(!record)return null;
      var pk = this.nodesIdAttribute,
          ctn = this.nodesContainer;
			if(!ctn || !WIN.isFunction(ctn.find)) return null;
      return ctn.find(record[pk]);
    },
    toString: function(){return "[object DATA.NodesDataUpdater]";}
  },
  DATA.XmlDataUpdater
);
 