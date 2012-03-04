<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/r/jsp/path.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Sunshine CMS</title>	
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<script type="text/javascript" src="${path}/r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}/r/operamasks-ui/js/operamasks-ui.min.js"></script>
<link rel="stylesheet" href="${path}/r/operamasks-ui/themes/default/om-all.css">
</head>

<body>
    <div id="main-frame-center">
	    <div id="__content" class="content">
		    <table id="body-table">
		        <tr>
		            <td class="left-panel" valign="top">
		                <dl class="demos-nav">
		                </dl>
		            </td>
		                
		            <td class="center-panel" valign="top">
		                <div id="demo-config" style="float:left;">
		                    <div id="demo-frame"  style="width:721px;float:left;">
		                        <p id="demo-link">
		                            <a target="_blank" href="" class="demo-new-window">新窗口打开</a>
		                        </p>
		                        <iframe id="content-frame" name="content-frame" frameborder="0" style=" border: none;width: 720px;_width:740px"></iframe>
		                    </div>
		                </div>
		                <div id="content_div">
		                    <a id="view_source" class="view_source_close" href="#">查看源码</a>
		                    <div id="demo-source" style="display:none;">
		                        <pre></pre>
		                    </div>
		                    <div id="api_div">
		                    </div>
		                </div>
		            </td>
		        </tr>
	    	</table>
	    </div>
	</div>
</body>
</html>
