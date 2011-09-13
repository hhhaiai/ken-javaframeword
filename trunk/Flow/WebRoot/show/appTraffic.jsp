<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>应用流量</title>
<script type="text/javascript" src="${rootPath}resource/js/rl/src/RealLight.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/flash/swfobject.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/amcharts.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/raphael.js"></script>
</script>
<!-- 页面显示框架 -->
<script language="javascript">   
rl.importCss("nf:std_info");
rl.importJs("gui.indicator.ProgressBar");
rl.importJs("nf:reportQuery");
rl.importJs("nf:queryDialog");
rl.addAutoDecoArea("mainForm", "queryDialogContent", "appTrafficList");

rl.gui.indicator.ProgressBar.prototype.barSkinRule = function(progress){
    return progress <= 25 ? "green" : 
          (progress <= 50 ? "yellow" : 
          (progress <= 80 ? "orange" : "red"));
}

// 查询
function query(){
    var mainForm = document.mainForm;
    mainForm.action = "${rootPath}appTraffic_list";
    mainForm.submit(); 
}
</script>

<!-- 加载报表 -->
<script type="text/javascript">
// 初始化
var params = 
{
	bgcolor:"#FFFFFF"
};
var flashVars = 
{
	path: "${jsPath}amcharts/flash/",
	chart_data: "USA;19544\nJapan;5455\nFrance;2313\nGermany;2208\nUK;2057\nIndia;1771\nRussia;1495\nSouth Korea;1281\n",
	chart_settings: "<settings><data_type>csv</data_type><legend><enabled>0</enabled></legend><pie><inner_radius>30</inner_radius><height>7</height><angle>10</angle><gradient></gradient></pie><animation><start_time>1</start_time><pull_out_time>1</pull_out_time></animation><data_labels><show>{title}</show><max_width>100</max_width></data_labels></settings>"
};

// 如果浏览器支持flash则以flash显示，否则以JavaScript显示
if (swfobject.hasFlashPlayerVersion("8")) {
	swfobject.embedSWF("${jsPath}amcharts/flash/ampie.swf", "chartdiv", "600", "400", "8.0.0", "${jsPath}amcharts/flash/expressInstall.swf", flashVars, params);
} else {
	var amFallback = new AmCharts.AmFallback();
	amFallback.chartSettings = flashVars.chart_settings;
	amFallback.chartData = flashVars.chart_data;
	amFallback.type = "pie";
	amFallback.write("chartdiv");
}
</script>
<style type="text/css">
.data_list .rl_progressbar td{
    border:none;
}
</style>
</head>
<body>
<div class="std_info">
    <div class="page_wrapper limit_770">
    	<!-- 查询页面 START -->
        <div class="top_bar limit_770">
			<a title="显示/隐藏 查询" onClick="toggleSearch();" class="icon_btn" href="javascript:void(0);">
            <img src="${rootPath}resource/image/icons/search.gif" /> 查询
            </a>
            <span class="sep">&nbsp;</span>
            <a title="导出为pdf文件" onClick="exportPdf();return false;" class="icon_btn" href="javascript:void(0);" >
            <img src="${rootPath}resource/image/icons/export_pdf.gif" /> 导出PDF
            </a>
		</div>
        <!-- 查询页面 END -->
        <h3 class="title">应用流量统计</h3>
        <!-- 应用流量统计 START -->
        <div class="report">
            <!-- 查询框 START -->
            <div class="rpt_search">
                <div class="search_wrapper_ani" id="searchBarAniCtn" style="display:none;">
                    <div class="search_wrapper">
                        <form name="mainForm"  id="mainForm" method="post" action="">
                            <table class="fields_layout">
                                <tr>
                                    <th class="label" style="width:100px;">周期</th>
                                    <td colspan="3">
                                    <select id="statPeroid" name="statPeroid">
                                    <c:forEach var="periodList" items="${dto.statPeriodList}">
                                    	<option value="<c:out value="${periodList.key}"/>" 
                                        <c:if test="${periodList.key == dto.statPeroid}">selected="selected"</c:if>>
                                        	<c:out value="${periodList.value}"/>
                                        </option>
                                    </c:forEach>
	                                </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="label" style="width:100px;">前N名</th>
                                    <td colspan="3">
                                    <select  name="topPageN" id="topPageN">
                                    <c:forEach var="pageList" items="${dto.topPageList}">
                                    	<option value="<c:out value="${pageList.key}"/>"
                                        <c:if test="${pageList.value == dto.topPageN}">selected="selected"</c:if>>
                                        	<c:out value="${pageList.value}"/>
                                        </option>
                                    </c:forEach>
                                    </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="label" style="width:100px;">日期</th>
                                    <td colspan="3">
                                    <input ctype="DateSelect" id="date" name="date" format="%Y-%m-%d" width="150" value="${dto.date}" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>&nbsp;</th>
                                    <td colspan="3" class="search_bottom_bar">
                                    <button type="button" onclick="query();">查&nbsp;&nbsp;询</button>
                                    &nbsp;&nbsp;
                                    <button type="button" onclick="toggleSearch();">取消</button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
            <!-- 查询框 END -->
            <!-- 应用流量数据展现 START -->
            <div>
            <s:if test="#request.dbModels['default'].size > 0">
            <table id="appTrafficList" class="data_list" width=100% cellSpacing=0 cellPadding=0 border=0>
            <tr>
                <th>&nbsp;</th>
                <th>应用程序</th>
                <th>总流量(MB)</th>
                <th>流入(MB)</th>
                <th>百分比</th>
                <th>流出(MB)</th>
                <th>百分比</th>
                <th>流量趋势</th>
            </tr>
            <s:iterator value="#request.dbModels['default']" status="dbModel">
            <tr>
                <td><s:property value="#dbModels['default'].index + 1" /></td>
                <td><a href="javascript:void(0);"><s:property value="dbModels['default'][#dbModel.index]['app_alias']" /></a></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['total_bytes_all']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['total_bytes_in']" /></td>
                <td><span ctype="ProgressBar" barSkin="green" progress="<s:property value="dbModels['default'][#dbModel.index]['bytes_in_percentage']" />"></span></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['total_bytes_out']" /></td>
                <td><span ctype="ProgressBar" barSkin="green" progress="<s:property value="dbModels['default'][#dbModel.index]['bytes_out_percentage']" />"></span></td>
                <td><img height="14" width="14" src="${rootPath}resource/image/icons/trend.png" border="0"></td>
            </tr>
            </s:iterator>
            </table>
            <!-- 数据报表 START -->
            <div id="chartdiv" style="width:100%; height:400px; text-align:center"></div>
            <!-- 数据报表 END -->
            </s:if>
            <s:else><div style="text-align:center"><img src="${rootPath}resource/image/default/no_data.gif" /></div></s:else>
            </div>
            <!-- 应用流量数据展现 END -->
        </div>
        <!-- 应用流量量统计 END -->
    </div>
</div>
</body>
</html>
