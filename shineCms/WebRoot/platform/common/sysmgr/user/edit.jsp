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
	$('#roleIds').omCombo({
		width : "150px",
		multi : true,
		emptyText : '请至少选择一个角色',
		value : '${e.roleIds}',
    	dataSource : [ 
    		<c:forEach var="r" items="${roleList}" varStatus="idx">
    			<c:if test="${!idx.first}">,</c:if>
    			{text:'${r.name}',value:'${r.roleId}'}
    		</c:forEach>
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
    		<c:if test="${param.method eq 'add'}">
    			required : true,
    		</c:if>
    			maxlength : 20
    		},
    		'confirmPassword' : {
    		<c:if test="${param.method eq 'add'}">
    			required : true,
    		</c:if>
    			equalTo : "#password"
    		},
    		'roleIds' : {
    			required : true		//下拉框会有样式问题
    		}
        },
        messages : {
        	'roleIds' : {
        		required : '请至少选择一个角色'
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
						<input type="hidden" name="e.userId" value="${e.userId}"/>
						<table class="simple_table" style="width:100%;">
							<tr>
								<td class="label">用户名<span class="red">*</span>：</td>
								<td><input class="input" type="text" name="e.username" value="${e.username}"/></td>
							</tr>
							<tr>
								<td class="label">姓名<span class="red">*</span>：</td>
								<td><input class="input" type="text" name="e.name" value="${e.name}"/></td>
							</tr>
							<c:choose>
								<c:when test="${param.method eq 'add'}">
									<tr>
										<td class="label">密码<span class="red">*</span>：</td>
										<td><input class="input" type="password" id="password" name="e.password" value="123456"/><font color="gray">(默认：123456)</font></td>
									</tr>
									<tr>
										<td class="label">确认密码<span class="red">*</span>：</td>
										<td><input class="input" type="password" name="confirmPassword" value="123456"/></td>
									</tr>
								</c:when>
								<c:otherwise>
									<tr>
										<td class="label">密码：</td>
										<td><input class="input" type="password" id="password" name="e.password" value=""/><font color="gray">(不修改密码则不输入)</font></td>
									</tr>
									<tr>
										<td class="label">确认密码：</td>
										<td><input class="input" type="password" name="confirmPassword" value=""/><font color="gray">(不修改密码则不输入)</font></td>
									</tr>
								</c:otherwise>
							</c:choose>
							<tr>
								<td class="label">角色<span class="red">*</span>：</td>
								<td><input type="text" id="roleIds" name="e.roleIds"/></td>
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