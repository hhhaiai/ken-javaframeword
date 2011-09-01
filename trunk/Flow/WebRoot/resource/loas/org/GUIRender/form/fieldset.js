/***************************************************************
fieldset.js
defined GUIRender.Fieldset module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("org.GUIRender.form.fieldset");
//require resource
require("org.GUIRender.engin");
require("app.gui.engin");

/*
CLASS:
  GUIRender.Fieldset 
SUPERCLASS:
  GUIRender.Base
DES:
  Fieldset
PROPERTY:
METHOD:
*/
GUIRender.Fieldset = function(){
 GUIRender.Fieldset.superClass.apply(this);
  /*
  ():
    {this} initialize({object} options)
  ARG:
		{object} options
			PROPERTY:
				{string}head
					table head html
				{string}foot
					table foot html
  */
  /*
  ():
    {void} _buildView()
  DES:
    buildView and reference dom
  */
  this._buildView = function(){
		var ele = this.container || this.renderTarget;
		if(!WIN.isElement(ele))return ;
		
		var head = "<span class='legend' style='background-color:" + this.legendColor + ";'>" 
		          + this.legend + "</span>";
		ele.innerHTML = GUI.createTable33Html(head, ele.innerHTML, this.foot, "GUIRender_fieldset");
	};
};
WIN.extendClass(GUIRender.Fieldset, GUIRender.Base);
