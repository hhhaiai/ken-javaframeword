require.provide("sf.alarm.alarmConfig");
var xmlHttp;
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
function sendRequest(xmlHttp, url) {
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
			var returnText = xmlHttp.responseText;
			if (String.trim(returnText) == "true") {
				alert("\u4fee\u6539\u64cd\u4f5c\u6210\u529f!");
				window.location.reload();
			} else {
				alert("\u4fee\u6539\u64cd\u4f5c\u5931\u8d25!");
			}
		}
	};
	xmlHttp.open("POST", url, true);
	xmlHttp.send(null);
}
function toAdd() {
	document.mainForm.action = "alarm/alarm_start.action";
	document.mainForm.submit();
}
function toRemove(name) {
	window.location = "<%=rootPath%>" + "/alarm/alarm_close.action?alarmName=" + name;
}
function colseModWin() {
	var obj = document.getElementById("table33");
	obj.style.display = "none";
}
function modify(key, rowIndex, alarmType, alarmName) {
	var tab = document.getElementById("configList");
	var flow_in;
	var flow_out;
	var min_rate_in;
	var min_rate_out;
	var max_rate_in;
	var max_rata_out;
	if (alarmType == "IPGROUP") {
		flow_in = tab.rows[rowIndex].cells[1].innerText;
		flow_out = tab.rows[rowIndex].cells[2].innerText;
		min_rate_in = tab.rows[rowIndex].cells[3].innerText;
		max_rate_in = tab.rows[rowIndex].cells[4].innerText;
		min_rate_out = tab.rows[rowIndex].cells[5].innerText;
		max_rata_out = tab.rows[rowIndex].cells[6].innerText;
	} else {
		flow_in = tab.rows[rowIndex].cells[2].innerText;
		flow_out = tab.rows[rowIndex].cells[3].innerText;
		min_rate_in = tab.rows[rowIndex].cells[4].innerText;
		max_rate_in = tab.rows[rowIndex].cells[5].innerText;
		min_rate_out = tab.rows[rowIndex].cells[6].innerText;
		max_rata_out = tab.rows[rowIndex].cells[7].innerText;
	}
	var modTable = document.getElementById("modConfig");
	document.getElementById("key").value = key;
	document.getElementById("alarmType").value = alarmType;
	document.getElementById("name").innerText = alarmName;
	document.getElementById("inSize").value = flow_in;
	document.getElementById("outSize").value = flow_out;
	document.getElementById("inMinRate").value = min_rate_in;
	document.getElementById("inMaxRate").value = max_rate_in;
	document.getElementById("outMinRate").value = min_rate_out;
	document.getElementById("outMaxRate").value = max_rata_out;
	var obj = document.getElementById("table33");
	obj.style.display = "block";
}
function changeRoll() {
	var top = EL.getScrollXY();
	var obj = document.getElementById("table33").style.top = top.scrollTop;
}
function fraSubmit() {
	var key = document.getElementById("key").value;
	var alarmType = document.getElementById("alarmType").value;
	var inSize = document.getElementById("inSize").value;
	var outSize = document.getElementById("outSize").value;
	var inMinRate = document.getElementById("inMinRate").value;
	var inMaxRate = document.getElementById("inMaxRate").value;
	var outMinRate = document.getElementById("outMinRate").value;
	var outMaxRate = document.getElementById("outMaxRate").value;
	var url1 = "alarm/alarm_modifyConfig.action?input.inSize=" + inSize + "&input.outSize=" + outSize + "&input.inMaxRate=" + inMaxRate + "&input.outMaxRate=" + outMaxRate;
	var url = url1 + "&input.inMinRate=" + inMinRate + "&input.outMinRate=" + outMinRate + "&input.key=" + key + "&input.alarmType=" + alarmType;
	if (RPC.confirmResponse(url, "true")) {
		alert(" \u4fee\u6539\u914d\u7f6e\u6210\u529f ! ");
		window.location.reload();
	} else {
		alert(" \u4fee\u6539\u914d\u7f6e\u5931\u8d25!");
	}
    
   ///  xmlHttp = getxmlHttp();
   ///  sendRequest(xmlHttp,url);
}
function showType(type) {
	try {
	
		var tarTable = document.getElementById("configList");	
		for (var i = 0; i < tarTable.rows.length - 2; i++) {
			if (String.trim(type) != "all") {
				if (tarTable.rows[2 + i].id != String.trim(type)) {
					tarTable.rows[2 + i].style.display = "none";
				} else {
					tarTable.rows[2 + i].style.display = "block";
				}
			} else {
				   tarTable.rows[2 + i].style.display = "block";
			}
		}
	}
	catch (e) {
		alert(e);
	}
}
function changePageShow(rowCount, culomnCount) {
	var tarTable = document.getElementById("configList");
	for (var row = 2; row < rowCount; row++) {
		tarTable.rows[row].cells[culomnCount - 1].innerHtml;
	}
}

