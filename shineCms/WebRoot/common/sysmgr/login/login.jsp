<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>用户登录</title>
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
	
	var url = "${path}sysmgr/login_in.do";
	var formData = $("#loginForm").serialize();
    $.post(url,formData,function(data){
    	$.shine.showAjaxMsg(data,function(){
    		alert("登录成功");
    	});
    });
}
$(document).ready(function() {
	// 对表单进行校验
    validator = $('#loginForm').validate({
        rules : {
            'username' : {
    			required : true
    		},
            'password' : {
    			required : true
    		}
        },
        messages : {
        	'username' : {
        		required : ' 请输入帐号'
        	},
        	'password' : {
        		required : ' 请输入密码'
        	}
        }
    });
});
</script>
</head>

<body>
<div class="box1" style="width:450px;">
	<div class="box1_topcenter">
		<div class="box1_topleft">
			<div class="box1_topright"></div>
		</div>
	</div>
	<div class="box1_middlecenter">
		<div class="box1_middleleft">
			<div class="box1_middleright">
				<div class="boxContent" style="overflow: visible;">
					<form id="loginForm" method="post">
						<table class="simple_table" style="width:100%;">
							<tr>
								<td class="label">帐 号：</td>
								<td><input class="input" type="text" name="username" value=""/></td>
							</tr>
							<tr>
								<td class="label">密 码：</td>
								<td><input class="input" type="password" name="password" value=""/></td>
							</tr>
							<tr>
								<td colspan="4" align="center">
									<input type="button" value="登 录" onclick="submitForm();" />
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