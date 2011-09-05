<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>应用流量配置</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />	
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script>
rl.importJs("nf:listPage");
rl.importCss("nf:form");

// 编辑
function editHref(cellText, colIndex, rowIndex, dataSource){
	return '<a href="${rootPath}appTrafficConfig_edit?appId='+cellText+'"><img src="${imagePath}icons/edit.gif" border="0"/></a>';
} 

nf.createListPage({
	toolbar : {
		items : [
			{
				text : "增加", 
				icon : "${imagePath}icons/add.gif",
				action : function(){
					location.href="${rootPath}appTrafficConfig_add";
				}
			},
			{
				text : "删除",
				icon : "${imagePath}icons/remove.gif",
				action : function(){
					var grid = nf.listPageGrid;
					var len = grid.getSelectedRows().length;
					if(!len){
						alert("请选择要删除的应用程序!");
						return;
					}
					if(len && confirm("确认删除这" + len + "条应用程序吗？"))
					grid.sendSelected("${rootPath}appTrafficConfig_delete");
				}
			},
			
			nf.clearSearchBtnOptions
		]
	},
	
	grid :{
		dataUrl : "${rootPath}appTrafficConfig_getJsonList",
		dataFields : ["id","app_alias","app_id","ip_port","ip_address", "protocol_name"],
		dataPrimaryKey : "app_id",
		columns : [
			{ctype : "RowSelector", multiple:true, selectorName : "appIds"},
			{caption: "应用程序名", width : 150, name: 'app_alias'},
			{caption: "服务器IP地址", width : 200, name: 'ip_address'},
	        {caption: "端口号", width : 100, name: 'ip_port'}, 
			{caption: "编辑", width: "30", name: 'app_id', convert : editHref} 
		]
	}
});
</script>
</head>
<body>
</body>
</html>