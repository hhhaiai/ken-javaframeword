/* autoHeightIframes.js
*/
require.provide("lib.dom.autoHeightIframes");

/* {
NAMESPACE
  EL.AutoHeightIframes
DES:
  EL.AutoHeightIframes is a action to auto set iframe height to its inner scroll height;
PROPERTY:
  {boolean} applyInners
    apply autoHeight action to document inner iframes;
  {boolean} applySelf
    apply autoHeight action to self if self is a iframe window;
  {boolean} targetIframes
    (null) when applyInners is true, targetIframes specifys the target iframes that autoHeight 
    action apply to; if this isnt offered, then targetIframes is all iframes;
FUNCTION:
  {void} EL.AutoHeightIframes.initialize()
  {void} EL.AutoHeightIframes.fit({HTMLElement | string} iframe)
  {void} EL.AutoHeightIframes.fitInners()
  {void} EL.AutoHeightIframes.fitSelf()
  {void} EL.AutoHeightIframes.delayFitSelf()
  {HTMLElementCollection | array} EL.AutoHeightIframes.getTargetIframes()
} */
namespace("EL.AutoHeightIframes", {
  applyInners : false,
  applySelf : true,
  targetIframes : null,
  
  /* {
  ():
    {void} EL.AutoHeightIframes.initialize()
  DES:
    apply auto height action by detecting EL.AutoHeightIframes options(applyInners, applySelf) ;
    @see properties (applyInners, applySelf);
    Note: this method can only be invoked on body load;
  } */
  initialize : function(){
    var A = EL.AutoHeightIframes;
    if(A.applyInners){
      A.fitInners();
    }
    if(A.applySelf){
      A.delayFitSelf();
    }
    EVT.stopObserving(window, "load", A.initialize);
  },
  /* {
  ():
    {void} EL.AutoHeightIframes.fit({HTMLElement | string} iframe)
  DES:
    fit specified iframe to be their inner scrollHeight;
  ARG:
    {array} iframe
      a iframe id string or iframe element;
  } */
  fit : function(iframe){
    var win, h, doc;
    iframe = $(iframe);
    if(!iframe) return ;
    win = iframe.contentWindow;
    if(!win || !win.DOC || !WIN.isFunction(win.DOC.getClientHeight) )return ;
		
		doc = win.document;
		h = (doc.compatMode != "CSS1Compat") ? 
				doc.body.scrollHeight : 
				doc.documentElement.scrollHeight;
    if(h > 0){
      EL.setStyle(iframe, {height : EL.parseUnit(h)});
    }
  },
  /* {
  ():
    {void} EL.AutoHeightIframes.fitInners()
  DES:
    fit document inner iframes; the iframes are the method getTargetIframes's result;
  } */
  fitInners : function(){
    var A = EL.AutoHeightIframes;
    Array.each(A.fit, A.getTargetIframes());
  },
  /* {
  ():
    {void} EL.AutoHeightIframes.fitSelf()
  DES:
    apply autoHeight action to self if self is a iframe window;
  ARG:
    {array} iframes
      a list of iframes, its item can be a string or iframe element;
  } */
  fitSelf : function(){
    EL.AutoHeightIframes.fit(EL.getWindowElement());
  },
  /* {
  ():
    {void} EL.AutoHeightIframes.delayFitSelf()
  DES:
    delay to fitSelf;
  } */
  delayFitSelf : function(){
    setTimeout(EL.AutoHeightIframes.fitSelf, 10);
  },
  /* {
  ():
    {HTMLElementCollection | array} EL.AutoHeightIframes.getTargetIframes()
  DES:
    return target iframes that the autoHeight action applied to, @see property targetIframes;
  RTN:
    reteurn EL.AutoHeightIframes.targetIframes or document all iframes;
  } */
  getTargetIframes : function(){
    var A = EL.AutoHeightIframes,
        targets = A.targetIframes;
    if(!WIN.isArray(targets))targets = document.getElementsByTagName("iframe");
    return targets;
  },
  
  unknown : null
});
EVT.observe(window, "load", EL.AutoHeightIframes.initialize);

/* {
():
  {HTMLIframeElement | null} EL.getWindowElement()
DES:
  returns the parent iframe element whose contentWindow is equals to self, if it is a iframe window;
} */
EL.getWindowElement = function(){
  var p = window.parent;
  if(p && p.document){
    var win, re,
        iframes = p.document.getElementsByTagName("iframe");
    Array.each(function(iframe){
      win = iframe.contentWindow;
      if(win == window){
        re = iframe;
        throw Object;
      }
    }, iframes);
    return re;
  }
  return null;
};