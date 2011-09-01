/***************************************************************
checkInput.js
checkInput string | ip | number | email
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("sv.common.checkInput");
function formatString(str)
{
   var str2 = "";
   var onechar = "";
   var charcode = "";
   str = String.trim(str);
   for(i=0;i<str.length;i++)
   {
     onechar = str.charAt(i);
     charcode = str.charCodeAt(i);
     if(charcode==39)
     {
       onechar = "_";
     }
     str2 = str2 + onechar;
   }
   return str2;
}

function checkinput(htmlname,type,note,maxlen,isnull)
{
	 var txtObject = mainForm[htmlname];
	 var inputStr = String.trim(formatString(txtObject.value)); 

	 if(!isnull&&inputStr=="")  //????????????
	 {
			alert("<" + note + ">\u4e0d\u80fd\u4e3a\u7a7a!"); 
			txtObject.focus();
			return false;
	 }

	 if(isnull&&inputStr=="") return true;

	 var len = String.lenB(inputStr);
	 if(type=="string")  //????????????
	 {
			if(len>maxlen)      //????????
			{
		alert("<" + note + ">\u8f93\u5165\u8fc7\u957f!");
		txtObject.focus();
		return false;
			}
	 }
	 else if(type=="number")  //??????????
	 {
			if(isNaN(inputStr))
		{
			 alert("<" + note + ">\u5fc5\u987b\u662f\u6570\u5b57!");
			 txtObject.focus();
			 return false;
		}
			else if(len>maxlen)      //????????
			{
			 alert("<" + note + ">\u8f93\u5165\u8fc7\u957f!");
			 txtObject.focus();
			 return false;
			}
	 }
	 else if(type=="ip")   //????ip
	 {
			if(inputStr=="localhost" || /^([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)\.([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)\.([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)\.([1]\d\d|[2][0-5][0-5]|[1-9]\d|\d)$/.test(inputStr))return true;
			else {
				alert("<" + note + ">" + unescape("%u9519%u8BEF%21"));
				return false;
			}
	 }
	 else if(type=="email")  //??????email
	 {
			if(inputStr.indexOf("@")==-1||inputStr.indexOf(".")==-1||inputStr.length<6)
 {
					alert("<Email>" + unescape("%u9519%u8BEF%21"));
					txtObject.focus();
					return false;
 }
	 }
	 else if(type=="mobile")  //??????????
	 {
			if(isNaN(inputStr)||len!=11)
 {
					alert("<mobile>" + unescape("%u9519%u8BEF%21"));
					txtObject.focus();
					return false;
 }
	 }
	 txtObject.value = inputStr;
	 return true;
}

function checkNumber(htmlname,note,min,max,isnull){
     var txtObject = mainForm[htmlname];
	 var inputStr = String.trim(formatString(txtObject.value)); 

	 if(!isnull&&inputStr=="")  //????????????
	 {
			alert("<" + note + ">\u4e0d\u80fd\u4e3a\u7a7a!"); 
			txtObject.focus();
			return false;
	 }
	 if(isnull&&inputStr=="") return true;
	 if(isNaN(inputStr)){
			 alert("<" + note + ">\u5fc5\u987b\u662f\u6570\u5b57!");
			 txtObject.focus();
			 return false;
	 }
	 if(inputStr<min||inputStr>max){
	    alert("<"+note+">\u7684\u503c\u5fc5\u987b\u5728"+min+"\u548c"+max+"\u4e4b\u95f4");
	    txtObject.focus();
	    return false;
	 }
	 return true;
	 
}

function pwdConfirm(){
	var p1 = mainForm.password;
	var p2 = mainForm.passwordConfirm;
	if(p1.value == p2.value)return true;
	alert(unescape("%u4E24%u6B21%u8F93%u5165%u7684%u5BC6%u7801%u4E0D%u4E00%u81F4%2C%u8BF7%u91CD%u65B0%u8F93%u5165%21"));
	p1.value = "";
	p2.value = "";
	return false;
}
