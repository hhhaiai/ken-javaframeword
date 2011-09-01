/* baseNode.js
defined map base model: NMS.BaseNode;
*/
require.provide("sol.NMS.node.baseNode");

namespace("NMS");
NMS.BaseNode = WIN.createClass(
	function(){
	},{
		/*
		cfg:
			{string} nodeCss
		DES:
			css for this ele
		*/
		nodeCss : "",
		/*
		cfg:
			{string} nodeTagName
		DES:
			tagName of this ele,(defaults to "div");
		*/
		nodeTagName : "div",
		/*
		():
			{this} initialize({object} options)
		DES:
			initialize interface,add new handle to window unload event for this dispose;
		ARG:
			{object} options
			  options are extended as this's props;
		*/
		initialize : function(options){
			WIN.extend(this, options);
			
			this.build(true);
			
			return this;
		},
		/*
		():
			{void} build({boolean} fireOnBuild)
		DES:
			build interface,create a element which has this object as attrbute named "_this";
		ARG:
			{boolean} fireOnBuild
			  if this build method is the end of build chain(chain of JS prototype -- inheritance simulation) then fires onBuild event;
		*/
		build : function(fireOnBuild){
			if(!WIN.isElement(this.ele)){
				this.ele = DOC.c(this.nodeTagName);
				this.ele.className = this.nodeCss;
			};
			
			if(WIN.isElement(this.container)) this.container.appendChild(this.ele);
			
			if(fireOnBuild)this.onBuild();
		},
		/*
		():
			{void} onBuild()
		DES:
			trggered on elements construction finished;
		*/
		onBuild : Function.empty,
		
		/*
		():
			{this} on({string} evtName, {function} evtHnd, {boolean} useCapture)
		DES:
			shortcut for observing new event handle to this.ele;
		ARG:
		  see also EVT.observe.
		*/
		on : function(evtName, evtHnd, useCapture){
			EVT.observe(this.ele, evtName, evtHnd, useCapture);
			return this;
		},
		/*
		():
			{this} setStyle({object} style)
		DES:
			shortcut for setting this.ele style;
		*/
		setStyle: function(style){
			EL.setStyle(this.ele, style);
			return this;
		},
		unknown: null	
	}
);
