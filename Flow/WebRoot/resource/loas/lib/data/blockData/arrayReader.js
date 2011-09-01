/* arrayReader.js
defined DATA.BlockData.ArrayReader
*/
require.provide("lib.data.blockData.arrayReader");
require("lib.data.blockData.engin");

DATA.BlockData.ArrayReader = WIN.createClass(
	function(){
	},{
		setDataSource: function(dataSource){
			return this.dataSource = dataSource;
		},
		getAttribute: function(record, fieldIndex){
			return record[fieldIndex];
		},
		setAttribute: function(record, fieldIndex, value){
			record[fieldIndex] = value;
		}
	},
	DATA.BlockData.Reader,
	["setDataSource", "getAttribute", "setAttribute"]
);
DATA.basicArrayReader = new DATA.BlockData.ArrayReader;