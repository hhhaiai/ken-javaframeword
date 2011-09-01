/***************************************************************
btnRenderer.js
defined GUI.systemButton module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("org.GUIRender.btn.btnRenderer");
require("app.gui.btn.button");
require("app.gui.btn.systemButtonMgr");

namespace("GUIRender.BTN", function(){
	return {
		/*
		():
			{GUI.Button} GUIRender.BTN.render({HTMLElement | id} target [, {string} type, {function} cmd
																				{object} options, {String.PathMapper} pathMapper])
		DES:
			render an element as GUI.Button, return a button instance;
		ARG:
		  {HTMLElement | id} target
			  target to be rendered;
			{string} type
			  (optional) button type,specify it to get button default title and icon from GUIRender.BTN.systemButtonMgrs. it may has these value:
				"ok", "cancel", "add", "delete", "yes", "no" and so on. you can add more by extending GUIRender.BTN.systemButtons; see systemButtons for more details;
			{function} cmd
			  (optional) command for button
			{object} options
			  (optional) see GUI.Button initialize options;
			{String.PathMapper} pathMapper
			  (optional)PathMapper to map icon file path;default PathMapper's path == require._rootUrl + "resouce/img/" + theme + "/gui/button/system/";if you want to change icon files fodder, please build a new pathMapper for it;
		*/
		render: function(target, type, cmd, options, pathMapper, cssFloat){
			target = $(target);
			if(!target)return null;
			
			var sysBtn = GUI.systemButtonMgr;
			opt = WIN.extend({
				renderTarget: target,
				cmd : cmd,
				layout :sysBtn.layout
			}, sysBtn.getTypeInfo(type, pathMapper));
			
			if(WIN.isObject(options)){
				WIN.extendExclude(opt, options, ["layout"]);
				WIN.extend(opt.layout, options.layout);
			}
			
			var btn = (new GUI.Button).initialize(opt);
			var s = btn.ele.style;
			cssFloat = (cssFloat || "left"); 
			if(WIN.isDefined(s.cssFloat))s.cssFloat = cssFloat;
			else s.styleFloat = cssFloat;
			return btn;
		},
		unknown: null
	};
}());
