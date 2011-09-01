
require.provide("sf.home.hometable");
require("org.GUIRender.panel.table33");
require("lib.dom.layout.position");
require("app.bhv.dnd.drag");

EVT.domLoadedObserver.add(function () {
	try {
		var r = GUIRender.BTN.render;
		initTableElement("IFT");
		setTimeout(function(){initTableElement("IP")}, 10);
		setTimeout(function(){initTableElement("IPG")}, 10);
		setTimeout(function(){initTableElement("APP")}, 10);
	}
	catch (e) {
		alert(e);
	}
});

GUIRender.table33_renderStr = "{type: GUIRender.Table33,\t\t\t\t\t\t\t   options:{\t\t\t\t\t\t\t     contentId : \"IFTContent\",\t\t\t\t\t\t\t     head :\"\",\t\t\t\t\t\t\t     foot: '<div align=\"center\"><input name=\"reset\" type=\"button\"   value=\"\u5173\u95ed\" /></div>'}}";


function initTableElement(ele,index) {
    try{
    
	GUIRender.table33_renderStr = "{type: GUIRender.Table33, options:{contentId : \"" + ele + "Content\" }}";
	GUIRender.renderElement($(ele));
	BHV.DND.Drag.toDragalbe($(ele));
	EVT.observe($(ele), "mousedown", Function.curry(function(element){ $(element).style.zIndex +=1;}, ele));
	////EL.keepInview($(ele));
    
	}
	catch(e){
	alert(e);
	}
}

