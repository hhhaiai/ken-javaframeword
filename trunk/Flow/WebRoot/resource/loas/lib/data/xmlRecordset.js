/* xmlRecordset.js
*/
require.provide("lib.data.xmlRecordset");
require("lib.data.recordset");

DATA.XmlRecordset = WIN.createClass(
  function(meta, recordType, fieldNodeType){
		this._fieldNodeType = fieldNodeType;
  },{
    readResponse : function(response){
      var doc = response.responseXML;
      if(!doc) {
        throw {message: "DATA.XmlRecordset.read: XML Document not available"};
      }
      return this.readRecords(doc);
    },
    readRecords : function(root){
      root = root.documentElement || root;      
      var nodes = root.getElementsByTagName(this.meta.recordTag);
			return this.readNodes(nodes);
    },
    readNodes : function(nodes, fieldNodeType){
      var records = this.records;
      var fields = this.meta.fields;
			var X = DATA.XmlRecordset;
      var isEmp = X.isEmptyValue;
			var type = (fieldNodeType || this._fieldNodeType).toLowerCase();
			var getValue = X.readFieldBy[type];
			
      for(var i = 0, len = nodes.length; i < len; i++){
        var node = nodes[i], values = {};
        
        for(var j = 0, len2 = fields.length; j < len2; j++){
          var f = fields[j];
          var v = getValue(node, f.name);
          if(isEmp(v)) v = f.defaultValue;
          if(f.convert) v = f.convert(v);
          values[f.name] = v;
        }
        
        var rd = new this.recordType(values);
        rd.node = node;
        records.push(rd);
      }
			
			return records;
    },
    toString : function(){
      return "[object DATA.XmlRecordset]";
    }
  },
  DATA.Recordset
);

/*
():
  {boolean} DATA.XmlRecordset.isEmptyValue({object} o)
DES:
  return ture if o is one of these value : null, undefined, "";
*/
DATA.XmlRecordset.isEmptyValue = function(o){
  return ( o === null || o === undefined || o === "");
};
DATA.XmlRecordset.readFieldBy = {
	/*
	():
		{string} DATA.XmlRecordset.readFieldBy.attribute({XMLElement} node, {string} field)
	DES:
		return node attribute value;
	*/
  attribute : function(node, field){
    return node.getAttribute(field);
  },
	/*
	():
		{string | null} DATA.XmlRecordset.readFieldBy.element({XMLElement} node, {string} field)
	DES:
		return value of the node's child specified by the field;
	*/
  element : function(node, field){
    var n = node.getElementsByTagName(field)[0];
    if(!n)return null;
    n = n.firstChild;
    return chd ? chd.nodeValue : null;
  }
};

/*
  WIN.extend(DATA.XmlRecordset, {
		readAttribute : function(node, fieldName){},
		readFirstTag : function(node, fieldName){},
		readFirstChild : function(node, fieldName){}
	});
*/