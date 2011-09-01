/* ObserverProvider.js
define layout panel
*/
require.provide("lib.core.util.ObserverProvider");

/* {
CLASS:
  WIN.ObserverProvider
DES:
  util class to provide WIN.Observer;
PROPERTY:
  {object} _observers
    stores observers
METHOD:
  {void} addObservers({string} name1 [, name2 ...])
  {void} addListener({NEString} name, {function} hnd)
  {WIN.Observer | null} getObserver({NEString} name)
  {boolean} hasObserver({NEString} name)
  {boolean} removeObserver({NEString} name)
  {void} removeListener({NEString} name, {function} hnd)
  {void} fireObserver({NEString} name [, obj...])
} */
WIN.ObserverProvider = WIN.createClass(
  function(){ 
    this._observers = {};
  },{
    /*
    ():
      {void} addObservers({string} name1 [, name2 ...])
    DES:
      add observers unless the same observer exits.
    ARG:
      {string} name1 [, name2 ...]
        specify observer's name, case-insensitive;
    e.g.
      obj.addObservers("onload", "onclick");
    */
    addObservers : function(){      
      var name, arg = arguments;      
      for(var i = 0, len = arg.length; i < len; i++){
        name = arg[i].toLowerCase();
        if(!this.hasObserver(name)){
          this._observers[name] = new WIN.Observer;
        }
      }
    },
    /*
    ():
      {void} addListener({NEString} name, {function} hnd)
    DES:
      add listener to appointed observer;
    ARG:
      {NEString} name 
        @see getObserver method
      {function} hnd
        @see add method of  WIN.Observer Class;
    */
    addListener : function(name, hnd){
      var obv = this.getObserver(name);
      if(obv)obv.add(hnd);
    },
    /*
    ():
      {WIN.Observer | null} getObserver({NEString} name)
    DES:
      return specified observer;
    ARG:
      {NEString} name
        (case-insensitive), observer name
    */
    getObserver : function(name){
      if(String.notEmpty(name)){
        name = name.toLowerCase();
        var obv = this._observers[name];
        if(obv instanceof WIN.Observer)return obv;
      }
      return null;
    },
    /*
    ():
      {boolean} hasObserver({NEString} name)
    DES:
      return true if find specified observer;
    ARG:
      {NEString} name
        @see getObserver method
    */
    hasObserver : function(name){
      return !!this.getObserver(name);
    },
    /*
    ():
      {boolean} removeObserver({NEString} name)
    DES:
      return true if the specified observer delete;
    ARG:
      {NEString} name
        @see getObserver method
    */
    removeObserver : function(name){
      if(String.notEmpty(name)){
        name = name.toLowerCase();
        return delete this._observers[name];
      }
    },
    /*
    ():
      {void} removeListener({NEString} name, {function} hnd)
    DES:
      remove listener from appointed observer;
    ARG:
      {NEString} name
        @see getObserver method
      {function} hnd 
        @see remove method of  WIN.Observer Class;
    */
    removeListener : function(name, hnd){
      var obv = this.getObserver(name);
      if(obv)obv.remove(hnd);
    },
    /*
    ():
      {void} fireObserver({NEString} name [, obj...])
    DES:
      notify appointed observer has changed;
    ARG:
      {NEString} name 
        @see getObserver method
      [, obj...]
        arguments for observer's listeners;
    */
    fireObserver : function(name){
      var obv = this.getObserver(name);
      if(obv){
        var args = WIN.toArray(arguments).slice(1);
        obv.execute.apply(obv, args);
      }
    },
    toString : function(){
      return "[object WIN.ObserverProvider]";
    }
  }
);
