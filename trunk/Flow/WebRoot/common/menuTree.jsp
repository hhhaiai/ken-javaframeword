<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>网络流量</title>
<script type="text/javascript"
    src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script type="text/javascript">
rl._stopAutoRenderBody = true;
rl.createNamespace("nf.config", {
    urlOfSysMenu : "${rootPath}common/conf/sysMenu.xml",
    menuTreeIniOpenTo : "1003",
    menuTreeIconRoot : "${rootPath}resource/image/menu/"
});
rl.importJs("nf:treeNav");
</script>
</head>
<body>
</body>
</html>
