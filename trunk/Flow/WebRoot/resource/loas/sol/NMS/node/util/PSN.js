/* psn.js
util for NMS.PortStatusNode.
*/
require.provide("sol.NMS.node.util.PSN");
require("sol.NMS.node.baseStatusNode");//require "statusNode" here is to fix ie stack overflow bug
require("sol.NMS.node.portStatusNode");
namespace("NMS", {
	/*
	():
		{array} NMS.batchCreatePSN({2D-array} initInfoList)
	DES:
	  batch create NMS.PortStatusNode
	ARG:
		{2D-array} initInfoList
		  node init info list,its item is an array whose first item is the name of the node's class and the other items are the arguments of the class's initialize method. it looks like:
		  [nodeClass , id, nodeDescription, options]
	RTN:
		list of psn nodes;
	*/
	batchCreatePSN : function(initInfoList){
		var nodeList = Array.map(function(i){
		  var node = new i[0];
			node.initialize.apply(node, i.slice(1));
			return node;
		}, initInfoList);
		return nodeList;
	},
	/*
	():
		{class} NMS.createPSNSubClass({array} statusImgList, {string} root)
	DES:
		shortcut of creating sub class of NMS.PortStatusNode by specifing the class prototype 's statusImgList;
	ARG:
		{array} statusImgList
		  status imgs files name list;
		{string} root
		  root of status img file
	*/
	createPSNSubClass : function(statusImgList, root, options){
		var list = Array.map(function(img){
		  return root + img;
		}, statusImgList);
		var props = WIN.extend( {
				statusImgList : list
			},options);
		
		var subClass = WIN.createClass(
			function(){
			}, 
			props , 
			NMS.PortStatusNode
		);
		return subClass;
	},
	unknown: null
});