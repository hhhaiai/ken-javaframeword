<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%
Exception ee = (Exception)request.getAttribute("exception");
ee.printStackTrace();
String className = ee.getClass().getName();
String msg =ee.getMessage();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>程序内部处理出错！</title>
<link rel="rl-page-icon" href="${imagePath}/icons/info.gif" />
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script type="text/javascript">  
rl.importCss("nf:errorpage");
rl.importJs("lib.dom.DomWrap");
function toggleDetail(){
	var display = rl.$("detail").getStyle("display");
	if(display == "none"){
		rl.dw.show();
	}else {         
		rl.dw.hide();
	}
}
</script>
</head>
<body>
<table  border="0"  cellpadding="0" cellspacing="0" class="circular content">
    <tr>
        <td class="td1"></td>
        <td class="td2"></td>
        <td class="td3"></td>
    </tr>
    <tr>
        <td class="td8"></td>
        <td class="td9">
            <table style="width:100%;" border="0" cellspacing="0" cellpadding="0">
                <tr valign="middle">
                    <td style="width:80px; text-align:center;">
                    	<img title="显示详情" src="${imagePath}default/info.jpg" style="cursor:pointer;" onClick="toggleDetail()" />
                    </td>
                    <td>
                    	<div class="err_title">对不起，程序内部处理出错！</div>
						<div id="mainInfo"><%=msg %></div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style=" text-align:right;">
                    <button id="back" class="btn" onClick="history.back(1)" onMouseOver="this.className='btn_over'"  onmouseout="this.className='btn'" style="margin:0; padding:0;">返回</button>
                 	</td>
                </tr>
            </table>
        	<div id="detail" class="details">
                <s:property value="exceptionStack" />
            </div>
            </td>
        <td class="td4"></td>
    </tr>
    <tr>
        <td class="td7"></td>
        <td class="td6"></td>
        <td class="td5"></td>
    </tr>
</table>
</body>
</HTML>