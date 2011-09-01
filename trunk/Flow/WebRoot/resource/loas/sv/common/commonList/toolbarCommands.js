/* toolbarCommands.js
*/
require.provide("sv.common.commonList.toolbarCommands");
require("lib.core.util.toggler");

function setSeniorSearchBar(on){
	var pm = GUI.systemPathmapper;
	var btn = SV.btn_senior_search;
	var ele = $("SeniorSearchBar");
	if(!(pm && btn && ele))return ;
	
	var style = ele.style;	
	if(on){
		style.display = "";
		btn.setTitle("隐藏高级查询");
		btn.setIcon(pm.map("arrow_up.gif"));
	}
	else{
		style.display = "none";
		btn.setTitle("打开高级查询");
		btn.setIcon(pm.map("arrow_down.gif"));
	}
}

var btn_seniorSearchToggler = (new WIN.Toggler).initialize(
	Function.curry(setSeniorSearchBar, true),
	setSeniorSearchBar
);
function toggleSeniorSearchBar(){
	btn_seniorSearchToggler.toggle();
}
function toggleTableCollapse(){
	var pm = GUI.systemPathmapper;
	var h = GUI.basicTableAutoWidther
	var btn = SV.btn_toggleTable;
	if(!(pm && btn && h))return ;
	h.toggle();
	var tip = h.expanded ? "折叠全部" : "展开全部";
	var icon = h.expanded ? "view_expand_detail.gif" : "view_collapse_detail.gif";
	btn.setTip(tip);
	btn.setIcon(pm.map(icon));
}