<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>增加IP分组</title>
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script type="text/javascript">
rl.importCss("nf:std_info");
rl.importJs("nf:Validator");

function toEdit(){
	var mainForm = document.mainForm;
	if(Validator.Validate(mainForm,3)){ 
		mainForm.action = "${rootPath}ipGroupTrafficConfig_doEdit";	
		mainForm.submit();
	}
}
</script>
</head>
<body>
<div class="std_info">
    <div class="page_wrapper limit_770">
    <h3 class="title">编辑IP分组</h3>
	<form name="mainForm" method="post">
    	<input type="hidden" name="groupId" value="<s:property value="dbModels['default'][0]['group_id']" />" />
		<div class="group">
			<fieldset class="wrapper">
				<div class="g_body">
				<table cellpadding="0" cellspacing="0" border="0" class="fields_layout">
					<tr>
						<th class="label">IP分组名 <span class="asterisk">*</span></th>
						<td>
                        <input class="field" name="ipAlias" 
                        value="<s:property value="dbModels['default'][0]['ip_alias']" />" dataType="Require" />
                        </td>
					</tr>
                    <tr>
						<th class="label">开始地址 <span class="asterisk">*</span></th>
						<td>
                        <input class="field" name="ipStartAddress" 
                        value="<s:property value="dbModels['default'][0]['ip_start_address']" />" dataType="Ip" />
                        </td>
					</tr>
                    <tr>
						<th class="label">结束地址 <span class="asterisk">*</span></th>
						<td>
                        <input class="field" name="ipEndAddress" 
                        value="<s:property value="dbModels['default'][0]['ip_end_address']" />" dataType="Ip" />
                        </td>
					</tr>
				</table>
                </div>
            </fieldset>
        </div>
        <div class="form_action_bar">
            <button type="button" onclick="toEdit();">保 存</button>
            &nbsp;
            <button type="button" onclick="javascript:history.go(-1)">返回</button>
        </div>
	</form>
	</div>
</div>
</body>
</html>