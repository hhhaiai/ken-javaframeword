<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>${param.method eq 'add'?'新增流程分类':'编辑流程分类'}</title>
<link title="${themes}" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link type="text/css" rel="stylesheet" href="${path}r/ztree/css/zTreeStyle.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="${themes}" rel="stylesheet" href="${path}r/css/themes/${themes}/style.css"/>
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/ztree/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<script type="text/javascript">
var validator;
//提交表单
function submitForm(){
	if(!validator.form())
		return;
	var url = "${path}jbpm/type_${param.method eq 'add'?'save':'update'}.do";
	var formData = $("#editForm").serialize();
    $.post(url,formData,function(data){
    	$.shine.showAjaxMsg(data,function(){
    		<c:if test="${param.method eq 'add'}">
	    		var rs = eval("("+data+")");
	    		$("#typeId").val(rs.datas.id);
    		</c:if>
    		window.parent.saveSuccess($("#editForm").serializeJson());
    	});
    });
}
//点击取消按钮,关闭对话框
function cancel(){
	window.parent.closeEditDialog();
}
var setting = {
	view: {
		dblClickExpand: false,
		showIcon: false,
		showLine: false
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: function(e, treeId, treeNode){
			var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
			nodes = zTree.getSelectedNodes(),
			v = "";
			nodes.sort(function compare(a,b){return a.id-b.id;});
			for (var i=0, l=nodes.length; i<l; i++) {
				v += nodes[i].name + ",";
			}
			if (v.length > 0 ) v = v.substring(0, v.length-1);
			var cityObj = $("#pname");
			cityObj.attr("value", v);
		}
	}
};
var zNodes =[
	{id:1, pId:0, name:"北京"},
	{id:2, pId:0, name:"天津"},
	{id:3, pId:0, name:"上海"},
	{id:6, pId:0, name:"重庆"},
	{id:4, pId:0, name:"河北省", open:true},
	{id:41, pId:4, name:"石家庄"},
	{id:42, pId:4, name:"保定"},
	{id:43, pId:4, name:"邯郸"},
	{id:44, pId:4, name:"承德"},
	{id:5, pId:0, name:"广东省", open:true},
	{id:51, pId:5, name:"广州"},
	{id:52, pId:5, name:"深圳"},
	{id:53, pId:5, name:"东莞"},
	{id:54, pId:5, name:"佛山"}
];
function showSelect() {
	var cityObj = $("#pname");
	var cityOffset = $("#pname").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "showBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
$(document).ready(function() {
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	// 对表单进行校验
    validator = $('#editForm').validate({
        rules : {
            'e.typeName' : {
    			required : true,
    			maxlength : 50
    		}
        }
    });
	$("#box").box();
	$("#pComboTree").comboTree({
		valueFiled : 'pid',
		textFiled : 'ppname',
		treeHeight : 100,
		treeNodes : [
			{id:1, pid:0, name:"广东省", open:true},
			{id:2, pid:1, name:"广州市", open:true},
			{id:3, pid:2, name:"天河区"},
			{id:4, pid:2, name:"越秀区"},
			{id:5, pid:2, name:"海珠区"},
			{id:6, pid:1, name:"中山市"},
			{id:7, pid:1, name:"东莞市"},
			{id:8, pid:0, name:"湖南省"},
			{id:9, pid:8, name:"长沙市"},
			{id:10, pid:8, name:"娄底市"}
		]
	});
});
</script>
</head>

<body>
<div id="box">
	<form id="editForm" method="post">
		<input type="hidden" id="typeId" name="e.id" value="${e.id}"/>
		<input type="hidden" name="e.pid" value="${e.pid}"/>
		<table class="simple_table" style="width:100%;">
			<tr>
				<td class="label">上层菜单：</td>
				<td>${tname}</td>
			</tr>
			<tr>
				<td class="label">上层菜单：</td>
				<td>
					<input class="input" id="pname" type="text" readonly value="" style="float: left;width:131px;"/>
					<img id="showBtn" onclick="showSelect(); return false;" src="${path}r/css/themes/${themes}/image/icon/select_btn_1.gif" onmouseover="this.src='${path}r/css/themes/${themes}/image/icon/select_btn_2.gif'" onmouseout="this.src='${path}r/css/themes/${themes}/image/icon/select_btn_1.gif'" border="0" style="float: left;" />
				</td>
			</tr>
			<tr>
				<td class="label">上层菜单：</td>
				<td>
					<%--
					<span class="om-combo om-widget om-state-default" style="width: 150px;" onmouseover="$(this).addClass('om-state-hover')" onmouseout="$(this).removeClass('om-state-hover')">
						<input type="hidden" name="e.pid" id="e.pid">
						<input type="text" name="pname" value="sdddddddddddddddddddds" style="width: 129px;width:131px\9;"/><span class="om-combo-trigger om-icon-carat-1-s"></span>
					</span>
					 --%>
					<span id="pComboTree"></span>
				</td>
			</tr>
			<tr>
				<td class="label"><span class="red">*</span> 名称：</td>
				<td><input class="input" type="text" name="e.typeName" value="${e.typeName}"/></td>
			</tr>
			<tr>
				<td align="center" colspan="2">
					<input type="button" value="提 交" onclick="submitForm();" />
					<input type="button" value="取 消" onclick="cancel();" />
				</td>
			</tr>
		</table>
	</form>
</div>
<div id="menuContent" class="menuContent" style="display:none; position: absolute;">
	<ul id="treeDemo" class="ztree ztreeCombo" style="width:140px;height:100px;"></ul>
</div>
</body>
</html>