<%@page language="java" pageEncoding="utf-8"%>
<%@page import="java.util.*"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%
    String rootPath = request.getContextPath() + "/";
    String imagePath = rootPath + "/resource/image/";
    String jsPath = rootPath + "/resource/js/";
    request.setAttribute("rootPath",rootPath);
    request.setAttribute("imagePath",imagePath);
    request.setAttribute("jsPath",jsPath);
    
    response.setHeader("Pragma","No-cache"); 
    response.setHeader("Cache-Control","no-cache"); 
    response.setDateHeader("Expires", 0); 
%>