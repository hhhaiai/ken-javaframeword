/* recordset.js
*/
require.provide("lib.data.recordset");

namespace("DATA.Recordset");

DATA.Recordset = WIN.createClass(
	function(meta, recordType){
		this.meta = meta || {};
		this.records = [];
		this.recordType = recordType;
	},{
		filter : null,
    addNew : function(fields, data){
      
    },
    remove : function(index){
      
    },
    update : function(){
      
    },
    updateBatch : function(){
      
    },
    move : function(n){
      
    },
    moveTo : function(index){
      
    },
    movePrevious : function(){
      return this.move(-1);
    },
    moveNext : function(){
      return this.move(1);
    },
    moveFirst : function(){
      return this.moveTo(0);
    },
    moveLast : function(){
			var last = this.records.length - 1;
      return this.moveTo(last);
    },
		
    toString : function(){
      return "[object DATA.Recordset]";
    }
	}
);