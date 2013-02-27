<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>${appName}</title>	
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link type="text/css" rel="stylesheet" href="${path}r/ztree/css/zTreeStyle.css">
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/ztree/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<style>
html, body{width:100%;height:100%;padding:0;margin:0;overflow:hidden;}
#center-tab .om-panel-body{padding: 0;}
</style>
<script type="text/javascript">
<!--
	var centerHeight,tabElement,zTree;
	var setting = {
		view: {
			dblClickExpand: false,
			showLine: true,
			selectedMulti: false,
			expandSpeed: ($.browser.msie && parseInt($.browser.version)<=6)?"":"fast"
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "pid",
				rootPId: ""
			}
		},
		callback: {
			beforeClick: function(treeId, treeNode) {
				var murl = treeNode.murl;
				if(murl&&murl!=""){
					murl = "${path}"+murl;
					var nodeId = treeNode.id;
					var tabId = tabElement.omTabs('getAlter', 'tab_'+nodeId);
	        		if(tabId!=null){
	        			tabElement.omTabs('activate', tabId);
	        		}else{
	          			tabElement.omTabs('add',{
							title : treeNode.name, 
							tabId : 'tab_'+nodeId,
							content : "<iframe id='tab_iframe_"+nodeId+"' border=0 frameBorder='no' name='inner-frame' src='"+murl+"' height='"+centerHeight+"' width='100%' style='width:100%;height:"+centerHeight+"px;'></iframe>",
							closable : true
		            	});
	        		}
				}
				return true;
			}
		}
	};
	
	var zNodes =[
		<c:forEach var="m" items="${sessionScope.CURRENT_MENUS}" varStatus="idx">
			<c:if test="${!idx.first}">,</c:if>
			{id:'${m.menuId}', pid:'${m.pid}', name:"${m.menuName}", murl:"${m.murl}", open:true}
		</c:forEach>
	];
	
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
	   	        title:"菜单导航",
	   	        region:"west",width:200
	   	    }]
		});
	    tabElement = $('#center-tab').omTabs({
	        height : "fit",
	        border : false,
	        tabMenu : true,
	        closable : [1],
	        onBeforeClose : function(n,event){
	    		//不关闭第一个选项卡页(首页)
	        	if(n==0)
	        		return false;
	        },
	        onBeforeCloseAll : function(event){
	        	//不关闭第一个选项卡页(首页)
	        	var total = this.omTabs('getLength');
	        	for(var i=total-1;i>0;i--){
	        		this.omTabs('close',i);
	        	}
	        	return false;
	        }
	    });
	    
	    //初始化Tree
		zTree = $.fn.zTree.init($("#tree"), setting, zNodes);
	    
	    centerHeight = tabElement.height() - tabElement.find(".om-tabs-headers").outerHeight()-2;
	    $('#homeFrame').height(centerHeight);
	});
//-->
</script>

</head>
<body>
<div id="body-panel" style="width:100%;height:100%;">
	<div id="north-panel" style="width:100%;height:37px;padding:0px;margin:0px;background:url(${path}/r/css/themes/${themes}/image/frame/frame_top_bg.gif)">
		<div style="float:left;width:147px;height:37px; background:url(${path}/r/css/themes/${themes}/image/frame/frame_top_logo.gif) no-repeat;">
			<span style="float:left;margin:12px 0 0 45px;width:147px;">${sessionScope.CURRENT_USER.name}</span>
		</div>
		<div style="float:right;padding:12px 10px 0 0;">
			<a href="javascript:void(0);">退出系统</a>
		</div>
	</div>
	<div id="center-panel">
		<div id="center-tab" >
			<ul>
				<li><a href="#tab_0">首页</a></li>
			</ul>
			<div id="tab_0">
				<iframe id='homeFrame' border=0 frameBorder='no' src='http://www.yangguangnet.com' width='100%' height='100%'></iframe>
			</div>
		</div>
	</div>
	<div id="west-panel">
		<ul id="tree" class="ztree" style="width:180px;overflow:auto;"></ul>
	</div>
</div>
</body>
</html>