/***************************************************************
engin.js
defined GUIRender.engin module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("org.GUIRender.engin");
//require resource

/*
NAMESPACE:
  name
DES:
  GUIRender common methods
FUNCTION:
  {void} GUIRender.autoApplyRender({string} tagName [, ...])
  {object} GUIRender.getGUIRenderObj({function} renderClass, {string} itemName)
  {object} GUIRender.getGUIRenderObjByEle({HTMLElment} ele)
  {object} GUIRender.getJSON(ele, attr)
  ?{void} GUIRender.renderDocumentElements({string} tagName)
  {object || null} GUIRender.renderElement({HTMLElement} ele)
  {void} GUIRender.renderElements({HTMLElements} elements)
*/
namespace("GUIRender");
WIN.extend(GUIRender, {
  /*
  ():
    {void} GUIRender.autoApplyRender({string} tagName [, ...])
  DES:
    auto render document elements after dom loaded
  ARG:
    {string} tagName
      accept one or more tagName
  */
  autoApplyRender : function(){
    EVT.domLoadedObserver.add( Array.each(GUIRender.renderDocumentElements, arguments));
  },
  /*
  ():
    {object} GUIRender.getGUIRenderObj({function} renderClass, {string} itemName)
  DES:
    get GUIRender Object.
  ARG:
    {function} renderClass
      class that used to render element
  */
  getGUIRenderObj : function(renderClass, itemName){
    try{return renderClass.items[itemName.toLowerCase()];}catch(e){return null;}
  },
  /*
  ():
    {object} GUIRender.getGUIRenderObjByEle({HTMLElment} ele)
  DES:
    get element's corresponding GUIRender object.
  ARG:
    {string} tagName
      accept one or more tagName
  */
  getGUIRenderObjByEle : function(ele){
    var render = GUIRender.getJSON(ele, "gui-render");
    if(!render)return null;
    return GUIRender.getGUIRenderObj(render.type, render.itemName );
  },
  /*
  ():
    {object} GUIRender.getJSON(ele, attr)
  DES:
    get a JSON obj from ele if it has assigned attribute;
  ARG:
    {string} attr
      attribute name
  */
  getJSON : function(ele, attr){
    if(!WIN.isElement(ele))return null;
    var render = ele.getAttribute(attr);
    try{
      if(String.notEmpty(render)){
				render = String.trim(render);
        if(render.indexOf("{") == 0)render = eval("(" + render + ")");
        else render = eval("(" + eval(render) + ")");
        return render;
      }
    }catch(e){return null};
  },
  /*
  ():
    ?{void} GUIRender.renderDocumentElements({string} tagName)
  DES:
    render Document Elements by given tagName
  ARG:
    {string} tagName
      the tagName of element which assigned "gui-render" attribute.
  */
  renderDocumentElements : function(tagName){
    var targets = document.getElementsByTagName(tagName || "*");
    GUIRender.renderElements(targets);
  },
  /*
  ():
    {object || null} GUIRender.renderElement({HTMLElement} ele)
  DES:
    Render element if it has valid "gui-render" attribute.After render,we add "gui-rendered" attribute(value is "true") to element.
    *
    *  The "gui-render" attribute points to a JSON string that can have the following properties:
    *
    *   prop. name  | description
    *  -----------------------------------------------------------------------------------------
    *   type        | {function} render type, a GUIRender class;
    *   options     | {object} (optional) the initialize options of the class instance,besides, we will extend a renderTarget(value is ele) attribute to options.
    *   itemName    | {string} (optional) if offered, we will store the class instance, e.g. you can use GUIRender.getGUIRenderObj( GUIRender.Table33, itemName) to get the instance.
    
  RTN:
    Return a instance of the class which assigned in "gui-render" attribute.
    If ele has been rendered then return instance it ever create.Note:if it didnt provide itemName in "gui-render" attribute it just return null.
      
  e.g.
    You can use by 2 ways like:
    1.use renderString to redirect to json string.
    * html part: 
      <div id="table33" gui-render="GUIRender.table33_renderStr">
    * script part:
      table33_renderStr = '{type: GUIRender.Table33, \
                            options:{ \
                              head :"..", \
                              foot:\'<button value="" >ok</button>\' }}';
    2.use json string directly.
    * html part: 
      <div id="table33_2" gui-render="{type: GUIRender.Table33, options:{head :head,foot:foot} }">
    * script part:
      var head = ".. ";
      var foot = '<button value="" >ok</button>';
  */
  renderElement : function(ele){
    var render = GUIRender.getJSON(ele, "gui-render");
    if(!render)return null;
    var GUIModule = render.type;
		
    if(ele.getAttribute("gui-rendered") == "true")
      return GUIRender.getGUIRenderObj(GUIModule, render.itemName );
    
    var guiIns = new GUIModule();
    
    var opt = WIN.extend({
      renderTarget : ele
    }, render.options);
    guiIns.initialize(opt);
    
    if(String.notEmpty(render.itemName)){
      if(!GUIModule.items)GUIModule.items = {};
      GUIModule.items[render.itemName.toLowerCase()] = guiIns;
    }
    //rendered flag
    ele.setAttribute("gui-rendered", "true");
    return guiIns;
  },
  /*
  ():
    {void} GUIRender.renderElements({HTMLElements} elements)
  DES:
    render elements;
  */
  renderElements : function(elements){
    Array.each(function(ele){
      GUIRender.renderElement(ele);
    }, elements);
  },
  unknown:null
});

/*
CLASS:
  GUIRender.Base
DES:
  render classes base
METHOD:
  {void} _buildView()
  {void} build()
  {this} initialize({object} options)
  {void} handleOptions()
  {void} onBuild()
*/
GUIRender.Base = function(){
  /*
  ():
    {this} initialize({object} options)
  */
  this.initialize = function(options){
    WIN.extend(this, this.handleOptions(options));
    
    this.build();
    return this;
  };
  /* 
  ():
    {void} handleOptions()
  DES:
    handle options
  */
  this.handleOptions = function(options){
    var opt = WIN.extend({
    }, options);
    
    return opt;
  };
  /*
  ():
    {void} build()
  DES:
    build box;You should define onBuild method in subClass;
  */
  this.build = function(){
    this._buildView();
    this.onBuild();
  };
  /*
  ():
    {void} _buildView()
  DES:
    buildView and reference dom
  */
  this._buildView = Function.empty;
  /*
  ():
    {void} onBuild()
  DES:
    Function.empty;
  */
  this.onBuild = Function.empty;
};