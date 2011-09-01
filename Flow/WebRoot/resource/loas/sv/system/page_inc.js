/* page_inc.js
defines common scripts that page need;
*/
require.provide("sv.system.page_inc");
require("sol.page_comm.page");//page module for communication with system
require("org.GUIRender.btn.btnRenderer");

namespace("SV");
/*location.root = function(){
  return "/" + location.pathname.split("/")[1];
}();
*/
/* fix old version window.open, window.history.backmethod before custom window developed;
*/
window.__open = window.open;
window.open = function(url, name, features){
	return page.open(url, name, features + ",type=tab");
};

EVT.domLoadedObserver.add(function(){
	//fix old version program which directly use the variant "mainForm" to access docuemnt.form for fixfox compatibility;
  if(!BROWSER.IE)window.mainForm = document.mainForm;
});