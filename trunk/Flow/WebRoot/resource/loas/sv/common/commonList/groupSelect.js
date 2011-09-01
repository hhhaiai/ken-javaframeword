/* groupSelect.js
*/
require.provide("sv.common.commonList.groupSelect");
require("app.bhv.form.selectGroup");

/*
():
  {void} anonymous()
DES:
  auto init the group selcet behaviors of a page which only has one form;
	it follows this rule:
	header : checkbox (named "checkall");
	items : checkboxs (named "checkbox");
*/
EVT.domLoadedObserver.add(function(){
	var sg = new BHV.Form.SelectGroup;
	var header = document.getElementsByName("checkall")[0];
	var items = document.getElementsByName("checkbox");
	sg.initialize(header, items);
});