/* wizard.js
*/
require.provide("app.bhv.form.wizard");

namespace("BHV.Form", {
	Wizard : WIN.createClass(
	  function(){
			this.stepObserver = new WIN.Observer;
			this.dataObserver = new WIN.Observer;
		},
		{
			previousable : false,
			nextable : false,
			initialize : function(steps, controllers){
				this.setSteps(steps);
				this.initControllers(controllers);
				this.start();
				return this;
			},
			start : function(){
				var steps = this.steps;
				if(!steps )return false;
				
				var c = this.currentStep = 1;
				var step = steps[c - 1];
				step.show();
				this.onStepChange(c);
				return true;
			},
			setSteps : function(steps){
				if(!WIN.isArray(steps))return null;
				
				var _this = this;
				Array.each(function(step){
				  step.dataObserver.add(function(){_this.onDataChange();});
				}, steps);
				
				this.steps = steps;
				this.totalSteps = steps.length;
				steps[0].previousable = false;
				steps[this.totalSteps - 1].nextable = false;
				
				return this;
			},
			initControllers : function(controllers){
			},
			gotoStep : function(n){
				var steps = this.steps;
				n = isNaN(n) ? this.startStep : n;
				if(n > len)n = len ;
				else if(n < this.startStep) n = this.startStep;
				n = n - 1;
				
				var crt = this.currentStep - 1;
				var ck = (n - crt);
				
				if(ck == 0)return true;//same step return true
				else if(ck == 1){//next step
				  return this.switchToSibling();
				}
				else if(ck == -1){//previous step
				  return this.switchToSibling(true);
				}
				else	return false;//nonadjacent step return false
			},
			switchToSibling : function(isPrevious){
				var steps = this.steps;
				var crt = this.currentStep;
				var n = isPrevious ? (crt - 1) : (crt + 1);
				var ns = steps[n - 1];
				var cs = steps[crt - 1];
				var able = isPrevious ?  cs.previousable :cs.nextable;
				if(able){
					cs.hide();
					ns.show();
					this.currentStep = n;
					this.onStepChange(n);
				}
				return able;
			},
			previous : function(){
				if(! this.switchToSibling(true))this.onFailSwitch();
			},
			next : function(){
				if(! this.switchToSibling())this.onFailSwitch();
			},
			onStepChange: function(n){
				this.checkSwitchable();
				this.stepObserver.execute(n);
			},
			onFailSwitch : function(){
				this.steps[this.currentStep - 1].hndFailSwitch();
			},
			checkSwitchable : function(){				
				var steps = this.steps;
				var c = this.currentStep, t = this.totalSteps;
				var cs = steps[c - 1];
				
				this.previousable = ((c > 1) && cs.previousable);
				this.nextable = ((c < t) && cs.nextable);
			},
			onDataChange: function(){
				this.checkSwitchable();
				this.dataObserver.execute();
			},
			unknown: null
		}
	),
	unknown: null
});