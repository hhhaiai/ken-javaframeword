/* xp.js
defines the interface of add experience to sv content table;
if you want to do sth for the table see function SV.CommonListXP.execute ;
if you want to set xpOptions for a main list(table)'s xpFunction, see function SV.CommonListXP.setXPOptions;
*/
require.provide("sv.common.commonList.xp");

namespace("SV.CommonListXP", {
	/*
	PROPERTY:
		{WIN.Observer} SV.CommonListXP.XPObserver
	DES:
		MainLists XP observer
	*/
	XPObserver : new WIN.Observer,
	/*
	PROPERTY:
		{object} SV.CommonListXP._XPOptions
	DES:
		store options for xpFunctions;
	*/
	_XPOptions : {},
	/*
	():
		{void} SV.CommonListXP.execute()
	DES:
		execute SV.CommonListXP.XPObserver's functions;
		
		Note: if you want to do sth for the table you can use this:		
		SV.CommonListXP.XPObserver.add(xpFunction);
		the xpFunction will be ivoked ondomloaded,and it accepts 2 parameters :
			{HTMLTableElement} table //the target table 
			{int} index //table index of the valid tables list, in this version,
			if a table's css contains "sv_content_table" then it's valid;
		
	*/
	execute : function(){
		var tables = SV.CommonListXP.getMainLists();
		Array.each(function(table, index){
			SV.CommonListXP.XPObserver.execute(table, index);
		}, tables);
	},
	/*
	():
		{void} SV.CommonListXP.getMainLists([{string} mainCss])
	DES:
		get all table whose css contains the mainCss;
	ARG:
	  {string} mainCss
		  (optional), name of mainLists css,(defaults to "sv_content_table");
	*/
  getMainLists : function(mainCss){
		var lists = [], docLists = document.getElementsByTagName("table");
		mainCss = mainCss || "sf_commonList";
		Array.each(function(table){
			var css = table.className;
			if(String.notEmpty(css) 
					&& String.contains(css, mainCss)) 
			      lists.push(table);
		}, docLists);
		return lists;
	},
	/*
	():
		{void} SV.CommonListXP.getTableXPOptions({string} xpFunctionName,
																			{HTMLTableElement} table [,{int} index])
	DES:
		get XPOptions By XPOptionsName specified by table's XPOptionsName attribute;if the 
		attribute is not specified, we use the index instead;see index at SV.CommonListXP.execute;
	*/
	getTableXPOptions : function(xpFunctionName, table, index){
		if(!WIN.isElement(table))return null;
		var XPOptionsName = table.getAttribute("XPOptionsName") || table.XPOptionsName || index;
		return SV.CommonListXP.getXPOptions(xpFunctionName, XPOptionsName);
	},
	/*
	():
		{object} SV.CommonListXP.getXPOptions({string} xpFunctionName, {string | int} XPOptionsName)
	DES:
		get XPOptions By XPOptionsName
	*/
	getXPOptions : function(xpFunctionName, XPOptionsName){
		if(!String.notEmpty(xpFunctionName) )return null;
		var opt = SV.CommonListXP._XPOptions[xpFunctionName];
		if(WIN.isObject(opt))	return opt[XPOptionsName];
		return null;
	},
	/*
	():
		{object} SV.CommonListXP.removeXPOtion({string} xpFunctionName, {string | int} XPOptionsName,
																				 {string} name)
	DES:
		delete the XPOtions's property specified by name;
	*/
	removeXPOtion : function(xpFunctionName, XPOptionsName, name){
		var o = SV.CommonListXP.getXPOptions(xpFunctionName, XPOptionsName);
		delete o[name];
	},
	/*
	():
		{object} SV.CommonListXP.removeXPOtions({string} xpFunctionName, {string | int} XPOptionsName)
	DES:
		delete all properties of the XPOtions;
	*/
	removeXPOtions : function(xpFunctionName, XPOptionsName){
		var o = SV.CommonListXP.getXPOptions(xpFunctionName, XPOptionsName);
		for(var i in o)delete o[i];
	},
	/*
	():
		{void} SV.CommonListXP.setXPOptions({string} xpFunctionName, {string | int} XPOptionsName,
																			{object} xpOptions)
	DES:
		set xpOptions for a main list(table)'s xpFunction;
	ARG:
		{string} xpFunctionName
		  name of the experience function;
		{string | int} XPOptionsName
		  Different tables have their own options when applying a xpFunction.this XPOptionsName is 
			to specify the xpOptions for each of them;
		{object} xpOptions
			store options for the xpFunction, its interface is defined in the function;
			Although it depends on different apply , xpOptions always used to store the xpFunction's 
			parameters options; the basic promised rule is :
			the property names correspond to the function parameter names -- we call p2p rule;
	e.g.
		SV.CommonListXP.setXPOptions("sort", "tabel1", {
			overrides : [0 , 1]
		});
	*/
	setXPOptions : function(xpFunctionName, XPOptionsName, xpOptions){
		var str = xpFunctionName + "." + XPOptionsName;
		namespace(str, xpOptions, SV.CommonListXP._XPOptions);
	},
	unknown : null
});
EVT.domLoadedObserver.add(SV.CommonListXP.execute);