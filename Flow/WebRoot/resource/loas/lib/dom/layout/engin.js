/***************************************************************
engin.js
about elements layout
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.dom.layout.engin");
//register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
require.registerPackage("lib.dom.layout",{
    files   :["position","size"]
});
//require resource
require("lib.dom.engin");
