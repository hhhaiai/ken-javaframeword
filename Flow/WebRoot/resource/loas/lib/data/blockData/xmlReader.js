/* xmlReader.js
defined DATA.BlockData.XMLReader
*/
require.provide("lib.data.blockData.xmlReader");
require("lib.data.blockData.engin");

DATA.BlockData.XMLReader = WIN.createClass(
	function(){
	},{
		isRemoot : true,
		remootSourceUrl: "",
		recordTagName : "",
		
    initialize : function(dataSource, fields, options){
      DATA.BlockData.XMLReader.$initialize.call(this, dataSource, fields, options);
			
			if(this.isRemoot)this.refresh();
      return this;
    },
		setDataSource: function(){
			return this.dataSource = this.getRecords(this.recordTagName);
		},
		getRecords : function(xmldoc, tagName){
			return xmlDoc.getElementsByTagName(tagName);
		},
		refresh : function(){
			this.setDataSource(this.remootSourceUrl);
		},
		getAttribute: function(record, fieldIndex){
			var field = this.fields[fieldIndex];
			return record.getAttribute(field);
		},
		setAttribute: function(record, fieldIndex, value){
			var field = this.fields[fieldIndex];
			record.setAttribute(field, value);
		}
	},
	DATA.BlockData.Reader,
	["setDataSource", "getAttribute", "setAttribute"]
);