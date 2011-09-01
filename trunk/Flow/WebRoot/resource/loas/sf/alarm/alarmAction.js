
require.provide("sf.alarm.alarmAction");
require("org.GUIRender.panel.table33");
require("lib.dom.layout.position");


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


function toAdd(url, alarmType,alarmName) {
     
	if (window.confirm("确定启动"+alarmName +"告警器 ?")) {
	    
	 this.xmlhttp = getxmlHttp();
         var urlString = url + "/alarm/alarm_start.action?alarmName=" + alarmType;
         sendRequest(this.xmlhttp,urlString);

	} else {
		return false;
	}
	
}

function sendRequest(xmlHttp,url) {
try{
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
		      var text =  xmlHttp.responseText;
			  var infor = eval('('+text+')');
              alert(infor.alarmName + infor.text);
			  if(infor.state=='open'){
			         document.getElementById("alarm_add").style.display="none";
			         document.getElementById("alarm_remove").style.display="block";
                     document.getElementById("btn_cfg").style.display="block";
			  }else{
			         document.getElementById("alarm_add").style.display="block";
		             document.getElementById("alarm_remove").style.display="none";
                     document.getElementById("btn_cfg").style.display="none";			  
}
		}
	};
	
	xmlHttp.open("POST",url, true);
	xmlHttp.send(null);
	}catch(e){
	   alert(e);
	}
}


function toRemove(url, alarmType,alarmName) {
	if (window.confirm("移除 "+alarmName +"告警器 ?")) {	
	     this.xmlhttp = getxmlHttp();
         var urlString = url + "/alarm/alarm_close.action?alarmName=" + alarmType;
         sendRequest(this.xmlhttp,urlString);
		 ///window.location = url + "/alarm/alarm_close.action?alarmName=" + alarmType;
	} else {
		return false;
	}
}

function comfirmResponse(comfirmText){
       this.xmlHttp = getxmlHttp();         
       xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
		      var text =  xmlHttp.responseText;
                      return (comfirmText==String.trim(text));
		}
	};
	xmlHttp.open("POST",url, true);
	xmlHttp.send(null);
}


function checkAlarmState(path,alarmName,callback){
       this.xmlHttp = getxmlHttp();  
       var url = "/alarm/alarm_list.action?toJSonFlag=true";       
        xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
		      var alarmNames =  xmlHttp.responseText;
                   try{
                      var s = alarmNames.split(",");
                      var flag = "false";
                      for (var i = 0; i < s.length; i++) {
                          if(String.trim(s[i])==String.trim(alarmName))                                     
                               flag = "true";
                      }
                        if(flag=="true")
                           (callback('open'));
                        else
                           (callback('close'));          
                       }catch(e){
                        alert(e);
                       }                                   
		}
	};
	xmlHttp.open("post",path+url, true);
	xmlHttp.send(null);
}

function changeAlarmBtn(flag){
  
  if(String.trim(flag =="open")){
     
       document.getElementById("alarm_add").style.display="none";
       document.getElementById("alarm_remove").style.display="block"; 
       document.getElementById("btn_cfg").style.display="block";
	   
  }else{
   
		  document.getElementById("alarm_add").style.display="block";
          document.getElementById("alarm_remove").style.display="none";
          document.getElementById("btn_cfg").style.display="none";
		 
  }
}




