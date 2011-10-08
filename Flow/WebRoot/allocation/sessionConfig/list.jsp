<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>会话流量配置</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />	
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script>
rl.importJs("nf:listPage");
rl.importCss("nf:form");

// 编辑
function editHref(cellText, colIndex, rowIndex, dataSource){
	return '<a href="${rootPath}sessionTrafficConfig_edit?sessionId='+cellText+'"><img src="${imagePath}icons/edit.gif" border="0"/></a>';
} 

nf.createListPage({
	toolbar : {
		items : [
			{
				text : "增加", 
				icon : "${imagePath}icons/add.gif",
				action : function(){
					location.href="${rootPath}sessionTrafficConfig_add";
				}
			},
			{
				text : "删除",
				icon : "${imagePath}icons/remove.gif",
				action : function(){
					var grid = nf.listPageGrid;
					var len = grid.getSelectedRows().length;
					if(!len){
						alert("请选择要删除的会话通道!");
						return;
					}
					if(len && confirm("确认删除这" + len + "条会话通道吗？"))
					grid.sendSelected("${rootPath}sessionTrafficConfig_delete");
				}
			},
			
			nf.clearSearchBtnOptions
		]
	},
	
	grid :{
		dataUrl : "${rootPath}sessionTrafficConfig_getJsonList",
		dataFields : ["id","session_alias","session_id","first_ip","second_ip"],
		dataPrimaryKey : "session_id",
		columns : [
			{ctype : "RowSelector", multiple:true, selectorName : "sessions"},
			{caption: "会话通道名称", width : 100, name: 'session_alias'},
	        {caption: "第一个IP", width : 100, name: 'first_ip'}, 
			{caption: "第二个IP", width : 100, name: 'second_ip'}, 
			{caption: "编辑", width: "30", name: 'session_id', convert : editHref} 
		]
	}
});
</script>
</head>
<body>
</body>
</html>