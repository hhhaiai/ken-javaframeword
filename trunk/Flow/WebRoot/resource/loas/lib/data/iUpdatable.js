/* iUpdatable.js
*/
require.provide("lib.data.iUpdatable");
require("lib.core.util.methodPool");

/* {
MPOOL:
  DATA.iUpdatable
DES:
  data update manager;
CFG:
  {boolean} autoUpdate
    (false) if true updater will auto start interval update records from source onload;
  {string} primaryKey
    ("") records primaryKey;
  {int} updateInterval
    (60) update interval, its unit is second;
FUNCTION:
  {int} findIn({array} records, {any} value, {string} prop)
  {this} intervalUpdate()
  {this} stopIntervalUpdate()
  {this} toUpdatable()
  {this} update()
  {boolean} updateAllWith({array} newRecords)
  {this} updateOne({object} oldRecord, {object} newRecord)
	
  {int} _hndUpdateResponse({XMLHttpRequest} req)
} */
DATA.iUpdatable = WIN.MethodPool.declare({
    autoUpdate : true,
    primaryKey : "",
    updateInterval : 60,
    
    /* {
    ():
      {this} update()
    DES:
      update records by reading source; If the source is an url, it will first request the 
      url to get the responseXML used as the root param before calling method readRecords ;
    } */
    update : function(){
      var source = this.source;
      if(String.notEmpty(source)){
        RPC.xhr(this.source, {
          bAsync : this.bAsync,
          onSuccess : Function.bind(this._hndUpdateResponse, this),
          onFailure : Function.bind(this._hndFailureRpc, this)
        });
      }
      else if(source){
        var newRecords = this.readRecords(source, this.recordTag, false);
        this.updateAllWith(newRecords);
        this.fireObserver("onUpdate", this.records);
      }
      return this;
    },
    /* {
    ():
      {boolean} updateAllWith({array} newRecords)
    DES:
      contrast every record of newRecords to every of oldRecords;
      if no corresponding oldRecord, it fireObserver("onSourceAddRecord");
      if oldRecord attribute was changed,it fireObserver("onSourceUpdateRecord");
      if oldRecord was removed, it fireObserver("onSourceRemoveRecord");
    RTN:
      return true if update success;
    } */
    updateAllWith : function(newRecords){
      if(!WIN.isArray(newRecords)) return false;
      if(!WIN.isArray(this.records))this.records = [];
      var value, ind,
          pk = this.primaryKey,
          records = this.records,
          rCopy = records.concat();
      
      Array.each(function(record){
        value = record[pk];
        ind = this.findIn(rCopy, value, pk);
        if(ind > -1){  //update
          this.updateOne(rCopy[ind], record);
          rCopy.removeAt(ind);
        }
        else{//add
          records.push(record);
          this.fireObserver("onSourceAddRecord", record);
        }
      }, newRecords, 0, this);
      while(record = rCopy[0]){//remove
        records.remove(record);
        rCopy.removeAt(0);
        this.fireObserver("onSourceRemoveRecord", record);
      }
      return true;
    },
    /* {
    ():
      {this} updateOne({object} oldRecord, {object} newRecord)
    DES:
      update old record with new one;
    } */
    updateOne : function(oldRecord, newRecord){
      var fname, newVal, oldVal,
          changedList = [];
      Array.each(function(field){
        fname = field.name;        
        newVal = newRecord[fname];
        oldVal = oldRecord[fname];
        if(newVal != oldVal){
          oldRecord[fname] = newVal;
          changedList.push(fname);
        }
      }, this.fields);
      if(changedList.length > 0){
				this.fireObserver("onSourceUpdateRecord", oldRecord, changedList);
			}
			
      return this;
    },
    /* {
    ():
      {this} intervalUpdate()
    DES:
      start interval update records;
    } */
    intervalUpdate : function(){
      var t = (this.updateInterval || 60) * 1000,
          f = Function.bind(this.update, this);
      this._intervalUpdateTimer = setInterval(f, t);
      return this;
    },
    /* {
    ():
      {this} stopIntervalUpdate()
    DES:
      stop records update interval;
    } */
    stopIntervalUpdate : function(){
      clearInterval(this._intervalUpdateTimer);
      return this;
    },
    /* {
    ():
      {int} findIn({array} records, {any} value, {string} prop)
    DES:
      return spcified record index in records;
    } */
    findIn : function(records, value, prop){
      var val,
          ind = -1, 
          prop = String.notEmpty(prop) ? prop : this.primaryKey ;
      Array.each(function(record, index){
        if(record){
          val = record[prop];
          if(val == value){
            ind = index;
            throw Object;
          }
        }
      }, records);
      return ind;
    },
    
    /* {
    ():
      {int} _hndUpdateResponse({XMLHttpRequest} req)
    DES:
      update records by response;
    } */
    _hndUpdateResponse : function(req){
      var newRecords = this.readResponse(req, false);
      this.updateAllWith(newRecords);
      this.fireObserver("onUpdate", this.records);
    },
    /* {
    ():
      {this} toUpdatable()
    } */
    toUpdatable : function(){
      this.addObservers("onUpdate", "onSourceAddRecord", "onSourceRemoveRecord", "onSourceUpdateRecord");
      if(this.autoUpdate){
				this.addListener("onLoad",  Function.bind(this.intervalUpdate, this) );
			}
      return this;
    }
  }
);