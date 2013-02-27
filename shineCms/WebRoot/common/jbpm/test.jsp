<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.shine.platform.context.ConfigFactory"%>
<%@page import="org.jbpm.api.RepositoryService"%>
<%@page import="org.jbpm.api.ProcessDefinition"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
RepositoryService repositoryService  = (RepositoryService)ConfigFactory.getFactory().getSpringContext().getBean("repositoryService");
List<ProcessDefinition> pdList = repositoryService.createProcessDefinitionQuery().list();
System.out.println(pdList);
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'test.jsp' starting page</title>
    
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
    This is my JSP page. <br>
  </body>
</html>
