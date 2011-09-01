/* sound.js
*/
require.provide("app.gui.media.sound");

namespace("GUI.Media");

/* {
CLASS:
  __classname
DES:
  __description
CFG:
  {__datatype} __cfgname
    __description
PROPERTY:
  {__datatype} __propertyname
    __description
METHOD:
  {__returntype} __function_name({__datatype} __argment1)
} */
GUI.Media.Sound = WIN.createClass(function(){
  },{    
    em_src : "",
		em_autostart : true,
		em_loop : false,
		em_hidden : true,
		em_starttime : 0,
		em_volume : 100,
		em_controls : "",
		em_title : "",
		em_name : "",
		embedPropertiesRe : /em_/,
		
		initialize : function(options){
			WIN.extend(this, options);
			return this;
    },
    build : function(){
			var p, 
					ele = this.dom = DOC.c("embed"),					
					ctn = this.container || document.body;
			
			this._initDom();
			if(WIN.isElement(ctn))ctn.appendChild(ele);
			return this;
    },
		play : function(){
			EL.removeNode(this.dom);
			this.dom = undefined;
			this.build();
		},
		setEmbed : function(name, value){
			var ele = this.dom;
			if(WIN.isElement(ele)){
				ele.setAttribute(name, value);
			}
			return this;
		},
		_initDom : function(){
			var re = this.embedPropertiesRe;
			for(var i in this){
				if(re.test(i)){
					p = this[i];
					if(p || p === 0){
						i = i.replace(re, "");
						this.setEmbed(i, p);
					}
				}
			}
		},
    toString: function(){return "[object GUI.Media.Sound]";}
  }
);
