/***************************************************************
path.js
methods to parse path string
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.string.path");
/*
Extend NAMESPACE:
  String
FUNCTION:
  {string | undefined} String.parseToHref({string} url)
  {int | undefined} String.numOfRelPath({string} strPath)
*/

WIN.extend(String,{
  /*
  ():
    {string | undefined} String.parseToHref({string} url)
  DES:
    parse a url to be a available href;
  ARG:
    {string} url
      a url or file path;
  e.g.
    var url1 = "fileName.html";
    var myHref1 = getHref(url1);// ->http://localhost:8080/nms/developer/test/html/fileName.html
    var url2 = "/fileName.html";
    var myHref2 = getHref(url2);// ->http://localhost:8080/fileName.html
    var url3 = "../../fileName.html";
    var myHref3 = getHref(url3);// ->http://localhost:8080/nms/developer/fileName.html
    var url4 = "http://www.baidu.com";
    var myHref4 = getHref(url4);// ->http://www.baidu.com
  */
  parseToHref : function(url){
    if(!String.notEmpty(url))return ;
    var pathName = location.pathname.replace(/\\/g, "/");
    var RN = String.numOfRelPath(url);
    
    if(RN == -1) pathName = url;
    else {
      var pathFrag = pathName.split("/");
      var len = pathFrag.length,n = len - RN;
      if(n >=0){
        pathFrag[n-1] = url.replace(/\.\.\//g, "");
        pathFrag.splice(n, RN);
        pathName = pathFrag.join("/");
      }
    }
    return location.protocol + "//" + location.host + pathName;
  },
  /*
  ():
    {int | undefined} String.numOfRelPath({string} strPath)
  DES:
    get "../" num in relative path.
    Note:the seporator of path should be "/";
  ARG:
    {string} strPath
      relative path string, like: "../filename.html".
  RTN:
    {int}the num of "../"; 
    If strPath startsWith "/",return -1;
    If strPath is notEmpty string return undefined;
  */
  numOfRelPath     :function(strPath){
    strPath = String.trim(strPath);
    if(!String.notEmpty(strPath))return;
    var r, num;
    r = strPath.match(/\.\.\//g); 
    num = r ? r.length : (strPath.indexOf("/") === 0 ? -1 : 0);
    return num;
  }
});
