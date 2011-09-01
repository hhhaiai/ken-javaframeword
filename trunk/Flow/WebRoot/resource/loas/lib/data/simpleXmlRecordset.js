/* simpleXmlRecordset.js
*/
require.provide("lib.data.simpleXmlRecordset");
require("lib.core.util.ObserverProvider");

namespace("DATA");
/* {
CLASS:
  DATA.SimpleXmlRecordset
SUPERCLASS:
  WIN.ObserverProvider
DES:
  Simple Xml Recordset, a data source provider.
CFG:
  {string | xmlDoc} source
    xml data source, it surports url or xmlDoc, if it's url will request the url to get the 
    responseXML before readRecords;
  {string} sourceNodeName
    ("sourceNode") property stores source node in every records, it must be different from 
		the field names.
  {boolean} bAsync
    (true) if true, read source(only if source is a url) by async request ;
  {object} fields
    it may have following options:
      @{string} name
        field name
      @{string} mappingName
        ("") xml attribute name. If not offered, use fields.name instead;
      @{function} convert
        (null) the function to convert xml attribute value;
  {string} recordTag
    ("node") default xml nodes tag name;
PROPERTY:
  {2d array} records
	  records parsed from source;
		
	{number} _intervalUpdateTimer
    interval Update Timer
  {boolean} _loaded
    indecates records has loaded;
METHOD:
  {this} initialize({object} options)
  {void} intervalUpdate()
  {array} readNodes({array} nodes, {boolean} clear)
  {array} readRecords({XMLDocument} root, {string} recordTag, {boolean} clear)
  {array} readResponse({XMLHttpRequest} response, {boolean} clear)
  {void} stopIntervalUpdate()
  {void} update()
OBSERVERS:
  onLoad: on update first time;
  onUpdate: on update after load;
  onLoadFailed: on update failed;
} */
DATA.SimpleXmlRecordset = WIN.createClass(
  function(){
  },{
    source : null,
    fields : null,
		sourceNodeName : "sourceNode",
    recordTag : "node",
    bAsync : true,
    
    /* {
    ():
      {this} initialize({object} options)
    DES:
      initialize & add observers;
    } */
    initialize : function(options){
      WIN.extend(this, options);
      this.addObservers("onLoad", "onFailureRpc");
      return this;
    },
    /* {
    ():
      {array} readResponse({XMLHttpRequest} response, {boolean} clear)
    DES:
      read a rpc response, return reocrds readed;
    ARG:
      {XMLHttpRequest} response
        a rpc XMLHttpRequest.
      {boolean} clear
        (false) if true clear old reocrds;
    } */
    readResponse : function(response, clear){
      var doc = response.responseXML;
      if(!doc) {
        throw {description: this.toString() + " -> readResponse(): Invalid XML Document!"};
      }
      return this.readRecords(doc, this.recordTag, clear);
    },
    /* {
    ():
      {array} readRecords({XMLDocument} root, {string} recordTag, {boolean} clear)
    DES:
      read Records from XML document.
    ARG:
      {XMLDocument} root
        XMLDocument;
      {string} recordTag
        xml nodes tag name;
    } */
    readRecords : function(root, recordTag, clear){
      root = root.documentElement || root;
      recordTag = recordTag || this.recordTag;
			var nodes = root.getElementsByTagName(recordTag);
      return this.readNodes(nodes, clear);
    },
    
    /* {
    ():
      {array} readNodes({array} nodes, {boolean} clear)
    DES:
      read xml nodes.
    ARG:
      {array} nodes
        array of xml nodes;
      {boolean} clear
        if true, clear old records;
    RTN:
      array of values obj;
    } */
    readNodes : function(nodes, clear){
			if(!nodes) return null;
      var i, j, nodesLen, fieldsLen, node, 
          val, values, field, fieldName, mappingName, convert, attr,
          records = [],
          fields = this.fields || [],
					sNodeName = this.sourceNodeName;
      for(i = 0, nodesLen = nodes.length; i < nodesLen; i++){
        node = nodes[i];
        values = {};
				values[sNodeName] = node;
        
        for(j = 0, fieldsLen = fields.length; j < fieldsLen; j++){
          field = fields[j];
          fieldName = field.name;
          mappingName = field.mappingName;
          convert = field.convert;
          attr = mappingName || fieldName;
          val = node.getAttribute(attr);
          if(convert) val = convert(val);
          values[fieldName] = val;
        }
        
        records.push(values);
      }
      if(clear)this.records = records;
      return records;
    },
    load : function(){
      var source = this.source;
      if(String.notEmpty(source)){
				RPC.xhr(this.source, {
          bAsync : this.bAsync,
          onSuccess : Function.bind(this._hndLoadResponse, this),
          onFailure : Function.bind(this._hndFailureRpc, this)
        });
      }
      else if(source){
        this.readRecords(source, this.recordTag, true);
				this.fireObserver("onLoad", this.records);
      }
    },
    
    _hndLoadResponse : function(req){
      this.readResponse(req, true);
			this.fireObserver("onLoad", this.records);
    },
    _hndFailureRpc : function(){
      this.fireObserver("onFailureRpc");
    },
    toString : function(){
      return "[object DATA.SimpleXmlRecordset]";
    }
  },
  WIN.ObserverProvider
);