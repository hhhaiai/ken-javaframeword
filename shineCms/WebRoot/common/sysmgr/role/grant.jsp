<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>给角色[${e.name}]授权</title>
<link title="${themes}" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="${themes}" rel="stylesheet" href="${path}r/css/themes/${themes}/style.css"/>
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<script type="text/javascript">
//提交表单
function submitForm(){
	var url = "${path}sysmgr/role_saveGrant.do";
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
var autoFun = false;
//点击自动勾选功能
function autoFunctionCheck(target){
	autoFun = target.checked;
}
/**
 * 全选/全取消
 */
function checkAll(target){
	if(target.checked){
		var cks = $("[pid]");
		for(var i=0,len=cks.length;i<len;i++){
			cks[i].checked=true;
		}
	}else{
		var cks = $("[pid]");
		for(var i=0,len=cks.length;i<len;i++){
			cks[i].checked=false;
		}
	}
}
/**
 * 点击菜单复选时,如果选中则将所有上层菜单选中,如果取消选中则取消所有子菜单及功能选中
 * @param {Object} target	点击的目标
 */
function menuCheck(target){
	if(target.checked){
		var pid = target.getAttribute("pid");
		var parent = document.getElementById(pid);
		if(parent){
			parent.checked=true;
			menuCheck(parent);
		}
		if(autoFun){
			var id = target.getAttribute("id");
			menuFunctionCheck(id);
		}
	}else{
		var id = target.getAttribute("id");
		var cs = $("[pid='"+id+"']");
		for(var i=0,len=cs.length;i<len;i++){
			var c = cs[i];
			c.checked=false;
			menuCheck(c);
		}
		$("#check_all").checked=false;
	}
}
/**
 * 选中菜单下的功能
 */
function menuFunctionCheck(id){
	var cs = $(".funs[pid='"+id+"']");
	var len;
	if(cs&&(len=cs.length)>0){
		for(var i=0;i<len;i++){
			var c = cs[i];
			c.checked=true;
		}
	}
}
/**
 * 点击功能复选时,如果选中则将相应的菜单勾选中
 * @param {Object} target
 */
function funCheck(target){
	if(target.checked){
		var pid = target.getAttribute("pid");
		var parent = document.getElementById(pid);
		if(parent){
			parent.checked=true;
			menuCheck(parent);
		}
	}
}
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
						<input type="hidden" name="e.roleId" value="${e.roleId}"/>
						<div style="padding: 2px 10px;">
							<input id="autoFunction" type="checkbox" value="1" style="vertical-align: middle;" onclick="autoFunctionCheck(this)"/><label for="autoFunction">自动勾选功能</label>
						</div>
						<table class="line_table" style="width:100%;">
							<tr>
								<th style="width:5%;">
									<label for="check_all"><input id="check_all" type="checkbox" name="menu_all" value="1" onclick="checkAll(this)"/></label>
								</th>
								<th style="width:32%;">菜 单</th>
								<th style="width:63%;">功 能</th>
							</tr>
							<c:forEach var="m" items="${menuList}">
							<tr>
								<td align="center">
									<input id="menu_${m.menuId}" type="checkbox" name="menus" value="${m.menuId}" ${m.checked?"checked='checked'":""} pid="menu_${m.pid}" onclick="menuCheck(this)"/>
								</td>
								<td><label for="menu_${m.menuId}">${m.menuName}</label></td>
								<td>
									<c:choose>
										<c:when test="${fn:length(m.funs)>0}">
											<c:forEach var="f" items="${m.funs}">
											<input id="fun_${f.funId}" class="funs" type="checkbox" name="funs" value="${f.funId}" ${f.checked?"checked='checked'":""} style="vertical-align: middle;" pid="menu_${m.menuId}" onclick="funCheck(this)"/><label for="fun_${f.funId}">${f.funName}</label>&nbsp;
											</c:forEach>
										</c:when>
										<c:otherwise>&nbsp;</c:otherwise>
									</c:choose>
								</td>
							</tr>
							</c:forEach>
							<tr>
								<td colspan="3" align="center">
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