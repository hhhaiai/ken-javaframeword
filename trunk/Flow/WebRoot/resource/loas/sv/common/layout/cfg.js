/* cfg.js
SV tblrLayout appends toolBar and sideBar;
*/
require.provide("sv.common.layout.cfg");

/* {
NAMESPACE
  SV.Config
DES:
  sv config
PROPERTY:
  {int} toolBarPanelHeight
    (37) toolbar panel(topPanel) height.
  {string} toolBarId
    ("SV_toolBar") toolbar element id.
  {int} sideBarPanelWidth
    (170) sideBar panel(leftPanel) height.
  {string} sideBarPanelBg
    ("#D7E5F5") sideBar panel background.
  {boolean} isFrameContent
    (true) indicates content type is a iframe;
  {string} contentStartUrl
    ("about:blank") content start url works only if isFrameContent is true.
  {string} contentDivId
    ("SV_mainContent") content element id works only if isFrameContent is false.
  {string} resTreeDataUrl
    ("") resTree xml data url;
  {string} resTreeTitle
    ("") resTree panel title;
  {object || null} resTreeXmlFieldMapping
    (null) resTree Xml nodes field mapping; @see GUI.Tree method loadXmlNodesData param;
  {string} layoutModuleName
    ("tblrLayout")specify layout module name to load, the module script should offer 
		SV.Config.layoutType value a GUI.TBLR_Layout class which indicates layout type.
  {GUI.TBLR_Layout} layoutType
	  (null) indicates layout type, instance of GUI.TBLR_Layout;
} */
namespace("SV.Config", {
	toolBarPanelHeight : 37,
	toolBarId : "SV_toolBar",
	sideBarPanelWidth : 170,
	sideBarPanelBg : "#D7E5F5",
	isFrameContent : true,
	contentStartUrl : "about:blank",
	contentDivId : "SV_mainContent",
	resTreeDataUrl : "",
	resTreeTitle : "",
	resTreeXmlFieldMapping : null,
	layoutModuleName : "sv.common.layout.tblrLayout",
	layoutType : null
});