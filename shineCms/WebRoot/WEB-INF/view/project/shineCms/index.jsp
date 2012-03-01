<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Sunshine CMS</title>
<script type="text/javascript">
	alert(2);
	function test(){
		alert(3);
	}
</script>
</head>
  
<body onload="test();">
    Sunshine CMSddddddd
</body>
</html>
