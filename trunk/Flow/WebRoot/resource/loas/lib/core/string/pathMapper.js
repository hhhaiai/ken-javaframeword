/* pathMapper.js
*/
require.provide("lib.core.string.pathMapper");

/*
CLASS:
  String.PathMapper([{string} path])
DES:
  provide a path parser.
PROPERTY:
  {string} path
    string likes: "http://www.yg.com/common",its end has no filename or "/";
METHOD:
  {string} toString()
  {string} map({string} path)
*/
String.PathMapper = WIN.createClass(
  function(path){
    var a = (String.notEmpty(path) ? path : location.href).split("/");
    var end = a[a.length - 1];
    if(String.contains(end, ".") || !String.trim(end) )a.pop();  
    this.path = a.join("/");
  },{
    toString : function(){return this.path;},
    /*
    ():
      {string} map({string} path)
    DES:
      maps a specified path to a physical path
    ARG:
      {string} path
        A relative or virtual path to map to a physical path. If this parameter starts with / , it returns a path as if this parameter is a full virtual path. else it returns a path relative to the directory of this.path;
    */
    map : function(path){
      if(!WIN.isString(path))return "";
			else if(String.trim(path) == "")return this.path;
      if(String.startsWith(path, "/"))return location.protocol + "//" + location.host + path;
			else if(String.contains(path, ":"))return path;
      else{
        var b = this.path.split("/");
        var re = /\.\.\//;
        while (re.test(path)){
          b.pop();
          path = path.replace(re, "");
        }
        return b.join("/") + "/" + path;
      }
    }
  }
);

/*
Extend NAMESPACE:
  String
PROPERTY:
  {object String.PathMapper} String.localPath
FUNCTION:
  {string} String.mapPath({string} path)
*/
WIN.extend(String,{
  /*
  P:
    {object String.PathMapper} String.localPath
  DES:
    a String.PathMapper's instance with path attribute quals to location.href;
  */
  localPath : new String.PathMapper,
  /*
  ():
    {string} String.mapPath({string} path)
  DES:
    maps a specified path to a physical path, if path is relative, then it returns a path relative to the directory of the file being processed; see also String.PathMapper's map method.
  */
  mapPath :function(path){
    return String.localPath.map(path);
  }
});
