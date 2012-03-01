<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="platform" uri="/platform"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>${platform:getIndexName()}</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

	</head>

	<body>
		<form action="${pageContext.request.contextPath}/platform.do?login"
			method="post">
			ID:
			<input type="text" name="id" id="id">
			<br>
			密码 :
			<input type="password" name="userPassword" id="userPassword">
			<br>
			<input type="submit" value="Login">
		</form>
		<br>
	</body>
</html>
