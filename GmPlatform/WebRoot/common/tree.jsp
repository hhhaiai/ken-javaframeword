<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'tree.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body>
    <ul class="easyui-tree">
		<li>
			<span>My Documents</span>
			<ul>
				<li data-options="state:'closed'">
					<span>Photos</span>
					<ul>
						<li>
							<span>Friend</span>
						</li>
						<li>
							<span>Wife</span>
						</li>
						<li>
							<span>Company</span>
						</li>
					</ul>
				</li>
				<li>
					<span>Program Files</span>
					<ul>
						<li>Intel</li>
						<li>Java</li>
						<li>Microsoft Office</li>
						<li>Games</li>
					</ul>
				</li>
				<li>index.html</li>
				<li>about.html</li>
				<li>welcome.html</li>
			</ul>
		</li>
	</ul>
  </body>
</html>
