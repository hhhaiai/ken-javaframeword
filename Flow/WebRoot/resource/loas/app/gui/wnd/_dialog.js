/***************************************************************
dialog.js
create window dialog
****************************************************************/
GUI.dialogView = (new GUIdialogBaseView()).initialize({});

function GUIdialog(){
	this.initialize = function(view, opt){
		GUI.dialog.show( url, this.name, features);
		return this;
	};
}


(function(){//for singleton: GUI.window
	function GUIdialogInstance(){
		this.show = function(){};
	}
	GUIdialogInstance.prototype = new GUIwndInstanceBase();
	
	function GUIdialog(){
			
		this.initialize = function(opt){
			
		};
		this.show = function(url,name,features){
			var winView = new GUIwndViewBuilder();
			winView.initialize();
			winView.create();
			var returnWindow = new GUIdialogInstance();
			return returnWindow; 
		};
	}
	GUIdialog.prototype = new GUIwndBaseModel();
	GUI.window = new GUIdialog();
	/*you can init GUI.window to cover default options
	GUI.window.initialize(opt);
	*/
})();

