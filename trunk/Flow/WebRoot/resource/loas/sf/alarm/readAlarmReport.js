require.provide("sf.alarm.readAlarmReport");
require("org.GUIRender.panel.table33");
require("lib.dom.layout.position");
require("app.bhv.dnd.drag");


EVT.domLoadedObserver.add(function () {
	try {
	///	var r = GUIRender.BTN.render;
	///	r("queryDay_img", "date", null, {title:"", tip:"\u9009\u62e9\u65e5\u671f"});
	///	r("queryDay_search", "search", queryAction, {title:"\u67e5\u8be2"});
	///	GUIRender.renderElement($("tReport"));
	/// BHV.DND.Drag.toDragalbe($("tReport"));
	/// EL.keepInview($("tReport"));
	}
	catch (e) {
		alert(e);
	}
});

var alarmXMLHttp = null;

function getAlarmxmlHttp() {
  
	 try {
               // Firefox, Opera 8.0+, Safari
		  alarmXMLHttp = new XMLHttpRequest();
	     }
	 catch (e) {
              // Internet Explorer
	try {
			alarmXMLHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }catch (e) {
	        try {
			alarmXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}catch (e) {
		alert("your bowser don't support the AJAX\xa3\xa1");
		return false;
		}
		}
	}
	return alarmXMLHttp;
}

function sendAlarmRequest(xmlHttp,url) {

	xmlHttp.onreadystatechange = function (){
		if (xmlHttp.readyState == 4) {
		     var txt = xmlHttp.responseText;
		
			 if(String.trim(txt)!="ALARMTIPSISNULL")
			        refreshReportTable(String.trim(txt));
				 else
				    closeResportTable();
		}
	};
	
	xmlHttp.open("POST",url, true);
	xmlHttp.send(null);
}

function refreshReportTable(text){      
    try{
     
	  var targetObj = document.getElementById("tipSpan");
	  var infor = eval('('+text+')'); 
	  var tip = '告警类型 :'+infor.alarmType+'<br>最大流入量:'+infor.MI+'<br>最大流出量:'+infor.MO+'<br>最小流入速率:'+infor.MIIR+'<br>最大流入速率：'+infor.MMIR+'<br>最小流出速率：'+infor.MIOR+'<br>最大流出速率：'+infor.MMOR;
	  ///var tip = '告警类型 :'+infor.alarmType;
     
      document.getElementById('alarmType').innerText= infor.alarmType;
	  document.getElementById('MI').innerText = infor.MI;
	  document.getElementById('MO').innerText = infor.MO;
	  document.getElementById('MIIR').innerText = infor.MIIR;
	  document.getElementById('MMIR').innerText = infor.MMIR;
	  document.getElementById('MIOR').innerText = infor.MIOR;
	  document.getElementById('MMOR').innerText = infor.MMOR;
	   
	 /// targetObj.innerHTML = tip;
	  var targetDiv = document.getElementById("tReport");
	  targetDiv.style.display = "block";
	  divToBottom();
	  setTimeout(closeResportTable,90000);
	  
	  }catch(e){
	     //alert(e.describe);
	  }
}
	  
function closeResportTable(){
      var targetObj = document.getElementById("tReport");
	  targetObj.style.display = "none";
}
	  
function getAlarmReport(path,alarmType){
       
	    this.alarmXMLHttp = getAlarmxmlHttp();
		var url;
		if(String.trim(alarmType)!="All")
           url = path + "/alarm/alarm_getReportTip.action?toCount=TRUE&&alarmName="+ alarmType;
		else
		   url = path + "/alarm/alarm_getReportTip.action?alarmName=All";
           sendAlarmRequest(alarmXMLHttp,url);
}

function getAlarmReportDetail(path,alarmType){
		var url;
		if(String.trim(alarmType)!="All")
           url = path + "/alarm/alarm_getReportTip.action?alarmName="+ alarmType;
		else
		   url = path + "/alarm/alarm_getReportTip.action?alarmName=All";
            
        window.location = url;  
}


function divToBottom(){

   document.getElementById("tReport").style.top=(document.documentElement.scrollTop+document.documentElement.clientHeight-document.getElementById("tReport").offsetHeight)+"px";
   document.getElementById("tReport").style.left=(document.documentElement.scrollLeft+document.documentElement.clientWidth-document.getElementById("tReport").offsetWidth)+"px";
   
}

window.onscroll=divToBottom;
window.onresize=divToBottom;


