/* dialog.js
*/
require.provide("app.gui.window.dialog");
require("app.gui.window.wndPanel");

/* {
CLASS:
  GUI.Dialog
SUPERCLASS:
  GUI.WndPanel
DES:
  Dialog is a WndPanel with bsDialog borderstyle;
CFG:
  {__datatype} __cfgname
    __description
PROPERTY:
  {__datatype} __propertyname
    __description
METHOD:
  {__returntype} __function_name({__datatype} __argment1)
} */
GUI.Dialog = WIN.createClass(function(){
  },{
    /* {
    ():
      {this} initialize({object} cfg)
    DES:
      apply dialog cfg: borderstyle: "bsDialog"
    } */
    initialize : function(cfg){
      cfg = WIN.extend(cfg, {
        borderStyle : "bsDialog"
      });
      return GUI.Dialog.$initialize.call(this, cfg);
    },
    toString: function(){return "[object GUI.Dialog]";}
  },
  GUI.WndPanel
);
