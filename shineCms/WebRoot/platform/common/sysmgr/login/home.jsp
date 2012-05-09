<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>Sunshine CMS</title>	
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="default" rel="stylesheet" href="${path}r/css/themes/${themes}/all.css"/>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/themes/${themes}/om-all.css"/>
</head>

<FRAMESET border="0" frameSpacing="0" rows="60, *" frameBorder="0">
	<FRAME name="header" src="${path}platform/common/sysmgr/login/head.jsp" frameBorder="0" noResize scrolling="no" />
	<FRAMESET cols="170, *">
		<FRAME name=menu src="${path}platform/common/sysmgr/login/menu.jsp" frameBorder="0" noResize />
		<FRAME name=main src="${path}platform/common/sysmgr/login/main.jsp" frameBorder="0" noResize scrolling="yes" />
	</FRAMESET>
</FRAMESET>
<noframes>
</noframes>
</html>