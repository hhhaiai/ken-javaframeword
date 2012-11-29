<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.shine.platform.context.ConfigFactory"%>
<%
String path = request.getContextPath() +"/";
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;

request.setAttribute("appName",ConfigFactory.getFactory().getAppName());

request.setAttribute("path",path);
request.setAttribute("basePath",basePath);
request.setAttribute("themes","default");	//默认主题

response.setHeader("Pragma","No-cache");
response.setHeader("Cache-Control","no-cache");
response.setDateHeader("Expires", 0);

/** 
针对IE8设置渲染内核
IE=edge:使用最高版本IE;
IE=EmulateIE7:使用IE7;
chrome=1:如果装了Chrome插件则使用chrome;
*/
response.setHeader("X-UA-Compatible","IE=EmulateIE7,chrome=1");
%>