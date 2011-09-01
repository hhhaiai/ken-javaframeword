/* wizardStep.js
*/
require.provide("app.bhv.form.wizardStep");

namespace("BHV.Form", {
	WizardStep : WIN.createClass(
	  function(){
			this.dataObserver = new WIN.Observer;
		},
		{
			previousable : true,
			nextable : false,
			initialize : function(inputsContainer, passCheck){
				this.ele = $(inputsContainer);;
				if(WIN.isFunction(passCheck))this.passCheck = passCheck;
				var eles = this.getInputs(this.ele), _this = this;
				if(eles){
				  Array.each(function(ele){
					  _this.observeInput(ele);
					}, eles);
				}
				this.hide();
				return this;
			},
			show : function(){
				this.showing = true;
			  this.ele.style.display = "block";
			},
			hide : function(){
				this.showing = false;
			  this.ele.style.display = "none";
			},
			hndFailSwitch : function(){
				//WIN.debug('hndFailSwitch = ' + 123456);
			},
			passCheck : function(){return true;},
			/*
			():
				{array || null} getInputs({HTMLElement} container)
			DES:
				get input elements;
			ARG:
				{HTMLElement} container
				  input elements Container.
			RTN:
				array of input elements;
			*/
			getInputs : function(container){
			  if(!container)return null;
			  var tags = ["input", "select", "textarea"];
				var eles = [];
				Array.each(function(tag){
				  var s = container.getElementsByTagName(tag);
					Array.each(function(ele){
					  eles.push(ele);
					}, s);
				},tags);
				return eles;
			},
			/*
			():
				{void} observeInput({HTMLElement} ele)
			DES:
				observe Input Element onchange
			*/
			observeInput : function(ele){
				var f = Function.bind(this.onDataChange, this);
			  //EVT.observe(ele, "keypress", f);
			  EVT.observe(ele, "change", f);
			},
			/*
			():
				{void} onDataChange()
			DES:
				on data change event
			*/
			onDataChange : function(){
				this.nextable = this.passCheck();
				this.dataObserver.execute();
			},
			unknown: null
		}
	),
	unknown: null
});