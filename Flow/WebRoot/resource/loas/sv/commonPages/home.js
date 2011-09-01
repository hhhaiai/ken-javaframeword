/* home.js
*/
require.provide("sv.commonPages.home");
require("sv.common.paintRows");
require("org.GUIRender.panel.table33");
require("org.GUIRender.panel.VNP");

namespace("SV.Home", {
  VNP_renderStr : '{type: GUIRender.VNP,\
                            options:{\
                              eventName : "mousedown",\
                              menuData  : ["最近报警","当天报警统计", "服务器信息", "网络设备信息"] } }',
  /*
  ():
    {void} SV.Home.comptentsInit()
  DES:
    This page(home.jsp) has a bug by using vnp compontents, because there's a bug of innerHTML under ie.In this page, vnp_content includes danamic imgs that are created by server, while we reset vnp_content innerHTML ie would ignore cache but start new requests and it makes some imgs cant be load.
    To fix the bug, we use appendChild method insteads of innerHTML property, and render when body loaded, in this page we trigger this function when a img onload,for less time which to render comptents needs to waiting for. 
  */
  initComptents : function(){  
    var vnpNode = $("sv_vnp");
    SV.Home.vnp = GUIRender.renderElement(vnpNode);
    var table33 = GUIRender.renderElement($("sv_table33"));
    /*table33.bodyEle.innerHTML = "";
    table33.bodyEle.appendChild(vnpNode);*/
  },
  /*
  ():
    {void} SV.Home.initPageOnReady()
  DES:
    initPage when dom loaded;
  */
  initPageOnReady : function (){
    SV.Home.initComptents();
  },
  /*
  ():
    {void} SV.Home.initPageOnload()
  DES:
    initPage when body onload.
  */
	initPageOnload : function(){
    Array.each(function(i, ind){
      var id = "sv_vnp_content" + ind;
      i.appendChild($(id));
    }, SV.Home.vnp.content.childNodes);
	},
  /*
  ():
    {void} SV.Home.observeMap({string} id)
  DES:
    observe ImageMap areas's onclick event to open their href at new tab(named "alarmCount");
  */
  observeMap : function (id){
		var map = $(id);
		if(!map)return ;
		var areas = map.getElementsByTagName("area");
		Array.each(function(area){
			area.onclick = SV.Home.hndAreaElementOnClick;
		},areas);
  },
  /*
  ():
    {void} SV.Home.hndAreaElementOnClick()
  DES:
    open Href at new tab(named "alarmCount");
  */
  hndAreaElementOnClick : function (){
		var href = this.href;
		if(String.notEmpty(href))top.SV.openTab(this.href, "alarmCount");
		return false;
  },
	unknown :null
});
