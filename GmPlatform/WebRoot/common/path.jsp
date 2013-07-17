<%@page language="java" pageEncoding="utf-8"%>
<%@page import="java.util.*"%>
<%
	String rootPath = request.getContextPath() + "/";
	request.setAttribute("rootPath",rootPath);
	
    response.setHeader("Pragma","No-cache"); 
    response.setHeader("Cache-Control","no-cache"); 
    response.setDateHeader("Expires", 0); 
%>