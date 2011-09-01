/* textMonitor.js
defined a model to display text;
*/
require.provide("app.gui.indicator.textMonitor");
require("app.gui.engin");
require("lib.evt.engin");
require("lib.dom.layout.position");

/*
CLASS:
  GUI.TextMonitor
DES:
  easy to display text content;
PROPERTY:
  {HTMLElement} container
    default is document.body;
  {HTMLElement} ele
  {HTMLElement} monitorEle
    the container of text;
  {string} wrapperTagName
  {string} wrapperCss
	{boolean} isShow
METHOD:
  {void} build()
  {void} hide()
  {this} initialize({string} text, {object} options)
  {void} setStyle({object} style)
  {void} setText({string} value)
  {void} show()
      {void} showAt({int} x, {int} y [, {boolean} fix])
  {void} showAtElement({HTMLElement} ele [, {string} align], {boolean} fix)
  {void} showAtEvent({event} evt [, {int} offsetX, {int} offsetY, {boolean} fix])
*/
GUI.TextMonitor = WIN.createClass(
  function(){
    
  }, {
    /*
    P:
      {string} wrapperTagName
    DES:
      monitor's tagName;
    */
    wrapperTagName : "span",
    /*
    P:
      {string} wrapperCss
    DES:
      monitor wrapper's css;
    */
    wrapperCss : "gui_textMonitor_wrap",
    /*
    ():
      {this} initialize({string} text, {object} options)
    ARG:
      {string} text
        content text to be display by monitor;
    */
    initialize : function(text, options){      
      WIN.extend(this, options);      
      this.build();      
      this.setText(text || "");
      
      return this;
    },
    /*
    ():
      {void} build()
    DES:
      build html structure;
    */
    build : function(){
      this.ele = this.monitorEle = DOC.c(this.wrapperTagName);
      this.ele.className = this.wrapperCss;
      GUI.appendToOnReady.call(this);
    },
    /*
    ():
      {void} setStyle({object} style)
    DES:
      set wrapper style;
    */
    setStyle : function(style){
      EL.setStyle(this.ele, style);
    },
    /*
    ():
      {void} setText({string} value)
    DES:
      set wrapper style;
    */
    setText : function(value){
      if(!WIN.isString(value) || (this.text == value))return ;
      this.text = value;
      this.monitorEle.innerHTML = value;
    },
    /*
    ():
      {void} show()
    DES:
      show monitor;
    */
    show : function(){
      if(this.isShow)return;
      this.ele.style.display = "block";
      this.isShow = true;
    },
    /*
    ():
      {void} showAt({int} x, {int} y [, {boolean} fix])
    DES:
      show monitor at specified postion;
    ARG:
      {boolean} fix
      fix this's position or not;
    */
    showAt : function(x, y, fix){
      var s = this.ele.style;
      
      s.left = EL.parseUnit(x);
      s.top = EL.parseUnit(y);
      if(fix)EL.fixElementPosition(this.ele);
      
      this.show();
    },
    /*
    ():
      {void} showAtElement({HTMLElement} ele [, {string} align, {boolean} fix])
    DES:
      show the monitor near a given element.
    ARG:
      {HTMLElement} ele
        the reference element
      {string} align
        (optional) default, show the monitor under and right beside the element;
        if offered, please follow this way:
        align is formed of 2 letters("**"),the first letter is for specifying the halign(likes x position) and the second one is for valign(likes y postion) to the element; Each of them has these choices:
        "A", "B", "C", "D", "E";
        for halign, the letter in sequence means the position from above the ele to under ele;
        for valign, means from left beside the ele to right beside;
    */
    showAtElement : function(ele, align, fix){
      var p = EL.getPageXY(ele), selfEle = this.ele, s = selfEle.style, oDisplay = s.display;;
      s.display = "block";
      var w = selfEle.offsetWidth, h = selfEle.offsetHeight;
      var offW = ele.offsetWidth, offH = ele.offsetHeight;
      s.display = oDisplay;
      
      if(String.notEmpty(align)){
        align = align.toUpperCase();
        var halign = align.substr(0, 1);
        var valign = (align.length > 1) ? align.substr(1, 1) : "l";
        // horizontal alignment
        switch (halign) {
          case "A": p.x -= w; break;//left side of ele
          case "B": break;//next to ele left
          case "C": p.x += offW / 2; break;//center
          case "D": p.x += offW - w; break;//near to ele right
          case "E": p.x += offW; break;//right side of ele
        }
        // vertical alignment
        switch (valign) {
          case "A": p.y -= h; break;//above ele;
          case "B": break;//next to ele top
          case "C": p.y += offH / 2; break;//center
          case "D": p.y += offH - h; break;//next to ele bottom
          case "E": p.y += offH; break;//under ele;
        }
      }
      else{
        p.x += offW;
        p.y += offH;
      }
      p.w = w;
      p.h = h;
      EL.fixBoxPosition(p);
      this.showAt(p.x, p.y, (fix || false));
    },
    /*
    ():
      {void} showAtEvent({event} evt [, {int} offsetX, {int} offsetY, {boolean} fix])
    DES:
      show the monitor at event pointer;
    ARG:
      {int} offsetX, {int} offsetY
        offsetX,offsetY to pointer
    */
    showAtEvent : function(evt, offsetX, offsetY, fix){
      var p = EVT.pointerXY(evt);
      if(!isNaN(offsetX))p.x += offsetX;
      if(!isNaN(offsetY))p.y += offsetY;
      this.showAt(p.x, p.y, (fix || false));
    },
    /*
    ():
      {void} hide()
    DES:
      hide monitor;
    */
    hide : function(){
      this.ele.style.display = "none";
      this.isShow = false;
    },
		dispose : function(){
      var self = this, 
          toDelete = ["monitorEle", "ele"];
      EL.destoryNode(this.ele);
			Array.each(function(name){
        delete self[name];
      }, toDelete);
		},
    unknown : null
  }
);