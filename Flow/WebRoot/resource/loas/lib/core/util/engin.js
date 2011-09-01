/***************************************************************
engin.js
util's engin
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.util.engin");
//register package to record all files( except itself -- engin.js) and sub fodders in this fodder.
require.registerPackage("lib.core.util",{
    files   :["singlelast", "prioritystate"]
});

