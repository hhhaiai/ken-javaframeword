// timer.js

require.provide("lib.core.debug.timer");

/*
NAMESPACE:
  WIN.Timer
DES:
  util debug Timer;
PROPERTY:
METHOD:
  {int} WIN.Timer.clock([{string} name])
  {int} WIN.Timer.count({string} start, {string} end)
  {array} WIN.Timer.countThese({string} name ...)
  {int} WIN.Timer.get({string} name)
  {int} WIN.Timer.now()
  {int} WIN.Timer.passed({string} start [,{int} nowTime])
  {void} WIN.Timer.reset()
  {void} WIN.Timer.showClocks()
  {void} WIN.Timer.showCount({string} start, {string} end)
  {void} WIN.Timer.showPassed({string} start [,{int} nowTime])
  {void} WIN.Timer.showMsg({string | array | WIN.Timer.Msg} msgs)
  {void} WIN.Timer.showThese({string} name ...)
  {array} sort()
*/
WIN.Timer = function(){
  var rd = {}, autoId = 0;
  var info = '<table border="1" cellspacing="2"  style="border-collapse:collapse" ><thead><caption>Timer</caption><tr><th style="padding:2px 5px;">Start</th><th style="padding:2px 5px;">End</th><th style="padding:2px 5px;">Cost(ms)</th></tr></thead>rows</table>';
  return {
    /*
    ():
      {int} WIN.Timer.clock([{string} name])
    DES:
      mark-up a new time;
    */
    clock : function(name){
      if(!String.notEmpty(name))name = "t_" + (++autoId);
      var t = rd[name.toLowerCase()] = this.now();
      return t;
    },
    /*
    ():
      {int} WIN.Timer.count({string} start, {string} end)
    DES:
      return the time bt start and end;
    */
    count : function(start, end){
      if(!String.notEmpty(start) || !String.notEmpty(end))return;
      return (this.get(end) - this.get(start) );
    },
    /*
    ():
      {array} WIN.Timer.countThese({string} name ...)
    DES:
      this method count the time bt adjacent arguments, and the time from first and last argument to now ;then return an msgs array(see also showMsg arguments);
    */
    countThese : function(){
      var _this = this, start = arguments[0], msg, msgs = [];
      var end = this.now();
      
      Array.each(function(name){
        msg = new WIN.Timer.Msg(start, name, _this.count(start, name));
        msgs.push(msg);
        start = name;
      }, arguments, 1);
      msg = new WIN.Timer.Msg(start, "Now", this.passed(start, end));
      msgs.push(msg);
      msg = new WIN.Timer.Msg(arguments[0], "Now", this.passed(arguments[0], end));
      msgs.push(msg);
      return msgs;
    },
    /*
    ():
      {int} WIN.Timer.get({string} name)
    DES:
      return the named time that ever clocked;
    */
    get : function(name){
      if(!String.notEmpty(name))return;
      return rd[name.toLowerCase()];
    },
    /*
    ():
      {int} WIN.Timer.now()
    DES:
      return now time
    */
    now : function(){
      return new Date().getTime();
    },
    /*
    ():
      {int} WIN.Timer.passed({string} start [,{int} nowTime])
    DES:
      return the time bt start and the specific nowTime or now;
    */
    passed : function(start, nowTime){
      var end = nowTime || this.now();
      return (end - this.get(start));
    },
    /*
    ():
      {void} WIN.Timer.reset()
    DES:
      reset timer;
    */
    reset : function(){
      rd = {};
      autoId = 0;
    },
    /*
    ():
      {void} WIN.Timer.showClocks()
    DES:
      show recent clocks info;
    */
    showClocks : function(){
      var s = this.sort();
      this.showThese.apply(this, s);
    },
    /*
    ():
      {void} WIN.Timer.showCount({string} start, {string} end)
    DES:
      showClocks the time info bt start and end;
    */
    showCount : function(start, end){
      var msg = new WIN.Timer.Msg(start, end, this.count(start, end));
      this.showMsg(msg);
    },
    /*
    ():
      {void} WIN.Timer.showPassed({string} start [,{int} nowTime])
    DES:
      showClocks the time info bt start and the specific nowTime or now;
    ARG:
      {int} nowTime
        if not offered, we create new time instead;
    */
    showPassed: function(start, nowTime){
      this.showMsg(new WIN.Timer.Msg(start, "Now", this.passed(start, nowTime)));
    },
    /*
    ():
      {void} WIN.Timer.showMsg({string | array | WIN.Timer.Msg} msgs)
    DES:
      output msgs in the form of a table;
    ARG:
      {string | array | WIN.Timer.Msg} msgs
        msgs can be an instance of WIN.Timer.Msg, or a table row html or a array with these items. 
    */
    showMsg : function(msgs){
      msgs = msgs.join ? msgs.join("") :  msgs;
      WIN.debug(info.replace("rows", msgs));
    },
    /*
    ():
      {void} WIN.Timer.showThese({string} name ...)
    DES:
      this method showClocks the time bt adjacent arguments, and the time from first and last argument to now;
    */
    showThese : function(){
      var msgs = this.countThese.apply(this, arguments);
      this.showMsg(msgs);
    },
    /*
    ():
      {array} WIN.Timer.sort()
    DES:
      return an ascending sort array which has this clock records name as its items;
    */
    sort : function(){
      var s = [], _this = this;
      
      for(var i in rd) s.push(i);
      
      s = s.sort(function(x, y){return (_this.get(x) - _this.get(y));});
      
      return s;
    },
    unknown: null
  };
}();

WIN.Timer.Msg = function(start, end, costTime){
  this.start = start;
  this.end = end;
  this.cost = costTime;
};
WIN.Timer.Msg.prototype.toString = function(){
  return "<tr><td>" + this.start + "</td><td>" + this.end + "</td><td>" + this.cost + "</td></tr>";
};

