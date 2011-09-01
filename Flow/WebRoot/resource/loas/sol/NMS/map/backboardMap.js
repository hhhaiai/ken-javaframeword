/* backboardMap.js
defined backboardMap model: NMS.BackboardMap;
*/
require.provide("sol.NMS.map.backboardMap");
require("app.gui.engin");
require("sol.NMS.map.baseMap");
require("lib.rpc.util.asyncXhr");

/*
CLASS:
  NMS.BackboardMap
SUPERCLASS:
  NMS.BaseMap
DES:
  backboard map.A map may includes different types items(groupNode or statusNode).
*/
namespace("NMS");
NMS.BackboardMap = WIN.createClass(
  function(){
    this.toString = function(){
      return "[object NMS.BackboardMap]";
    };
  },{
    /*
    cfg:
      {string} nodeCss
    DES:
      css for this ele
    */
    nodeCss : "NMS_backboardMap",
    /*
    cfg:
      {HTMLElement} dataSourceUrl
    DES:
      dataSource Url;
    */
    dataSourceUrl : "",
    /*
    cfg:
      {boolean} enableItemsIntervalBlink
    DES:
      enable items interval blink when exceptional status,(defaults to false);
    */
    enableItemsIntervalBlink : false,
    /*
    cfg:
      {number} updateInterval
    DES:
      interval time of update items info, defaults to 60,000;
    */
    updateInterval : 60000,    
    /*
    cfg:
      {string} updateErrorMsg
    DES:
      msg for update Error.
    */
    updateErrorMsg : "更新背板图失败.",
    /*
    cfg:
      {object} updateErrorCauseInfo
    DES:
      Cause of updateError;
		P:
		  {string} errUrl
			  cant get data soucre
			{string} errParse
			  can parse data source
    */
    updateErrorCauseInfo : {
      errUrl : "原因：无法读取数据源.",
      errParse : "原因：无法解析数据源."
    },
    errorHandler : function(error){
      alert(error.type + "\n\n" + error.description);
    },
    /*
    cfg:
      {object} status2Description
    DES:
      status to description;
    */
    status2Description:{
      "1" : "up",
      "2" : "down",
      "3" : "admin down"
    },
    /*
    P:
      {number} intervalUpdateTimer
    DES:
      timer of interval update.
    */
    intervalUpdateTimer : 0,
    /*
    P:
      {object} data
    DES:
      object which uses id as its index;
    */
    data: null,
    /*
    P:
      {string} templatedItemDes
    DES:
      templated string for items nodeDescription.
    */
    templatedItemDes : "描述:{id}<br/>"
                      + "----------<br/>"
                      + "连接状态<b>:{status}</b><br/>"
                      + "<nobr>--------------------</nobr><br/>"
                      + "出口利用率(%):{outBandWidthUtil}<br/>"
                      + "入口利用率(%):{inBandWidthUtil}<br/>"
                      + "出口流速(Kbps):{outSpeed}<br/>"
                      + "入口流速(Kbps):{inSpeed}<br/>",
    
    /*
    ():
      {void} build({boolean} fireOnBuild)
    DES:
      build & do intervalUpdate.
    */
    build : function(fireOnBuild){
      NMS.BackboardMap.$build.call(this, false);
      this.intervalUpdate();
      GUI.appendToOnReady.call(this, this.container);
      if(fireOnBuild)this.onBuild();
    },
    /*
    ():
      {void} stopIntervalUpdate()
    DES:
      stop Interval Update
    */
    stopIntervalUpdate : function(){
      clearTimeout(this.intervalUpdateTimer);
    },
    /*
    ():
      {void} intervalUpdate({number} t)
    DES:
      Interval Update items info, includs their status and nodeDescriptions;
    ARG:
      {number} t
        time for interval update, defaults to this.updateInterval;
    */
    intervalUpdate : function(t){
      t = t || this.updateInterval;
      this.update();
      this.intervalUpdateTimer = setInterval(Function.bind(this.update, this),t);
    },
    /*
    ():
      {void} update({string} url)
    DES:
      update this items info by a given url which provides a xml data source;
    */
    update : function(url){
      url = url || this.dataSourceUrl;
      RPC.onResponseXml(
        url, 
        Function.bind(this.hndSuccess,this), 
        {onFailure : Function.bind(this.hndFailure,this, url)}
      );
    },
    /*
    ():
      {void} hndSuccess({object} xmlDoc)
    DES:
      handler for success RPC.onResponseXml;
    */
    hndSuccess : function(xmlDoc){
      this.data = this.parseXml(xmlDoc);
      if(this.data)this.updateItemsInfo();
      else{
        this.errorHandler(
          {
            type :this.updateErrorMsg,
            description : this.updateErrorCauseInfo.errParse
          }
        );
      }
      
    },
    /*
    ():
      {void} hndFailure()
    DES:
      handler for Failure RPC.onResponseXml;
    */
    hndFailure : function(url){
			this.errorHandler(
				{
					type :this.updateErrorMsg,
					description : this.updateErrorCauseInfo.errUrl + url
				}
			);
    },
    /*
    ():
      {object} parseXml({xmlDoc} xml)
    DES:
      parse Xmldoc to an object.
    */
    parseXml: function(xml){
      if(!xml)return null;
      var nodes = xml.getElementsByTagName("port");
      var data = {};
      Array.each(function(node){
        var p = node.getAttribute("id");
        data[p] = node;
      }, nodes);
      return data;
    },
    /*
    ():
      {void} updateItemsInfo()
    DES:
      update items info.A map may includes different types items(groupNode or statusNode), so we need to check its type before update;
    */
    updateItemsInfo: function(){
      var item, items = this.items;
      for(var p in items){
        item = items[p];
        if(this.isGroupNode(item)){          
          Array.each(this.updateItemInfo, item.items, null, this);
        }
        else{
          this.updateItemInfo(item);
        }
      }
    },
    /*
    ():
      {boolean} updateItemsInfo({object} item)
    DES:
      update an item's info, includes its status and nodeDescription. return true when update suc.
    */
    updateItemInfo : function(item){
      var info, id = item.id;
      if(String.notEmpty(id)){
        info = this.getItemInfo(id);
        if(!info)return false;
        item.setStatus(info.status);
        item.setNodeDescription(info.des);
        return true;
      }
    },
    /*
    ():
      {object} getItemInfo({string} id)
    DES:
      getItemInfo by id from this data source.
      Note:Info is common name for item's status and nodeDescription properties but not an real property.
    ARG:
      {string} id
        id is the unique association between HTML dom node and xml data source node;
    RTN:
      return an obj:{
        des : des,
        status : status
      };
    */
    getItemInfo : function(id){
      var data = this.data;
      var node = data[id];
      if(!node)return null;
      var des = this.templatedItemDes;
      var status = node.getAttribute("status");
      des = des.replace("{id}", id);
      des = des.replace("{status}", this.status2Description[status]);
      des = des.replace("{outBandWidthUtil}", node.getAttribute("outBandWidthUtil"));
      des = des.replace("{inBandWidthUtil}", node.getAttribute("inBandWidthUtil"));
      des = des.replace("{outSpeed}", node.getAttribute("outSpeed"));
      des = des.replace("{inSpeed}", node.getAttribute("inSpeed"));
      return {
        des : des,
        status : (parseInt(status) - 1)
      };
    },
    /*
    ():
      {boolean} isGroupNode({object} node)
    DES:
      return true when the node has an array attribute named "items";
    */
    isGroupNode : function(node){
      return (node && WIN.isArray(node.items));
    },
    unknown: null
  },
  NMS.BaseMap
);