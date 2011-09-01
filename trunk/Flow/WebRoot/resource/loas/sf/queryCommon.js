
require.provide("sf.queryCommon");
require("org.GUIRender.panel.table33");
require("lib.dom.layout.position");
require("app.bhv.dnd.drag");

EVT.domLoadedObserver.add(function () {
	try {
		var r = GUIRender.BTN.render;
		r("queryDay_img", "date", null, {title:"", tip:"\u9009\u62e9\u65e5\u671f"});
		r("queryDay_search", "search", queryAction, {title:"\u67e5\u8be2"});
		GUIRender.renderElement($("tQuery"));
	    BHV.DND.Drag.toDragalbe($("tQuery"));
	    EL.keepInview($("tQuery"));
	}
	catch (e) {
		alert(e);
	}
});
GUIRender.table33_renderStr = "{type: GUIRender.Table33,\t\t\t\t\t\t\t   options:{\t\t\t\t\t\t\t     contentId : \"TQContent\",\t\t\t\t\t\t\t     head :\"\",\t\t\t\t\t\t\t     foot: '<div align=\"center\"><input name=\"reset\" type=\"button\" onclick=\"cancleDiv();\"  value=\"\u5173\u95ed\" /></div>'}}";
var xmlHttp = null;
function getxmlHttp() {
	try {
         // Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	}
	catch (e) {
  // Internet Explorer
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) {
				alert("your bowser don't support the AJAX\xa3\xa1");
				return false;
			}
		}
	}
	return xmlHttp;
}

function sendRequest(xmlHttp, urlString, day) {
	document.getElementById("url").value = urlString;
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
			var pageComment = xmlHttp.responseText;
			changeComment(pageComment, day);
		}
	};
	xmlHttp.open("POST", urlString + "&input.day=" + day, true);
	xmlHttp.send(null);
}

function changeComment(pageComment, day) {
	try {
		document.getElementById("queryDay").value = day;
		var obj_table = document.getElementById("Query");
		obj_table.rows[1].cells[0].innerHTML = pageComment;
	}
	catch (e) {
		alert(e);
	}
}

function cancleDiv(divNum) {
	var obj = document.getElementById("tQuery");
	obj.style.display = "none";
}

function cancelEventBubble(evt) {
	evt = evt || window.event;
	evt.cancelBubble = true;
}

function openQueryWin(url, day) {
	try {
		this.httpXMLObject = getxmlHttp();
		sendRequest(this.httpXMLObject, url, day);
		var obj = document.getElementById("tQuery");
		obj.style.display = "block";
		changeRoll();
	}
	catch (e) {
		alert(e);
	}
}
function queryAction() {
	var url = document.getElementById("url").value;
	var new_day = document.getElementById("queryDay").value;
	openQueryWin(url, new_day);
}
function changeRoll() {
	var top = EL.getScrollXY();
	var obj = document.getElementById("tQuery").style.top = top.scrollTop;
}
