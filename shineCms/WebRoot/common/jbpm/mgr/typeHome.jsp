<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>流程分类</title>	
<link title="${themes}" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link type="text/css" rel="stylesheet" href="${path}r/ztree/css/zTreeStyle.css">
<link type="text/css" rel="stylesheet" href="${path}r/css/base.css"/>
<link title="${themes}" rel="stylesheet" href="${path}r/css/themes/${themes}/style.css">
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/om-menu.js"></script>
<script type="text/javascript" src="${path}r/ztree/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<script type="text/javascript">
<!--
	var zTree,funcIframe,bodyHeight,rMenu;
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
				var typeId = treeNode.id;
				if(typeId>0){
					var url = "${path}jbpm/def_enter.do?typeId="+typeId;
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
			//如果右击的是顶层类型则禁用编辑和删除菜单，否则开启
			if(treeNode.id==0){
				 rMenu.omMenu('disableItem','2');
				 rMenu.omMenu('disableItem','3');
			}else{
				 rMenu.omMenu('enableItem','2');
				 rMenu.omMenu('enableItem','3');
			}
			zTree.selectNode(treeNode);
			rMenu.omMenu('show',event.target);
		}
	}

	var zNodes =[
		{id:0, pid:-1, name:"流程分类", open:true}
		<c:forEach var="t" items="${list}">
			,{id:${t.id},pid:${t.pid},name:"${t.typeName}",open:true}
		</c:forEach>
	];
	
	var editDialog;	//编辑框
	//增加子分类
	function toAdd(){
		var selNode = zTree.getSelectedNodes()[0];
		if (selNode) {
			var id = selNode.id;
			editDialog = $.shine.openDialog({id:"editDialog", title:"增加子分类", url:"${path}jbpm/type_toAdd.do?e.pid="+id, width:500, height:200});
		}
	}
	//修改分类
	function toEdit(){
		var selNode = zTree.getSelectedNodes()[0];
		if (selNode) {
			var id = selNode.id;
			editDialog = $.shine.openDialog({id:"editDialog", title:"修改分类", url:"${path}jbpm/type_toEdit.do?e.id="+id, width:500, height:200});
		}
	}
	//删除分类
	function toDelete(){
		var selNode = zTree.getSelectedNodes()[0];
		if (selNode) {
			var id = selNode.id;
			if(confirm("删除后将不能恢复，确认删除？")){
				$.post('${path}jbpm/type_delete.do','id='+id,function(data){
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
		var tnode = zTree.getNodeByParam("id",obj["e.id"],null);
		if(tnode!=null){
			tnode.name=obj["e.typeName"];
			zTree.updateNode(tnode);
		}else{
			var newNode = {id:obj["e.id"],pid:obj["e.pid"],name:obj["e.typeName"]};
			var pnode = zTree.getNodeByParam("id",obj["e.pid"]);
			zTree.addNodes(pnode, newNode);
		}
	}
	
	//加载右键菜单
	function initRightMenu(){
		rMenu = $('#rightMenu').omMenu({
        	minWidth : 150,
        	maxWidth : 200,
        	dataSource : [
        		{id:'1',label:'增加子类型',handle:'toAdd()',icon:'${path}r/css/themes/${themes}/image/icon/add.gif'},
            	{id:'2',label:'修改',handle:'toEdit()',icon:'${path}r/css/themes/${themes}/image/icon/modify.gif'},
            	{id:'3',label:'删除',handle:'toDelete()',icon:'${path}r/css/themes/${themes}/image/icon/delete.gif'}
            ],
        	onSelect:function(item,event){
				if(item.handle)
					eval(item.handle);
	        }
		});
	}
	
	function initLayout(){
		$('#body-panel').omBorderLayout({
			fit : true,
			panels:[{
	   	        id:"west-panel",
	   	        resizable:true,
	   	        collapsible:true,
	   	        title:"流程分类",
	   	        region:"west",
	   	        width:260
	   	    },{
	   	        id:"center-panel",
	   	        title : "流程定义",
	   	     	header:true,
	   	        region:"center"
	   	    }]
		});
	}
	
	$(document).ready(function(){
		initLayout();
		//初始化Tree
		zTree = $.fn.zTree.init($("#tree"), setting, zNodes);
		
		//初始化右键菜单
		initRightMenu();
		
		funcIframe = $("#funcIframe");
		
		bodyHeight = window.parent.centerHeight;
	});
//-->
</script>
</head>
<body>
<div id="body-panel" style="width:100%;height:100%;">
	<div id="west-panel">
		<ul id="tree" class="ztree" style="width:95%;overflow:auto;"></ul>
	</div>
	<div id="center-panel">
		<iframe id="funcIframe" name="funcIframe" src="about:blank" frameborder="0" scrolling="auto" width="100%" height="100%"></iframe>
	</div>
</div>
<div id="rightMenu"></div>
</body>
</html>