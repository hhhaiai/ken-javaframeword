<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>IP流量</title>
<script type="text/javascript"
    src="${rootPath}resource/js/rl/src/RealLight.js"></script>
</script>
<script language="javascript">   
rl.importCss("nf:std_info");
rl.importJs("nf:reportQuery");
rl.importJs("nf:queryDialog");
rl.addAutoDecoArea("mainForm", "queryDialogContent");
</script>
</head>
<body>
<div class="std_info">
    <div class="page_wrapper limit_770">
    	<!-- 查询页面 START -->
        <div class="top_bar limit_770">
			<a title="显示/隐藏 查询" onClick="toggleSearch();" class="icon_btn" href="javascript:void(0);"><img src="${rootPath}resource/image/icons/search.gif" /> 查询</a>
            <span class="sep">&nbsp;</span>
            <a title="导出为pdf文件" onClick="exportPdf();return false;" class="icon_btn" href="javascript:void(0);" ><img src="${rootPath}resource/image/icons/export_pdf.gif" /> 导出PDF</a>
		</div>
        <!-- 查询页面 END -->
        <h3 class="title">IP流量统计</h3>
        <!-- IP流量统计 START -->
        
        <!-- IP流量统计 START -->
	</div>
</div>
</body>
</html>
