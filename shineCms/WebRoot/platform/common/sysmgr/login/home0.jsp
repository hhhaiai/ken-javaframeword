<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>Sunshine CMS</title>	
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
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
            var navData = [{id:"n1",text:"搜索引擎",expanded:true},
                         {id:"n2",text:"中间件",expanded:true},
                         {id:"n11",pid:"n1",text:"百度",url:"http://www.baidu.com"},
    			         {id:"n12",pid:"n2",text:"金蝶中间件",url:"http://www.apusic.com/homepage/index.faces"}];
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
        });
</script>

</head>
<body>
<%-- 
<div id="top-panel" style="width:100%;height:50px;background-color: gray;">
	&nbsp;
</div>
--%>
<div id="body-panel" style="width: 100%;height:100%;">
	<div id="north-panel" style="width:100%;height:30px;background-color: gray;"></div>
	<div id="center-panel">
		<div id="center-tab" >
			<ul>
				<li><a href="#tab1">3D盒子</a></li>
			</ul>
			<div id="tab1">
				<iframe id='3Dbox' border=0 frameBorder='no' src='' width='100%'></iframe>
			</div>
		</div>
	</div>
	<div id="west-panel">
		<ul id="navTree"></ul>
	</div>
</div>
</body>
</html>