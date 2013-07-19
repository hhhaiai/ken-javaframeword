<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@include file="/common/path.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>${name}</title>
		<link rel="stylesheet" type="text/css"
			href="<%=rootPath%>resource/themes/default/easyui.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=rootPath%>resource/themes/icon.css" />
		<script type="text/javascript"
			src="<%=rootPath%>resource/js/jquery.min.js">
</script>
		<script type="text/javascript"
			src="<%=rootPath%>resource/js/jquery.easyui.min.js">
</script>
	</head>

	<body>
		<form id="login_form" action="login_login" method="post">
			<table>
				<tr>
					<td>
						用户名:
					</td>
					<td>
						<input class="easyui-validatebox" type="text" name="userName"
							data-options="required:true" value="admin"></input>
					</td>
				</tr>
				<tr>
					<td>
						密码：
					</td>
					<td>
						<input class="easyui-validatebox" type="password" name="password"
							data-options="required:true,validType:'password'" value="123456"></input>
					</td>
				</tr>
				<tr align="right">
					<td />
					<td>
						<input type="submit" value="登陆" />
					</td>
				</tr>
			</table>
		</form>

	</body>
</html>