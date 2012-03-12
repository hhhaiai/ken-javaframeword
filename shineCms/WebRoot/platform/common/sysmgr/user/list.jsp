<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>用户管理</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/demo/data.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/demo/demo.js"></script>
<link rel="stylesheet" href="${path}r/operamasks-ui/css/default/om-default.css">
<%--
<style type="text/css">
#toolbar {padding: 6px 4px;}
#toolbar .om-btn {border:none;}
#toolbar *  {background-color: transparent;background-image: none}
#toolbar .om-state-hover .om-btn-bg {background: url(images/button-hover-bg.png);}
#toolbar .om-state-focus .om-btn-bg {background: url(images/button-focus-bg.png);}
#toolbar .om-state-active .om-btn-bg {background: url(images/button-mousedown-bg.png);}
#toolbar .om-btn .om-btn-left {background-position: 100% 0px;background-repeat: no-repeat;}
#toolbar .om-btn .om-btn-center {background-position: 100% -24px;background-repeat: repeat-x;}
#toolbar .om-btn .om-btn-right {background-position: 100% -48px;background-repeat: no-repeat;}
span.om-widget-header { background: url("images/header_bg.png") repeat-x scroll 0 0 transparent; color: #23466D; font-weight: bold;}
</style>
 --%>
<script type="text/javascript">
$(document).ready(function() {
    $('#grid').omGrid({
        dataSource : '${path}sysmgr/user_listJSON.do',
        colModel : [ {header : 'ID', name : 'userId', width : 100, align : 'center'}, 
                     {header : '用户名', name : 'username', width : 120, align : 'left'}, 
                     {header : '姓名', name : 'name', align : 'left', width : 'autoExpand'} ]
    });
});
</script>
</head>

<body>
<span id="toolbar" class="om-widget-header om-corner-all">
	<a id="simpleButton" href="javascript:void(0)">金蝶中间件</a>
	<a id="button-width"  href="javascript:void(0)"></a>
	<a id="button-disabled1"  href="javascript:void(0)">被disabled的按钮</a>
	<a id="button-icons" href="javascript:void(0)">有左icon的按钮</a>
</span>
<table id="grid"></table>
</body>
</html>