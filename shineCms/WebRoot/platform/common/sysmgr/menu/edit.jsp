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
var validator;
//提交表单
function submitForm(){
	if(!validator.form())
		return;
	var url = "${path}sysmgr/menu_${param.method eq 'add'?'save':'update'}.do";
	var formData = $("#editForm").serialize();
    $.post(url,formData,function(data){
    	shine.showAjaxMsg(data,function(){
    		window.parent.addSuccess();
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
            'e.menuName' : {
    			required : true,
    			maxlength : 5
    		}, 
            'e.murl' : {
    			required : false,
    			maxlength : 500
    		},
            'e.icon' : {
    			required : false,
    			maxlength : 50
    		},
    		'e.remark' : {
    			required : false,
    			maxlength : 100
    		},
    		'e.orderId' : {
    			required : true,
    			number : true
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
						<input type="hidden" name="e.menuId" value="${e.menuId}"/>
						<input type="hidden" name="e.pid" value="${e.pid}"/>
						<table class="simple_table" style="width:100%;">
							<tr>
								<td class="label">上层菜单：</td>
								<td>${pname}</td>
							</tr>
							<tr>
								<td class="label"><span class="red">*</span> 名称：</td>
								<td><input class="input" type="text" name="e.menuName" value="${e.menuName}"/></td>
							</tr>
							<tr>
								<td class="label">URL：</td>
								<td><input class="input" type="text" name="e.murl" value="${e.murl}"/></td>
							</tr>
							<tr>
								<td class="label">图标：</td>
								<td><input class="input" type="text" name="e.icon" value="${e.icon}"/></td>
							</tr>
							<tr>
								<td class="label">备注：</td>
								<td><input class="input" type="text" name="e.remark" value="${e.remark}"/></td>
							</tr>
							<tr>
								<td class="label">生效：</td>
								<td><input class="input" type="text" name="e.enable" value="${e.enable}"/></td>
							</tr>
							<tr>
								<td class="label">排序：</td>
								<td><input class="input" type="text" name="e.orderId" value="${e.orderId}"/></td>
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