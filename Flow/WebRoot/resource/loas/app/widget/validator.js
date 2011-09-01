/***************************************************************
validator.js
defined form validator
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.widget.validator");
//require resource
require("app.widget.engin");

/*
CLASS:
  WIDGET.ValidationBase
SUBCLASS:
  WIDGET.TextValidation
DES:
  ValidationBase defined a Validation's base behaviors:
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
WIDGET.ValidationBase = function(){
	/*
	():
		{this} initialize({object} options)
		  See also handleOptions
	*/
  this.initialize = function(options){
		WIN.extend(this, this.handleOptions(options));		
	  return this;
	};
	/*
	():
		{object} handleOptions({object} options)
	DES:
		handle Options
	ARG:
		{object} options
		  default:{
				onSuccess : null,//{function}
				showError : null,//{function}
				hideError : null,//{function}
				rEvent    : "",
				rTarget   : null,//{HTMLElement}
				vEvent    : "",
				vTarget   : null,//{HTMLElement}
				unkonw    : null
			}
	*/
  this.handleOptions = function(options){
		var opt = WIN.extend({
				/*
				():
					{void} hideError()
				DES:
					(optional)hide Error if Error is showed;
				*/
				hideError : null,
				/*
				():
					{void} onSuccess()
				DES:
					(optional) function called when validate success
				*/
				onSuccess : null,
				/*
				():
					{void} showError()
				DES:
					(optional) function called when validate failed
				*/
				showError : null,
				/*
				PROPERTY:
					{string} rEvent
				DES:
					event to trigger hideError;
				*/
				rEvent    : "",
				/*
				PROPERTY:
					{HTMLElement} rTarget
				DES:
					target observe rEvent to trigger hideError;
				*/
				rTarget   : null,
				/*
				PROPERTY:
					{string} vEvent
				DES:
					event to trigger validate;
				*/
				vEvent    : "",
				/*
				PROPERTY:
					{HTMLElement} vTarget
				DES:
					target observe vEvent to trigger validate;
				*/
				vTarget   : null,
				unkonw    : null
			}, options);
		
	  return opt;
	};
	/*
	():
		{void} setTrigger({HTMLElement} target, {string} vEvent)
	DES:
		Apply this validation to the target,then when the vEvent happens, it'll auto do this validate;
	ARG:
	  {HTMLElement} target
		  (optional) default is this.vTarget
		{string} vEvent
		  (optional) default is this.vTargetevent to trigger the validation;
	*/
	this.setTrigger = function(target, vEvent){
		target = ($(target) || $(this.vTarget));
	  if(!WIN.isElement(target))return;
	  vEvent = (vEvent || this.vEvent);
		if(!rEvent) return;
		EVT.observe(target, vEvent, Function.bind(this.validate, this));
	};
	/*
	():
		{void} setResetTrigger({HTMLElement} target, {string} rEvent)
	DES:
		hide validatoion's error msg when the target's rEvent happens;
	*/
	this.setResetTrigger= function(target, rEvent){
		target = ($(target) || $(this.rTarget));
	  if(!WIN.isElement(target))return;
	  rEvent = rEvent || this.rEvent;
		if(!(vEvent&& WIN.isFunction(this.hideError))) return;
		EVT.observe(target, rEvent, Function.bind(this.hideError, this));
	};
	/*
	():
		{boolean} isOk()
	DES:
		this function must be override in subClass,here we defined just for avoiding error;
	*/
	this.isOk = Function.empty;
	/*
	():
		{boolean} validate({HTMLElement} target)
	DES:
		Do the validation then call onSuccess(if passed)or call showError;
	*/
	this.validate = function(){
	  if(this.isOk()){
		  if(WIN.isFunction(this.onSuccess))this.onSuccess();
			return true;
	  }
		else{
		  if(WIN.isFunction(this.showError))this.showError();
			return false;
		}
	};	
};

/*
CLASS:
  WIDGET.TextValidation
SUPERCLASS:
  WIDGET.ValidationBase
DES:
  TextValidation is a class to deal with elements which have "value" attribute;
PROPERTY:
  {string} vType
    validation data type(VDT);all is defined in TextValidation.re, it's case-insensitive
METHOD:
  {boolean} isPassed({HTMLElement} target)
*/
WIDGET.TextValidation = function(){
  WIDGET.TextValidation.superClass.apply(this);
	
  this.handleOptions = function(options){
		var opt = WIN.extend({
				/*
				():
					{void} hideError()
				DES:
					(optional)hide Error if Error is showed;
				*/
				hideError : null,
				/*
				():
					{void} onSuccess()
				DES:
					(optional) function called when validate success
				*/
				onSuccess : null,
				/*
				():
					{void} showError()
				DES:
					(optional) function called when validate failed
				*/
				showError : null,
				/*
				PROPERTY:
					{string} rEvent
				DES:
					event to trigger hideError;
				*/
				rEvent    : "",
				/*
				PROPERTY:
					{HTMLElement} rTarget
				DES:
					target observe rEvent to trigger hideError;
				*/
				rTarget   : null,
				/*
				PROPERTY:
					{string} vEvent
				DES:
					event to trigger validate;
				*/
				vEvent    : "",
				/*
				PROPERTY:
					{HTMLElement} vTarget
				DES:
					target observe vEvent to trigger validate;
				*/
				vTarget   : null,
				unkonw    : null
			}, options);
		
	  return opt;
	};
	/*
	():
		{boolean} isPassed({HTMLElement} target)
	DES:
		estimate value of the target by this validation.
	*/
	this.isPassed = function(ele){
	  if(!WIN.isElement(ele))return false;
		var text = ele.value;
		if(!WIN.isDefined(text))return false;
		//do validation
		var vOpt = this.options;
		var reDataType = TextValidation.re[this.vType];
		var reRule = vOpt.vRule, vFunction = vOpt.vFunction;

		if((vOpt.require && !TextValidation.re.require.test(text)) ||
		    (reDataType && reDataType.test && !reDataType.test(text)) ||
				(reRule && reRule.test && !reRule.test(text)) ||
				(WIN.isFunction(vFunction) && !vFunction(ele, text, reRule)) ){
			return false;
	  }
		return true;
	};
}
