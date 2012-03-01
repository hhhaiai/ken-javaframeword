<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.shine.platform.context.ConfigFactory"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title><%=ConfigFactory.getFactory().getAppName()%></title>
<meta http-equiv="refresh" content="0;url=<%=ConfigFactory.getFactory().getIndexPage()%>" />
</head>

<body>
</body>
</html>
