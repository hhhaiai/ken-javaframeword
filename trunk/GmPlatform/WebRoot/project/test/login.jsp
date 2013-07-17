<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>${name}</title>
	</head>

	<body>
		<s:form action="login_login">
			<s:textfield name="userName" label="用户名" key="user"></s:textfield>
			<s:password name="passWord" label="密码" key="password"></s:password>
			<s:submit key="login" value="提交"></s:submit>
		</s:form>
		<a 	href="/GmView/common/Main.jsp">test</a>
	</body>
</html>