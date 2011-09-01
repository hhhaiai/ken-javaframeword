/***************************************************************
engin.js
dom's engin
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.dom.engin");
/*
extend NAMESPACE:
  EL
DES:
  dom element operatios.
PROPERTY:
  {datatype} property_name
FUNCTION:
	{HTMLElement} EL.cleanWhitespace({HTMLElement} element)
  {int | string} EL.getCssVal({HTMLElement} e, {string} p[, {boolean} i])
  {string | undefined} EL.getInnerText({HTMLElement | string} ele)
  {array} EL.getNodesByMethod({function} fn, {string} tag, {string | HTMLElement} root)
  ?{object} EL.getNodeByAttrPath({string} attrValPath [,{string} attrName] [,{object} obj])
  {array} EL.getNodesByClassName({string} className, {HTMLElement} parentElement)
  {HTMLElement} EL.getParentByAttr({string} src, {string} attr, {string} attrVal)
  {boolean} EL.hasClass({HTMLElement}element, {string} className)
  {void} EL.setInnerText({HTMLElement} element, {string} txt)
*/
WIN.extend(EL,{
	/*
	():
		{HTMLElement} EL.cleanWhitespace({HTMLElement} element)
	DES:
		Removes all of element's text nodes which contain only whitespace. Returns element.
		Note:this method is from prototype framework.
	*/
  cleanWhitespace: function(ele) {
    ele = $(ele);
    var node = ele.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue)){
        ele.removeChild(node);
			}
      node = nextNode;
    }
    return ele;
  },
	/*
  ():
    {int | string} EL.getCssVal({HTMLElement} e, {string} p[, {boolean} i])
  DES:
    get element css style propertyValue
  ARG:
    {HTMLElement} e
      id string or object reference
    {string} p
      Css property
    {int} i
      parseInt propertyValue or not
  */
  getCssVal   : function (e,p,i){
    if(!(e=$(e)))return null;
    var s, v = 'undefined', dv = document.defaultView;
    
    if(dv && dv.getComputedStyle){
      s = dv.getComputedStyle(e,'');
      if(s) v = s.getPropertyValue(p);
    }
		else if(e.currentStyle){
      v=e.currentStyle[String.camelize(p)];
    }
		else return null;
    return i ?(parseInt(v)||0):v;
  },
	getStyle : function(){
		var dv = document.defaultView,
				isElement = WIN.isElement,
				isNEString = String.notEmpty;
		return dv ?
			function (ele, prop){
				if(! (isElement(ele) && isNEString(prop)) )return null;
				var s, v = null;
				if(prop == 'float'){
					prop = "cssFloat";
				}
				if(v = ele.style[prop]){
					return v;
				}
				if(dv.getComputedStyle){
					s = dv.getComputedStyle(ele, '');
					if(s) v = s.getPropertyValue(String.camelize(prop));
				}
				return v;
			} :
			function (ele, prop){
				if(! (isElement(ele) && isNEString(prop)) )return null;
				var s, v = null;
				if(prop == 'opacity'){
					try{
						var re = /alpha\(.*?opacity.*?=(.*)\)/i;
						v = parseFloat(ele.style.filter.match(re)[1]) / 100;
						return isNaN(v) ? v : 1;
					}catch(e){ return 1; }
				}else if(prop == 'float'){
					prop = "styleFloat";
				}
				if(v = ele.style[prop]){
					return v;
				}
				
				if(s = ele.currentStyle){
					v = s[String.camelize(prop)];
				}
				return v;
			};
	}(),

  /*
  ():
    {string | undefined} EL.getInnerText({HTMLElement | string} ele)
  DES:
    get element innerText|| textContent;If ele isnt exists it return undefined.
  */
  getInnerText      : function(ele){
    ele = $(ele);
    if(!ele)return;
    return ele.innerText || ele.textContent;
  },
  
  /*
  ():
    {array} EL.getNodesByMethod({function} fn, {string} tag, {string | HTMLElement} root)
  DES:
    Return a array of HTMLElements that pass the test applied by supplied boolean fn.
  ARG:
    {function} fn
      A boolean  fn to filter nodes.
    {String} tag (optional)
      The tag name of the elements being collected
    {string | HTMLElement} root
      The HTMLElement or an ID to use as the starting point 
  */
  getNodesByMethod: function(fn, tag, root) {
    tag = tag || '*';    
    var nodes = [];
    
    if (root){
      if(!(root = $(root))) {
        return nodes;
      }
    }
    else {
      root = document;
    }    
    var elements = root.getElementsByTagName(tag);
    var len = elements.length;
    if ( !len && (tag == '*' && root.all) ) {
      elements = root.all; // IE < 6
    }
    
    for (var i = 0; i < len; ++i) {
      if ( fn(elements[i]) ) {
        nodes.push(elements[i]);
      }
    }
    return nodes;
  },
  /*
  ():
    ?{object} EL.getNodeByAttrPath({string} attrValPath [,{string} attrName] [,{object} obj])
  DES:
    getNodeBy attrValPath in single model.The nodes at deferent hiberarchy in single model has the same attribute which we can used to form a value chain to find a node.
  ARG:
    {string} attrValPath
      node attribute value path, surport relative path
    {string} attrName
      node attribute，defautl: DMname
    {object} obj
      the start node to be search,default:document.body;  
  RTN:
    element || null
  */
  getNodeByAttrPath   : function (attrValPath,attrName,obj){
    function _getStartObj(n,obj){
      var db = document.body;
      if(n == -1 || !WIN.isDefined(obj))return db;  
      for(var i = 0; i < n , WIN.isElement(obj); i++){
        if(WIN.isClientNode(obj))return db;
        obj = obj.parentNode;
      }
      return obj;
    };
    var arr,startObj,nodes,length;
    attrValPath = attrValPath.toLowerCase();
    arr = attrValPath.match(/\w+/g);
    startObj = _getStartObj(String.numOfRelPath(attrValPath),obj);  //搜索的起始节点
    if(!WIN.isDefined(attrName))attrName = "DMname";
    //遍历,如找到对应节点则返回
    for(var i = 0 ; i < arr.length , WIN.isElement(startObj); i ++){//遍历路径
      nodes = startObj.childNodes;
      for(var j = 0 ,length = nodes.length; j<length; j++){//遍历子节点
        startObj = nodes[j];
        if(startObj[attrName].toLowerCase() == arr[i]){
          if(i == arr.length - 1)return startObj;//遍历至最后一个路径
          break;
        }
      }
    }
    return null;
  },
  /*
  ():
    {array} EL.getNodesByClassName({string} className, {HTMLElement} parentElement)
  DES:
    Fetches all of element’s descendants which have a CSS class of className and returns them as an array of extended elements.
  */  
  getNodesByClassName : function (className, parentElement) {
    var children = ($(parentElement) || document.body).getElementsByTagName('*');
    var elements = [], child;
    for (var i = 0, length = children.length; i < length; i++) {
      child = children[i];
      if (EL.hasClass(child, className))
        elements.push(child);
    }
    return elements;
  },
  /*
  ():
    {HTMLElement} EL.getParentByAttr({HTMLElement} src, {string} attr, {string} attrVal)
  DES:
    get parentNode by its attribute & attribute's value
  ARG:
    {string} src
      element node
    {string} attr
      node's attribute name
    {string} attrVal
      attribute's value
  RTN:
    element || null
  */
  getParentByAttr     : function (src,attr,attrVal){
    return EL.getParentByMethod(src, function(ele){
      return !!(ele[attr] && ele[attr].toLowerCase() == attrVal.toLowerCase());
    });
  },
  /*
  ():
    {boolean} EL.hasClass({HTMLElement}element, {string} className)
  DES:
    Checks whether element has the given CSS className.
  */  
  hasClass        : function (ele, css) {
    if (!(ele = $(ele))) return false;
    var re = new RegExp('(?:^|\\s+)' + css + '(?:\\s+|$)');
    return re.test(ele.className);
  },
  /*
  ():
    {void} EL.setInnerText({HTMLElement} element, {string} txt)
  DES:
    set element innerText|| textContent
  */
  setInnerText        : function(ele,txt){
    if(typeof ele.textContent == "undefined")ele.innerText = txt;
    else ele.textContent = txt;
  }
});

