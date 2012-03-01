<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>插件管理</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
		<link rel="stylesheet" type="text/css"
			href="../../resource/css/default/om-default.css" />

		<script type="text/javascript" src="../../resource/js/jquery.min.js" />
<script type="text/javascript"
			src="../../resource/js/operamasks-ui.min.js" />
			
		<script type="text/javascript">
$(document).ready(function() {
	$('#grid').omGrid( {
		dataSource : 'griddata.do?method=fast',
		colModel : [ {
			header : 'ID',
			name : 'id',
			width : 100,
			align : 'center'
		}, {
			header : '地区',
			name : 'city',
			width : 120,
			align : 'left'
		}, {
			header : '地址',
			name : 'address',
			align : 'left',
			width : 'autoExpand'
		} ]
	});
});
</script>

	</head>

	<body>
		<table id="grid"></table>
	</body>
</html>
