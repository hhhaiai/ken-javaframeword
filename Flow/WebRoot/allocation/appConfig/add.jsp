<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>增加新应用</title>
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script type="text/javascript">
rl.importCss("nf:std_info");
rl.importJs("nf:Validator");

function toAdd(){
	var mainForm = document.mainForm;
	if(Validator.Validate(mainForm,3)){ 
		mainForm.action = "${rootPath}appTrafficConfig_doAdd";	
		mainForm.submit();
	}
}
</script>
</head>
<body>
<div class="std_info">
    <div class="page_wrapper limit_770">
    <h3 class="title">增加新应用</h3>
	<form name="mainForm" method="post">
		<div class="group">
			<fieldset class="wrapper">
				<div class="g_body">
				<table cellpadding="0" cellspacing="0" border="0" class="fields_layout">
					<tr>
						<th class="label">应用程序名 <span class="asterisk">*</span></th>
						<td>
                        <input class="field" name="appAlias" dataType="Require" />
                        </td>
					</tr>
                    <tr>
						<th class="label">服务器IP地址 <span class="asterisk">*</span></th>
						<td>
                        <input class="field" name="ipAddress" dataType="Ip" />
                        </td>
					</tr>
                    <tr>
						<th class="label">端口号 <span class="asterisk">*</span></th>
						<td>
                        <input class="field" name="ipPort" dataType="Integer" />
                        </td>
					</tr>
				</table>
                </div>
            </fieldset>
        </div>
        <div class="form_action_bar">
            <button type="button" onclick="toAdd();">保 存</button>
            &nbsp;
            <button type="button" onclick="javascript:history.go(-1)">返回</button>
        </div>
	</form>
	</div>
</div>
</body>
</html>