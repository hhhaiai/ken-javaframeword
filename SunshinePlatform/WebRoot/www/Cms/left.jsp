<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>无标题文档</title>
		<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
-->
</style>
		<script type="text/javascript" src="../../resource/js/jquery-1.7.1.js">
</script>
		<script type="text/javascript" src="../../resource/js/jquery.min.js">
</script>
		<script type="text/javascript"
			src="../../resource/js/operamasks-ui.min.js">
</script>
		<link rel="stylesheet"
			href="../../resource/css/default/om-default.css">
		<script type="text/javascript">
var data = [{
	"text":"首页"
},{
	"text" : "系统管理",
	"children" : [ {
		"text" : "系统基础信息"
	}, {
		"text" : "插件管理"
	} , {
		"text" : "页面管理"
	} ]
}];

$(document).ready(function() {
	$("#mytree").omTree( {
		dataSource : data,
		onClick : function(node) {
		   var pagePath
		   if(node.text=="系统基础信息")
			 pagePath="systemInfo.jsp"
		   else if (node.text=="插件管理")
			   pagePath="pluginManger.jsp"
		    if(pagePath!=null)
			window.top.changeCenterPage(pagePath);
		}
	});
});
</script>
	</head>

	<body>
		<table width="171" height="100%" border="0" cellpadding="0"
			cellspacing="0">
			<tr>
				<td valign="top">
					<table width="100%" height="100%" border="0" cellpadding="0"
						cellspacing="0" style="table-layout: fixed;">
						<tr>
							<td style="width: 3px; background: #0a5c8e;">
								&nbsp;
							</td>
							<td>
								<table width="100%" height="100%" border="0" cellpadding="0"
									cellspacing="0" style="table-layout: fixed;">
									<tr>
										<td height="5" style="line-height: 5px; background: #0a5c8e;">
											&nbsp;
										</td>
									</tr>
									<tr>
										<td height="23" background="../../resource/image/main_29.gif">
											<table width="100%" border="0" cellspacing="0"
												cellpadding="0">
												<tr>
													<td width="40%">
														&nbsp;
													</td>
													<td width="42%">
														<font
															style="height: 1; font-size: 9pt; color: #bfdbeb; filter: glow(color = #1070a3, strength = 1)">方法管理</font>
													</td>
													<td width="18%">
														&nbsp;
													</td>
												</tr>
											</table>
										</td>
									</tr>
									<tr>
										<td bgcolor="#e5f4fd">
											<table width="100%" height="100%" border="0" cellpadding="0"
												cellspacing="0">
												<tr>
													<td valign="top">
														<div align="center">
															<ul id="mytree"></ul>
														</div>
													</td>
												</tr>
												<tr>
													<td height="50">
														<table width="100%" border="0" cellspacing="0"
															cellpadding="0">
															<tr>
																<td height="25"
																	background="../../resource/image/main_43.gif">
																	<table width="100%" border="0" cellspacing="0"
																		cellpadding="0">
																		<tr>
																			<td width="37%">
																				&nbsp;
																			</td>
																			<td width="45%">
																				<font
																					style="height: 1; font-size: 9pt; color: #bfdbeb; filter: glow(color = #1070a3, strength = 1)">方法浏览</font>
																			</td>
																			<td width="18%">
																				&nbsp;
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
															<tr>
																<td height="25"
																	background="../../resource/image/main_43.gif">
																	<table width="100%" border="0" cellspacing="0"
																		cellpadding="0">
																		<tr>
																			<td width="37%">
																				&nbsp;
																			</td>
																			<td width="45%">
																				<font
																					style="height: 1; font-size: 9pt; color: #bfdbeb; filter: glow(color = #1070a3, strength = 1)">其他菜单</font>
																			</td>
																			<td width="18%">
																				&nbsp;
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
										</td>
									</tr>
									<tr>
										<td height="23" background="../../resource/image/main_45.gif">
											<table width="100%" border="0" cellspacing="0"
												cellpadding="0">
												<tr>
													<td width="18%">
														&nbsp;
													</td>
													<td width="64%">
														<div align="center">
															<font
																style="height: 1; font-size: 9pt; color: #bfdbeb; filter: glow(color = #1070a3, strength = 1)">版本2008
																V1.0 </font>
														</div>
													</td>
													<td width="18%">
														&nbsp;
													</td>
												</tr>
											</table>
										</td>
									</tr>
									<tr>
										<td height="9" style="line-height: 9px; background: #0a5c8e;">
											&nbsp;
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>

