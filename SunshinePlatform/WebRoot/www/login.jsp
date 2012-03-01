<%@ page language="java" pageEncoding="UTF-8"
	contentType="text/html; charset=UTF-8"%>
<form action="${pageContext.request.contextPath}/user.do?method=add"
	method="post">
	ID号:
	<input type="text" name="userId" id="userId">
	<br>
	密码:
	<input type="password" name="userPassword" id="userPassword">
	<br>
	<input type="submit" value="Login">
</form>
<br>
<form action="${pageContext.request.contextPath}/user.do?method=add2"
	method="post">
	ID号:
	<input type="text" name="userId" id="userId">
	<br>
	密码:
	<input type="password" name="userPassword" id="userPassword">
	<br>
	<input type="submit" value="Login2">
</form>
<br>
<form action="${pageContext.request.contextPath}/user.do?method=add3"
	method="post">
	ID号:
	<input type="text" name="userId" id="userId">
	<br>
	密码:
	<input type="password" name="userPassword" id="userPassword">
	<br>
	<input type="submit" value="Login3">
</form>