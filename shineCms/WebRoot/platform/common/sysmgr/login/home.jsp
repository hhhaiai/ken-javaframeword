<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>${appName}</title>	
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<style>
html, body{ width: 100%; height: 100%; padding: 0; margin: 0;overflow: hidden;}
#center-tab .om-panel-body{
	padding: 0;
}
</style>
<script type="text/javascript">
$(document).ready(function() {
	$('#body-panel').omBorderLayout({
		fit : true,
		panels:[{
			id:"north-panel",
   	     	header:false,
   	        region:"north"
		},{
   	        id:"center-panel",
   	     	header:false,
   	        region:"center"
   	    },{
   	        id:"west-panel",
   	        resizable:true,
   	        collapsible:true,
   	        title:"导航",
   	        region:"west",width:150
   	    }]
	});
    var tabElement = $('#center-tab').omTabs({
        height : "fit"
    });
    var navData = [{id:"n1",text:"系统管理",expanded:true},
                 	{id:"n2",text:"内容管理",expanded:true},
                 	{id:"n11",pid:"n1",text:"用户管理",url:"${path}sysmgr/user_enter.do"},
					{id:"n12",pid:"n2",text:"栏目管理",url:"http://www.apusic.com/homepage/index.faces"}];
    $("#navTree").omTree({
        dataSource : navData,
        simpleDataModel: true,
        onClick : function(nodeData , event){
        	if(nodeData.url){
				var tabId = tabElement.omTabs('getAlter', 'tab_'+nodeData.id);
        		if(tabId){
        			tabElement.omTabs('activate', tabId);
        		}else{
          			tabElement.omTabs('add',{
						title : nodeData.text, 
						tabId : 'tab_'+nodeData.id,
						content : "<iframe id='"+nodeData.id+"' border=0 frameBorder='no' name='inner-frame' src='"+nodeData.url+"' height='"+ifh+"' width='100%'></iframe>",
						closable : true
	            	});
        		}
        	}
        }
    });
    var ifh = tabElement.height() - tabElement.find(".om-tabs-headers").outerHeight() - 4; //为了照顾apusic皮肤，apusic没有2px的padding，只有边框，所以多减去2px
    $('#3Dbox').height(ifh);
});
</script>

</head>
<body>
<div id="body-panel" style="width:100%;height:100%;">
	<div id="north-panel" style="width:100%;height:37px;padding:0px;margin:0px;background:url(${path}/r/css/themes/${themes}/image/frame/frame_top_bg.gif)">
		<div style="float:left;width:147px;height:37px; background:url(${path}/r/css/themes/${themes}/image/frame/frame_top_logo.gif) no-repeat;">
		</div>
	</div>
	<div id="center-panel">
		<div id="center-tab" >
			<ul>
				<li><a href="#tab1">首页</a></li>
			</ul>
			<div id="tab1">
				<iframe id='3Dbox' border=0 frameBorder='no' src='${path}sysmgr/user_enter.do' width='100%' height='100%'></iframe>
			</div>
		</div>
	</div>
	<div id="west-panel">
		<ul id="navTree"></ul>
	</div>
</div>
</body>
</html>