<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>${param.method eq 'add'?'增加权限功能':'编辑权限功能'}</title>
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link rel="stylesheet" href="${path}r/css/themes/${themes}/style.css"/>
<script type="text/javascript">
var validator;
//提交表单
function submitForm(){
	if(!validator.form())
		return;
	var url = "${path}sysmgr/fun_${param.method eq 'add'?'save':'update'}.do";
	var formData = $("#editForm").serialize();
    $.post(url,formData,function(data){
    	$.shine.showAjaxMsg(data,function(){
    		window.parent.saveSuccess();
    	});
    });
}
//点击取消按钮,关闭对话框
function cancel(){
	window.parent.closeEditDialog();
}
var uindex = 1;
function addUrlLine(){
	
}
$(document).ready(function() {
	 // 对表单进行校验
    validator = $('#editForm').validate({
        rules : {
            'e.funName' : {
    			required : true,
    			maxlength : 50
    		}, 
    		'e.orderId' : {
    			required : true,
    			digits : true,
    			max : 9999
    		}
        }
    });
});
</script>
</head>

<body>
<div class="box1">
	<div class="box1_topcenter">
		<div class="box1_topleft">
			<div class="box1_topright"></div>
		</div>
	</div>
	<div class="box1_middlecenter">
		<div class="box1_middleleft">
			<div class="box1_middleright">
				<div class="boxContent" style="overflow: visible;">
					<form id="editForm" method="post">
						<input type="hidden" id="menuId" name="e.funId" value="${e.funId}"/>
						<input type="hidden" id="menuId" name="e.menuId" value="${e.menuId}"/>
						<table class="simple_table" style="width:100%;">
							<tr>
								<td class="label"><span class="red">*</span> 名称：</td>
								<td><input class="input" type="text" name="e.funName" value="${e.funName}"/></td>
							</tr>
							<tr>
								<td class="label"><span class="red">*</span> 排序：</td>
								<td><input class="input" type="text" name="e.orderId" value="${e.orderId eq null?1:e.orderId}"/></td>
							</tr>
							<tr>
								<td class="label" valign="top"><span class="red">*</span>  URL：</td>
								<td>
									<table id="urlTable" class="line_table" style="width:100%;">
										<tr>
											<td colspan="3">
												<a href="javascript:void(0);" onclick="addUrlLine();"><img src="${path}r/css/themes/${themes}/image/icon/add.gif" border="0" align="absmiddle"/>增加一行</a>
											</td>
										</tr>
										<tr>
											<td width="50%">URL</td>
											<td width="30%">记录日志</td>
											<td width="20%">删除</td>
										</tr>
										<c:choose>
											<c:when test="${param.method eq 'add' or fn:length(e.urls)<1}">
												<tr>
													<td><input type="text" class="input" name="uurl" value="" maxlength="500" style="width: 180px;"/></td>
													<td>
														<label id="log_0"><input id="log_0" type="radio" value="1"/>是</label>
														<label id="log_1"><input id="log_1" type="radio" value="0" checked="checked"/>否</label>
													</td>
													<td>
														<a href="javascript:void(0);" onclick=""><img src="${path}r/css/themes/${themes}/image/icon/delete.gif" border="0" align="absmiddle"/>删除</a>
													</td>
												</tr>
											</c:when>
											<c:otherwise>
												<c:forEach var="u" items="${e.urls}" varStatus="idx">
												<tr>
													<td>
														<input type="text" class="input" name="uurl" value="${u.uurl}" maxlength="500" style="width: 180px;"/>
													</td>
													<td>
														<label id="log_0"><input id="log_0" type="radio" value="1" ${u.isLog==1?"checked='checked'":""}/>是</label>
														<label id="log_1"><input id="log_1" type="radio" value="0" ${u.isLog!=1?"checked='checked'":""}/>否</label>
													</td>
													<td>
														<c:if test="${idx.first}">&nbsp;</c:if>
														<c:if test="${!idx.first}">
															<a href="javascript:void(0);" onclick=""><img src="${path}r/css/themes/${themes}/image/icon/delete.gif" border="0" align="absmiddle"/>删除</a>
														</c:if>
													</td>
												</tr>
												</c:forEach>
											</c:otherwise>
										</c:choose>
									</table>
								</td>
							</tr>
						</table>
						<table class="simple_table" style="width:100%;">
							<tr>
								<td align="center">
									<input type="button" value="提 交" onclick="submitForm();" />
									<input type="button" value="取 消" onclick="cancel();" />
								</td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</div>
	</div>
	<div class="box1_bottomcenter">
		<div class="box1_bottomleft">
			<div class="box1_bottomright"></div>
		</div>
	</div>
</div>
</body>
</html>