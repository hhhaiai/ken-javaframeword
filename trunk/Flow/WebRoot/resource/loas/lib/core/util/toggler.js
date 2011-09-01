/* toggler.js
defines CLASS WIN.Toggler;
*/
require.provide("lib.core.util.toggler");

/*
CLASS:
  WIN.Toggler
DES:
  Toggler is the manager for toggle actions( toggle on or toggle off).
METHOD:
	{boolean} toggle({boolean} state)
*/
WIN.Toggler = WIN.createClass(function(){
	}, {
		/*
		():
			{void} _toggleOn()
		DES:
			_toggleOn action;
		*/
		_toggleOn : null,
		/*
		():
			{void} _toggleOff()
		DES:
			_toggleOff action;
		*/
		_toggleOff : null,
		
		/*
		():
			{boolean} initialize({function} toggleOn, {function}toggleOff)
		DES:
			initialize toggle actions
		*/
		initialize : function(toggleOn, toggleOff){
			this._toggleOn = toggleOn;
			this._toggleOff = toggleOff;
			return this;
		},
		/*
		():
			{void} setToggleState({boolean} state)
		DES:
			do toggle action;
		ARG:
		  {boolean} state
			  determine to do toggleOn or toggleOff action;
		*/
		setToggleState : function(state){
			var f = state ? "_toggleOn" : "_toggleOff";
			this[f]();
			this.toggled = state;
		},
		/*
		():
			{void} toggle()
		DES:
			do toggle action;
		*/
		toggle : function(){
			this.setToggleState(!this.toggled);
		},
		toString : function(){return "[object WIN.Toggler]";}
	}
);