WIN.DomSafeSet = {
	_autoId : 0,
	_store : {},
	_prefix : "_DomSafeSet_",
	safeCheck : false,
	/*
	():
		{void} add({HTMLElement} ele, {object} obj [, {string} type])
	DES:
		add a new set with ele and obj;
	ARG:
		{HTMLElement} ele
		  dom node
		{object} obj 
		  obj to bind;
		{string} type
		  (optional),defaults to the string of obj;
	*/
	add : function(ele, obj, type){
	  type = String.notEmpty(type) ? type : obj.toString();
		var id = type + (this._autoId ++);		
		var name = this._prefix + type;
		
		ele[name] = id;
		this._store[id] = obj;
	},
	/*
	():
		{obj} get({HTMLElement} ele, {string} type)
	DES:
		get binded object by specified type;
	*/
	get : function(ele, type){
	  var re = null;
		if(WIN.isElement(ele) && String.notEmpty(type)){
			var name = this._prefix + type;
		  var id = ele[name];
			var o = this._store[id];
			if(!this.safeCheck || (o.dom == ele))re = o;
		}
		return re;
	},
	toString : function(){
		return "[object WIN.DomSafeSet]";
	}
};

//avoid memory leak by using DomSafeSet
var myEle = $("debugLogBar");
var myObj = {
  dom : myEle,
  toString : function(){
	  return "[object myObj]";
	}
};
var myObj2 = {
  dom : myEle,
  toString : function(){
	  return "[object myObj2]";
	}
};
/*WIN.DomSafeSet.add(myEle, myObj, "test");
var out = WIN.DomSafeSet.get(myEle, "test");
WIN.dir(out);

WIN.DomSafeSet.add(myEle, myObj2, "test2");
var out2 = WIN.DomSafeSet.get(myEle, "test2");
WIN.dir(out2);
*/
//test memory leak by using circular referencing;
myEle._EX_1 = myObj;
myEle._EX_2 = myObj2;

function MyClass(){
  var ele = this.dom =  EL.c({
	  innerHTML : "dom in the itanceof my class"
	},{
	  position : "absolute",
		left : "100px",
		top : "100px",
		width : "100px",
		height : "100px",
		border : "solid 1px #ccc",
		backgroundColor : "#eee"
	},{
	  click : function(){
		  var obj = this._this;
			WIN.dir(obj);
			WIN.dir(this);
			WIN.debug('(this.innerHTML) = ' + (this.innerHTML));
		}
	});
	ele._this = this;
	document.body.appendChild(ele);
	this.id = "adsf";
	this.toString = function(){
	  return "[obj MyClass]";
	}
}

var o1 = new MyClass();
var o2 = new MyClass();
WIN.dir(o1);
WIN.dir(o2);
myEle._EX_3 = o1;
myEle.dom = o2.dom;
