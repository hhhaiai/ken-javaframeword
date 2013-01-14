<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>${param.method eq 'add'?'增加菜单':'编辑菜单'}</title>
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link rel="stylesheet" href="${path}r/css/themes/${themes}/style.css"/>
<script type="text/javascript">
function submitForm(){
	var url = "${path}sysmgr/menu_save.do";
	var formData = $("#editForm").serialize();
    $.post(url,formData,function(data){
    	shine.showAjaxMsg(data,function(){
    		
    	});
    });
}
$(document).ready(function() {
	
});
</script>
</head>

<body>
<form id="editForm" method="post">
	<table>
		<tr>
			<td width="100" align="right" style="padding: 3px;">名称：</td>
			<td><input type="text" name="e.menuName" value="${e.menuName}"/></td>
		</tr>
		<tr>
			<td>ID</td>
			<td><input type="text" name="e.menuId" value="${e.menuId}"/></td>
		</tr>
		<tr>
			<td>PID</td>
			<td><input type="text" name="e.pid" value="${e.pid}"/></td>
		</tr>
		<tr>
			<td>URL</td>
			<td><input type="text" name="e.murl" value="${e.murl}"/></td>
		</tr>
		<tr>
			<td>Icon</td>
			<td><input type="text" name="e.icon" value="${e.icon}"/></td>
		</tr>
		<tr>
			<td>remark</td>
			<td><input type="text" name="e.remark" value="${e.remark}"/></td>
		</tr>
		<tr>
			<td>enable</td>
			<td><input type="text" name="e.enable" value="${e.enable}"/></td>
		</tr>
		<tr>
			<td>orderId</td>
			<td><input type="text" name="e.orderId" value="${e.orderId}"/></td>
		</tr>
		<tr>
			<td colspan="2">
				<input type="button" value="提交" onclick="submitForm();" />
			</td>
		</tr>
	</table>
</form>
</body>
</html>