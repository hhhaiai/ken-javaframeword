/***************************************************************
singlelast.js
defined singlelast module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.util.singlelast");

/*
CLASS:
  WIN.Util.SingleLast
DES:
  SingleLast describe this design pattern: in one aear,there're items whose style or other properties are same,but at one time only one of them can display the style.So when set an item's style we need to restore last item's;
METHOD:
  {this} initialize({function} setAction, {function} restoreAction)
  {void} set({object} obj)
  {void} restore()
*/
WIN.SingleLast = function(){
  var last,status;
  var set = Function.empty;
  var restore = Function.empty;
  /*
  ():
    {this} initialize({function} setAction, {function} restoreAction, {object} lastStatus)
  DES:
    init setAction and restoreAction;
  ARG:
    {function} setAction
      set action for the new item
    {function} restoreAction
      restore action for the last item
    {object} lastStatus
      (optional) last Status for the last item,it will be pass to restoreAction as an param 
  */
  this.initialize = function(setAction, restoreAction, lastStatus){
    set = setAction;
    restore = restoreAction;
    status = lastStatus;
    return this;
  };
  /*
  ():
    {void} set({object} obj)
  DES:
    set action for the new item
  */
  this.set = function(obj){
    //if(obj == last)return;
    this.restore();
    set(obj);
    last = obj;
  };
  /*
  ():
    {void} restore()
  DES:
    restore action for the last item
  */
  this.restore = function(){
    //e.g. last obj may own some dom reference which may had been remove;
		restore(last, status);
  };
};
