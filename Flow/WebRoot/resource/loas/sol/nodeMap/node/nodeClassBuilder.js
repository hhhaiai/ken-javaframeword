/* nodeClassBuilder.js
*/
require.provide("sol.nodeMap.node.nodeClassBuilder");

/* {
CLASS:
  NodeMap.nodeClassBuilder
DES:
  nodeClassBuilder is a util to fast to create a node class with some different cfg from super 
	class.This is useful when we create a batch classes whose cfg are similar but not the same.
INIT_PARAMS:
  {object} nodesCfg
    provides different cfg for different class;
  {object} nodesSuperClass
    nodes super class;
METHOD:
	{class} createClass({string} type, {array} overrides)
} */
NodeMap.nodeClassBuilder = WIN.createClass(function(nodesCfg, nodesSuperClass){
		this._nodesCfg = nodesCfg;
		this._nodesSuperClass = nodesSuperClass;
  },{
		/* {
		():
			{class} createClass({string} type, {array} overrides)
		DES:
			returns a new class inherits from nodesSuperClass; the new class accepts some cfg
			from nodesCfg by the type;
		ARG:
			{string} type
			  specifys which type of the cfg the new class accepts;
				if the specified cfg is undefined, then we use cfg.defaults instead;
				So, provides the "defaults" type in each cfg;
			{array} overrides
			  specifys which cfg that the new class needs to overrides super class;
		e.g.
		  var nodesCfg = {
				icon : {
					defaults : "blank.gif",
					atm : "atm.gif",
					switch : "switch.gif"
				},
				title : {
					defaults : "",
					atm : "atm",
					switch : "switch"
				}
			};
			var myClassBuilder = new NodeMap.nodeClassBuilder(nodesCfg, nodesSuper);
			var atm = myClassBuilder.createClass("atm", ["icon", "title"]);
			var atm_ins_1 = new atm;
			var atm_ins_2 = new atm;
		} */
    createClass : function(type, overrides){
			var cfg, v, 
					prop = {},
					nodesCfg = this._nodesCfg;
			
			Array.each(function(p){
				cfg = nodesCfg[p];
				if(cfg){
					v = prop[p] = cfg[type];
					if(v === undefined)prop[p] = cfg.defaults ;
				}
			}, overrides);
			
			var newClass = WIN.createClass(function(){}, prop, this._nodesSuperClass);
			
			return newClass;
		},
    toString: function(){return "[object NodeMap.nodeClassBuilder]";}
  }
);
