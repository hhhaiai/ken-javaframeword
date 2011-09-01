/***************************************************************
engin.js
widget engin
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.widget.engin");
//register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
require.registerPackage("app.widget",{
  files   :["validator"]
});
namespace("WIDGET");
