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

		<script type="text/javascript" src="../../resource/js/jquery.min.js"></script>
        <script type="text/javascript"
			         src="../../resource/js/operamasks-ui.min.js" ></script>
		<script type="text/javascript">
		var data=[{"total":126, "rows":
    [
        {"address":"CZ88.NET ","city":"IANA保留地址","id":"1"},
        {"address":"CZ88.NET ","city":"澳大利亚","id":"2"},
        {"address":"电信","city":"福建省","id":"3"},
        {"address":"CZ88.NET ","city":"澳大利亚","id":"4"},
        {"address":"CZ88.NET ","city":"泰国","id":"5"},
        {"address":"CZ88.NET ","city":"日本","id":"6"},
        {"address":"电信","city":"广东省","id":"7"},
        {"address":"CZ88.NET ","city":"日本","id":"8"}
    ]
}];
		
$(document).ready(function() {
	$('#grid').omGrid( {
		dataSource : data,
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
