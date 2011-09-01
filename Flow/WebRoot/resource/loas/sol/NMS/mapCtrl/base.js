/* base.js
defined BaseBoard model;
*/

namespace("NMS", {
  BaseBoard : function(){
	  this.items = {};
		this.itemsObserver = new WIN.Observer;
	}
});
