/* PSNGroupNode.js
define NMS.PortStatusNode group for easily layout;
*/
require.provide("sol.NMS.node.PSNGroupNode");
require("sol.NMS.node.util.PSN");
require("sol.NMS.node.baseNode");

/*
CLASS:
  NMS.PSNGroup
DES:
  build nodes group for easily layout;
PROPERTY:
  {array} items
    node List
METHOD:
  {returntype} function_name({datatype} argment1)
*/
NMS.PSNGroupNode = WIN.createClass(
  function(){
  },{
		/*
		cfg:
			{string || int} itemspacing
		DES:
			items node spacing
		*/
		itemspacing : 3,
		/*
		cfg:
			{string} nodeCss
		DES:
			css for this ele
		*/
		nodeCss : "NMS_PSNGroupNode",
    /*
    ():
      {this} initialize(id, nodeDescription, {object} options)
    DES:
      initialize interface,add new handle(dispose) to window unload event;
    ARG:
      {object} options
        options are extended as this's props;
    */
    initialize : function(left, top, initInfoList, nodeClass, nodeWidth, nodeHeight){
			this._cfg = {
				left : left,
				top : top,
				list : initInfoList,
				nodeClass : nodeClass,
				nodeWidth : nodeWidth,
				nodeHeight : nodeHeight
			};
			
      NMS.PSNGroupNode.$initialize.call(this);
			
			delete this._cfg;
			
      return this;
    },
    /*
    ():
      {void} build({boolean} fireOnBuild)
    DES:
      initInfoMonitor & initBehaviors;
    */
    build : function(fireOnBuild){
      NMS.StatusNode.$build.call(this, false);
			
      var cfg = this._cfg, p = EL.parseUnit;
			this.setStyle({
				left: p(cfg.left),
				top: p(cfg.top)
			});
			this.initItems();
      
      if(fireOnBuild)this.onBuild();
    },
		initItems : function(){
			var _this = this, cfg = this._cfg;
			
			var list = Array.map(function(i){
			  i = [cfg.nodeClass].concat(i);
				i.push({container: _this.ele});
				return i;
			}, cfg.list);
			
			this.items = NMS.batchCreatePSN(list);
			this.initItemsStyle();
		},
		initItemsStyle : function(){
			var _this = this, cfg = this._cfg, p = EL.parseUnit;
			
			Array.each(function(node, ind){
			  var spacing = (ind == 0) ? 0 : _this.itemspacing;
				node.setStyle({
					width: p(cfg.nodeWidth),
					height: p(cfg.nodeHeight),
					marginLeft : p(spacing)
				});
			}, this.items);
		},
		
		setCellSpacing : function(value){
			this.itemspacing = value;
		},
    unknown: null
  },
	NMS.BaseNode
);
