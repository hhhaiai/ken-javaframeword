/***************************************************************
engin.js
gui common methods
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.engin");

/*
NAMESPACE:
  GUI
DES:
  gui common methods
PROPERTY:
  {datatype} property_name
FUNCTION:
  {void} GUI.appendTo({HTMLElement | string} ele)
  {string} GUI.createTable33Html({string} head, 
                                 {string} body, {string} foot, {string} tableCss)
  {void} GUI.executePlugins({array} plugins)
*/
namespace("GUI", {
  /*
  ():
    {boolean} GUI.appendTo({HTMLElement | string} ele)
  DES:
    Append gui instance's ele to a container element.
    Note: it's dynamic method, you should use in this way: GUI.appendTo.call(this, ele);
  ARG:
    {HTMLElement | string} ele
      (optional), when we initialize a gui instance,if a container was assigned, we will apppend instance's ele to it;you can also assign another by passing ele param.
  */
  appendTo: function(ele){
    if(this._appendedToContainer)return true;
		ele = $(ele || this.container) || document.body;
    if(WIN.isElement(ele)){
      this.container = ele;
      ele.appendChild(this.ele);
			this._appendedToContainer = true;
			return true;
    }
  },
  /*
  ():
    {boolean} GUI.appendToOnReady({HTMLElement | string} ele)
  DES:
    Append gui instance's ele to a container element on dom ready.
    Dynamic method.
  ARG:
    {HTMLElement | string} ele
      see at GUI.appendTo method;
  */
	appendToOnReady : function(ele){
		if(!EVT.domLoaded){
			EVT.domLoadedObserver.add(Function.bind(function(){
			ele = $( ele || this.container) || document.body;
			GUI.appendTo.call(this, ele);
			}, this) );
		}
		else{
			GUI.appendTo.call(this, ele);
		}
	},
  /*
  ():
    {string} GUI.createTable33Html({string} head, 
                                   {string} body, {string} foot, {string} tableCss)
  DES:
    create Table33 Html.
  ARG:
    {string} head, {string} body, {string} foot
      html for head body foot;
    {string} tableCss
      table css,besides define table css you should also define every td css.
      e.g.
        if table css is 
        .table33{
          }
        then you should also define td css like these:
        .table33 .nw{//nw corner
          }
        .table33 .content{//content css
          }
  */
  createTable33Html : function(head, body, foot, tableCss){
    if(!String.notEmpty(head))head = "&nbsp;";
    if(!String.notEmpty(body))body = "&nbsp;";
    if(!String.notEmpty(foot))foot = "&nbsp;";
    
    return '<table class="' + tableCss + '" width="100%" border="0" cellspacing="0" cellpadding="0">'
             + '<tr>'
             +   '<td class="nw">&nbsp;</td>'
             +   '<td class="n">' + head + '</td>'
             +   '<td class="ne">&nbsp;</td>'
             + '</tr>'
             + '<tr>'
             +   '<td class="w">&nbsp;</td>'
             +   '<td class="content">' + body + '</td>'
             +   '<td class="e">&nbsp;</td>'
             + '</tr>'
             + '<tr>'
             +   '<td class="sw">&nbsp;</td>'
             +   '<td class="s">' + foot + '</td>'
             +   '<td class="se">&nbsp;</td>'
             + '</tr>'
             +'</table>';
  },
  /*
  ():
    {void} GUI.executePlugins([{array} plugins])
  DES:
    execute assigned host's plugins;
    Note: it's dynamic method,you should use in this way: 
       GUI.executePlugins.call(this, plugins)
  ARG:
    {array} plugins
      (optional) plugins array, each plugin should implement execute method which accepts host as param.
  */
  executePlugins : function(plugins){
    var _this = this, plugins = plugins || this.plugins;
    var f = function(plugin){if(plugin.execute)plugin.execute(_this);};
		Array.each(f, plugins);
  },
  unknown:null
});

