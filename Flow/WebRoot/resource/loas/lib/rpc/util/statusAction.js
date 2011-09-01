/* statusAction.js
*/
require.provide("lib.rpc.util.statusAction");
require("lib.core.util.ObserverProvider");

RPC.StatusAction = WIN.createClass(function(){
    this._statusHanlers = {};
	},{
    action : "",
		async : true,
		method : "post",
		postBody : "",
		
		_onSuccessTransport : function(req){
			var status;
			if(req){
				status = req.responseText;
				var f = this.getStatusHanler(status);
				if(WIN.isFunction(f)){
					f();
				};
			}
			this.fireObserver("onEnd", req, status);
		},
		_onFailureTransport : function(req){
			this.fireObserver("onEnd", req);
		},
		
		initialize : function(options){
			WIN.extend(this, options);
			this.addObservers("onStart");
			this.addObservers("onEnd");
			return this;
		},
		addStatusHanler : function(status, handler){
			if(String.notEmpty(status) && WIN.isFunction(handler)){
				var H = this._statusHanlers,
				    status = status.toLowerCase();
				if(!H[status]){
					H[status] = handler;
					return true;
				}
			}
			return false;
		},
		removeStatusHanler : function(status){
			if(String.notEmpty(status)){
				var H = this._statusHanlers,
				    status = status.toLowerCase();
				var h = H[status];
				delete H[status];
				return h;
			}
		},
		getStatusHanler : function(status){
			if(!String.notEmpty(status))return null;
			var H = this._statusHanlers,
					status = status.toLowerCase();
			var h = H[status];
			return h;
		},
		submit : function(){
			this.fireObserver("onStart");
			RPC.xhr(this.action, {
				bAsync    : this.async,
				method    : this.method,
				postBody  : this.postBody,
				onSuccess : Function.bind(this._onSuccessTransport, this),
				onFailure  : Function.bind(this._onFailureTransport, this)
			});
		},
    toString: function(){return "[object RPC.StatusAction]";}
  },
  WIN.ObserverProvider
);

