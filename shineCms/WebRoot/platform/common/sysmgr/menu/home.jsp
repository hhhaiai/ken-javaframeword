<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>${appName}</title>	
<link type="text/css" rel="stylesheet" href="${path}r/css/base.css"/>
<link type="text/css" rel="stylesheet" href="${path}r/ztree/css/zTreeStyle.css">
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/ztree/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript">
<!--
	var zTree;
	var editIframe;
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
				pIdKey: "pId",
				rootPId: ""
			}
		},
		callback: {
			beforeClick: function(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("tree");
				if (treeNode.isParent) {
					zTree.expandNode(treeNode);
					return false;
				} else {
					editIframe.attr("src",treeNode.murl);
					return true;
				}
			}
		}
	};

	var zNodes =[
		{id:1, pId:0, name:"系统管理", open:true},
		{id:101, pId:1, name:"用户管理", murl:"http://www.baidu.com"},
		{id:102, pId:1, name:"角色管理", murl:"http://www.baidu.com"},
		{id:103, pId:1, name:"菜单管理", murl:"${path}platform/common/sysmgr/menu/edit.jsp"},

		{id:2, pId:0, name:"内容管理", open:false},
		{id:201, pId:2, name:"栏目管理", murl:"http://www.baidu.com"},
		{id:206, pId:2, name:"信息管理", murl:"http://www.baidu.com"},
		{id:207, pId:206, name:"信息发布", murl:"http://www.baidu.com"},
		{id:208, pId:206, name:"信息审核", murl:"http://www.baidu.com"}
	];
	
	function iframeLoadReady() {
		var bodyH = demoIframe.contents().find("body").get(0).scrollHeight,
		htmlH = demoIframe.contents().find("html").get(0).scrollHeight,
		maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
		h = demoIframe.height() >= maxH ? minH:maxH ;
		if (h < 530) h = 530;
		demoIframe.height(h);
	}
	
	$(document).ready(function(){
		var t = $("#tree");
		t = $.fn.zTree.init(t, setting, zNodes);
		editIframe = $("#editIframe");
		editIframe.bind("load", loadReady);
		var zTree = $.fn.zTree.getZTreeObj("tree");
		zTree.selectNode(zTree.getNodeByParam("id", 101));

	});
//-->
</script>

</head>
<body>
<table align="left" style="width:100%;height:100%;border:0px;">
	<tr>
		<td align="left" valign="top" style="width:260px;BORDER-RIGHT: #999999 1px dashed;">
			<ul id="tree" class="ztree" style="width:260px; overflow:auto;"></ul>
		</td>
		<td align="left" valign="top">
			<iframe id="editIframe" name="editIframe" src="" frameborder="0" scrolling="auto" width=100% height=100% ></iframe>
		</td>
	</tr>
</table>
</body>
</html>