/***************************************************************
progressbar.js
create progressbar gui
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.indicator.progressBar");
//require resource
require("app.gui.engin");

/*
CLASS:
  GUI.ProgressBar
DES:
  ProgressBar
PROPERTY:
  {HTMLElement} ele
    bar dom reference
  {HTMLElement} proEle
    image to show progress;
  {HTMLElement} proTextEle
    text to show progress, only exists when options's showText of initialize method is true;
METHOD:
  {void} setValue({int} value)
  {int} getValue()
*/
GUI.ProgressBar = function(){
	/*
	():
		{this} initialize({datatype} argment1)
	DES:
		initialize bar, set progresss value to 0;
	ARG:
		{object} options
		  (optional), default is:{
				container : document.body,
				showText  : true
			}
	*/
  this.initialize = function(options){
    WIN.extend(this, this.handleOptions(options));
    
    this.build();
    this.hide();
    
    return this;
  };
  this.handleOptions = function(options){
    var opt = WIN.extend({
      container : document.body,
      showText  : true
    }, options);
    return opt;
  };
  this.build = function(){
    var layout = this.layout;
    this._createWrap();
    GUI.appendTo.call(this);
  };
  /*
  ():
    {void} _createWrap()
  DES:
    _create wrapper and reference dom;
  */
  this._createWrap = function(){
    var html = '<div class="gui_progressbar_wrap">';
    if(this.showText)html += '<div class="gui_progressbar_text">0%</div>';
    html += '<div class="gui_progressbar_main">'
            + '<div class="gui_progressbar_pro"></div></div></div>';
    var wrap = this.ele = EL.createElementsByHtml(html)[0];
    this.proEle = wrap.lastChild.firstChild;
    if(this.showText)this.proTextEle = wrap.firstChild;
  };
  /*
  ():
    {void} setValue({int} value)
  DES:
    set progress value.
  */
  this.setValue = function(value){
		clearTimeout(this._hideDelayTimer);
		if(value < 0)value = 0;
		if(value > 100)value = 100;
		var val = "" + String(value) + "%";
    EL.setStyle(this.proEle, {width : val});
    if(WIN.isElement(this.proTextEle)){
			this.proTextEle.innerHTML = val;
		}
		if(100 == value)this._hideDelayTimer = setTimeout(Function.bind(this.onDone, this), 100);
  };
  /*
  ():
    {int} getValue()
  DES:
    get progress value.
  */
  this.getValue = function(){
    return parseInt(this.proEle.style.width);
  };
	this.onDone = function(){
		this.hide();
	};
	this.hide = function(){
		this.showing = false;
		this.ele.style.display = "none";
	};
	this.show = function(){
		this.showing = true;
		this.ele.style.display = "";
	};
};