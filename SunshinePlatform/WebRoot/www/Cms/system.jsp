<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="platform" uri="/platform"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>${platform:getIndexName()}</title>
		<script type="text/javascript" src="../../resource/js/jquery.min.js">
</script>
		<script type="text/javascript"
			src="../../resource/js/operamasks-ui.min.js">
</script>
		<script type="text/javascript">
var data = [ {
	"text" : "系统管理",
	"children" : [ {
		"text" : "系统信息"
	}, {
		"text" : "插件管理"
	} ]
}, {
	"text" : "node2",
	"expanded" : true,
	"children" : [ {
		"text" : "node21",
		"expanded" : true,
		"children" : [ {
			"text" : "node211"
		}, {
			"text" : "node212"
		} ]
	}, {
		"text" : "node22"
	} ]
}, {
	"text" : "node3"
}, {
	"text" : "node4"
} ];
$(document).ready(function() {
	$("#leadtree").omTree( {
		dataSource : data
	});
});
</script>
<link rel="stylesheet" type="text/css" href="../../resource/css/default/om-default.css" />
		<style type="text/css">
<!--
body {
	font: 100%/ 1.4 Verdana, Arial, Helvetica, sans-serif;
	background: #4E5869;
	margin: 0;
	padding: 0;
	color: #000;
}

/* ~~ 元素/标签选择器 ~~ */
ul,ol,dl {
	/* 由于浏览器之间的差异，最佳做法是在列表中将填充和边距都设置为零。为了保持一致，您可以在此处指定需要的数值，也可以在列表所包含的列表项（LI、DT 和 DD）中指定需要的数值。请注意，除非编写一个更为具体的选择器，否则您在此处进行的设置将会层叠到 .nav 列表。 */
	padding: 0;
	margin: 0;
}

h1,h2,h3,h4,h5,h6,p {
	margin-top: 0;
	/* 删除上边距可以解决边距会超出其包含的 div 的问题。剩余的下边距可以使 div 与后面的任何元素保持一定距离。 */
	padding-right: 15px;
	padding-left: 15px;
	/* 向 div 内的元素侧边（而不是 div 自身）添加填充可避免使用任何方框模型数学。此外，也可将具有侧边填充的嵌套 div 用作替代方法。 */
}

a img { /* 此选择器将删除某些浏览器中显示在图像周围的默认蓝色边框（当该图像包含在链接中时） */
	border: none;
}

/* ~~ 站点链接的样式必须保持此顺序，包括用于创建悬停效果的选择器组在内。 ~~ */
a:link {
	color: #414958;
	text-decoration: underline;
	/* 除非将链接设置成极为独特的外观样式，否则最好提供下划线，以便可从视觉上快速识别 */
}

a:visited {
	color: #4E5869;
	text-decoration: underline;
}

a:hover,a:active,a:focus { /* 此组选择器将为键盘导航者提供与鼠标使用者相同的悬停体验。 */
	text-decoration: none;
}

/* ~~ 此容器包含所有其它 div，并依百分比设定其宽度 ~~ */
.container {
	width: 80%;
	max-width: 1260px;
	min-width: 780px;
	background: #FFF;
	margin: 0 auto;
}

.header {
	background: #6F7D94;
}

.sidebar1 {
	float: left;
	width: 20%;
	background: #93A5C4;
	padding-bottom: 10px;
}

.content {
	padding: 10px 0;
	width: 60%;
	float: left;
}

.sidebar2 {
	float: left;
	width: 20%;
	background: #93A5C4;
	padding: 10px 0;
}

.content content-frame {
	padding: 0 15px 15px 40px;
}

ul.nav {
	list-style: none;
	border-top: 1px solid #666;
	margin-bottom: 15px;
}

ul.nav li {
	border-bottom: 1px solid #666;
}

ul.nav a,ul.nav a:visited {
	padding: 5px 5px 5px 15px;
	display: block;
	text-decoration: none;
	background: #8090AB;
	color: #000;
}

ul.nav a:hover,ul.nav a:active,ul.nav a:focus {
	background: #6F7D94;
	color: #FFF;
}

.footer {
	padding: 10px 0;
	background: #6F7D94;
	position: relative;
	clear: both;
}

.fltrt {
	float: right;
	margin-left: 8px;
}

.fltlft {
	float: left;
	margin-right: 8px;
}

.clearfloat {
	clear: both;
	height: 0;
	font-size: 1px;
	line-height: 0px;
}
-->
</style>
	</head>

	<body>

		<div class="container">
			<div class="header">
				<a href="#"><img src="" alt="在此处插入徽标" name="Insert_logo"
						width="20%" height="90" id="Insert_logo"
						style="background: #8090AB; display: block;" /> </a>
				<!-- end .header -->
			</div>
			<div class="sidebar1">
				<ul id="leadtree" />
				<!-- end .sidebar1 -->
			</div>
			<div class="content">
				<iframe id="content-frame" name="content-frame" frameborder="0" src="${platform:getPageName('pluginManger')}"></iframe>
				<!-- end .content -->
			</div>
			<div class="sidebar2">
				<h4>
					背景
				</h4>
				<p>
					本质上，所有 div 中的背景颜色将仅显示与内容一样的长度。如果您希望采用分隔线（而不是颜色），请在 .content div
					的侧面放置边框（但仅当其将始终包含更多内容时）。
				</p>
				<!-- end .sidebar2 -->
			</div>
			<div class="footer">
				<p>
					此 .footer 包含声明 position:relative，以便为 .footer 指定 Internet Explorer 6
					hasLayout，并使其以正确方式清除。如果您不需要支持 IE6，则可以将其删除。
				</p>
				<!-- end .footer -->
			</div>
			<!-- end .container -->
		</div>
	</body>
</html>
