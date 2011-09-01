/***************************************************************
interfacesMgr.js
simulate interface
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.interfacesMgr");
//require resource
WIN.InterfacesMgr = {
	/*
	OBJECT:
		_simulantInterfaces
	DES:
		Store simulant Interfaces
	*/
  _simulantInterfaces:{},
	/*
	():
		{void} WIN.InterfacesMgr.register({string} name, {array} methodList)
	DES:
		register a new simulate interface. if a same name interface is existed it raise a exception;
	ARG:
		{string} name
		  interface name,(case-sensitive)
	*/
	register : function(name, methodList){
		if(String.notEmpty(name) && methodList){
			var interfs = WIN.InterfacesMgr._simulantInterfaces;
			if(interfs[name])throw {description: "simulateInterface: " + name + "existed!"};
			interfs[name] = methodList;
		}
	},
	/*
	():
		{boolean} WIN.InterfacesMgr.check({object} obj, {string} name)
	DES:
		return true when the obj had implemented the assigned interface .
	*/
	check : function(obj, name){
		if(obj && String.notEmpty(name)){
			var methodList = WIN.InterfacesMgr._simulantInterfaces[name];
			
			return Array.every(function(fn){
					return WIN.isFunction(obj[fn]);
				}, methodList);
		}
	},
	unknown: null
};