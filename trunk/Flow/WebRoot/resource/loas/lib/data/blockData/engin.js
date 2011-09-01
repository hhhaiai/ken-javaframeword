/* dataReader.js
define Block Data Reader base;
*/
require.provide("lib.data.blockData.engin");

namespace("DATA.BlockData");

/*
CLASS:
  DATA.BlockData.Reader
DES:
  DATA BlockData Reader
PROPERTY:
  {2D-array} dataSource
METHOD:
  {this} initialize([{any} dataSource , {object} fields, {object} options])
  {2D-array} setDataSource({any} dataSource)
*/
DATA.BlockData.Reader = WIN.createClass(
  function(){
  },{
    /*
    ():
      {this} initialize([{any} dataSource , {object} fields, {object} options])
    DES:
      description
    ARG:
      {any} dataSource 
        (optional),dataSource that need to be transformed into 2D-array data type;; 
      {object} fields
        (optional), data record's fields;
      {object} options
        (optional)
    */
    initialize : function(dataSource, fields, options){
      this.fields = fields;
      WIN.extend(this, options);
      this.setDataSource(dataSource);
      return this;
    },
    /*
    ():
      {2D-array} setDataSource({any} dataSource)
    DES:
      transform dataSource to this.source.you need to implement your setDataSource method for each reader instance.
    ARG:
      {any} dataSource
        any source can be transformed into 2D-array data type;
    */
    setDataSource: Function.empty,
    getAttribute: Function.empty,
    setAttribute: Function.empty
  }
);
