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

// 查询
function query(){
    var mainForm = document.mainForm;
    mainForm.action = "${rootPath}iptraffic_list";
    mainForm.submit(); 
}
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
        </div>
        <!-- IP流量统计 START -->
    </div>
</div>
</body>
</html>
