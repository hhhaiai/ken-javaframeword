require.provide("sv.common.del");

var alertInfo = "\u786e\u5b9e\u8981\u5220\u9664\u8fd9\u4e9b\u8bb0\u5f55\u5417?";

function del(customAction,checkbox){
  customAction = (customAction ||delAction);
  var bExist = false;
  var mainForm = document.mainForm;
  if(!mainForm[checkbox])return false;
  
  if ( mainForm[checkbox].length == null ){
    if( mainForm[checkbox].checked ) bExist = true;
  }
  else  {
    for( var i=0; i < mainForm[checkbox].length; i++ ){
       if(mainForm[checkbox][i].checked){
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