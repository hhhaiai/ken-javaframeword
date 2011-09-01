/* console.js
*/
require.provide("lib.core.debug.console");
require("lib.core.string.pathMapper");

/*
NAMESPACE:
  WIN.Timer
DES:
  util debug Timer;
PROPERTY:
METHOD:
*/
WIN.Console = {  
  initShow : false,
  helpInfo : ""
    + '<pre>'
    + '(): <br />'
    + '  {void} debug({string} info [, {string} type])<br />'
		+ 'DES:<br />'
		+ '  output info in console;<br />'
    + 'ARG:<br />'
    + '  {string} type<br />'
    + '    ("message") specify info type for console filter, which has 3 options: "message", "warning", "error";<br />'
    + '(): <br />'
    + '  {void} dir({any} obj)<br />'
		+ 'DES:<br />'
		+ '  output obj\'s all properties in console;<br />'
    + ' <br />'
		+ 'PoweredBy <b>YGNET 2007-2009</b>.'
    + '</pre>',
  
  initialize : function(options){
    WIN.extend(this, options);
    if(EVT.domLoaded){    
      this.buildConsole();
    }
    else{
      EVT.domLoadedObserver.add(function(){
        WIN.Console.buildConsole();
      });
    }
    return this;
  },
  buildConsole : function(){
    var theme = "default";//sys.getTheme() ? ;
    var iconRoot = require._rootUrl + "resouce/img/" + theme + "/debug/";
    var pm = new String.PathMapper(iconRoot);
    var map = Function.bind(pm.map, pm);
    var display = "";
    this.showing = true;
    if(!this.initShow){
      display = "none";
      this.showing = false;
    }
    var html = ''
      + '<div style="position:absolute; z-index:10; left:0;bottom:0;width:100%;height:200px; overflow:hidden; background-color:#fff; display:' + display + '; ">'
        + '<div style=" width:100%; height:25px; border-top:solid 1px #ACA899;background-color:#ECE9D8; border-bottom:1px solid #ACA899; overflow:hidden;" >'
        + '<form onsubmit="WIN.Console.evalCommand();return false;">'
          + '<table style=" width:100%; height:25px;" cellpadding="0" cellspacing="0">'
            + '<tr valign="middle">'
              + '<td style="width:370px;">'
                + '<select style="width:60px;" name="cmdType" title="command type">'
                  + '<option value="eval" selected="selected">eval</option>'
                  + '<option value="debug">debug</option>'
                  + '<option value="dir">dir</option>'
                + '</select>'
                + '&nbsp;<input type="text" name="command" title="command here" style="width:300px; height:14px;" />'
              + '</td>'
              + '<td style="width:16px;">'
                + '<input type="image" style="cursor:pointer; *margin-top:2px;" title="execute command"  src="' + map("run.gif") + '" />'
              + '</td>'
              + '<td>&nbsp;</td>'
              + '<td style="width:70px;">'
                + '<select style="width:60px;" title="filter info type" onChange="WIN.Console.selectInfoFilterType(this);">'
                  + '<option value="all" selected="selected">all</option>'
                  + '<option value="message">message</option>'
                  + '<option value="warning" style="color:#FFCC00; ">warning</option>'
                  + '<option value="error" style="color:red">error</option>'
                + '</select>'
              + '</td>'
              + '<td style="width:80px;">'
                + '<span style="cursor:pointer;" title="clear console"  onclick="WIN.Console.clearConsole();">Clear</span>&nbsp;'
                + '<span style="cursor:pointer;" title="show help info"  onclick="WIN.Console.showHelp();">Help</span>'
              + '</td>'
              + '<td style="width:17px;">'
                + '<img style="cursor:pointer; *margin-top:2px;" title="hide|show console" onclick = "WIN.Console.toggleConsoleDisplay(this);"  src="' + map("down.gif") + '" />'
              + '</td>'
            + '</tr>'
          + '</table>'
        + '</form>'
        + '</div>'
        + '<div style=" width:100%; height:174px; overflow:auto;">'
        + '</div>'
      + '</div>';
    var ele = this.dom = EL.createElementsByHtml(html)[0];
    document.body.appendChild(ele);
    this._bindElements();
    this.onConsoleBuild();
  },
  onConsoleBuild : function(){
    Array.each(function(i){
      this.debug.apply(this, i);
    },this._debugInfoCache, 0, this);
  },
  
  eval : function(cmd){
    return eval(cmd);
  },
  /* {
  ():
    {void} debug({string} info [, {string} type])
  DES:
    output info in console;
  ARG:
    {string} info
      info to be output;
    {string} type
      ("message") indecates info type, which has 3 options:
      "message", "warning", "error";
      you can filter info type displayed in console;
  } */
  debug : function(info, type){
    var  ele = this.infoCtn;
    if(!ele) return this._cacheDebugInfo(info, type);
    var d = new Date(),
        t= d.toLocaleString() + ":" + d.getUTCMilliseconds(),
        type = this._msgTypeRe.test(type) ? type : "message",
				color = type == "message" ? "black" : (type == "warning") ? "#FFCC00" : "red";
        infoEle = EL.c({
          className : type,
          innerHTML : '<b style="color:' + color + ';">TIME:</b>' + t + "<br />" + String(info)
        },{
          borderBottom : "dashed 1px #eee",
          padding : "5px"
        });
    ele.insertBefore(infoEle, ele.firstChild);
  },
  showHelp : function(){
    this.debug(this.helpInfo);
  },  
  dir : function(obj){
    WIN.dir(obj);
  },
  clearConsole : function(){
    var ele = this.infoCtn;
    ele.innerHTML = "";
  },
  evalCommand : function(){
    try{
      var cmd = this.cmdForm.command.value;
      if(!cmd)this.debug("Input script commands and press enter to execute!", "warning");
      var cmdType = this.cmdForm.cmdType.value.toLowerCase();
      eval("WIN.Console." + cmdType + "(" + cmd + ")");
    }catch(e){
      this.debug("Commands Error:" + e + (e.description || ""), "error");
    }
  },
  
  hide : function(){
    if(!this.showing)return this;
    var ele = this.dom;
    if(WIN.isElement(ele)){
      EL.setStyle(ele, {display : "none"});
    }
    this.showing = false;
    return this;
  },
  show : function(){
    if(this.showing)return this;
    var ele = this.dom;
    if(WIN.isElement(ele)){
      EL.setStyle(ele, {display : ""});
    }
    this.showing = true;
    return this;
  },
  ensureShow : function(){
    var ele = this.dom;
    if(WIN.isElement(ele)){
      this.show();
    }
    else{
      this.initShow = true;
    }
    return this;
  },
  setDisplay : function(show){
    if(show) this.show();
    else this.hide();
  },
  expandConsole : function(img){
    this.dom.style.height = "200px";
    img.src = img.src.replace("up.gif", "down.gif");
  },
  collapseConsole : function(img){
    this.dom.style.height = "25px";
    img.src = img.src.replace("down.gif", "up.gif");
  },
  toggleConsoleDisplay : function(img){
    if(this._collasped){
      this.expandConsole(img);
      this._collasped = false;
    }
    else{
      this.collapseConsole(img);
      this._collasped = true;
    }
  },
  
  filterInfo : function(type){
    var ele = this.infoCtn;
    if(ele){
      var s, 
          msgRe = this._msgTypeRe,
          re = msgRe.test(type) ? new RegExp(type, "i") : msgRe;
      Array.each(function(chd){
        s = chd.style;
        if(re.test(chd.className)){
          s.display = "";
        }
        else{
          s.display = "none";
        }
      }, ele.childNodes);
    }
  },
  selectInfoFilterType : function(ele){
    if(WIN.isElement(ele)){
      var value = ele.value;
      this.filterInfo(value);
    }
  },
  
  _cacheDebugInfo : function(info, type){
    if(!WIN.isArray(this._debugInfoCache)) this._debugInfoCache = [];
    this._debugInfoCache.push([info, type]);
  },
  _msgTypeRe : /message|warning|error/i,
  _bindElements : function(){
    var ele = this.dom,
        cmdForm = ele.getElementsByTagName("form")[0],
        infoCtnEle = ele.lastChild;  
    this.infoCtn = infoCtnEle;
    this.cmdForm = cmdForm;
  },
  toString : function(){return "[object WIN.Console]";}
};
WIN.Console.initialize();