<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>网络流量</title>
<script type="text/javascript"
	src="${rootPath}resource/js/rl/src/RealLight.js"></script>
</script>
<script type="text/javascript">
rl.createNamespace("nf.config", {
	/** 登录用户名 */
    userName : "",

    /** 顶部菜单页 */
    urlOfSysMenuData : "${rootPath}common/topMenu.jsp",
    
    /** 显示主页 */
    urlOfHomepage : "${rootPath}common/menuTree.jsp",

    /** 用户信息页 */
    urlOfAccountInfo : ""
});
rl.importJs("nf:mui");
</script>
</head>
<body>
</body>
</html>
