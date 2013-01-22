<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>${appName}</title>	
<link title="${themes}" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link type="text/css" rel="stylesheet" href="${path}r/ztree/css/zTreeStyle.css">
<link type="text/css" rel="stylesheet" href="${path}r/css/base.css"/>
<link title="${themes}" rel="stylesheet" href="${path}r/css/themes/${themes}/style.css">
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/ztree/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<script type="text/javascript">
<!--
	var zTree,funcIframe,bodyHeight;
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
				var menuId = treeNode.id;
				if(menuId>0){
					var url = "${path}sysmgr/fun_enter.do?menuId="+menuId;
					funcIframe.attr("src",url);
					return true;
				}
				return false;
			},
			onRightClick: OnRightClick
		}
	};
	
	//右击菜单
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
			,{id:${m.menuId},pid:${m.pid},name:"${m.orderId}-${m.menuName}",open:true}
		</c:forEach>
	];
	
	var editDialog;	//编辑框
	//增加子菜单
	function toAdd(){
		var selNode = zTree.getSelectedNodes()[0];
		if (selNode) {
			var id = selNode.id;
			editDialog = $.shine.openDialog({name:"editDialog", title:"增加子菜单", url:"${path}sysmgr/menu_toAdd.do?e.pid="+id, width:500, height:350});
		}
	}
	//编辑菜单
	function toEdit(){
		var selNode = zTree.getSelectedNodes()[0];
		if (selNode) {
			var id = selNode.id;
			editDialog = $.shine.openDialog({name:"editDialog", title:"编辑菜单", url:"${path}sysmgr/menu_toEdit.do?e.menuId="+id, width:500, height:350});
		}
	}
	//删除菜单
	function toDelete(){
		var selNode = zTree.getSelectedNodes()[0];
		if (selNode) {
			var id = selNode.id;
			if(confirm("删除后将不能恢复，确认删除？")){
				$.post('${path}sysmgr/menu_delete.do','id='+id,function(data){
	                $.shine.showAjaxMsg(data,function(){
	                	zTree.removeNode(selNode);
	                });
	            });
			}
		}
	}
	//关闭编辑框
	function closeEditDialog(){
		if(editDialog.omDialog('isOpen')){
			editDialog.omDialog('close');
		}
	}
	//保存菜单成功后调用
	function saveSuccess(obj){
		closeEditDialog();
		var tnode = zTree.getNodeByParam("id",obj["e.menuId"],null);
		if(tnode!=null){
			tnode.name=obj["e.orderId"]+"-"+obj["e.menuName"];
			zTree.updateNode(tnode);
		}else{
			var newNode = {id:obj["e.menuId"],pid:obj["e.pid"],name:obj["e.orderId"]+"-"+obj["e.menuName"]};
			var pnode = zTree.getNodeByParam("id",obj["e.pid"]);
			zTree.addNodes(pnode, newNode);
		}
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
	
	$(document).ready(function(){
		//初始化Tree
		zTree = $.fn.zTree.init($("#tree"), setting, zNodes);
		
		//初始化右键菜单
		initRightMenu();
		
		funcIframe = $("#funcIframe");
		//funcIframe.bind("load", iframeLoadReady);
		
		bodyHeight = window.parent.centerHeight-4;
		$("body").height(bodyHeight);
		$("#funcIframe").height(bodyHeight);
	});
//-->
</script>
</head>
<body style="height: 100%;">
<table align="left" style="width:100%;height:100%;border:0px;">
	<tr>
		<td align="left" valign="top" style="width:260px;height:100%;border-right: #999999 1px dashed;">
			<div style="width:260px;padding: 5px 0px 3px 2px;color:gray;border-bottom: #999999 1px dashed;">左击管理功能权限,右击显示操作菜单</div>
			<ul id="tree" class="ztree" style="width:260px;overflow:auto;"></ul>
		</td>
		<td align="left" valign="top">
			<iframe id="funcIframe" name="funcIframe" src="" frameborder="0" scrolling="auto" width="100%" height="100%"></iframe>
		</td>
	</tr>
</table>

<div id="rightMenu"></div>
</body>
</html>