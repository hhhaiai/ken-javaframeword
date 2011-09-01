/* systemButtonMgr.js
store system buttons info.
*/
require.provide("app.gui.btn.systemButtonMgr");
require("app.gui.systemPathmapper");
/*
NAMESPACE:
  GUI.systemButtonMgr
DES:
  Mgr system buttons type info(title, icon), layout options and so on.
PROPERTY:
  {object} GUI.systemButtonMgr.layout
  {object} GUI.systemButtonMgr.typesInfo
FUNCTION:
  {boolean} GUI.systemButtonMgr.registerTypeInfo({string} type, {object} info)
  {object} GUI.systemButtonMgr.getTypeInfo({string} type, {object} pathMapper)
*/
(function(){
  /*
  OBJECT:
    typesInfo
  DES:
    store different system buttons types info; each type has these props:{
      title : "", button title 
      icon  : "" button icon file name
    } 
  PROPERTY:
    {object} ADD
    {object} APPLY
    {object} BACK
    {object} CANCEL
    {object} COUNT
    {object} DATE
    {object} FILTER
    {object} NEXT_STEP
    {object} OK
    {object} PDF
    {object} PREVIOUS_STEP
    {object} REMOVE
    {object} SAVE
    {object} SEARCH
    {object} SETTING
    {object} UNDO
  */
  var typesInfo = {
    ADD : {
      title : "增加",
      icon  : "add.gif"
    },
    APPLY : {
      title : "应用",
      icon  : "apply.gif"
    },
    BACK : {
      title : "后退",
      icon  : "back.gif"
    },
    CANCEL : {
      title : "取消",
      icon  : "cancel.gif"
    },
    COUNT : {
      title : "统计",
      icon  : "count.gif"
    },
    DATE : {
      title : "日期",
      icon  : "date.gif"
    },
    EXCEL : {
      title : "导出到Excel",
      icon : "export_excel.gif"
    },
    FILTER : {
      title : "过滤",
      icon  : "filter.gif"
    },
    FRESH : {
      title : "刷新",
      icon  : "fresh.gif"
    },
    NEXT_STEP : {
      title : "下一步",
      icon  : "next_step.gif"
    }
    ,
    PRE_PAGE : {
      title : "上一页",
      icon  : "btn_nav_preview.gif"
    }
    ,
    NEXT_PAGE : {
      title : "下一页",
      icon  : "btn_nav_next.gif"
    },
    FIRST_PAGE : {
      title : "",
      icon  : "btn_nav_home.gif"
    },
    LAST_PAGE : {
      title : "",
      icon  : "btn_nav_end.gif"
    },
	GOTO_PAGE : {
      title : "下一页",
      icon  : "redo.gif"
    }
	,
    OK : {
      title : "确定",
      icon  : "ok.gif"
    },
    PDF : {
      title : "生成PDF",
      icon  : "pdf.gif"
    },
    PREVIOUS_STEP : {
      title : "上一步",
      icon  : "previous_step.gif"
    },
    REMOVE : {
      title : "删除",
      icon  : "remove.gif"
    },
    SAVE : {
      title : "保存",
      icon  : "save.gif"
    },
    SEARCH : {
      title : "搜索",
      icon  : "search.gif"
    },
    SETTING : {
      title : "告警阀值设置",
      icon  : "setting.gif"
    },
    ALARM_START : {
      title : "",
      icon  : "warning.gif"
    },
    ALARM_CLOSE : {
      title : "",
      icon  : "cancel.gif"
    },
    UNDO : {
      title : "撤销",
      icon  : "undo.gif"
    },
    show0 : {
      title : "",
      icon  : "warning.gif"
    },
    show1 : {
      title : "",
      icon  : "png-1661.gif"
    },
    showall : {
      title : "",
      icon  : "showall.png"
    },
    unknown: null
  };
  namespace("GUI.systemButtonMgr",{
    /*
    ():
      {boolean} GUI.systemButtonMgr.registerTypeInfo({string} type, {object} info)
    DES:
      register a new typeInfo of system button;
    ARG:
      {string} type
        case insensitive, type of system buttons;
      {object} info
        typeInfo, should at lease contains these props:{
          title : "", button title 
          icon  : "" button icon file name,(dont provide file path for it, because its path is mappped by pathMapper);
        }
    RTN:
      return true when register is success;
    */
    registerTypeInfo : function(type, info){
      if(String.notEmpty(type)){
        typesInfo[type.toUpperCase()] = info;
        return true;
      }
    },
    /*
    ():
      {object} GUI.systemButtonMgr.getTypeInfo({string} type, {object} pathMapper)
    DES:
      get registered btn typeInfo;
    ARG:
      {object} pathMapper
        pathMapper for map icon file path;
    RTN:
      {object} info
        typeInfo, at lease contains these props:{
          title : "", button title 
          icon  : "" button icon url;
        }
    */
    getTypeInfo : function(type, pathMapper){
      if(!String.notEmpty(type))return null;
      var info = typesInfo[type.toUpperCase()];
      if(info){
        if(String.notEmpty(info.icon)){
          pathMapper = (pathMapper instanceof String.PathMapper )
                       ? pathMapper : GUI.systemPathmapper;
          info.iconUrl = pathMapper.map(info.icon);
        }
      }
      return info;
    },
    /*
    P:
      {object} GUI.systemButtonMgr.layout
    DES:
      system buttons default layout options
    */
    layout : {
      width      : "auto",
      height     : 24,
      styleNormal    : {backgroundPosition: "0 24px", color: "black"},
      styleFocused   : {backgroundPosition: "0 -24px", color: "black"},
      styleDisabled  : {backgroundPosition: "0 24px", color: "#ACA899"},
      bgPos_over : "0%",
      bgPos_down : "-24px",
      bgImg_l_css: "sys_button_left_img",
      bgImg_m_css: "sys_button_text_wrap_img",
      bgImg_r_css: "sys_button_right_img"
    },
    unknown: null
  });
})();