<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>Menu</title>
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link rel="stylesheet" href="${path}r/css/themes/${themes}/frame.css"/>
<SCRIPT language=javascript>
function expand(el)
{
	childObj = document.getElementById("child" + el);

	if (childObj.style.display == 'none')
	{
		childObj.style.display = 'block';
	}
	else
	{
		childObj.style.display = 'none';
	}
	return;
}
</SCRIPT>
</head>

<body>
<TABLE height="100%" cellSpacing=0 cellPadding=0 width=170
	background="${path}r/css/themes/${themes}/image/frame/menu_bg.jpg" border=0>
	<TR>
		<TD vAlign=top align=middle>
			<TABLE cellSpacing=0 cellPadding=0 width="100%" border=0>

				<TR>
					<TD height=10></TD>
				</TR>
			</TABLE>
			<TABLE cellSpacing=0 cellPadding=0 width=150 border=0>

				<TR height=22>
					<TD style="PADDING-LEFT: 30px" background="${path}r/css/themes/${themes}/image/frame/menu_bt.jpg">
						<A class=menuParent onclick=expand(1) href="javascript:void(0);">系统管理</A>
					</TD>
				</TR>
				<TR height=4>
					<TD></TD>
				</TR>
			</TABLE>
			<TABLE id=child1 style="DISPLAY: none" cellSpacing=0 cellPadding=0
				width=150 border=0>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/frame/menu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="${path}sysmgr/user_enter.do" target="main">用户管理</A>
					</TD>
				</TR>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/frame/menu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="#" target=main>荣誉资质</A>
					</TD>
				</TR>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/frame/menu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="#" target=main>分类管理</A>
					</TD>
				</TR>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/frame/menu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="#" target=main>子类管理</A>
					</TD>
				</TR>
				<TR height=4>
					<TD colSpan=2></TD>
				</TR>
			</TABLE>
			<TABLE cellSpacing=0 cellPadding=0 width=150 border=0>
				<TR height=22>
					<TD style="PADDING-LEFT: 30px" background="${path}r/css/themes/${themes}/image/frame/menu_bt.jpg">
						<A class=menuParent onclick=expand(2) href="javascript:void(0);">新闻中心</A>
					</TD>
				</TR>
				<TR height=4>
					<TD></TD>
				</TR>
			</TABLE>
			<TABLE id=child2 style="DISPLAY: none" cellSpacing=0 cellPadding=0
				width=150 border=0>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/frame/menu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="#" target=main>公司新闻</A>
					</TD>
				</TR>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/framemenu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="#" target=main>分类管理</A>
					</TD>
				</TR>
				<TR height=20>
					<TD align=middle width=30>
						<IMG height=9 src="${path}r/css/themes/${themes}/image/frame/menu_icon.gif" width=9>
					</TD>
					<TD>
						<A class=menuChild href="#" target=main>子类管理</A>
					</TD>
				</TR>
				<TR height=4>
					<TD colSpan=2></TD>
				</TR>
			</TABLE>
			
		</TD>
		<TD width=1 bgColor=#d1e6f7></TD>
	</TR>
</TABLE>
</body>
</html>