<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>IP流量</title>
<script type="text/javascript" src="${jsPath}amcharts/flash/swfobject.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/amcharts.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/raphael.js"></script>
<script type="text/javascript" src="${jsPath}rl/src/RealLight.js"></script>
</script>
<script language="javascript">
rl.importCss("nf:std_info");
rl.importJs("gui.indicator.ProgressBar");
rl.importJs("nf:reportQuery");
rl.importJs("nf:queryDialog");
rl.addAutoDecoArea("mainForm", "ipSrcTrafficList", "ipDstTrafficList");

rl.gui.indicator.ProgressBar.prototype.barSkinRule = function(progress){
    return progress <= 25 ? "green" : 
          (progress <= 50 ? "yellow" : 
          (progress <= 80 ? "orange" : "red"));
}

// 查询
function query(){
    var mainForm = document.mainForm;
    mainForm.action = "${rootPath}ipTraffic_list";
    mainForm.submit(); 
}

// 具体IP查询
function showDetail(ipAddress, ipType) {
	document.mainForm.action ='${rootPath}detail/ipTrafficDetail_list?ipType=' + ipType + '&ipAddress=' + ipAddress;
	document.mainForm.target = "_self";
	document.mainForm.submit();
}

// 导出图片
function exportImage() {
	var flashMovie = document.getElementById('chartdivsrc');
	if (flashMovie) {
		flashMovie.exportImage('${rootPath}ipTraffic_exportImage'); 
	}
} 

// 流量趋势
function showFlowTrend(ip) {
	var mainForm = document.mainForm;
	mainForm.action ='${rootPath}trend/ipTrafficTrend_list?ipAddress=' + ip;
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
var flashVarsSrc = 
{
	path: "${jsPath}amcharts/flash/",
	chart_data: "<s:property value="charts['ipSrc']" />",
	chart_settings: "<settings><data_type>csv</data_type><legend><enabled>0</enabled></legend><pie><inner_radius>30</inner_radius><height>7</height><angle>10</angle><gradient></gradient></pie><animation><start_time>2</start_time><pull_out_time>1</pull_out_time><start_effect>strong</start_effect><sequenced>1</sequenced></animation><data_labels><show>IP:{title}</show><max_width>100</max_width></data_labels><labels><label lid='0'><text><![CDATA[源ip流量]]></text><y>10</y><text_size>14</text_size><align>center</align></label></labels></settings>"
};
var flashVarsDst = 
{
	path: "${jsPath}amcharts/flash/",
	chart_data: "<s:property value="charts['ipDst']" />",
	chart_settings: "<settings><data_type>csv</data_type><legend><enabled>0</enabled></legend><pie><inner_radius>30</inner_radius><height>7</height><angle>10</angle><gradient></gradient></pie><animation><start_time>1</start_time><pull_out_time>1</pull_out_time><start_effect>strong</start_effect><sequenced>1</sequenced></animation><data_labels><show>IP:{title}</show><max_width>100</max_width></data_labels><labels><label lid='0'><text><![CDATA[目标ip流量]]></text><y>10</y><text_size>14</text_size><align>center</align></label></labels></settings>"
};

swfobject.embedSWF("${jsPath}amcharts/flash/ampie.swf", "chartdivsrc", "100%", "400", "8.0.0", "${jsPath}amcharts/flash/expressInstall.swf", flashVarsSrc, params);
swfobject.embedSWF("${jsPath}amcharts/flash/ampie.swf", "chartdivdst", "100%", "400", "8.0.0", "${jsPath}amcharts/flash/expressInstall.swf", flashVarsDst, params);
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
        <h3 class="title">IP流量统计</h3>
        <!-- IP流量统计 START -->
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
            <!-- 以源IP分组数据展现 START -->
            <div>
            <s:if test="#request.dbModels['ipSrc'].size > 0">
            <table id="ipSrcTrafficList" class="data_list" width=100% cellSpacing=0 cellPadding=0 border=0>
            <tr>
            	<th>&nbsp;</th>
                <th width="200px">源ip地址</th>
            	<th>流量(MB)</th>
                <th>百分比</th>
                <th></th>
                <th>流量趋势</th>
            </tr>
            <s:iterator value="#request.dbModels['ipSrc']" status="dbModel">
            <tr>
            	<td><s:property value="#dbModel.index + 1" /></td>
            	<td><a href="javascript:void(0);" onclick="showDetail('<s:property value="dbModels['ipSrc'][#dbModel.index]['src_ip']" />', 1);"><s:property value="dbModels['ipSrc'][#dbModel.index]['src_ip']" /></a></td>
                <td><s:property value="dbModels['ipSrc'][#dbModel.index]['format_bytes_total']" /></td>
                <td><span ctype="ProgressBar" barSkin="green" progress="<s:property value="dbModels['ipSrc'][#dbModel.index]['percentage']" />"></td>
                <td></span><s:property value="dbModels['ipSrc'][#dbModel.index]['percentage']" />%</td>
                <td><img style="cursor:pointer" height="14" width="14" src="${rootPath}resource/image/icons/trend.png" border="0" onclick="showFlowTrend('<s:property value="dbModels['ipSrc'][#dbModel.index]['src_ip']" />')"></td>
            </tr>
            </s:iterator>
            </table>
            <!-- 源IP数据报表 START -->
			<div id="chartdivsrc" style="width: 100%; height: 400px;"></div>
            <!-- <input type="button" value="导出图片" onClick="exportImage();" /> -->
            <!-- 源IP数据报表 END -->
            </s:if>
            <s:else><div style="text-align:center"><img src="${rootPath}resource/image/default/no_data.gif" /></div></s:else>
            </div>
            <!-- 以源IP分组数据展现 END -->
            <!-- 以目标IP分组数据展现 START -->
            <div>
            <s:if test="#request.dbModels['ipDst'].size > 0">
            <table id="ipDstTrafficList" class="data_list" width=100% cellSpacing=0 cellPadding=0 border=0>
            <tr>
            	<th>&nbsp;</th>
                <th width="200px">目标ip地址</th>
            	<th>流量(MB)</th>
                <th>百分比</th>
                <th></th>
                <th>流量趋势</th>
            </tr>
            <s:iterator value="#request.dbModels['ipDst']" status="dbModel">
            <tr>
            	<td><s:property value="#dbModel.index + 1" /></td>
            	<td><a href="javascript:void(0);" onclick="showDetail('<s:property value="dbModels['ipDst'][#dbModel.index]['dst_ip']" />', 2);"><s:property value="dbModels['ipDst'][#dbModel.index]['dst_ip']" /></a></td>
                <td>
                <s:property value="dbModels['ipDst'][#dbModel.index]['format_bytes_total']" />
                </td>
                <td><span ctype="ProgressBar" barSkin="green" progress="<s:property value="dbModels['ipDst'][#dbModel.index]['percentage']" />"></span></td>
                <td><s:property value="dbModels['ipDst'][#dbModel.index]['percentage']" />%</td>
                <td><img height="14" width="14" src="${rootPath}resource/image/icons/trend.png" border="0"></td>
            </tr>
            </s:iterator>
            </table>
            <!-- 目标IP数据报表 START -->
            <div id="chartdivdst" style="width: 100%; height: 400px;"></div>
            <!-- 目标IP数据报表 END -->
            </s:if>
            <s:else><div style="text-align:center"><img src="${rootPath}resource/image/default/no_data.gif" /></div></s:else>
            </div>
            <!-- 以目标IP分组数据展现 END -->
        </div>
        <!-- IP流量统计 END -->
    </div>
</div>
</body>
</html>
