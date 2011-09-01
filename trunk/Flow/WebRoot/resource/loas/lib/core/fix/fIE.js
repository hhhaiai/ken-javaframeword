/* fIE.js
*/
require.provide("lib.core.fix.fIE");

namespace("WIN.Fix", {
  fixIE6Scroller : function(){
		var ele = document.body.parentNode;
		var h = ele.scrollHeight;
		var H = DOC.getClientHeight();
		if(h > H)ele.style.overflowY = "scroll";
	},
	delayFix : function(){
		setTimeout(WIN.Fix.fixIE6Scroller, 100);
	},
	fixIE6BgCache : function(){
		try {document.execCommand("BackgroundImageCache", false, true);} catch(e){};
	},
	unknown : null
});
(function(){
	var fix = WIN.Fix;
	EVT.observe(window, "load", fix.delayFix)
	EVT.observe(window, "resize", fix.delayFix);
	fix.fixIE6BgCache();
})();