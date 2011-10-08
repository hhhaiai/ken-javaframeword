<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title></title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="${jsPath}rl/src/RealLight.js"></script>
<script type="text/javascript">   
rl.importCss("nf:std_info");
rl.importJs("gui.indicator.ProgressBar");
rl.importJs("nf:reportQuery");
rl.importJs("nf:queryDialog");
rl.addAutoDecoArea("mainForm", "queryDialogContent", "ipList");

rl.gui.indicator.ProgressBar.prototype.barSkinRule = function(progress){
    return progress <= 25 ? "green" : 
          (progress <= 50 ? "yellow" : 
          (progress <= 80 ? "orange" : "red"));
}

// 查询
function query(ipAddress, ipType){
    var mainForm = document.mainForm;
    mainForm.action = "${rootPath}detail/ipTrafficDetail_list?ipType = " + ipType + "&ipAddress=" + ipAddress;
    mainForm.submit();
}

// 分页
function getPage(pageNo, totalPage, ipAddress, ipType){
   document.mainForm.action = 
   '${rootPath}detail/ipTrafficDetail_list?curPage=' + pageNo + '&totalPage=' + totalPage + '&ipType=' + ipType + '&ipAddress=' + ipAddress;
   document.mainForm.target = "_self";
   document.mainForm.submit();
}
</script>
<body>
<div class="std_info">
    <div class="page_wrapper limit_770">
    	<!-- 查询页面 START -->
        <div class="top_bar limit_770">
        	<a title="后退" onClick='history.back();return false;' class="icon_btn" href="javascript:void(0);">
            <img src="${imagePath}icons/back.gif" /> 后退</a>
            <span class="sep">&nbsp;</span>
			<a title="显示/隐藏 查询" onClick="toggleSearch();" class="icon_btn" href="javascript:void(0);">
            <img src="${imagePath}icons/search.gif" /> 查询
            </a>
            <span class="sep">&nbsp;</span>
            <a title="导出为pdf文件" onClick="exportPdf();return false;" class="icon_btn" href="javascript:void(0);" >
            <img src="${imagePath}icons/export_pdf.gif" /> 导出PDF
            </a>
		</div>
        <!-- 查询页面 END -->
        <h3 class="title">
        	<s:if test="dto.ipType == 1">源</s:if><s:else>目标</s:else>IP(${dto.ipAddress})流量统计
        </h3>
        <!-- IP详细展现 START -->
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
                                    <button type="button" onclick="query('${dto.ipAddress}', ${dto.ipType});">查&nbsp;&nbsp;询</button>
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
            <!-- 分页 START -->
            <div class="std_pagination">
                <img class="btn" title="首页" src="${imagePath}icons/go_first.gif"
                onclick="getPage(1, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                <img class="btn" title="上一页" src="${imagePath}icons/go_pre.gif"
                onclick="getPage(${dto.curPage - 1}, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                <input type="text" value="${dto.curPage}" style="width:2em; vertical-align:middle;" />/${dto.totalPage}页
                <img class="btn" title="下一页" src="${imagePath}icons/go_next.gif" 
                onclick="getPage(${dto.curPage + 1}, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                <img class="btn" title="末页" src="${imagePath}icons/go_last.gif"
                onclick="getPage(${dto.totalPage}, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                 &nbsp;当前第${dto.curPage}页，共${dto.totalPage}页
            </div>
            <!-- 分页 END -->
            <!-- 数据展现 START -->
            <div>
            <s:if test="#request.dbModels['default'].size > 0">
            <table id="ipList" class="data_list" width=100% cellSpacing=0 cellPadding=0 border=0>
            <tr>
                <th>&nbsp;</th>
                <s:if test="dto.ipType == 1">
                <th>源IP地址</th>
                <th>源IP端口</th>
                <th>目标IP地址</th>
                <th>目标IP端口</th>
                </s:if>
                <s:else>
                <th>目标IP地址</th>
                <th>目标IP端口</th>
                <th>源IP地址</th>
                <th>源IP端口</th>
                </s:else>
                <th>字节(MB)</th>
                <th>时间</th>
            </tr>
            <s:iterator value="#request.dbModels['default']" status="dbModel">
            <tr>
                <td><s:property value="#dbModels['default'].index + 1" /></td>
                <s:if test="dto.ipType == 1">
                <td><s:property value="dbModels['default'][#dbModel.index]['src_ip']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['src_port']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['dst_ip']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['dst_port']" /></td>
                </s:if>
                <s:else>
                <td><s:property value="dbModels['default'][#dbModel.index]['dst_ip']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['dst_port']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['src_ip']" /></td>
                <td><s:property value="dbModels['default'][#dbModel.index]['src_port']" /></td>
                </s:else>
                <td>
                <s:text name="global.format.number">
                <s:param value="dbModels['default'][#dbModel.index]['bytes'] / 1048576"/>
                </s:text>
                </td>
                <td>
                <s:property value="dbModels['default'][#dbModel.index]['log_time'].substring(0, 19)" />
                </td>
            </tr>
            </s:iterator>
            </table>
            </s:if>
            <s:else><div style="text-align:center"><img src="${imagePath}default/no_data.gif" /></div></s:else>
            </div>
            <!-- 数据展现 END -->
            <!-- 分页 START -->
            <div class="std_pagination">
                <img class="btn" title="首页" src="${imagePath}icons/go_first.gif"
                onclick="getPage(1, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                <img class="btn" title="上一页" src="${imagePath}icons/go_pre.gif"
                onclick="getPage(${dto.curPage - 1}, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                <input type="text" value="${dto.curPage}" style="width:2em; vertical-align:middle;" />/${dto.totalPage}页
                <img class="btn" title="下一页" src="${imagePath}icons/go_next.gif" 
                onclick="getPage(${dto.curPage + 1}, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                <img class="btn" title="末页" src="${imagePath}icons/go_last.gif"
                onclick="getPage(${dto.totalPage}, ${dto.totalPage}, '${dto.ipAddress}', ${dto.ipType})" />
                 &nbsp;当前第${dto.curPage}页，共${dto.totalPage}页
            </div>
            <!-- 分页 END -->
        </div>
        <!-- IP详细展现 END -->
    </div>
</div>
</body>
</html>