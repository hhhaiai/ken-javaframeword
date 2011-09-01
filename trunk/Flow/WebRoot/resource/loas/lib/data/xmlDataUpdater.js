/* xmlDataUpdater.js
*/
require.provide("lib.data.xmlDataUpdater");
require("lib.core.util.methodPool");
require("lib.data.simpleXmlRecordset");
require("lib.data.iUpdatable");

/* {
CLASS:
  DATA.XmlDataUpdater
SUPERCLASS:
  DATA.SimpleXmlRecordset
DES:
  xml data update manager;
CFG:
 {boolean} autoUpdate
	(false) if true updater will auto start interval update records from source onload;
 {string} primaryKey
   ("") records primaryKey;
  {int} updateInterval
    (60)update interval, its unit is second;
METHOD:
} */
DATA.XmlDataUpdater  = WIN.createClass(function(){
  },{		
    autoUpdate : true,
    primaryKey : "",
    updateInterval : 60,
		
		initialize : function(options){
      DATA.XmlDataUpdater.$initialize.call(this, options);
			this.toUpdatable();
      return this;
    },
    toString: function(){return "[object DATA.XmlDataUpdater]";}
  },
  DATA.SimpleXmlRecordset
);
WIN.MethodPool.extendsPools(DATA.XmlDataUpdater, 
	DATA.iUpdatable
);