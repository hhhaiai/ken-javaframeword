/***************************************************************
engin.js
window and dialog gui base
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.ele.engin");
//register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
require.registerPackage("app.gui.ele",{
  files   :["textbox"]
});
//require resource
require("lib.dom.engin");

