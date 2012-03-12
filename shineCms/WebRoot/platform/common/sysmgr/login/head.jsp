<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Head</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<link rel="stylesheet" href="${path}r/blue/css/home.css">
</head>

<body>
<TABLE cellSpacing=0 cellPadding=0 width="100%"
	background="${path}r/blue/image/home/header_bg.jpg" border=0>
	<TR height=56>
		<TD width=260>
			<IMG height=56 src="${path}r/blue/image/home/header_left.jpg" width=260>
		</TD>
		<TD style="FONT-WEIGHT: bold; COLOR: #fff; PADDING-TOP: 20px"
			align=middle>
			当前用户：admin &nbsp;&nbsp;
			<A style="COLOR: #fff" href="" target=main>修改口令</A> &nbsp;&nbsp;
			<A style="COLOR: #fff"
				onclick="if (confirm('确定要退出吗？')) return true; else return false;"
				href="" target=_top>退出系统</A>
		</TD>
		<TD align=right width=268>
			<IMG height=56 src="${path}r/blue/image/home/header_right.jpg" width=268>
		</TD>
	</TR>
</TABLE>
<TABLE cellSpacing=0 cellPadding=0 width="100%" border=0>
	<TR bgColor=#1c5db6 height=4>
		<TD></TD>
	</TR>
</TABLE>
</body>
</html>