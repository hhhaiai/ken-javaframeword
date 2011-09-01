/***************************************************************
validator.js
create split button,tab and menu item gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.form.validate.validator");
//require resource

/*
CLASS:
  ValidationAbstract
DES:
  validation basic
	Warning:this is abstract class you must defined a method named isPassed in your sub class.
PROPERTY:
  {string} errMsg
    validation failed message.
  {string} vEvent
    the event type to do validation;
METHOD:
	{void} bind({HTMLElement} target, {string} vEvent)
	{void} onFail({HTMLElement} ele)
	{void} onSuccess({HTMLElement} ele)
	{boolean} validate({HTMLElement} target)
*/
function ValidationAbstract(){
	/*d;
		  {function} onFail
	():
		{this} initialize({string} errMsg, {string} vEvent, {object} options)
	ARG:
	  {object} options  
		  {string} vRule
			  more rule info fors validator,it can be a regExp or just a string, it'll will be passed as a param for vFunction if you defined the function;
		  {boolean} require
			  identify the input value or a select is required
		  {function} onSuccess
			  callback for validation passe
		  {function} onFail
			  callback for validation failed;
	*/
  this.initialize = function(errMsg, vEvent, options){
		this.errMsg = errMsg || "";
		this.vEvent = vEvent;
		var opt = this.options = WIN.extend({
				vRule     : "",
				require   : false,
				onSuccess : function(ele){WIN.debug('onSuccess = ' + 123456);},
				onFail    : function(ele){WIN.debug('onFail = ' + errMsg);},
				vFunction : null //slf defined rule function
			}, options);
		
		if(WIN.isFunction(opt.onFail))this.onFail = opt.onFail;
		if(WIN.isFunction(opt.onSuccess))this.onSuccess = opt.onSuccess;
	  return this;
	};
	/*
	():
		{void} bind({HTMLElement} target, {string} vEvent)
	DES:
		Apply this validation to the target,then when the vEvent happens, it'll auto validate the target;
	ARG:
		{string} vEvent
		  event to trigger the validation;
	*/
	this.bind = function(target, vEvent){
	  if(!WIN.isElement(target))return;
	  var evtName = vEvent || this.vEvent;
		if(!evtName) return;
		EVT.observe(target, evtName, Function.bind(this.validate, this, target));
	};
	/*
	():
		{void} isPassed()
	DES:
		this function must be override in subClass,here we defined just for avoiding error;
	*/
	this.isPassed = Function.empty;
	/*
	():
		{boolean} validate({HTMLElement} target)
	DES:
		Do the validation then call onSuccess(if passed)or call onFail by passing the target as a param;
	*/
	this.validate = function(ele,evt){
	  ele = $(ele);
		if(!WIN.isElement(ele))return false;
	  if(this.isPassed(ele)){
		  if(WIN.isFunction(this.onSuccess))this.onSuccess(ele);
			return true;
	  }
		else{
		  if(WIN.isFunction(this.onFail))this.onFail(ele, this.errMsg);
			return false;
		}
	};
}

/*
CLASS:
  TextValidation
SUPERCLASS:
  ValidationAbstract
DES:
  TextValidation is a class to deal with elements which have "value" attribute;
PROPERTY:
  {string} vType
    validation data type(VDT);all is defined in TextValidation.re, it's case-insensitive
METHOD:
  {boolean} isPassed({HTMLElement} target)
*/
function TextValidation(){
  TextValidation.superClass.apply(this);
	/*
	():
		{this} initialize({string} vType, errMsg, vEvent, options)
	*/
  this.initialize = function(vType, errMsg, vEvent, options){
		this.vType = vType.toLowerCase();
		TextValidation.$initialize.call(this, errMsg, vEvent, options);
	  return this;
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
WIN.extendClass(TextValidation, ValidationAbstract);

TextValidation.re = {
	chinese :  /^[\u0391-\uFFE5]+$/,
	currency : /^\d+(\.\d+)?$/,
	date: /^(\d{4})([-./])(\d{2})\2(\d{2})$/,
	double : /^[-\+]?\d+(\.\d+)?$/,
	email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	english : /^[A-Za-z]+$/,
	idcard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
	integer : /^[-\+]?\d+$/,
	ip : /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/,
	mobile : /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/,
	number : /^\d+$/,
	phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
	qq : /^[1-9]\d{4,8}$/,
	require : /.+/,
	unsafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,  //'
	username : /^[a-z]\w{3,19}$/i,
	url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,   //'
	zip : /^[1-9]\d{5}$/
};


function RadioValidation(){
	this.isPassed = function(ele){
	};
}
WIN.extendClass(RadioValidation, ValidationAbstract);

/*
CLASS:
  InputValidator
DES:
  InputValidator is a validator manager for inputs;
METHOD:
	{this} initialize({object} vDictionary, {object} vTargetElements, {object} options)
	{void} addBind({HTMLElement} ele, {string} vDictName, {object} validation)
	{void} addTarget({HTMLElement} ele, {string} vDictName)
	{void} addValidation({string} vDictName, {object} validation)
	{void} bindAll()
	{void} clearTargets()
	{void} clearValidationDict()
	{string} getElementDictName({HTMLElement} ele)
	{void} removeTarget({string} vDictName)
	{void} removeValidation({string} vDictName)
	{boolean} validate({string} vDictName)
	{boolean} validateElement({HTMLElement} ele, {string} vDictName)
	{boolean} validateElements({array} elements)
	{boolean} validateAll()
*/
function InputValidator(){
  var opt, _vDict = {}, _targetsObserver ={};
	function _chkV(validation){
	  if(validation && validation.bind && validation.validate)return true;
		else return false;
	}
	/*
	():
		{this} initialize({object} vDictionary, {object} vTargetElements, {object} options)
	DES:
		initialize a InputValidator instance.
	ARG:
		{object} vDictionary
		  a InputValidator can validate element by matching its own validation dictionary,so you dont need to offer any validation more,see also validateElement method; Its property should be a validation which is instanceof ValidationAbstract;
		{object} vTargetElements
		  we store vTargetElements just for validating them All at one time;You can use the method validateElements to do this but use method validatAll is faster.A vTargetElement is an element to be validated by a validation in vDictionary;Its property should be a HTMLElement;
		{object} options
		  {string} vDictNameAttr
			  the attribute of an element to specify the vDictName;Default is name attribute;See vDictName at addBind method;
			{string}vEvent
			  the event type to call the validate methods
			{function} onSuccess
			  default callback for a passed validation if it dont has its own;
			{function} onFail
			  default callback for a failed validation if it dont has its own;
	*/
  this.initialize = function(vDictionary, vTargetElements, options){
		opt = WIN.extend({
			vDictNameAttr : "name",
			vEvent        : "blur",
			onSuccess     : Function.empty,
			onFail        : Function.empty//handle for err msg
		}, options);
		
	  for(var i in vDictionary){
		  this.addValidation(i, vDictionary[i]);
		}
		if(vTargetElements){
			var len = vTargetElements.length; 
			for(var i=0; i<len; i++){
			  this.addTarget(vTargetElements[i]);
			}
		}
		return this;
  };
	/*
	():
		{void} addBind({HTMLElement} ele, {string} vDictName, {object} validation)
	DES:
		add a target and bind with validation;
	ARG:
		{string} vDictName
		  (optional) we use this to appoint a validation for element.Usually, we just assign an attribute for the element to specify this, but you can appoint another.
		{object} validation
		  (optional) instanceof ValidationAbstract;if not offer,we'll check this own dictionary.if not found, return without doing any thing;
	*/
	this.addBind = function(ele, vDictName, validation){
	  ele = $(ele);
	  if(!WIN.isElement(ele))return;
		if(!vDictName)vDictName = this.getElementDictName(ele);
		if(!vDictName)return;
		vDictName = vDictName.toLowerCase();
	  if(_chkV(validation))this.addValidation(vDictName, validation);
		else validation = _vDict[vDictName];
		if(!_chkV(validation))return;
	  
		this.addTarget(ele, vDictName);
		var vEvent = validation.vEvent || opt.vEvent;
		validation.bind(ele, vEvent);
	};
	/* 
	():
		{void} addTarget({HTMLElement} ele, {string} vDictName)
	DES:
		add a target;
	ARG:
		{string} vDictName
		  (optional) if not offer,you should assign an attribute for the element to specify this.
	*/
	this.addTarget = function(ele, vDictName){
	  ele = $(ele);
	  if(WIN.isElement(ele)){
		  if(!vDictName)vDictName = this.getElementDictName(ele);
			if(!vDictName)return;
		  _targetsObserver[vDictName.toLowerCase()] = ele;			
		}
	};
	/*
	():
		{void} addValidation({string} vDictName, {object} validation)
	DES:
		add a validation to this own validation dictionary;
	ARG:
		{string} vDictName
		  a name for validation in this own validation dictionary;
	*/
	this.addValidation = function(vDictName, validation){
	  if(!_chkV(validation))return ;
		_vDict[vDictName.toLowerCase()] = validation;
		if(!WIN.isFunction(validation.onSuccess))validation.onSuccess = opt.onSuccess;
		if(!WIN.isFunction(validation.onFail))validation.onFail = opt.onFail;
	};
	/*
	():
		{void} bindAll()
	DES:
		bind all target with this own validation dictionary;
	*/
	this.bindAll = function(){
	  var validation;
	  for(var vDictName in _targetsObserver){
			validation = _vDict[vDictName];
			if(_chkV(validation)){
				var vEvent = validation.vEvent || opt.vEvent;
				validation.bind(_targetsObserver[vDictName], vEvent);
			}
		}
	};
	/*
	():
		{void} clearTargets()
	*/
	this.clearTargets = function(){
	  _targetsObserver = {};
	};
	/*
	():
		{void} clearValidationDict()
	*/
	this.clearValidationDict = function(){
	  _vDict = {};
	};
	/*
	():
		{string} getElementDictName({HTMLElement} ele)
	DES:
		get element vDictName by detect its vDictName attribute;if the element doesnt has it return "";
	*/
	this.getElementDictName = function(ele){
	  try{
		  var vDictName;
			vDictName = ele.getAttribute("vDictName");
			if(!vDictName)vDictName = ele.getAttribute(opt.vDictNameAttr);
			return vDictName.toLowerCase();
		}catch(e){return ""}
	};
	/*
	():
		{void} removeTarget({string} vDictName)
	DES:
		remove a target from its targets observer(TO) by vDictName;It dont release the bind bt the element and its validation(if it has).That means when the validation's vEvent occurs it still call validation's validate.
	*/
	this.removeTarget = function(vDictName){
		delete _targetsObserver[vDictName];
	};
	/*
	():
		{void} removeValidation({string} vDictName)
	DES:
	  remove a validation from its validation dictionary(VD) by vDictName;
	*/
	this.removeValidation = function(vDictName){
		delete _vDict[vDictName];
	};
	/*
	():
		{boolean} validate({string} vDictName)
	DES:
	  do a validation (named vDictName); it first gets a validation from VD and finds its associte target from TO by vDictName then return validation.validate(target);See also validation.validate method;
	*/
	this.validate = function(vDictName){
	  if(!vDictName)return false;
		vDictName = vDictName.toLowerCase();
	  var validation = _vDict[vDictName];
		if(!_chkV(validation))return false;
		
		return validation.validate(_targetsObserver[vDictName]);
	};
	/*
	():
		{boolean} validateElement({HTMLElement} ele, {string} vDictName)
	DES:
	  validate an element by a validation from VD.
	ARG:
		{string} vDictName
		  (optional) validation dictionary name in VD,if not offer,we'll detect its vDictName attribute.
	*/
	this.validateElement = function(ele, vDictName){
	  ele = $(ele);
	  if(!WIN.isElement(ele))return false;
		if(!vDictName)vDictName = this.getElementDictName(ele);
		if(!vDictName)return false;
	  var validation = _vDict[vDictName];
		if(!_chkV(validation))return false;
		
		return validation.validate(ele);
	};
	/*
	():
		{boolean} validateElements({array} elements)
	DES:
	  validate elements with VD. See also validate method;
	*/
	this.validateElements = function(elements){
	  Array.each(this.validateElement, elements);
	};
	/*
	():
		{boolean} validateAll()
	DES:
	  do all targets'validation if all validation are passed return true;
	*/
	this.validateAll = function(){
	  var validation, allPassed = true;
	  for(var vDictName in _targetsObserver){
			validation = _vDict[vDictName];
			if(_chkV(validation)){
				if(!validation.validate(_targetsObserver[vDictName]))allPassed = false;
			}
		}
		return allPassed;
	};
}

/*
CLASS:
  FormValidatorMgr
DES:
	
PROPERTY:
  {datatype} propertyname
    description
METHOD:
  {returntype} function_name({datatype} argment1)
*/
function FormValidatorMgr(){
  var _formsObserver = {};
  this.initialize = function(errMsg, vDictionary){
	  this.vDictionary = vDictionary;
		this.errMsg = errMsg;
		return this;
  };	
	this.addForm = function(form, name, vDictionary, formOptions, elementsOptions){
	  form = FormValidatorMgr.getForm(form);
		if(!form)return;
		name = name || form.name;
		if(!name)return;	
		
		var fOptions = WIN.extend({
		  bindForm :true,
			validateOnsubmit : true,
			onSuccess: Function.empty,
			onFail   : Function.empty
		},formOptions);
		this.onSuccess = fOptions.onSuccess;
		this.onFail = fOptions.onFail;
		
		var eOptions = WIN.extend({
			onSuccess: Function.empty,
			onFail   : Function.empty
		},elementsOptions);
		
		vDictionary = vDictionary || this.vDictionary;
		WIN.debug('name = ' + name);
		WIN.debug('form.name = ' + form.name);
		_formsObserver[name] = new InputValidator().initialize(vDictionary, form, eOptions);	
		
		if(fOptions.bindForm)_formsObserver[name].bindAll();
		if(fOptions.validateOnsubmit){
		  form.onsubmit = Function.bind(this.validate, this, name);
		}
	};
	this.bind = function(name){
	  var formValidator = _formsObserver[name];
		if(formValidator && formValidator.bindAll)return formValidator.bindAll();
	};
	this.bindAll = function(){
	  for(var i in _formsObserver){
		  _formsObserver[i].bindAll();
		}
	};
	this.bindDocumentForms = function(vDictionary, formOptions, elementsOptions){
	  var forms = document.forms;
		if(!forms)return;
		var len = forms.length;
		for(var i=0; i<len; i++ ){
		  this.addForm(forms[i], undefined, vDictionary, formOptions, elementsOptions);
		}
	};
	this.removeForm = function(name){
	  delete _formsObserver[name];
	};
	this.validate = function(name){
	  var formValidator = _formsObserver[name];
		if(!formValidator)return false;
		
		if(formValidator.validateAll && formValidator.validateAll()){
		  this.onSuccess(document.forms[name]);
		  return true;
		}
		else{
		  this.onFail(document.forms[name]);
		  return false;
		}
	};
}
WIN.extend(FormValidatorMgr,{
	/*
	():
		{HTMLFormElement | null} FormValidatorMgr.isForm({HTMLFormElement} form)
	DES:
		indicate whether an element is a form
	ARG:
		{HTMLFormElement | string} form
			HTMLFormElement | form name | form id.
	*/
  isForm :function(form){
	  try{return !!(form.tagName.toUpperCase() == "FORM");}catch(e){return false;}
	},
	/*
	():
		{HTMLFormElement | null} FormValidatorMgr.getForm({HTMLFormElement | string} form)
	DES:
		get a form
	ARG:
		{HTMLFormElement | string} form
			HTMLFormElement | form name | form id.
	*/
  getForm :function(form){
	  if(!form)return null;
		if(FormValidatorMgr.isForm(form))return form;
		form = document.forms[form];
		if(FormValidatorMgr.isForm(form))return form;
		form = $(form);
		if(FormValidatorMgr.isForm(form))return form;
	}
});
