<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>${param.method eq 'add'?'新增角色':'编辑角色'}</title>
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
	
	var url = "${path}sysmgr/user_${param.method eq 'add'?'save':'update'}.do";
	var formData = $("#editForm").serialize();
    $.post(url,formData,function(data){
    	$.shine.showAjaxMsg(data,function(){
    		window.parent.saveSuccess();
    	});
    });
}
//点击取消按钮,关闭对话框
function cancel(){
	window.parent.closeEditDialog();
}
$(document).ready(function() {
	$('#roles').omCombo({
		width : "150px",
    	dataSource : [ 
    		{text : '中国', value : 'China/PRC'}, 
            {text : '美国', value : 'America/USA'}, 
            {text : '英国', value : 'the United Kingdom/UK'}, 
            {text : '日本', value : 'Japan/JPN'} 
    	]
	});
	 
	
	// 对表单进行校验
    validator = $('#editForm').validate({
        rules : {
            'e.username' : {
    			required : true,
    			maxlength : 50
    		},
            'e.name' : {
    			required : true,
    			maxlength : 50
    		}, 
            'e.password' : {
    			required : true,
    			maxlength : 20
    		},
    		'confirmPassword' : {
    			required : true,
    			equalTo : "#password"
    		}
        }
    });
});
</script>
</head>

<body>
<div class="box1">
	<div class="box1_topcenter">
		<div class="box1_topleft">
			<div class="box1_topright"></div>
		</div>
	</div>
	<div class="box1_middlecenter">
		<div class="box1_middleleft">
			<div class="box1_middleright">
				<div class="boxContent" style="overflow: visible;">
					<form id="editForm" method="post">
						<input type="hidden" name="e.roleId" value="${e.userId}"/>
						<table class="simple_table" style="width:100%;">
							<tr>
								<td class="label">用户名<span class="red">*</span>：</td>
								<td><input class="input" type="text" name="e.username" value="${e.username}"/></td>
							</tr>
							<tr>
								<td class="label">姓名<span class="red">*</span>：</td>
								<td><input class="input" type="text" name="e.name" value="${e.name}"/></td>
							</tr>
							<tr>
								<td class="label">密码<span class="red">*</span>：</td>
								<td><input class="input" type="password" id="password" name="e.password" value=""/></td>
							</tr>
							<tr>
								<td class="label">确认密码<span class="red">*</span>：</td>
								<td><input class="input" type="password" name="confirmPassword" value=""/></td>
							</tr>
							<tr>
								<td class="label">角色<span class="red">*</span>：</td>
								<td><input type="text" id="roles" name="roles" value=""/></td>
							</tr>
							<tr>
								<td colspan="4" align="center">
									<input type="button" value="提 交" onclick="submitForm();" />
									<input type="button" value="取 消" onclick="cancel();" />
								</td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</div>
	</div>
	<div class="box1_bottomcenter">
		<div class="box1_bottomleft">
			<div class="box1_bottomright"></div>
		</div>
	</div>
</div>
</body>
</html>