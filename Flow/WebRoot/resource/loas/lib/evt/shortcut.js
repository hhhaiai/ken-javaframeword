/***************************************************************
shortcut.js
make adding shortcuts to your application much easier.
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.evt.shortcut");
//require resource
require("lib.evt.engin");
/*
OBJECT:
	{object} EVT.shortcut
DES:
	shortcut manager.
	Base on Binny V A work.
	http://www.openjs.com/scripts/events/keyboard_shortcuts/.
	Version : 2.01.A. 
	License : BSD
ATTR:
  {object} _shortcuts
METHOD:
*/
if(!WIN.isObject(EVT.shortcut)) {
	(function(){
		EVT.shortcut = {
			/*
			PROPERTY:
				{object} _shortcuts
			DES:
				All the shortcuts are stored in this json
			*/
			_shortcuts:{},
			/*
			():
				{void} _hnd({string} keyCombination, {function} callback, {event} e)
			DES:
				(private),
			ARG:
			  see also method add.
			*/
			_hnd: function( keyCombination, callback, e){
				e = EVT.Event.fixKey(e);
				var binding = this._shortcuts[keyCombination];
				if(binding.disable_in_input) { //Don't enable shortcut keys in Input(type ==TEXT|PASSWORD ), Textarea fields
					var target = e.target;
					var tagName = target.tagName.toUpperCase();
					var type = target.type.toUpperCase();
					if(tagName == 'TEXTAREA')return false;
					if(tagName == 'INPUT'){
						if(type == "TEXT" || type == 'PASSWORD')return false;
					}
				}
		
				//Find Which key is pressed
				var keyCode = e.keyCode;
				var character = String.fromCharCode(keyCode).toLowerCase();
				
				if(keyCode == 188) character=","; //If the user presses , when the type is onkeydown
				if(keyCode == 190) character="."; //If the user presses , when the type is onkeydown
		
				var keys = keyCombination.split("+");
				//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
				var kp = 0;
				
				//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
				var shift_nums = {
					"`":"~",
					"1":"!",
					"2":"@",
					"3":"#",
					"4":"$",
					"5":"%",
					"6":"^",
					"7":"&",
					"8":"*",
					"9":"(",
					"0":")",
					"-":"_",
					"=":"+",
					";":":",
					"'":"\"",
					",":"<",
					".":">",
					"/":"?",
					"\\":"|"
				}
				//Special Keys - and their codes
				var special_keys = {
					'esc':27,
					'escape':27,
					'tab':9,
					'space':32,
					'return':13,
					'enter':13,
					'backspace':8,
		
					'scrolllock':145,
					'scroll_lock':145,
					'scroll':145,
					'capslock':20,
					'caps_lock':20,
					'caps':20,
					'numlock':144,
					'num_lock':144,
					'num':144,
					
					'pause':19,
					'break':19,
					
					'insert':45,
					'home':36,
					'delete':46,
					'end':35,
					
					'pageup':33,
					'page_up':33,
					'pu':33,
		
					'pagedown':34,
					'page_down':34,
					'pd':34,
		
					'left':37,
					'up':38,
					'right':39,
					'down':40,
		
					'f1':112,
					'f2':113,
					'f3':114,
					'f4':115,
					'f5':116,
					'f6':117,
					'f7':118,
					'f8':119,
					'f9':120,
					'f10':121,
					'f11':122,
					'f12':123
				}
		
				var modifiers = { 
					shift: { wanted:false, pressed:false},
					ctrl : { wanted:false, pressed:false},
					alt  : { wanted:false, pressed:false},
					meta : { wanted:false, pressed:false}	//Meta is Mac specific
				};
													
				if(e.ctrlKey)	modifiers.ctrl.pressed = true;
				if(e.shiftKey)	modifiers.shift.pressed = true;
				if(e.altKey)	modifiers.alt.pressed = true;
				if(e.metaKey)   modifiers.meta.pressed = true;
													
				for(var i=0; k=keys[i],i<keys.length; i++) {
					//Modifiers
					if(k == 'ctrl' || k == 'control') {
						kp++;
						modifiers.ctrl.wanted = true;
		
					} else if(k == 'shift') {
						kp++;
						modifiers.shift.wanted = true;
		
					} else if(k == 'alt') {
						kp++;
						modifiers.alt.wanted = true;
					} else if(k == 'meta') {
						kp++;
						modifiers.meta.wanted = true;
					} else if(k.length > 1) { //If it is a special key
						if(special_keys[k] == keyCode) kp++;
						
					} else if(binding['keycode']) {
						if(binding['keycode'] == keyCode) kp++;
		
					} else { //The special keys did not match
						if(character == k) kp++;
						else {
							if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
								character = shift_nums[character]; 
								if(character == k) kp++;
							}
						}
					}
				}
		
				if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
					callback(target);
		      if(!binding.propagate)e.stopEvent();
					return true;
				}
				return false;
			},
			
			/*
			():
				{void} add({string} combination,{function} callback,options)
			DES:
				
			ARG:
				*{string} combination
					The Shortcut Key Combination which should be specified in this format: Modifier [ + Modifier..] + Key. eg:Ctrl+A.The valid modifiers are :Ctrl, Alt, Shift, Meta.					
					You can specify a sequence without a modifier as well - like this...					
					EVT.shortcut.add("X",function() {
						alert("Hello!");
					});
					see also http://www.openjs.com/scripts/events/keyboard_shortcuts/
        *{function} callback
				  The function will be called when the shortcut key is pressed on the target element,and accept the target element as its only param;eg. callback(target);
				*{object} Options
					eg.(default options){
							eventType :'keydown',
							disable_in_input:false,
							keycode   :false,
							propagate :false,
							target    :document
						}
					*{String} eventType 
					  The event type - can be 'keydown','keyup','keypress'.
					*{Boolean} disable_in_input
					  If this is set to true, keyboard capture will be disabled in input and textarea fields. If these elements have focus, the keyboard shortcut will not work. This is very useful for single key shortcuts. 
					*{HTMLElement| string} target
						The (element|element.id) that should be watched for the keyboard event.
					*{Boolean} propagate
						Allow the event to propagate?
					*{Integer} keycode 
					  Watch for this keycode. For eg., the keycode '65' is 'a'. 
			*/
			add: function(combination,callback,options) {
				var opt = WIN.extendExclude({
          callback  :callback,
					eventType :'keydown',
					disable_in_input:false,
					keycode   :false,
					propagate :false,
					target    :document
				},options, ["callback"]);
				combination = combination.toLowerCase();
				this._shortcuts[combination] = opt;
				return true;
			},
			
			/*
			():
				{returntype} function_name({datatype} argment1)
			DES:
				
				Warning:make sure dom is loaded before you call this function.
			ARG:
				{datatype} argument
			RTN:
				return_value_description
			*/
			excute:function(){
				var type,ele,callback,binding,func,
				  _shortcuts = this._shortcuts;
				for(var combination in _shortcuts){
					binding = _shortcuts[combination];
				  type = binding.eventType;
				  ele = $(binding.target);
				  callback = binding.callback;
					func = (function(combi,cb){
									return function(){return EVT.shortcut._hnd(combi,cb);};
						})(combination,callback);
					EVT.observe(ele, type, func);
				}
			},
			//Remove the shortcut - just specify the shortcut and I will remove the binding
			remove:function(combination) {
				combination = combination.toLowerCase();
				var binding = this._shortcuts[combination];
				delete(this._shortcuts[combination]);
				if(!binding) return;
				var type = binding['event'];
				var ele = $(binding['target']);
				var callback = binding['callback'];
				EVT.stopObserving(ele ,type , callback);
			}
		};
		EVT.domLoadedObserver.addEvent(Function.bind(EVT.shortcut.excute,EVT.shortcut));
		
	})();
}
