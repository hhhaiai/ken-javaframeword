<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%@include file="/common/path.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>${name}</title>
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

	<body class="easyui-layout">
		<div data-options="region:'north',border:true"
			style="height: 80px; background: #e0edfe; padding: 10px">
			<jsp:include page="/common/head.jsp"></jsp:include>
		</div>
		<div class="easyui-tabs" data-options="region:'center'"
			style="margin: 0 auto; height: auto">
			<div title="首页" style="padding: 10px; border: false">
			</div>
		</div>

	</body>
</html>