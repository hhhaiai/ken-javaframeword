/* jsonReader.js
defined DATA.BlockData.JSONReader
*/
require.provide("lib.data.blockData.jsonReader");
require("lib.data.blockData.engin");

DATA.BlockData.JSONReader = WIN.createClass(
	function(){
	},{
		getAttribute: function(record, fieldIndex){
			var field = this.fields[fieldIndex];
			return record[field];
		},
		setAttribute: function(record, fieldIndex, value){
			var field = this.fields[fieldIndex];
			record[field] = value;
		}
	},
	DATA.BlockData.Reader,
	["setDataSource", "getAttribute", "setAttribute"]
);