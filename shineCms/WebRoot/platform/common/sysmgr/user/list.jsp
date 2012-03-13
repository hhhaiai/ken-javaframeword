<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>用户管理</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<link rel="stylesheet" href="${path}r/operamasks-ui/css/default/om-default.css">
<style type="text/css">
.toolbar {
    background: url("${path}r/blue/image/btn/toolbar_bg.jpg") repeat-x scroll 0 0 #99B5DD;
    border: 1px solid #808FB8;
    height: 24px;
    line-height: 24px;
    padding-left: 10px;
    padding-top: 1px;
    padding-bottom: 3px;
    font-size: 12px;
}
.mar {
    margin-top: 10px;
}
</style>
<script type="text/javascript">
$(document).ready(function() {
	$('#btn_add').omButton({
		icons : {left : '${path}r/blue/image/btn/add.gif'}
	});
	$('#btn_modify').omButton({
		icons : {left : '${path}r/blue/image/btn/modify.gif'}
	});
	$('#btn_delete').omButton({
		icons : {left : '${path}r/blue/image/btn/delete.gif'}
	});
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
<div class="toolbar mar">
     <a href="javascript:void(0);" id="btn_add">添加</a>
     <a href="javascript:void(0);" id="btn_modify">修改</a>
     <a href="javascript:void(0);" id="btn_delete">删除</a>
</div>
<table id="grid"></table>
</body>
</html>