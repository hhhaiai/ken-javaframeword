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
<script type="text/javascript">
$(document).ready(function() {
    $('#grid').omGrid({
        dataSource : '${path}sysmgr/user_listJSON.do',
        colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center'}, 
                     {header : '地区', name : 'city', width : 120, align : 'left'}, 
                     {header : '地址', name : 'address', align : 'left', width : 'autoExpand'} ]
    });
});
</script>
</head>

<body>
<table id="grid"></table>
</body>
</html>