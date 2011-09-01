<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>IP分组配置</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />	
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script>
rl.importJs("nf:listPage");
rl.importCss("nf:form");

// 编辑
function editHref(cellText, colIndex, rowIndex, dataSource){
	return '<a href="${rootPath}ipGroupTrafficConfig_edit?groupId='+cellText+'"><img src="${imagePath}icons/edit.gif" border="0"/></a>';
} 

nf.createListPage({
	toolbar : {
		items : [
			{
				text : "增加", 
				icon : "${imagePath}icons/add.gif",
				action : function(){
					location.href="${rootPath}ipGroupTrafficConfig_add";
				}
			},
			{
				text : "删除",
				icon : "${imagePath}icons/remove.gif",
				action : function(){
					var grid = nf.listPageGrid;
					var len = grid.getSelectedRows().length;
					if(!len){
						alert("请选择要删除的IP分组!");
						return;
					}
					if(len && confirm("确认删除这" + len + "条IP分组吗？"))
					grid.sendSelected("${rootPath}ipGroupTrafficConfig_delete");
				}
			},
			
			nf.clearSearchBtnOptions
		]
	},
	
	grid :{
		dataUrl : "${rootPath}ipGroupTrafficConfig_getJsonList",
		dataFields : ["id","ip_alias","group_id","ip_start_address","ip_end_address"],
		dataPrimaryKey : "group_id",
		columns : [
			{ctype : "RowSelector", multiple:true, selectorName : "ipGroups"},
			{caption: "IP分组名", width : 100, name: 'ip_alias'},
	        {caption: "开始IP", width : 100, name: 'ip_start_address'}, 
	        {caption: "结束IP", width : 100, name: 'ip_end_address'},
			{caption: "编辑", width: "30", name: 'group_id', convert : editHref} 
		]
	}
});
</script>
</head>
<body>
</body>
</html>