/* cmd.js
defined common commands to oprate data table list.
*/
require.provide("sv.common.commonList.cmd");
require("sv.common.commonList.groupSelect");

var alertInfo = "\u786e\u5b9e\u8981\u5220\u9664\u8fd9\u4e9b\u8bb0\u5f55\u5417?";
var delAction = "";

function toDelete(customAction){
  customAction = (customAction ||delAction);
  var bExist = false;
  var mainForm = document.mainForm;
  if(!mainForm.checkbox)return false;
  
  if ( mainForm.checkbox.length == null ){
    if( mainForm.checkbox.checked ) bExist = true;
  }
  else  {
    for( var i=0; i < mainForm.checkbox.length; i++ ){
       if(mainForm.checkbox[i].checked){
          bExist = true;
          break;
       }
    }
  }
  
  if(bExist){
   if (window.confirm(alertInfo)){
      mainForm.action = customAction;
      mainForm.submit();
   }
  }
  else{
    alert("\u8bf7\u9009\u62e9\u8981\u5220\u9664\u7684\u8bb0\u5f55");
    return false;
  }
}

function toDelete2(){
  var bExist = false;
  var mainForm = document.mainForm;
  if(!mainForm.radio)return false;
  
  if ( mainForm.radio.length == null ){
    if( mainForm.radio.checked ) bExist = true;
  }
  else  {
     for( var i=0; i < mainForm.radio.length; i++ ) {
       if(mainForm.radio[i].checked) bExist = true;
     }
  }

  if(bExist){
    if (window.confirm(alertInfo))  {
       mainForm.action = delAction;
       mainForm.submit();
    }
  }
  else  {
    alert("\u8bf7\u9009\u62e9\u8981\u5220\u9664\u7684\u8bb0\u5f55");
    return false;
  }
}

function addList(){
  var bExist = false;
  var mainForm = document.mainForm;
  if(!mainForm.checkbox)return false; 
  if ( mainForm.checkbox.length == null ){
    if( mainForm.checkbox.checked ) bExist = true;
  }
  else  {
    for( var i=0; i < mainForm.checkbox.length; i++ ){
       if(mainForm.checkbox[i].checked){
          bExist = true;
          break;
       }
    }
  }
  if(bExist){
      mainForm.action = addAction;
      mainForm.submit();
  }
  else{
    alert("\u81f3\u5c11\u8981\u9009\u62e9\u4e00\u9879\u8fdb\u884c\u6dfb\u52a0");
    return false;
  }
}
