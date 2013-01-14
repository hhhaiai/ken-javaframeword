<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>${appName}</title>	
<link type="text/css" rel="stylesheet" href="${path}r/css/base.css"/>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link type="text/css" rel="stylesheet" href="${path}r/ztree/css/zTreeStyle.css">
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/ztree/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript">
<!--
	var zTree,editIframe;
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
				var zTree = $.fn.zTree.getZTreeObj("tree");
				if (treeNode.isParent) {
					zTree.expandNode(treeNode);
					return false;
				} else {
					//editIframe.attr("src",treeNode.murl);
					return true;
				}
			},
			onRightClick: OnRightClick
		}
	};
	
	function OnRightClick(event, treeId, treeNode) {
		if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
			zTree.cancelSelectedNode();
		} else if (treeNode) {
			zTree.selectNode(treeNode);
			$('#rightMenu').omMenu('show',event.target);
		}
	}

	var zNodes =[
		{id:0, pid:-1, name:"菜单导航", open:true}
		<c:forEach var="m" items="${list}">
			,{id:${m.menuId},pid:${m.pid},name:"${m.menuName}",open:true}
		</c:forEach>
	];
	
	//增加子菜单
	function toAdd(){
		if (zTree.getSelectedNodes()[0]) {
			var pid = zTree.getSelectedNodes()[0].id;
			$("#dialog-modal").omDialog({title:'增加子菜单'});
			$("#dialog-modal").omDialog('open');
			var frame = $("#dialog-modal iframe")[0];
			frame.src = "${path}sysmgr/menu_toAdd.do?e.pid="+pid;
			/*
			var newNode = { name:"增加"};
			zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
			*/
		}
	}
	
	function addSuccess(){
		alert("dfdf");
	}
	
	//加载右键菜单
	function initRightMenu(){
		$('#rightMenu').omMenu({
        	minWidth : 150,
        	maxWidth : 200,
        	dataSource : [
        		{id:'1',label:'增加子菜单',handle:'toAdd()',icon:'${path}r/css/themes/${themes}/image/icon/add.gif'},
            	{id:'2',label:'编辑',handle:'toEdit()',icon:'${path}r/css/themes/${themes}/image/icon/modify.gif'},
            	{id:'3',label:'删除',handle:'toDelete()',icon:'${path}r/css/themes/${themes}/image/icon/delete.gif'}
            ],
        	onSelect:function(item,event){
				if(item.handle)
					eval(item.handle);
	        }
		});
	}
	
	//右边Iframe加载时调整高度
	function iframeLoadReady() {
		var bodyH = editIframe.contents().find("body").get(0).scrollHeight,
		htmlH = editIframe.contents().find("html").get(0).scrollHeight,
		maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
		h = editIframe.height() >= maxH ? minH:maxH ;
		if (h < 530) h = 530;
		editIframe.height(h);
	}
	
	$(document).ready(function(){
		var t = $("#tree");
		t = $.fn.zTree.init(t, setting, zNodes);
		zTree = $.fn.zTree.getZTreeObj("tree");
		zTree.selectNode(zTree.getNodeByParam("id", 101));
		
		//加载右键菜单
		initRightMenu();
		
		$( "#dialog-modal").omDialog({
            autoOpen: false,
            width:400,
            height:260,
            modal: true
        });
		
		editIframe = $("#editIframe");
		editIframe.bind("load", iframeLoadReady);
	});
//-->
</script>
</head>
<body>
<table align="left" height="100%" style="width:100%;height:100%;border:0px;">
	<tr>
		<td align="left" valign="top" style="width:260px;BORDER-RIGHT: #999999 1px dashed;height:100%;">
			<ul id="tree" class="ztree" style="width:260px; overflow:auto;"></ul>
		</td>
		<td align="left" valign="top">
			<iframe id="editIframe" name="editIframe" src="" frameborder="0" scrolling="auto" width="100%" height="100%"></iframe>
		</td>
	</tr>
</table>

<div id="rightMenu"></div>
<div id="dialog-modal">
	<iframe frameborder="0" style="width:100%;height:99%;height:100%\9;" src="about:blank"></iframe>
</div>
</body>
</html>