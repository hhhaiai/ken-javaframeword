/* iTargetsListable.js
*/
require.provide("lib.rpc.util.iTargetsListable");
require("lib.rpc.util.statusAction");

/* {
MPOOL:
  RPC.iTargetsListable
DES:
  group the listable submit actions;
REQUIRE:
  instanceof RPC.StatusAction
PROPERTY:
  {__datatype} __property_name
    __decription
FUNCTION:
  {__returntype} __function_name({__datatype} __argment1)
} */
RPC.iTargetsListable = WIN.MethodPool.declare({    
		/*
		Cfg:
			{number} submitDelay
		DES:
			delay bt every submit;
		*/
		submitDelay : 1000,
		/*
		Cfg:
			{function} submitFisrt
		DES:
			submit action which accepts target as only param;
		ARG: 
		  {object} target
			  parameters for submit action;
		*/
		submitFisrt : Function.empty,
		_applySubmitFirst : function(){
			var list = this._actionList;
			this.submitFisrt.apply(this, [].concat(list[0]));
		},
		
		_doNext : function(req, status){
			var list = this._actionList, self = this;
			list.shift();
			if(list.length > 0){
				if(!this.stoped){
					setTimeout(Function.bind(this._applySubmitFirst, this), this.submitDelay);
				}
			}
			else this.fireObserver("onQueueEnd");
		},
		startSubmitQueue : function(){
			this.fireObserver("onQueueStart");
			this._applySubmitFirst();
		},
		stopSumitQueue : function(){
			this.stoped = true;
		},
		restartSumitQueue : function(){
			this.stoped = false;
			this._applySubmitFirst();
		},
		pushTargets : function(targets){
			if(!targets) return ;
			var list = this._actionList;
			if(WIN.isArray(targets))this._actionList = list.concat(targets);
			else list.push(targets);
		},
		insertTarget : function(index, target){
			var list = this._actionList;
			list.insertAt(target, index);
		},
		insertTargetBefore : function(newTarget, refTarget){
			var list = this._actionList;
			list.insertBefore(newTarget, refTarget);
		},
		removeTargetAt : function(index){
			var list = this._actionList;
			list.removeAt(index);
		},
		removeTarget : function(target){
			var list = this._actionList;
			list.remove(target);
		},
		/* {
    ():
      {this} toTargetsListable()
    DES:
      initialize to be TargetsListable;
    } */
    toTargetsListable : function(){
      if(!this.iTargetsListable_initialized){
				this._actionList = [];
				this.addObservers("onQueueStart");
				this.addObservers("onQueueEnd");
				this.addListener("onEnd", Function.bind(this._doNext, this));				
				this.iTargetsListable_initialized = true;
      }
      return this;
    }
	}, function(obj){
    if(!(obj instanceof RPC.StatusAction) )return false;
    return true;
  }
);