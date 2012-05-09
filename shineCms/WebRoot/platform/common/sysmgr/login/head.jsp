<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>Head</title>
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link rel="stylesheet" href="${path}r/css/themes/${themes}/frame.css"/>
</head>

<body>
<TABLE cellSpacing="0" cellPadding="0" width="100%"
	background="${path}r/css/themes/${themes}/image/frame/header_bg.jpg" border="0">
	<TR height="56">
		<TD width="260" valign="top">
			<IMG height=56 src="${path}r/css/themes/${themes}/image/frame/header_left.jpg" width="260">
		</TD>
		<TD style="FONT-WEIGHT: bold; COLOR: #fff; PADDING-TOP: 20px" align="middle">
			当前用户：admin &nbsp;&nbsp;
			<A style="COLOR: #fff" href="" target=main>修改口令</A> &nbsp;&nbsp;
			<A style="COLOR: #fff"
				onclick="if (confirm('确定要退出吗？')) return true; else return false;" 
				href="" target="_top">退出系统</A>
		</TD>
		<TD align="right" width="268" valign="top">
			<IMG height=56 src="${path}r/css/themes/${themes}/image/frame/header_right.jpg" width="268">
		</TD>
	</TR>
</TABLE>
<TABLE cellSpacing="0" cellPadding="0" width="100%" border="0">
	<TR bgColor="#1c5db6" height="4">
		<TD></TD>
	</TR>
</TABLE>
</body>
</html>