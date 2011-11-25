<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>IP流量趋势</title>
<script type="text/javascript" src="${jsPath}amcharts/flash/swfobject.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/amcharts.js"></script>
<script type="text/javascript" src="${jsPath}amcharts/javascript/raphael.js"></script>
<script type="text/javascript" src="${jsPath}rl/src/RealLight.js"></script>
</script>
<script language="javascript">
rl.importCss("nf:std_info");
rl.importJs("nf:reportQuery");
rl.importJs("nf:queryDialog");
rl.addAutoDecoArea("mainForm");

// 查询
function query(){
    var mainForm = document.mainForm;
    mainForm.action = "${rootPath}ipTraffic_list";
    mainForm.submit(); 
}
</script>
<script type="text/javascript">
var params = 
{
	bgcolor:"#FFFFFF"
};

var flashVars = 
{
	path: "${jsPath}amcharts/flash/",
	chart_data: "<s:property value="charts['default']" />",
	chart_settings: "<settings><hide_bullets_count>18</hide_bullets_count><data_type>csv</data_type><plot_area><margins><left>50</left><right>40</right><top>55</top><bottom>30</bottom></margins></plot_area><grid><x><alpha>10</alpha><approx_count>8</approx_count></x><y_left><alpha>10</alpha></y_left></grid><axes><x><width>1</width><color>0D8ECF</color></x><y_left><width>1</width><color>0D8ECF</color></y_left></axes><indicator><color>0D8ECF</color><x_balloon_text_color>FFFFFF</x_balloon_text_color><line_alpha>50</line_alpha><selection_color>0D8ECF</selection_color><selection_alpha>20</selection_alpha></indicator><zoom_out_button><text_color_hover>FF0F00</text_color_hover></zoom_out_button><help><button><color>FCD202</color><text_color>000000</text_color><text_color_hover>FF0F00</text_color_hover></button><balloon><color>FCD202</color><text_color>000000</text_color></balloon></help><graphs><graph gid='0'><title>IP流量</title><color>B0DE09</color><color_hover>FF0F00</color_hover><line_width>2</line_width><fill_alpha>30</fill_alpha><bullet>round</bullet></graph></graphs><labels><label lid='0'><text><![CDATA[<b>IP流量趋势</b>]]></text><y>15</y><text_size>16</text_size><align>center</align></label></labels></settings>"
};
swfobject.embedSWF("${jsPath}amcharts/flash/amline.swf", "chartdiv", "600", "400", "8.0.0", "${jsPath}amcharts/flash/expressInstall.swf", flashVars, params);
</script>
</head>
<body>
<div class="std_info">
    <div class="page_wrapper limit_770">
    	<!-- 查询页面 START -->
        <!-- <div class="top_bar limit_770">
			<a title="显示/隐藏 查询" onClick="toggleSearch();" class="icon_btn" href="javascript:void(0);">
            <img src="${rootPath}resource/image/icons/search.gif" /> 查询
            </a>
            <span class="sep">&nbsp;</span>
            <a title="导出为pdf文件" onClick="exportPdf();return false;" class="icon_btn" href="javascript:void(0);" >
            <img src="${rootPath}resource/image/icons/export_pdf.gif" /> 导出PDF
            </a>
		</div> -->
        <!-- 查询页面 END -->
        <h3 class="title">IP流量趋势</h3>
        <!-- IP流量趋势统计 START -->
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
            <div>
            	<c:out value="${dto.ipAddress}"/>
                <c:forEach var="periodList" items="${dto.statPeriodList}">
                    <c:if test="${periodList.key == dto.statPeroid}"><c:out value="${periodList.value}"/></c:if>
                </c:forEach>
            </div>
            <div id="chartdiv" style="width:600px; height:400px; background-color:#FFFFFF"></div>
        </div>
        <!-- IP流量趋势统计 END -->
    </div>
</div>
</body>
</html>
