<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="platform" uri="/platform"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>企业邮件处理系统</title>
</head>

<frameset rows="83,*" cols="*" framespacing="0" frameborder="no" border="0">
  <frame src="top.html" name="topFrame" scrolling="No" noresize="noresize" id="topFrame" />
  <frame src="center.html" name="mainFrame" id="mainFrame" />
</frameset>
<noframes><body>
</body>
</noframes></html>

