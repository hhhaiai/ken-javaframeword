<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>IP分组流量</title>
<link rel="stylesheet" href="${cssPath}std_info.css" />
<script type="text/javascript" src="${jsPath}rl/src/RealLight.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/flash/swfobject.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/amcharts.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/amfallback.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/raphael.js"></script>
</script>
<!-- 页面显示框架 -->
<script language="javascript">   
//rl.importCss("nf:std_info");
rl.importJs("gui.indicator.ProgressBar");
rl.importJs("nf:reportQuery");
rl.importJs("nf:queryDialog");
rl.addAutoDecoArea("mainForm", "queryDialogContent", "ipGroupTrafficList");

rl.gui.indicator.ProgressBar.prototype.barSkinRule = function(progress){
    return progress <= 25 ? "green" : 
          (progress <= 50 ? "yellow" : 
          (progress <= 80 ? "orange" : "red"));
}

// 查询
function query(){
    var mainForm = document.mainForm;
    mainForm.action = "${rootPath}ipGroupTraffic_list";
    mainForm.submit(); 
}

// 导出PDF
function exportPdf() {
    var mainForm = document.mainForm;
	mainForm.action = "${rootPath}ipGroupTraffic_dumpPDF?method=ipGroupTraffic_list&isPdf=1";
	mainForm.submit();
}

// 流量趋势
function showFlowTrend(ipGroupId) {
	var mainForm = document.mainForm;
	mainForm.action ='${rootPath}trend/ipGroupTrafficTrend_list?ipGroupId=' + ipGroupId;
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
	chart_data: "<c:out value="${charts['default']}" escapeXml="false" />",
	chart_settings: "<settings><data_type>csv</data_type><plot_area><margins><left>50</left><right>40</right><top>50</top><bottom>50</bottom></margins></plot_area><grid><category><dashed>1</dashed><dash_length>4</dash_length></category><value><dashed>1</dashed><dash_length>4</dash_length></value></grid><axes><category><width>1</width><color>E7E7E7</color></category><value><width>1</width><color>E7E7E7</color></value></axes><values><value><min>0</min></value></values><legend><enabled>1</enabled></legend><angle>0</angle><column><type>3d column</type><width>15</width><alpha>80</alpha><spacing>10</spacing><hover_brightness>10</hover_brightness><balloon_text>{title}: {value}(MB)</balloon_text><grow_time>2</grow_time></column><depth>15</depth><angle>25</angle><graphs><graph gid='0'><title>流入流量</title><color>4BBF4B</color></graph><graph gid='1'><title>流出流量</title><color>C0DBFD</color></graph></graphs><labels><label lid='0'><text><![CDATA[<b>IP分组流量</b>]]></text><y>5</y><text_color>000000</text_color><text_size>16</text_size><align>center</align></label></labels></settings>"
};

/*window.onload = function()
{
	var amFallback = new AmCharts.AmFallback();
    amFallback.chartSettings = flashVars.chart_settings;
	amFallback.chartData = flashVars.chart_data;
	amFallback.type = "column";
	amFallback.write("chartdiv");
	
	var textDom = document.getElementsByTagName("text");
	var textLength = textDom.length;
	var theLength = textLength - 4;
	var theDom = textDom[theLength];
	theDom.style.display="none";
}*/

swfobject.embedSWF("${jsPath}amcharts/flash/amcolumn2.swf", "chartdiv", "100%", "400", "8.0.0", "${jsPath}amcharts/flash/expressInstall.swf", flashVars, params);
</script>
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
        <h3 class="title">IP分组流量</h3>
        <!-- IP分组流量统计 START -->
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
            <!-- IP分组数据展现 START -->
            <div>
            <s:if test="#request.dbModels['default'].size > 0">
            <table id="ipGroupTrafficList" class="data_list" width=100% cellSpacing=0 cellPadding=0 border=0>
            <tr>
                <th>&nbsp;</th>
                <th>IP分组名</th>
                <th>流入(MB)</th>
                <th>百分比</th>
                <th></th>
                <th>流出(MB)</th>
                <th>百分比</th>
                <th></th>
                <th>流量趋势</th>
            </tr>
            <s:iterator value="#request.dbModels['default']" status="dbModel">
            <tr>
                <td><s:property value="#dbModel.index + 1" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['ip_alias']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['src_ip_total']" /></td>
                <td><span ctype="ProgressBar" barSkin="green" progress="<s:property value="dbModels['default'][#dbModel.index]['src_ip_percentage']" />"></span></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['src_ip_percentage']" />%</td>
                <td><s:property value="dbModels['default'][#dbModel.index]['dst_ip_total']" /></td>
                <td><span ctype="ProgressBar" barSkin="green" progress="<s:property value="dbModels['default'][#dbModel.index]['dst_ip_percentage']" />"></span></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['dst_ip_percentage']" />%</td>
                <td>
                <img style="cursor:pointer" height="14" width="14" src="${rootPath}resource/image/icons/trend.png" border="0" onclick="showFlowTrend('<s:property value="dbModels['default'][#dbModel.index]['group_id']" />')">
                </td>
            </tr>
            </s:iterator>
            </table>
            <!-- 数据报表 START -->
            <div id="chartdiv" style="width: 100%; height: 400px;"></div>
            <!-- 数据报表 END -->
            </s:if>
            <s:else><div style="text-align:center"><img src="${rootPath}resource/image/default/no_data.gif" /></div></s:else>
            </div>
            <!-- IP分组数据展现 END -->
        </div>
        <!-- IP流分组量统计 END -->
    </div>
</div>
</body>
</html>
