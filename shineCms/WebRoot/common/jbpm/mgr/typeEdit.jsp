<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>${param.method eq 'add'?'新增流程分类':'编辑流程分类'}</title>
<link title="${themes}" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="${themes}" rel="stylesheet" href="${path}r/css/themes/${themes}/style.css"/>
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<script type="text/javascript">
var validator;
//提交表单
function submitForm(){
	if(!validator.form())
		return;
	var url = "${path}jbpm/type_${param.method eq 'add'?'save':'update'}.do";
	var formData = $("#editForm").serialize();
    $.post(url,formData,function(data){
    	$.shine.showAjaxMsg(data,function(){
    		<c:if test="${param.method eq 'add'}">
	    		var rs = eval("("+data+")");
	    		$("#typeId").val(rs.datas.typeid);
    		</c:if>
    		window.parent.saveSuccess($("#editForm").serializeJson());
    	});
    });
}
//点击取消按钮,关闭对话框
function cancel(){
	window.parent.closeEditDialog();
}
$(document).ready(function() {
	 // 对表单进行校验
    validator = $('#editForm').validate({
        rules : {
            'e.typeName' : {
    			required : true,
    			maxlength : 50
    		}
        }
    });
	$("#box").box();
});
</script>
</head>

<body>
<div id="box">
	<form id="editForm" method="post">
		<input type="hidden" id="typeId" name="e.typeId" value="${e.typeId}"/>
		<input type="hidden" name="e.pid" value="${e.pid}"/>
		<table class="simple_table" style="width:100%;">
			<tr>
				<td class="label">上层菜单：</td>
				<td>${tname}</td>
			</tr>
			<tr>
				<td class="label"><span class="red">*</span> 名称：</td>
				<td><input class="input" type="text" name="e.typeName" value="${e.typeName}"/></td>
			</tr>
			<tr>
				<td align="center" colspan="2">
					<input type="button" value="提 交" onclick="submitForm();" />
					<input type="button" value="取 消" onclick="cancel();" />
				</td>
			</tr>
		</table>
	</form>
</div>
</body>
</html>