<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>页面请求出错</title>
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
</head>
<body>
<div class="std_info">
	<center>
		<img src="${imagePath}/default/error.gif" />
	</center>
	<center>
		<a onclick="javascript:history.back(1)">
        	<img src="${imagePath}/default/back.jpg" />
		</a>
	</center>
</div>
</body>
</html>
