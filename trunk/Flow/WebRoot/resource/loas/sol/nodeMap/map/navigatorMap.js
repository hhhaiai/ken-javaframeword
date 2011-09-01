/* navigatorMap.js
*/
require.provide("sol.nodeMap.map.navigatorMap");
require("sol.nodeMap.map.richMap");
require("sol.nodeMap.data.navMapRectNodesDU");

NodeMap.NavigatorMap = WIN.createClass(function(){
  },{
		rectNodesDataUpdaterOpt : null,
    rectNodesDataUpdater : null,
		nodesType : null,
		navigatingMap : null,
		
		nodesIdAttribute : "nodeId",
		nodesNavigationAttr : "deviceAreaId",
		
    findNavgationTarget : Function.empty,
		
		
    /* {
    ():
      {this} initialize()
    DES:
      initialize and "onLoad" addObserver .
    } */
    initialize : function(options){
      NodeMap.NavigatorMap.$initialize.call(this, options);
			this.addListener("onselectchange", Function.bind(this._sendSelectChange, this) );
      this.initDataUpdater();
      return this;
    },
    /* {
    ():
      {void} initDataUpdater()
    DES:
      add and init rectNodesDataUpdater.
    } */
    initDataUpdater : function(){
      var du = this.rectNodesDataUpdater = new NodeMap.NavMapRectNodesDU;
			var opt = this.rectNodesDataUpdaterOpt || {};
			opt.nodesContainer = this;
			du.initialize(opt);
			du.load();
    },
		
    nodeAction : function(node){
			var map = this.navigatingMap;
			if(map && WIN.isFunction(map.goto)){
				var value = node[this.nodesNavigationAttr],
						target = this.findNavgationTarget(value);
				map.goto(target);
			}
		},
		getDirInfo : function(){
			if(!this._dirInfoStore) this.initDirInfo();
			return 	this._dirInfoStore;
		},
		initDirInfo : function(infoObj){
			var obj = this._dirInfoStore = this.getStat(),
					name = this.dirInfoCaption;
			WIN.extend(obj, infoObj);
			obj.toString = function(){return name;}
		},
		getStat : function(){
			var obj = {},
					titles = this.dirInfoTitles || {},
					normal = alarm = stop = down = 0;
			this.each(function(node){
				normal += parseInt(node.underlings_noraml || 0);
				alarm += parseInt(node.underlings_alarm || 0);
				stop += parseInt(node.underlings_stop || 0);
				down += parseInt(node.underlings_down || 0);
			}, 0 , this);
			obj[titles.normal || "normal"] = normal;
			obj[titles.alarm || "alarm"] = alarm;
			obj[titles.stop || "stop"] = stop;
			obj[titles.down || "down"] = down;
			return obj;
		},
		
    _sendSelectChange : function(selected, node){
			var map = this.navigatingMap;
			if(map && WIN.isFunction(map.fireObserver)){
				map.fireObserver("onselectchange", selected, node);
			}
		},
		toString: function(){return "[object NodeMap.NavigatorMap]";}
  },
  NodeMap.RichMap
);
