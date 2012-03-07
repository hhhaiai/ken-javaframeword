<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Sunshine CMS</title>	
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<%-- 
<script type="text/javascript" src="${path}r/operamasks-ui/demo/data.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/demo/demo.js"></script>
<link rel="stylesheet" href="${path}r/operamasks-ui/css/default/om-default.css">
--%>
<link rel="stylesheet" href="${path}r/blue/css/admin.css">
</head>

<FRAMESET border=0 frameSpacing=0 rows="60, *" frameBorder=0>
	<FRAME name=header src="${path}platform/common/sysmgr/login/head.jsp" frameBorder=0 noResize scrolling=no>
	<FRAMESET cols="170, *">
		<FRAME name=menu src="${path}platform/common/sysmgr/login/menu.jsp" frameBorder=0 noResize>
		<FRAME name=main src="${path}platform/common/sysmgr/login/main.jsp" frameBorder=0 noResize scrolling=yes>
	</FRAMESET>
</FRAMESET>
<noframes>
</noframes>
</html>