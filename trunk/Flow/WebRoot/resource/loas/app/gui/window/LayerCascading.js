/* LayerCascading.js
*/
require.provide("app.gui.window.LayerCascading");
namespace("GUI");

/* {
CLASS:
  GUI.LayerCascading
DES:
  mutil cascad layers's zIndex manager;layers are added a readonly property "zIndex" to indentify 
  their zIndex;
PROPERTY:
  {int} _startZIndex
    the start of layers's zIndex;
  {array} _layers
    stores cascad layers;
METHOD:
  {boolean} _isFront({object} layer)
  {void} _updateZIndex({int} start)
  {layer} append({object} layer)
  {layer} remove({object} layer)
  {layer} bringToFront({object} layer)
} */
GUI.LayerCascading = WIN.createClass(function(startZIndex){
    this._startZIndex = isNaN(startZIndex) ? 0 : startZIndex;;
    this._layers = [];
  },{
    /* {
    ():
      {boolean} _isFront({object} layer)
    DES:
      return true if layer is already front;
    } */
    _isFront : function(layer){
      var layers = this._layers;
      return (layers[layers.length - 1] === layer);
    },
    /* {
    ():
      {void} _updateZIndex({int} start)
    DES:
      update layers's zIndex;
    ARG:
      {int} start
        start item index, within 0;
    } */
    _updateZIndex : function(start){
      start = isNaN(start) ? 0 : start;
      var z, layer, 
          layers = this._layers,
          len = layers.length,
          startZIndex = this._startZIndex;
      for(var i = start; i < len; i ++ ){
        layer = layers[i];
        z = layer.zIndex = startZIndex + i;
        if(WIN.isFunction(layer.setZIndex))layer.setZIndex(z);
      }
    },
    /* {
    ():
      {layer} append({object} layer)
    DES:
      append a layer; 
			we add a readonly property "zIndex" to indentify its zIndex, 
			and call layer's setZIndex method;
		ARG:
		  {object} layer
			  it should implements setZIndex method;
    } */
    append : function(layer){
      if(layer){
        var layers = this._layers;
        layers.push(layer);
        this._updateZIndex(layers.length - 1);
      }
      return layer;
    },
    /* {
    ():
      {layer} remove({object} layer)
    DES:
      remove a layer and delete the layer's zIndex property;
    } */
    remove : function(layer){
      if(layer){
        var layers = this._layers,
            zIndex = layer.zIndex,
            i = layers.indexOf(layer);
        if(i != -1){
          layers.splice(i,1);
          this._updateZIndex(i);
          delete layer.zIndex;
        }
      }
      return layer;
    },
    /* {
    ():
      {layer} bringToFront({object} layer)
    DES:
      bring layer to the front of any other layers;
    } */
    bringToFront : function(layer){
      if(!this._isFront(layer)){
        this.remove(layer);
        this.append(layer);
      }
      return layer;
    },
    toString : function(){return "[object GUI.LayerCascading]";}
  }
);