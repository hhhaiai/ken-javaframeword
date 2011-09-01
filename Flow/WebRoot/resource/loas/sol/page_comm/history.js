/***************************************************************
history.js
define page history module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("sol.page_comm.history");
//require resource

namespace("PAGE_COMM");
PAGE_COMM.HistoryMgr = function(){
	var H = {};
	this.add = function(name){
		if(!String.notEmpty(name))return null;
		name = name.toLowerCase();
		var list = H[name] = new HistoryList();
		list._load = this.load;
		list._listName = name;
		return H[name];
	};
	this.remove = function(name){
		if(!String.notEmpty(name))return false;
		name = name.toLowerCase();
		delete H[name];
	};
	this.get = function(name){
		if(!String.notEmpty(name))return null;
		name = name.toLowerCase();
		return H[name];
	};
	this.go = function(name, which){
		var list = this.get(name);
		if(list && list.go)list.go(which);
	};
	this.back= function(name, n){
		this.go( name, - Math.abs(n));
	};
	this.forward= function(name, n){
		this.go( name, Math.abs(n));
	};
	this.load = Function.empty;
};

/*
CLASS:
  HistoryList
SUPERCLASS:
  superclass
SUBCLASS:
  subclass
DES:
  description
PROPERTY:
  {int} lengh
    the lengh of target window history list
METHOD:
  {returntype} back({datatype} argment1)
*/
function HistoryList(){
	var list = [], cursor = -1;
	this._add = function(url){
		if(!String.notEmpty(url))return false;
		var current = list[cursor], next = list[cursor + 1], previous = list[cursor - 1];
		if(current == url)return false;
		cursor = cursor + 1;
		list.length = cursor;
		list.push(url);
		this._updateProperties(cursor);
		return true;
	};
	this.go = function(which){
		if(list.length < 2)return ;
		var current = cursor;
		if(isNaN(which)){
			if(String.notEmpty(which)){
				Array.each(function(i, ind){
				  if(String.contains(i, which)){
						current = ind;
						throw Object;//break each
					}
				}, list);
			}
		}
		else current += which;
		var url = list[current];
		if(String.notEmpty(url)){
			cursor = current;
			this._updateProperties(cursor);
			return this._load( this._listName, url);		
		}
	};
	this.back = function(n){
		this.go( - Math.abs(n));
	};
	this.forward = function(n){
		this.go( Math.abs(n));
	};
	this._updateProperties = function(current){
		this.previous = list[cursor - 1];
		this.current = list[current];
		this.next = list[cursor + 1];
	};
	this._load = Function.empty;
}