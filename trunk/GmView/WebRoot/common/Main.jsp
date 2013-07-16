<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%@include file="/common/path.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>主页</title>
		<link rel="stylesheet" type="text/css"
			href="<%=rootPath%>resource/themes/default/easyui.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=rootPath%>resource/themes/icon.css" />
		<script type="text/javascript"
			src="<%=rootPath%>resource/js/jquery.min.js">
</script>
		<script type="text/javascript"
			src="<%=rootPath%>resource/js/jquery.easyui.min.js">
</script>
	</head>

	<body>
		<body class="easyui-layout">
			<div data-options="region:'north',border:false"
				style="height: 60px; background: #B3DFDA; padding: 10px">
				<jsp:include page="/common/head.jsp"></jsp:include>
			</div>
			<div data-options="region:'west',split:true,title:'West'"
				style="width: 150px; padding: 10px;">
				tree
			</div>
			<div
				data-options="region:'right',split:true,collapsed:true,title:'right'"
				style="width: 100px; padding: 10px;">
				right
			</div>
			<div data-options="region:'south',border:false"
				style="height: 50px; background: #A9FACD; padding: 10px;">
				foot
			</div>
			<div data-options="region:'center',title:'Center'">
				center
			</div>
		</body>
	</body>
</html>