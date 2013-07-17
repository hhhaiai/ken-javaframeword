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

	<body>
		<div data-options="region:'north',border:true"
			style="height: 60px; background: #e0edfe; padding: 10px">
			<jsp:include page="/common/head.jsp"></jsp:include>
		</div>
		<div class="easyui-tabs" data-options="region:'center'"
			style="margin: 0 auto; height: auto">
			<div title="首页" style="padding: 10px">
				<p style="font-size: 14px">
					jQuery EasyUI framework help you build your web page easily.
				</p>
				<ul>
					<li>
						easyui is a collection of user-interface plugin based on jQuery.
					</li>
					<li>
						easyui provides essential functionality for building modem,
						interactive, javascript applications.
					</li>
					<li>
						using easyui you don't need to write many javascript code, you
						usually defines user-interface by writing some HTML markup.
					</li>
					<li>
						complete framework for HTML5 web page.
					</li>
					<li>
						easyui save your time and scales while developing your products.
					</li>
					<li>
						easyui is very easy but powerful.
					</li>
				</ul>
			</div>
		</div>

	</body>
</html>