/* alarm.js
*/
require.provide("sv.commonPages.alarm");
require("app.gui.plugin.popup");
require("app.gui.media.sound");

/*
NAMESPACE:
  SV.Alarm
DES:
  Alarm mgr
PROPERTY:
	{PopupManager} SV.Alarm.popupMgr
	{int} SV.Alarm.timer_getAlarm
	{int} SV.Alarm.timer_heartbeat
FUNCTION:
  {string} SV.Alarm._onSuccess({XMLHttpRequest} req)
  {string} SV.Alarm.getAlarm(url)
  {string} SV.Alarm.getText({XMLElement} node, {string} tagName)
  {void} SV.Alarm.parseAlarmData({XMLElement} xmldoc)
  {void} SV.Alarm.run()
  {void} SV.Alarm.stop()
*/
namespace("SV.Alarm", {
  popupMgr : new PopupManager(),
	alarmSound : (new GUI.Media.Sound).initialize(),
  timer_getAlarm : null,
  timer_heartbeat : null,
  
  /*
  ():
    {string} SV.Alarm._onSuccess({XMLHttpRequest} req)
  DES:
    hnd for xhr alarmDataUrl;
  */
  _onSuccess : function(req){
    SV.Alarm.parseAlarmData(req.responseXML);
  },
  /*
  ():
    {string} SV.Alarm.getAlarm()
  DES:
    get alarm data then parse it;
  */
  getAlarm : function (){
    RPC.xhr(SV.Alarm.alarmDataUrl ,{onSuccess : SV.Alarm._onSuccess});
  },
  /*
  ():
    {string} SV.Alarm.getText({XMLElement} node, {string} tagName)
  DES:
    get the value of a xml node's child(specificed by tagName).
  */
  getText : function (node,tagName){
    try{
      return node.getElementsByTagName(tagName)[0].getAttribute("val");
    }catch(e){};
  },
  /*
  ():
    {string} SV.Alarm.setOptions()
  DES:
    set options;
  */
  setOptions : function (options){
		if(options){
			WIN.extend(SV.Alarm, options);
			$("popupWin_Menu_Setting").cmd = "top.SV.openTab('" + options.alarmSetUrl + "')";
			$("popupWin_Menu_Disable").cmd = "SV.Alarm.stop()";
		}
  },
  /*
  ():
    {void} SV.Alarm.parseAlarmData({XMLElement} xmldoc)
  DES:
    parse AlarmData and AddPopup;
  */
  parseAlarmData : function(xmldoc){
    var Alarm = SV.Alarm, getText = Alarm.getText, popupMgr = Alarm.popupMgr;
    var nodes,nodeNum;
    try{
      nodes = xmldoc.getElementsByTagName("alarm");
      nodeNum = nodes.length;
      if (nodeNum == 0)return false;
      var node;
      var msg,title,icon,func;
      for (var i = 0; i < nodeNum; i += 1)  {
        try{
          node = nodes[i];
          msg = getText(node,"msg");
          title = getText(node,"title") + "-SourceView告警";
          icon = getText(node,"icon");
          //if(icon =="") icon = "img/popup_icon_Post.gif";
          func = getText(node,"func");
          popupMgr.AddPopup("popupWin",msg,icon,title, func);
        }catch(e){}
      }
			var sound = Alarm.alarmSound;
			if(!String.notEmpty(sound.em_src))sound.em_src = Alarm.alarmSoundSrc;
			sound.play();
      return true;
    }catch(e){return false;}
  },
  /*
  ():
    {void} SV.Alarm.run()
  DES:
    run popup.
  */
  run : function(){
    var Alarm = SV.Alarm;
		if(this.disabled)return ;
    Alarm.getAlarm();
    Alarm.timer_getAlarm = window.setInterval(Alarm.getAlarm, Alarm.getAlarmTime);
    Alarm.timer_heartbeat = window.setInterval("SV.Alarm.popupMgr.Heartbeat();", Alarm.msgHeartbeatTime);
  },
  /*
  ():
    {void} SV.Alarm.stop()
  DES:
    stop popup.
  */
  stop : function(){
    var Alarm = SV.Alarm;
    window.clearInterval(Alarm.timer_getAlarm);
    window.clearInterval(Alarm.timer_heartbeat);
  },
  unknown: null
});
