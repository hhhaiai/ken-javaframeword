/* engin.js

*/
namespace("NMS", {
  backBoardMap : function(ele){
	  this.ele = $(ele);
	  this.items = {};
		this.itemsObserver = new WIN.Observer;
	},
  portMap : function(){
	  this.statusObserver = new WIN.Observer;
	},
	unknown: null
});
