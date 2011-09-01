/***************************************************************
engin.js
LOAS lib's engin
****************************************************************/
/*
():
 {void} namespace({string} str [, {object} props])
DES:
  Returns the namespace specified and creates it if it doesn't exist, copy the props(optional) to it;
*/
function namespace(str, props, owner){
  var s = str.split("."), o = owner || window, p;
  for(var i = 0, len = s.length; i < len; i++){
    p = s[i];
    if(!o[p])o[p] = {};
    o = o[p];
  }
  if(props)WIN.extend(o, props);
  return o;
}
/*
():
  {element || null} $({HTMLelement | string} o)
DES:
  ab. document.getElementById 
*/
function $(o){
  if(!o)return null;
  var ele;
  if(typeof o == "string")ele = document.getElementById(o);
  else ele = o;
  return ele;
}
/*
NAMESPACE:
  WIN
DESCRIPTION:
  globla namespace,colect some core functions.
PROPERTY:
  {object} config
FUNCTION:
  {object} WIN.clone({object} source ,{boolean} isObj)
  {function} WIN.createClass({function} f [, {object} props, {object} superClass])
  {void} WIN.debug({string} debugInfo [, {string} type])
  {void} WIN.debugEnsure()
  {void} WIN.debugFn({function} fn[,{Error} e, {string} moreInfo])
  {object} WIN.extend({object} destination, {object} source)
  {object } WIN.extendThese({object} destination, {object} source ,{array} extendList)
  {object } WIN.extendExclude({object} destination, {object} source ,{array} ExcludeList)
  {void} WIN.extendClass({class} destClass, {class | object} source, {array} overrideList)
  {array} WIN.getKeys({object} o)
  {array} WIN.getValues({object} o)
  {boolean} WIN.isArray({object} obj)
  {boolean} WIN.isDefined({object} obj)
  {boolean} WIN.isDefinedAll({object} v1[,..])
  {boolean} WIN.isElement({object} obj)
  {boolean} WIN.isFunction({object} obj)
  {boolean} WIN.isObject({object} obj)
  {boolean} WIN.isString({object} obj)
  {array} WIN.toArray({array} obj)
*/
var WIN = {
  /*
  PROPERTY:
    {object} config
  DES:
    script configs
    PROPERTY:
      {boolean} confirmOnExit
      {string} debugID
      {string} debugModule
      {string} enalbeIE6_bgCache
      {boolean} isDebugMode
  */  
  config   : {
    /*
    cfg:
      {boolean} isDebugMode
    DES:
      flag to enable debug
    */
    isDebugMode : true,
    /*
    cfg:
      {boolean} confirmOnExit
    DES:
      confirm onbeforeunload
    */
    confirmOnExit : false,
    /*
    cfg:
      {string} debugID
    DES:
      debug log container id
    */
    debugID     : "debugLog",  //
    /*
    cfg:
      {string} debugModule
    DES:
      debug module
    */
    debugModule : "lib.core.debug.engin",
    /*
    cfg:
      {string} enalbeIE6_bgCache
    DES:
      enable ie 6 backgroud image cache
    */
    enalbeIE6_bgCache:true
  },
  /*
  ():
    {object} WIN.clone({object} source)
  DES:
    if source is an obj(not an HTMLElement), return a deep clone of the source;
    if it's an arry return source copy
    else return source;
    about the deep clone:
      if property is obj type then do WIN.clone recursive;
      else if is array type then return its copy 
      else if is element and its nodeType ==1 the return element.cloneNode(true).
      else return itself;
    Note:if you want to clone an HTMLElement please use element.clone.
  ARG:
    {object} source
      source to be clone
  */
  clone    : function (source){
    if(!WIN.isObject(source)){
      if(WIN.isArray(source))return (source.concat());
      else return source;
    }
    else if(source.nodeType > 0){//HTMLElement
      if(source.nodeType == 1) return source.cloneNode(true);
      else return source;
    }
    else {
      var newObj = {};
      for(var i in source){
        var o = source[i];
        if(WIN.isObject(o))newObj[i] = WIN.clone(o);
        else if(WIN.isArray(o))newObj[i] = o.concat();
        else newObj[i] = o;
      }
      return newObj;
    }
  },
  /*
  ():
    {function} WIN.createClass({function} f 
                               [, {object} props, {object} superClass, {array} overrides])
  DES:
    create a new class;If it has same name  public method or property then we set them as the dest's static property with new name("$" + the original name) to access source's method or property,if you dont want to access it,push the name into overrides.
    bug warnning : if superClass is specified, dont call prototye method in constructor.
    it's a bug, please pay attention;
  ARG:
    {function} f 
      class main constructor;
    {object} props
      public attributes or methods;
    {object} superClass
      if superClass is offered, we create a new constructor which will apply superClass constructor;
    {array} overrides
      the methods and properties list of the new class to override super class.
  e.g.
    function A(){}
    var extA = WIN.createClass(function(){}, {name: "ext from A"}, A);
  */
  createClass : function(f, props, superClass, overrides){
    var cf = f;
    if(WIN.isFunction(superClass)){
      cf = function(){
        superClass.apply(this, arguments);
        f.apply(this, arguments);
      };
      var sIns = new superClass;
      var fIns = new f;
      
      if(WIN.isArray(overrides)){
        for(var i in fIns)
          if(sIns[i] && !overrides.contains(i))cf["$" + i] = sIns[i];
        for(var i in props)
          if(sIns[i] && !overrides.contains(i))cf["$" + i] = sIns[i];
      }
      else {
        for(var i in fIns)
          if(sIns[i])cf["$" + i] = sIns[i];
        for(var i in props)
          if(sIns[i])cf["$" + i] = sIns[i];
      }
      
      cf.prototype = sIns;
      cf.prototype.constructor = cf;      
    }
    
    if(props){
      WIN.extend(cf.prototype ,props);
      if(BROWSER.IE && (props.toString != {}.toString))cf.prototype.toString = props.toString;
    }
    return cf;
  },
  /*
  ():
    {void} WIN.debug({string} debugInfo [, {string} type])
  DES:
    output debug info,you should prepare a div and set the debugMode.See also WIN._debug
  */
  debug    : function (debugInfo, type){
    if(WIN.config.isDebugMode) WIN._debug(debugInfo, type);
  },
  /*
  ():
    {void} WIN.debugEnsure()
  DES:
    check load resource if script is in debugMode .
  */
  debugEnsure:function(){
    if(WIN.config.isDebugMode){
      require(WIN.config.debugModule);
    }
  },
  /*
  ():
    {void} WIN.debugFn({function} fn[,{Error} e, {string} moreInfo])
  DES:
    if script is in debug mode,it'll outputs a function's caller backtrack and error description.Require debug module.See also WIN._debugFn
  */
  debugFn  : function (fn,e,moreInfo){
    if(WIN.config.isDebugMode)WIN._debugFn(fn,e,moreInfo);
  },
  /*
  ():
    {object } WIN.extend({object} destination, {object} source)
  DES:
    copy all properties from the source to the destination object,override properties of the same name in destination.Note if you want a deep clone, please use function WIN.clone.
    Note:seen more details in ARG destination.
  ARG:
    {object} destination
      Destination obj to be extended.
      Warning: If it's undefined,we assign a object value,but in fact the destination is still undefined,so when you're unsure whether the destination is defined or not,you should assign the return value to the destination.
      eg.
        var myObj;
        WIN.extend(myObj, {a: "a"}); //-> myObj is still undefined.
        myObj = WIN.extend(myObj, {a: "a"}); //-> myObj is {a: "a"} now.
      Besides,destination should not be a string text or boolean,or the destination will not be extended.A string text is not the same as String object which is created by new String();
        var str1 = "it's a string text";
        WIN.extend(str1, {a: "a"}); //-> str1 is still be a string.
        var str2 = new String("it's a string object");
        str2 = WIN.extend(str2, {name: "str2"}); //-> str2 had the property "name".
    {object} source
  */
  extend   : function(destination, source) {
    if(!destination)destination = {};
    for (var property in source){
      destination[property] = source[property];
    }
    return destination;
  },  
  /*
  ():
    {object } WIN.extendExclude({object} destination, {object} source ,{array} excludeList)
  DES:
    Copy some properties except specified in extendList from the source to the destination,See also WIN.extend.
  ARG:
    {object} destination
      If it's undefined,we assign it a object value.See also WIN.extend.
    {array} excludeList
      properties list you dont want.
  */
  extendExclude :function(destination, source, excludeList){
    if(!destination)destination = {};
    if(WIN.isArray(excludeList)){
      for (var property in source){
        if(!excludeList.contains(property)) destination[property] = source[property];
      }
    }
    else WIN.extend(destination, source);
    return destination;
  },
  /*
  ():
    {void} WIN.extendClass({class} dest, {class | object} source, {array} overrideList)
  DES:
    expand dest class's prototype by a class;If dest has same name  public method or property then we set them as the dest's static property with new name("$" + the original name) to access source's method or property,if you dont want to access it,push the name into overrideList.
    e.g.
      function c1(){
        this.init = function(){};//init in c1;
        this.get = function(){return null;};
      }
      function c2(){
        c2.superClass.apply(this);// c2.superClass = c1
        this.init = function(){
          c2.$init.call(this);//c2 has $init static function;
        };
        this.get = function(){return "";};
      }
      WIN.extendClass(c2, c1, ["get"]);
      var c2_ins = new c2();
      alert(c2_ins instanceof c2); // ->true;
      
    Note:
      In the function we set source as dest's superClass property;
  ARG:
    {class} destClass
      sub class to be extend
    {class | object} source
      super class or an obj
    {array} overrideList
      the methods and properties list of sub class to override super class.
  */
  extendClass : function(dest, source, overrideList){
    if(!(dest instanceof Function && source) || dest.superClass)return ;
    var sourceIns = new source();
    dest.superClass = source;
    
    var destIns = new dest();
    var _m = {};  
    if(WIN.isArray(overrideList)){
      for(var i in sourceIns)
        if(destIns[i] && !overrideList.contains(i))dest["$" + i] = sourceIns[i];
    }
    else {
      for(var i in sourceIns)
        if(destIns[i])dest["$" + i] = sourceIns[i];
    }
    dest.prototype = sourceIns;
  },
  /*
  ():
    {object } WIN.extendThese({object} destination, {object} source ,{array} extendList)
  DES:
    Copy some properties specified in extendList from the source to the destination,See also WIN.extend.
  ARG:
    {object} destination
      If it's undefined,we assign it a object value.See also WIN.extend.
    {array} extendList
      properties list you want.
  */
  extendThese :function(destination, source, extendList){
    if(!destination)destination = {};
    Array.each(function(i){destination[i] = source[i];},extendList);
    return destination;
  },
  /*
  ():
    {boolean} WIN.isArray({object} obj)
  DES:
    return ture when the type of variant is array
  */
  isArray      : function(obj) {
    return !!(obj && obj.constructor === Array);
  },
  /*
  ():
    {boolean} WIN.isDefined({object} obj)
  DES:
    return ture when variant is defined
  */
  isDefined    : function (obj){
    return (obj != undefined);
  },
  /*
  ():
    {boolean} WIN.isDefinedAll({object} v1[,..])
  DES:
    return ture when all viriants is defined
  */
  isDefinedAll : function(){
    return Array.every(WIN.isDefined,WIN.toArray(arguments));
  },
  /*
  ():
    {boolean} WIN.isElement({object} obj)
  DES:
    return true if obj.nodetype ==1 
  */
  isElement   : function (obj){
    return obj && obj.nodeType == 1;
  },
  /*
  ():
    {boolean} WIN.isFunction({object} obj)
  DES:
    return ture when the type of variant is function
  */
  isFunction   : function(obj) {
    return typeof obj == "function";
  },
  /*
  ():
    {boolean} WIN.isObject({object} obj)
  DES:
    return ture when the type of variant is object and not null
  */
  isObject     : function(obj) {
    return !!(obj && typeof obj == "object");
  },
  /*
  ():
    {boolean} WIN.isString({object} obj)
  DES:
    return ture when the type of variant is string
  */
  isString     : function(obj) {
    return typeof obj == "string";
  },
  /*
  ():
    {array} WIN.toArray({array} obj)
  DES:
    Accepts an array-like collection (anything with numeric indices) and returns its equivalent as an actual Array object. This method is a convenience alias of Array.from, but is the preferred way of casting to an Array.
  */
  toArray  : function (obj) {
    return Array.prototype.slice.call(obj,0);
  },
  /*
  CLASS:
    WIN.Observer
  DES:
    element Event Observer
  ATTR:
    {array} _observers
  METHOD:
    {void} add({function} fn, {boolean} throwOnError)
    {void} execute()
    {void} remove({function} fn)
  */
  Observer : function(){
    /*
    PROPERTY:
      {array} _observers
    DES:
      private,store event handlers with type like this [[fundtionName,throwOnError],[..]]
    */
    this._observer = [];
    /*
    ():
      add(fn, throwOnError)
    DES:
      add event on body ready
    ARG:
      fn:function name
      throwOnError: boolean,if true,it will throw error instead of continue calling next function 
    */
    this.add  = function(fn, throwOnError){
      var observer = this._observer;
      if(!(WIN.isArray(observer) || WIN.isFunction(fn)))return;
      observer.push([fn,throwOnError]);
    };
    /*
    ():
      execute()
    DES:
      execute all the function in bodyObserver._observer unless on error and need to stop
    */
    this.execute  = function(){
      var observer = this._observer;
      if(!WIN.isArray(observer))return;
      var len = observer.length;
      var f,throwOnError;
      for(var i=0; i<len; i++){
        f = observer[i][0];
        throwOnError = observer[i][1];
        if(f){
          if(throwOnError)f.apply(window, arguments);
          else try{f.apply(window, arguments);}catch(e){}
        }
      }
    };
    /*
    ():
      .remove(fn)
    DES:
      remove fn from bodyObserver._observer
    */
    this.remove  = function(fn){
      var observer = this._observer;
      if(!WIN.isArray(observer))return;
      var len = observer.length;
      var f;
      for(var i=0; i<len; i++){
        f = observer[i][0];
        if(fn == f)observer.removeAt(i);
      }
    };
    this.toString = function(){
      return "[object WIN.Observer]";
    };
  }
};
/*
NAMESPACE:
  BROWSER
DES:
  browser info
PROPERTY:
  {boolean} Gecko
  {boolean} IE
  {float} IEversion
  {boolean} Opera
  {boolean} Safari
*/
namespace("BROWSER");
(function(){
  var ua = navigator.userAgent.toLowerCase(),
    v = parseFloat(navigator.appVersion.toLowerCase().split("msie")[1]),
    IEversion = isNaN(v)? -1 : v,
    isIE = !!(IEversion > 0),
    isSafari = !!(ua.indexOf('safari') > -1),
    isOpera = !!window.opera;
  WIN.extend(BROWSER,{
    IE        :isIE,
    IEversion  :IEversion,
    Opera      :isOpera,
    Gecko      :!!(ua.indexOf('gecko') > -1 && !isSafari),
    Safari    :isSafari
  });
})();

/*
NAMESPACE:
  DOC
DES:
  reference to document elements and methods to get document style info
PROPERTY:
  {HTMLHeadElement} head
FUNCTION:
  {Element} DOC.c({string} tagName)
  {Int} DOC.getHeight()
  {Int} DOC.getWidth()
  {Int} DOC.getClientHeight()
  {Int} DOC.getClientWidth()
*/
namespace("DOC" ,{
  /*
  PROPERTY:
    {HTMLHeadElement} head
  DES:
    refer to head element in document
  */
  head     :document.getElementsByTagName("head")[0],
  /*
  ():
    {Element} DOC.c({string} tagName)
  DES:
    ab. for document.createElement
  */
  c        :function(tagName){return document.createElement(tagName);},
  /*
  ():
    {Int} DOC.getHeight()
  DES:
    Returns the height of the document (which includes the body and its margin).
  */
  getHeight : function() {
    var scrollHeight = (document.compatMode != "CSS1Compat") ? 
                      document.body.scrollHeight : 
                      document.documentElement.scrollHeight;
    return Math.max(scrollHeight, DOC.getClientHeight());
  },
  /*
  ():
    {Int} DOC.getWidth()
  DES:
    Returns the width of the document(which includes the body and its margin).
  */
  getWidth: function() {
    var scrollWidth = (document.compatMode != "CSS1Compat") ?
                      document.body.scrollWidth : 
                      document.documentElement.scrollWidth;
    return Math.max(scrollWidth, DOC.getClientWidth());
  },
  /*
  ():
    {Int} DOC.getClientHeight()
  DES:
    Returns the height of the viewable area of the page (excludes scrollbars)
  */
  getClientHeight: function() {
    var height = self.innerHeight;
    var mode = document.compatMode;

    if ( (mode || BROWSER.IE) && !BROWSER.Opera ) {
      height = (mode == "CSS1Compat") ?
              document.documentElement.clientHeight : // Standards
              document.body.clientHeight; // Quirks
    }
    return height;
  },
  /*
  ():
    {Int} DOC.getClientWidth()
  DES:
    Returns the width of the viewable area of the page (excludes scrollbars)
  */
  getClientWidth: function() {
    var width = self.innerWidth;
    var mode = document.compatMode;

    if (mode || BROWSER.IE) { // IE, Gecko, Opera
      width = (mode == "CSS1Compat") ?
              document.documentElement.clientWidth : // Standards
              document.body.clientWidth; // Quirks
    }
    return width;
  }
});

/*
NAMESPACE:
  TRY
DES:
  try to do some commands without casing any error.
FUNCTION:
  {void} TRY.whatever({function} fn1[,..]])
*/
namespace("TRY" ,{
  /*
  ():
    {void} TRY.whatever({function} fn1[,..]])
  DES:
    do all commands(functions) whatever.
  */
  whatever: function (){
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
      try {arguments[i]();}catch (e){}
    }
  }
});

/*
CLASS:
  Array
DES:
  Define some useful method to access to an array; If a method had been defined,it wont be infused again.
METHOD:
  {boolean} contains({object} o)
  {array} copy()
  {int} indexOf({object} obj[, {int} fromIndex])
  {void} insertAt({object} o, {int}i)
  {void} insertBefore({object} o,{object} o2)
  {int} lastIndexOf({object} obj[, {int} fromIndex])
  {int} push({object} obj[,..]])
  {void} removeAt({int} i)
  {void} remove(o)
  {item} shift()
*/
(function(){
  var arrayPrototype = Array.prototype;
  var arrayMethods = {
    /*
    ():
      {boolean} contains({object} o)
    DES:
      return true if the array contains o;
    */
    contains  :function(o){
      return this.indexOf(o)!=-1;
    },
    /*
    ():
      {array} copy()
    DES:
      return a copy of array
    */
    copy      :function(){
      return this.concat();
    },
    /*
    ():
      {int} indexOf({object} obj[, {int} fromIndex])
    DES:
      return the position that the obj appears at first time
    */
    indexOf    :function(obj,fromIndex){
      if(fromIndex==null){
        fromIndex = 0;
      }else if(fromIndex<0){
        fromIndex = Math.max(0,this.length+fromIndex);
      }
      for(var i = fromIndex;  i<this.length; i++)  if(this[i]===obj)return i;
      return -1;
    },
    /*
    ():
      {void} insertAt({object} o, {int}i)
    DES:
      insert o at position i
    */
    insertAt  :function(o,i){
      this.splice(i,0,o);
    },
    /*
    ():
      {void} insertBefore({object} o,{object} o2)
    DES:
      insert o2 Before o
    */
    insertBefore:function(o,o2){
      var i=this.indexOf(o2);
      if(i==-1)this.push(o);
      else this.splice(i,0,o);
    },
    /*
    ():
      {int} lastIndexOf({object} obj[, {int} fromIndex])
    DES:
      return the position that the obj appears at last time
    */
    lastIndexOf  :function(obj,fromIndex){        
      if(fromIndex==null){
        fromIndex=this.length-1;
      }else if(fromIndex<0){
        fromIndex=Math.max(0,this.length+fromIndex);
      }
      for(var i=fromIndex; i>=0; --i)if(this[i]===obj)return i;
      return -1;
    },
    /*
    ():
      {int} push({object} obj[,..]])
    DES:
      add new items at the end
    RTN:
      length of new array
    */
    push  :function (){
      for (var i=0;i<arguments.length;i++) this[this.length]=arguments[i];
      return this.length;
    },
    /*
    ():
      {void} remove(o)
    DES:
      remove item o
    */
    remove  :function(o){
      var i=this.indexOf(o);
      if(i!=-1)this.splice(i,1);
    },
    /*
    ():
      {void} removeAt({int} i)
    DES:
      remove o at position i
    */
    removeAt  :function(i){
      this.splice(i,1);
    },
    /*
    ():
      {item} shift()
    DES:
      remove first item
    RTN:
      first item
    */
    shift   :function (){
      var rs = this[0];
      for (var i=1;i<this.length;i++) this[i-1]=this[i]
      this.length=this.length-1
      return rs;
    }
  };
  for(i in arrayMethods)
    (arrayPrototype[i]) || (arrayPrototype[i] = arrayMethods[i]);    
})();

/*
NAMESPACE:
  Array
DES:
  Define methods to make use of array data structure;
FUNCTION:
  {void} Array.each({function} f,{array} sequence, {object}obj)
  {boolean} Array.every({function} f,{array} sequence, {object}obj)
  {array} Array.filter({function} f,{array} sequence, {object}obj)
  {void} Array.intervalEach({function} f,{array} sequence, {int}t)
  {array} Array.map({function} f,{array} sequence, {object}obj)
  {boolean} Array.some({function} f,{array} sequence, {object}obj)
*/
WIN.extend(Array,{
  /*
  ():
    {void} Array.each({function} f,{array} sequence, {object}obj)
  DES:
    iterate over all the items in a array to form a chain-calling,The iterator function you pass will be called with parameters (obj,sequence[i],i,sequence).
  ARG:
    {function} f
      the iterator function to be called
    {array} sequence
      sequence can be iteratable
    {object}obj
      the obj used as context of iterator function 
  */
  each     : function (f,sequence, start, obj){
    if(!(sequence && WIN.isFunction(f)))return;
    var len = sequence.length;
    try{
      for(var i = (start || 0);  i < len;  i++){
        f.call(obj,sequence[i],i,sequence);
      }
    }catch(e){
      if(e != Object)throw e;//break
    }
  },
  /*
  ():
    {boolean} Array.every({function} f,{array} sequence, {object}obj)
  DES:
    iterate over all the items in a array to form a chain-calling,The iterator function you pass will be called with parameters (obj,sequence[i],i,sequence).If each time the iterator function returns true,then Array.every return true,else Array.every return false.
  ARG:
    {function} f
      the iterator function to be called
    {array} sequence
      sequence can be iteratable
    {object}obj
      the obj used as context of iterator function 
  */
  every : function (f,sequence, start,obj){
    if(!(sequence && WIN.isFunction(f)))return false;
    var len = sequence.length;
    for(var i = (start || 0);  i < len;  i++)
      if(!f.call(obj,sequence[i],i,sequence)){ return false;}
    return true;
  },
  /*
  ():
    {array} Array.filter({function} f,{array} sequence, {object}obj)
  DES:
    iterate over all the items in a array to form a chain-calling,The iterator function you pass will be called with parameters (obj,sequence[i],i,sequence).Return a new array contains the appropriate items.
  ARG:
    {function} f
      the iterator function to be called
    {array} sequence
      sequence can be iteratable
    {object}obj
      the obj used as context of iterator function 
  */
  filter   : function (f,sequence, start,obj){
    if(!(sequence && WIN.isFunction(f)))return [];
    var len = sequence.length,
         res = [];
    for(var i = (start || 0);  i<len;  i++)
      if(f.call(obj,sequence[i],i,sequence)){ res.push(sequence[i]);}
    return res;
  },
  /*
  ():
    {void} Array.intervalEach({function} f,{array} sequence, {int}t)
  DES:
    interval to iterate over the sequence to form a chain-calling,
  ARG:
    {function} f
      the iterator function to be called
    {array} sequence
      sequence can be iteratable
    {int}t
      time interval 
  */
  intervalEach: function (f,sequence, t, start){
    if(!(sequence && WIN.isFunction(f)))return ;
    var i = (start || 0),len = sequence.length;
    var tmr = setInterval(function(){
      if(i >= len)clearInterval(tmr);
      else {
        f(sequence[i],i,sequence);
        i++;
      }
    },t);
  },
  /*
  ():
    {array} Array.map({function} f,{array} sequence, {object}obj)
  DES:
    iterate over all the items in a array to form a chain-calling,The iterator function you pass will be called with parameters (obj,sequence[i],i,sequence).Return a new array with items(which are the return value of iterator function called each time)
  ARG:
    see also Array.filter 
  */
  map      : function (f,sequence, start,obj){
    if(!(sequence && WIN.isFunction(f)))return ;
    var len = sequence.length,res = [];
    for(var i=(start || 0);  i < len;  i++)res.push(f.call(obj,sequence[i],i,sequence));
    return res;
  },
  /*
  ():
    {boolean} Array.some({function} f,{array} sequence, {object}obj)
  DES:
    iterate over all the items in a array to form a chain-calling,The iterator function you pass will be called with parameters (obj,sequence[i],i,sequence).If any time the iterator function returns true,then Array.every return true,else Array.every return false.
  ARG:
    see also Array.every 
  */
  some      : function (f,sequence, start,obj){
    if(!(sequence && WIN.isFunction(f)))return false;
    var len = sequence.length;
    for(var i=(start || 0);  i < len;  i++)
      if(f.call(obj,sequence[i],i,sequence)){ return true;}
    return false;
  }
});
/*
NAMESPACE:
  String
DES:
  these are functions to handle string.
  Waring:if the param str isnt a string,it'll just return str.All String functions are the same except these:String.evalJSONstring.
FUNCTION:
  {string} String.camelize({string} cssPropStr)
  {string} String.capitalize({string} str)
  {boolean} String.contains({string} str, {string} findStr)
  {boolean} String.endsWith({string} str,{string} eStr)
  {object} String.evalJSONstring({string} str)
  {int} String.lenB({string} str)
  {boolean} String.notEmpty({string} str)
  {boolean} String.startsWith({string} str,{string} bStr)
  {string} String.substringB({string} str,startPos,endPos)
  {string} String.stripTags({string} str)
  {string} String.trim({string} str)
*/
WIN.extend(String,{
  /*
  ():
    {string} String.camelize({string} cssPropStr)
  DES:
    fomate cssProperty String to camelize.if cssPropStr isnt a string.
  ARG:
    cssPropStr:cssProperty String,
  RTN:
    camelized cssPropStr
  */
  camelize  :function(cssPropStr){
    if(!WIN.isString(cssPropStr))return cssPropStr;
    var i,c,a=cssPropStr.split('-');
    var s=a[0];
    for(i=1;i<a.length;i++){
      c=a[i].charAt(0);
      s+=a[i].replace(c,c.toUpperCase());
    }
    return s;
  },
  /*
  ():
    {string} String.capitalize({string} str)
  DES:
    fomate string first letter to uppercase
  */
  capitalize:function(str){
    if(!WIN.isString(str))return str;
    return str.charAt(0).toUpperCase() + str.substr(1);
  },
  /*
  ():
    {boolean} String.contains({string} str, {string} findStr)
  DES:
    return true if the str contains findStr;
  ARG:
    {string}findStr
      stirng to be find
  */
  contains  :function(str, findStr){
    if(!WIN.isString(str))return false;
    return str.indexOf(findStr)!= -1;
  },
  /*
  ():
    {boolean} String.endsWith({string} str,{string} eStr)
  DES:
    Returns true if s ends with eStr.
  */
  endsWith  :function(str,eStr){
    if(!WIN.isString(str))return str;
    return str.substring(str.length-eStr.length,str.length)==eStr;
  },
  /*
  ():
    {object} String.evalJSONstring({string} str)
  DES:
    eval JSON like string expression
  eg.
    var e1 = "(function(){return 1;})();(function(){return 2;})();";
    var e2 = "(function(){return 1;})(),(function(){return 2;})()";
    var json1 = "{\
      name : 'json1',\
      id   : '2'\
    }"
    
    WIN.debug(eval(e1));// -> "2"
    WIN.debug(String.evalJSONstring(e2));// -> "2"
    WIN.debug(String.evalJSONstring(json1));// -> "[object Object]"
    
    //WIN.debug(eval(json1));// -> error: invalid label
    WIN.debug(String.evalJSONstring(e1));// -> error: missing ) in parenthetical
  */
  evalJSONstring :function(JSONstring) {
    return eval('(' + JSONstring + ')');
  },
  /*
  ():
    {int} String.lenB({string} str)
  DES:
    Returns the length of string by bytes.
  */
  lenB      :function(str){
    if(!WIN.isString(str))return str;
    return str.replace(/[^\x00-\xff]/g,"aa").length;
  },
  /*
  ():
    {boolean} String.notEmpty({string} str)
  DES:
    Returns true if str is a not empty string;
  */
  notEmpty :function(str) {
    return (WIN.isString(str) && (str != ""));
  },
  /*
  ():
    {boolean} String.startsWith({string} str,{string} bStr)
  DES:
    Returns true if s begins with bStr.
  */
  startsWith:function(str,bStr){
    if(!WIN.isString(str))return str;
    return str.indexOf(bStr) == 0;
  },
  /*
  ():
    {string} String.substringB({string} str,startPos,endPos)
  DES:
    return the string between startPos and endPos;its unit is bytes not char.
  */
  substringB:function(str,s,e){
    if(!WIN.isString(str))return str;
    var i = 0;
    var lenB = 0;
    if(s>e){
      var t = e;
      e = s;
      s = t;
    }
    while(lenB < s){
      lenB += (str.charCodeAt(i)>255) ? 2 : 1;
      i++;
    }
    s = i;    //new start pos
    while(lenB < e){
      lenB += (str.charCodeAt(i)>255) ? 2 : 1;
      i++;
    }
    e = i;    //new end pos
    return str.substring(s,e);
  },
  /*
  ():
    {string} String.stripTags({string} str)
  DES:
    return the string without tags(<>)
  */
  stripTags: function(str) {
    if(!WIN.isString(str))return str;
    return str.replace(/<\/?[^>]+>/gi, '');
  },
  /*
  ():
    {string} String.trim({string} str)
  DES:
    Removes leading and trailing white-space from a string.
  */
  trim      :function(str){
    if(!WIN.isString(str))return str;
    return str.replace(/(^\s+)|\s+$/g,"");
  }
});
//Function methods
/*
NAMESPACE:
  Function
DES:
  functions to create closure function and some use usefule properties
PROPERTY:
  {function} empty
  {function} K
FUNCTION:
  {function} Function.bind({function} f, {object} bindObj[,arguments]);
  {function} Function.curry({function} f[, arg...]);
*/
WIN.extend(Function,{
  /*
  ():
    {function} Function.bind({function} f, {object} bindObj[,arguments]);
  DES:
    Returns a bound method on bindObj, optionally currying arguments
  ARG:
   {function} f
     the function you want to apply
   {object} bindObj
     use as the context of the function 
    arguments: arguments for original function  
  */
  bind   :function(f,obj){
    if (obj === undefined) return this;
    var args = WIN.toArray(arguments).slice(2);
    return function(){
      return f.apply(obj,args.concat(WIN.toArray(arguments)));
    };
  },
  /*
  ():
    {function} Function.curry({function} f[, arg...]);
  DES:
    curry a function A with args to make new function B; A's thisObj is replaced by contetx obj.
  */
  curry  : function(f){
    var args = WIN.toArray(arguments).slice(1);
    return function(){
      return f.apply(this,args.concat(WIN.toArray(arguments)));
    };
  },
  /*
  PROPERTY:
    {function} empty
  DES:
    empty function
  */
  empty :function(){},
  /*
  PROPERTY:
    {function} K
  DES:
    K function
  */
  K :function(k){return k;}
});

/*
NAMESPACE:
  RPC
DES:
  handle remote procedure call;
PROPERTY:
  {array} _XHRTransportPool
  {string} MSG_NOTSUPPORT_XMLHTTP
FUNCTION:
  {string} RPC._appendUrlRandom({string} url)
  {object | null} RPC.createXHRTransport()
  {object} RPC.getXHRTransport()
  {boolean} RPC.isOk({object} req)
  {void} RPC.onReadyStateChange({xmlHttpRuquest} req, {object}o)
  {object} RPC.xhr({string} url, {object} options)
*/
namespace("RPC" ,{
  /*
  PROPERTY:
    {array} _XHRTransportPool
  DES:
    xmlRequest transports pool.Use a pool to manage the transports.
  */
  _XHRTransportPool   :[],
  
  /*
  ():
    {string} RPC._appendUrlRandom({string} url)
  DES:
    append Random num to Url;
  */
  _appendUrlRandom : function(url){
    var rnd = "&random=" + Math.random();
    if(String.contains(url, "?"))url += rnd;
    else url += "?" + rnd; 
    return url;
  },
  /*
  ():
    {object | null} RPC.createXHRTransport()
  DES:
    return a XMLHttpRequest obj,if browser doesnt surport XMLHttpRequest,it raises an error.
  */
  createXHRTransport :function (){
    if(typeof XMLHttpRequest == "function")return new XMLHttpRequest();
    
    var MsxmlArr = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
    var req = null;
    Array.each(function(i){
      try{
        req = new ActiveXObject(i);
        if(req){
          XMLHttpRequest = Function.curry(function(pid){return new ActiveXObject(pid);}, i);
          throw Object;//break
        }
      }catch(e){}
    }, MsxmlArr);
    return req;
    if(!req) throw new Error(RPC.MSG_NOTSUPPORT_XMLHTTP);
  },
  /*
  ():
    {object} RPC.getXHRTransport()
  DES:
    get a XMLHttpRequest obj.It first checks the _XHRTransportPool to get a spare transport if it exists,or create a new transport.
  RTN:
    XMLHttpRequest obj
  */
  getXHRTransport     :function (){
    var pool = this._XHRTransportPool, len = pool.length, s;
    for (var i = 0; i < len; i++){
      s = pool[i].readyState;
      if ( s == 0 || s == 4) return pool[i];
    }
    pool.push(RPC.createXHRTransport());
    return pool[pool.length - 1];
  },
  /*
  ():
    {boolean} RPC.isOk({object} req)
  DES:
    return true if the xmlHttpRuquest is success
  ARG:
    req :xmlHttpRuquest object
  */
  isOk :function (req){// dojo framework function
    var s = req.status || 0;
    return ( (s>=200)&&(s<300))||   // allow any 2XX response code
      (s==304)||             // get it out of the cache
      (s==1223)||             // Internet Explorer mangled the status code
      (!s && (location.protocol=="file:" || location.protocol=="chrome:") ); // Boolean
  },
  /*
  PROPERTY:
    {string} MSG_NOTSUPPORT_XMLHTTP
  DES:
    message for browser that are not support xmlHttp.
  */
  MSG_NOTSUPPORT_XMLHTTP : "对不起，您的浏览器不支持XMLHTTP!",
  /*
  ():
    {void} RPC.onReadyStateChange({xmlHttpRuquest} req, {object}o)
  DES:
    trigger xhr options events:onSuccess, onFailure, onSuccess, onLoading, onError;
  ARG:
    {object} o
      request options;
  */
  onReadyStateChange : function(req, o){
    try{
      var state = req.readyState;
      if (state == 4){//completed
        (o['on' + (RPC.isOk(req) ? 'Success' : 'Failure')]|| Function.empty)(req);
        req.onreadystatechange = Function.empty;//avoid next synchronous reuse
      }else if(state > 0){
        (o.onLoading || Function.empty)(req);
      }
    }catch(e){
      (o.onError || Function.empty)(req);
    }
  },
  /*
  ():
    {object} RPC.xhr({string} url, {object} options)
  DES:
    Initiates and processes an RPC request.
  ARG:
    options = {
      bAsync    : true,
      method    : "post",  //post||get
      postBody  : "",
      cache     : false,   //if cache == false then force ie to create a new httprequest for a url
      onSuccess : null,   //callback fns.
      onFailure  : null,
      onLoading  : null,
      onError: null
    }
  RTN:
    XMLHttpRequest obj
  */
  xhr :function (url, options){//base on prototype ajax model
    var o = WIN.extend({
      bAsync    : true,
      cache     : false,
      method    : "post",
      listen    : true,
      postBody  : null
    },options);
    if(!o.cache)url = RPC._appendUrlRandom(url);
    
    var xmlReq, body = null, isPost = !!(o.method.toLowerCase() == "post");
    try{
      //there're some bug with mixing sync and aysnc request, here we create a new transport for aysnc request
      if(isPost) xmlReq= RPC.createXHRTransport();
      else xmlReq = RPC.getXHRTransport();
      
      xmlReq.open(o.method, url, o.bAsync);
      if(isPost){
        body = o.postBody;
        xmlReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
      //
      if(o.listen)xmlReq.onreadystatechange = Function.curry(RPC.onReadyStateChange, xmlReq, o);      
      xmlReq.send(body);
      
      return xmlReq;
    }catch(e){}
  }
});

/*
NAMESPACE:
  EL
DES:
  dom element operatios.
FUNCTION:
  {HTMLElement} EL.c( {object} attr, {object} stl, {object} evt, {string} tagName)
  {array | null} EL.createElementsByHtml({string} html)
  {boolean} EL.destoryNode({HTMLElement} ele)
  {HTMLElement| null} EL.getParentByMethod({HTMLElement} src, {function} fn)
  {boolean} EL.isClientNode({HTMLElement}element)
  {string} EL.parseUnit({string|int} n)
  {string} EL.removeNode({HTMLElement} ele)
  {void} EL.setAttr({HTMLElement} element, {object} attrObj)
  {void} EL.setEvent({HTMLelement} ele, {object} evts)
  {void} EL.setOpacity({HTMLElement} element, {int} opacity)
  {void} EL.setStyle({HTMLElement}element, {object}styleObj)
*/
namespace("EL" ,{
  /*
  ():
    {HTMLElement} EL.c( {object} attr, {object} stl, {object} evt, {string} tagName)
  DES:
    fast to create an new element which has attributes, style, event by using json object.
  eg.
    var myEl = EL.c({
        id : "myElId"
      },{
        opacity :50,
        backgroundColor:"#000"
      },{
        click:function(){alert(this.id)}
      }
    );
  */         
  c  :function(attr, stl, evt,tag){
    var ele = document.createElement(tag || "div");
    EL.setStyle(ele,stl);
    EL.setAttr(ele,attr);
    var e = WIN.clone(evt);
    for(var i in e){
      ele["on" + i] = Function.curry(function(f){if(WIN.isFunction(f))f.apply(this);},e[i]);
    }
    return ele;
  },
  /*
  ():
    {array | null} EL.createElementsByHtml({string} html)
  DES:
    create elements by html;
    Warning: append elements to another container after created, or it'll be removed after next call.
  ARG:
    {string} html
  RTN:
    HTMLElements array, if html isn't a notEmpty string return null;
  */
  createElementsByHtml  :function(html){
    var ele = arguments.callee.ele;
    if(!WIN.isElement(ele)){
      ele = arguments.callee.ele = EL.c(null, {position: "absolute", top: "-10px",width:"1px",height:"1px",overflow:"hidden"});
      document.body.appendChild(ele);
    }
    if(!String.notEmpty(html))return null;
    ele.innerHTML = html;
    return ele.childNodes;
  },
  /*
  ():
    {HTMLElement| null} EL.getParentByMethod({HTMLElement} src, {function} fn)
  DES:
    Return a parent HTMLElement that pass the test applied by supplied boolean fn.
  ARG:
    {string} src
      element node
    {function} fn
      A boolean  fn to filter nodes.
  */
  getParentByMethod   : function (src, fn){  
    try{
      var srcP = src.parentNode;
      while(!fn(srcP)) srcP = srcP.parentNode;
      return srcP;
    }catch(e){ return null;}
  },
  /*
  ():
    {boolean} EL.isClientNode({HTMLElement}element)
  DES:
    return true when the node is (document|| html|| body)
  */
  isClientNode : function (ele){    
    if(!WIN.isElement(ele))return false;
    return (ele==document||ele.tagName.toLowerCase()=='html'||ele.tagName.toLowerCase()=='body');
  },
  /*
  ():
    {string} EL.parseUnit({string|int} n)
  DES:
    parse unit before setting size;
  ARG:
    {string} n
      if n is unit(auto|%|px|em|ex|pt|pc|in|mm|cm) return n;
      if n is "auto" return "auto";
      if n is NaN return 0;
      if n is int return (n + "px");
  */
  parseUnit   : function(n){
    if(/%|px|em|ex|pt|pc|in|mm|cm/.test(n))return n;
    if(/auto/.test(n))return "auto";
    if(isNaN(n))return 0;
    return n + "px";
  },
  /*
  ():
    {void} EL.removeNode({HTMLElement} ele)
  DES:
    remvoe a node
  */
  removeNode   : function(ele){
    if(!WIN.isElement(ele))return ;
    ele.parentNode.removeChild(ele);
    ele = undefined;
  },
  /*
  ():
    {boolean} EL.destoryNode({HTMLElement} ele)
  DES:
    destory a HTMLElement node.
    Note: this method can only be called after document.body loaded; 
  */
  destoryNode   : function(ele){
    var ctn = EL.createElementsByHtml.ele;
    if(WIN.isElement(ctn) && WIN.isElement(ele)){
      ctn.appendChild(ele);
      ctn.innerHTML = "";
      ele = undefined;
      return true;
    }
    return false;
  },
  /*
  ():
    {void} EL.setAttr({HTMLElement} element, {object} attrObj)
  DES:
    set element's inline attribute by using json
  ARG:
    {object} attrObj
      json attribute obj 
  */
  setAttr      : function (ele, attr){
    if(!WIN.isElement(ele))return ;
    var p = WIN.clone(attr);
    for(var o in p){
      ele[o] = p[o];
    }
  },
  /*
  ():
    {void} EL.setEvent({HTMLelement} ele, {object} evts)
  DES:
    add events to element.
  ARG:
    {object} evts
      events json.
      e.g.
      {
        click :function(){WIN.debug('it's clicked!');}
      }
  */
  setEvent        : function(ele, evts){
    if(!WIN.isElement(ele))return ;
    var events = WIN.clone(evts);
    for(var i in events){
      EVT.observe(ele, i,
                  Function.curry(function(f){if(WIN.isFunction(f))f.apply(this);},
                  events[i]));
    }
  },
  /*
  ():
    {void} EL.setOpacity({HTMLElement} element, {int} opacity)
  DES:
    set element's opacity
  */
  setOpacity  : function (ele,opacity){
    if(!WIN.isElement(ele))return ;
    var s = ele.style;
    if (WIN.isDefined(s.filter)){
      s.filter = "alpha(opacity="+ opacity +",style=0)";
    }else{
      s.opacity = opacity / 100;
    }
  },
  /*
  ():
    {void}EL.setStyle({HTMLElement}element, {object}styleObj)
  DES:
    set element's inline style by using json
    check:  1.'url()' is used when set  backgroundImage.
            2.width|height is not negative or undefined"
  ARG:
    element:element;
    styleObj:json style obj 
  */
  setStyle    : function (ele, stl){
    if(! (WIN.isElement(ele) && WIN.isObject(stl)))return ;
    var s = WIN.clone(stl);
    if(s.opacity){
      EL.setOpacity(ele, s.opacity);
      delete s.opacity;
    }
    for(var o in s){
      ele.style[o]=s[o];
    }
  }
});

/*
NAMESPACE:
  EVT
DES:
  event properties and functions
PROPERTY:
  {array} _observers
  {WIN.Observer} domLoadedObserver
METHOD:
  {void} observeAndCache({HTMLelement} ele,
                         {string} name, {function} evtHnd, {boolean} useCapture)
  {void} observe({HTMLelement} ele, {string} name, {function} evtHnd, {boolean} useCapture)
  {void} EVT.onDomLoaded({function} callback)
  {void} stopObserving({HTMLelement} ele,
                       {string} name, {function} evtHnd, {boolean} useCapture)
  {void} unloadCache()
*/
namespace("EVT" ,{
  /*
  PROPERTY:
    {array} EVT._observers
  DES:
    private,store event handlers with type like this [[ele, name, evtHnd, useCapture],[..]]  
  */
  _observers   : [],
  /*
  PROPERTY:
    {WIN.Observer} EVT.domLoadedObserver
  DES:
     domLoadedObserver
  */
  domLoadedObserver : new WIN.Observer(),
  /*
  ():
    {void} EVT.observeAndCache({HTMLelement} ele, 
                           {string} name, {function} evtHnd, {boolean} useCapture)
  DES:
    observe element a new event,store at EVT._observers to fix memory leak by using 
    EVT.unloadCache();it's a private function,in order to observe a new event please use 
    EVT.observe(ele, name, evtHnd, useCapture).
  */
  observeAndCache : function (ele, name, evtHnd, useCapture) {
    if (!EVT._observers) EVT._observers = [];
    if (ele.addEventListener) {
      EVT._observers.push([ele, name, evtHnd, useCapture]);
      ele.addEventListener(name, evtHnd, useCapture);
    } else if (ele.attachEvent) {
      EVT._observers.push([ele, name, evtHnd, useCapture]);
      ele.attachEvent('on' + name, evtHnd);
    }
  },
  /*
  ():
    {void} EVT.observe({HTMLelement} ele, {string} name, {function} evtHnd, {boolean} useCapture)
  DES:
    observe element a new event;
  ARG:
    name: event name(without "on")
    evtHnd:event handler
    useCapture:useCapture(!ie)
  */
  observe     : function (ele, name, evtHnd, useCapture) {
    useCapture=useCapture||false;
    if (name=='keypress'&&( BROWSER.Safari ||ele.attachEvent))name='keydown';
    EVT.observeAndCache(ele, name, evtHnd, useCapture);
  },
  /*
  ():
    {void} EVT.onDomLoaded({function} callback)
  DES:
    frequently check if document.body is ready then to do callback,always we just need to check the body element if is ready for handling or not.
  ARG:
    freq:frequency to check,default value 100ms.unit: ms
  */  
  onDomLoaded  :function(callback){
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded",callback, false);
    }
    else{
      document.write("<s"+'cript id="__onDOMContentLoaded" defer="defer" src="/'+'/:"></s'+"cript>");
      $("__onDOMContentLoaded").onreadystatechange = function() {
        if (this.readyState == "complete") {
          this.onreadystatechange = null;
          callback();
        }
      };
    }
  },
  /*
  ():
    {void} EVT.stopObserving({HTMLelement} ele,
                         {string} name, {function} evtHnd, {boolean} useCapture)
  DES:
    stop observing a event of element.
  */
  stopObserving   : function (ele, name, evtHnd, useCapture) {
    useCapture = useCapture||false;
    if (name=='keypress'&&( BROWSER.Safari || ele.detachEvent))name='keydown';
    if (ele.removeEventListener) {ele.removeEventListener(name, evtHnd, useCapture);} 
    else if (ele.detachEvent) {ele.detachEvent('on' + name, evtHnd);}
  },
  /*
  ():
    {void} EVT.unloadCache()
  DES:
    we use this to avoid memory leaks.
  */
  unloadCache : function () {
    var _observers = EVT._observers;
    if (!WIN.isArray(_observers)) return;
    var len = _observers.length;
    for (var i=0;i < len; i++) {
      EVT.stopObserving(_observers[i][0],_observers[i][1],
                         _observers[i][2],_observers[i][3]);
      _observers[i][0]=null;
    }
    EVT._observers = [];
  }
});
EVT.observe(window, "unload", EVT.unloadCache);
EVT.onDomLoaded(function(){
                  if(EVT.domLoaded)return;
                  EVT.domLoaded = true;
                  EVT.domLoadedObserver.execute();
                });
/*
():
  {void} require({string} strModule [,{object} options])
DES:  
  >>require("A.B"):loads a Javascript module from the appropriate URL.
    first checks to see if require.hasResource("A.B"). If it is, it is simply returned 
    (nothing to do).If not, it will look for "A/B.js" in the script root directory.    
  >>require("A.B.*"):loads a Javascript package from the appropriate URL.
    packageName rule : strModule("A.B.*") -> packageName("A.B");A:father fodderName,B:fodderName,
    first checks to see if require.hasResource("A.B").If it is, it is simply returned
    (nothing to do).If not,it will look for all files in "A/B/" in the script root directory.
    In order to use this you must create an engin.js in every fodders, and call the function
    require.registerPackage() to register a package and provide the package files or fodders.    
ARG:
  options:{
      bAsync    : false,
      onSuccess : Function.empty,
      onFailure : Function.empty
    }
  >>options.bAsync: it allowed you load scipt asynchronous,but it's not recommended unless
  you really want to preload some script.
*/
function require(module,options){
  var _this = arguments.callee;
  if(_this.hasResource(module))return;
  var o,urlArr = [],packagesNameArr = [];
  o = WIN.extend({
    bAsync    : false,
    cache     : false,
    method    : "get"
    //onSuccess : Function.empty,
    //onFailure : Function.empty
    },options || {});
  /*
  ():
   require._getUrlArr(strModule)
  DES:
    get url from strModule
  ARG:
    strModule:required module 
  */
  _this._getUrlArr = function (strModule){
    var modArr,last,packageName;
    modArr = strModule.split(".");
    last = modArr[modArr.length - 1];
    if(last=="*"){//get the common files in engin.js
      modArr = modArr.slice(0, -1);
      strModule = modArr.join(".");
      packageName = strModule;
      packagesNameArr.push(packageName);
      var ok,path;
      path = this._rootUrl + modArr.join('/') + "/";
      ok = this.hasResource(strModule + ".engin");
      if(!ok){//try to load engin.js
        var engin_js = path + "engin.js";
        ok =  this.syncLoad(engin_js);
      }
      if(ok){
        var package = this._package[packageName];
        if(!package)return;//throw ("require's package:" + strModule + " is undefined!");
        var files = package.files;
        var fodders = package.fodders;
        if(files){
          for(var i = 0; i< files.length; i++){
            if(!this.hasResource(packageName + files[i]))urlArr[urlArr.length] = path + files[i] + ".js";
          }
        }
        if(fodders){//tautog fodders
          for(var i = 0; i< fodders.length; i++){          
            _this._getUrlArr(strModule + "." + fodders[i] + ".*");
          }
        }
      }else throw ("Failed to load " + engin_js);
    }else{
      urlArr[0] = this._rootUrl + modArr.join('/') + ".js";
    }
  };
  
  _this._getUrlArr(module);
  var len = urlArr.length;
  if(len == 0)return;
  if(o.bAsync){
    o.onSuccess = Function.empty;
    for(var i=0; i<len; i++){
      if(_this.hasResource(urlArr[i])){
        if(i == (len - 1)){//avoid that the last url is loaded
          TRY.whatever(options.onSuccess,_recordResource);
        }
        continue;
      }
      if(i == (len - 1)){//last time to record loaded resource 
        o.onSuccess = function(){TRY.whatever(options.onSuccess,_recordResource);}
      }
      _this.asyncLoad(urlArr[i],o);
    }
  }else{
    for(var i=0; i<len; i++){
      if(_this.hasResource(urlArr[i]))continue;
      _this.syncLoad(urlArr[i]);
    }
    _recordResource();
  }
  function _recordResource(){
    _this._hasResource[module] = true;//
    var pLen = packagesNameArr.length ;
    if(pLen > 0){
      for(var i = 0 ; i<pLen ; i++){
        _this._hasResource[packagesNameArr[i]] = true;
        _this._loadedPackages.push(packagesNameArr[i]);
      }
    }
  }
}
WIN.extend(require,{
  /*private propertys
    _hasResource   :{},//record loaded urls,module and package,use like if(require._hasResource[strModule || package])
    _loadedModules :[],//loaded modules array
    _loadedPackages:[],//loaded packages array
    _loadedUrls    :[],//loaded urls array
    _package       :{},//a namespace see to packages's register,
    _rootUrl :"",//Script root path.We'll auto detect the src of engin script to set as its default value.If you want to change please use the setRoot() method.
  */
  _hasResource   :{},
  _loadedModules :[],
  _loadedPackages:[],
  _loadedUrls    :[],
  _package       :{},
  _rootUrl       :"",
//methods
  //private
  _cScript       :function (opt){
    var ele = DOC.c("script");
    WIN.extend(ele,opt||{});
    ele.type="text/javascript";
    //e.defer = true;
/*    
    if(opt){
      if(opt.id)e.id = opt.id;
      if(opt.src)e.src = opt.src;
      if(opt.text)e.text = opt.text;      
    }*/
    return ele;
  },
  _provide       :function (strModule){
    this._loadedModules.push(strModule);
    this._hasResource[strModule] = true;
    var url = this._rootUrl + strModule.split(".").join('/') + ".js";
    this._hasResource[url] = true;
  },
//public
  /*
  ():
    require.asyncLoad(url)
  DES:
    load script asynchronous
  */
  asyncLoad      :function (url,opt){
    if(this._hasResource[url])return;
    var o = WIN.extend({},opt||{});
    var _this = this;
    o.onSuccess = function(req){
      TRY.whatever(function(){_onSuccess(req);},
                   function(){opt.onSuccess(req);} );
    };
    function _onSuccess(req){
      _this._hasResource[url] = true;
      _this._loadedUrls.push(url);
      var o = {
        id   : escape(url),
        text : req.responseText
      };
      var e = _this._cScript(o);
      DOC.head.appendChild(e);
    }
    RPC.xhr(url,o);
  },
  /*
  ():
    require.hasResource(url)
  DES:
    return true if has resource
  */
  hasResource    :function (strResource){
    return this._hasResource[strResource] === true;
  },
  /*
  ():
    require.provide(strResource)
  DES:
    register a resource to make sure it is provided.
  */
  provide        :function (strResource){
    if(!this.hasResource(strResource))this._provide(strResource);
  },
  /*
  ():
    require.registerPackage(strPackageName,obj)
  DES:
    Register a package.Use it in engin.js in every fodders
    Warning: this function just register a package,but it do not means that require.hasResource(strPackage) == true,for it hasn't provide a package files. 
  ARG:
    strPackageName:[father fodde name ] + self fodder name follow by system/lib/;
    obj:record all files( except itself -- engin.js) and sub fodders in this fodder.always define as 
    {
      files   :["dnd","style"],
      fodders :["layout"]
    }
  */
  registerPackage:function (packageName,obj){
    if(!this._package[packageName])this._package[packageName] = obj;
  },
  /*
  ():
    require.syncLoad(url) 
  DES:
    load script synchronous 
    options = {
      bAsync    : true,
      method    : "post",  //post||get
      postBody  : "",
      cache     : false,   //if cache == false then force ie to create a new httprequest for a url
      onSuccess : Function.empty,   //callback fns
      onFailure  : Function.empty,
      onLoading  : Function.empty
    }
  */
  syncLoad       :function (url){
    if(this._hasResource[url]){
      return true; // Boolean
    }
    var req = RPC.xhr(url, {
      bAsync    : false,
			cache : false,
      method    : "get"
    });
    var contents = req.responseText;
    if(!contents){ return false; } // Boolean
    this._hasResource[url] = true;
    this._loadedUrls.push(url);
    //append script node
    var o = {
      id    : escape(url),
      text  : contents
    };
    var e = this._cScript(o);
    DOC.head.appendChild(e);
    return true; // Boolean
  },
  /*
  ():
    require.setRoot(path) 
  DES:
    set require root path
  */
  setRoot :function (path){this._rootUrl = path;}
});

/*
USEFUL PROCESS

  >> ensure that we has provided this resource "lib.core.engin";
  >> trap window error and output error msg
  >> set require._rootUrl by analysising the src of engin script.
  >> reset WIN.config by analysising the config(if given) of engin script.If it's debugMode then loads debug module.
  >> enables background image cache
  >> fix window close function for Gecko
  >> set location.JSONquery
*/
(function(){
  //ensure that we has provided this resource so it wont be downloaded again.
  require.provide("lib.core.engin");
  //register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
  require.registerPackage("lib.core",{
    files   :["debug"],
    fodders :["util"]
  });
  //trap error
  window.onerror = function (msg,url,line){
    var info="";
    info +="ErrorMsg: " + msg;
    info +="<br />ErrorURL: " + url;
    info +="<br />ErrorLine: " + line;
    WIN.debug(info, "error");
    return true;
  };
  //set require._rootUrl
  var engin = $("LOAS");
  var src = engin.getAttribute("src");//dont use 'src = engin.src' which works different BT browsers.
  require._rootUrl = (src.substring(0, src.indexOf("loas/") + 5));
  //reset WIN.config
  var config = eval("(" + engin.getAttribute("config") + ")");
  WIN.extend(WIN.config, config || {});
  if(WIN.config.confirmOnExit){window.onbeforeunload = function(){return "";}}
  //
  WIN.debugEnsure();
  //fix window close function for Gecko
  if(BROWSER.Gecko){
    var _close = window.close;
    window.close = function(){
      WIN.debug("Scripts may not close windows that were not opened by script.Input 'about:config' at adressBar make sure the item 'dom.allow_scripts_to_close_windows' value is true!", "error");
      _close();
    }
  }
  var v = BROWSER.IEversion;
  if( v >0 && v < 7){
    require("lib.core.fix.fIE");
  }
})();