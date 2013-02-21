<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>用户管理</title>
<link title="${themes}" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="${themes}" rel="stylesheet" href="${path}r/css/themes/${themes}/style.css"/>
<script type="text/javascript" src="${path}r/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/js/shine.js"></script>
<script type="text/javascript">
var grid,editDialog,searchDialog,dataUrl;
//保存成功后回调
function saveSuccess(){
	closeEditDialog();
	refreshData();
}
//关闭编辑框
function closeEditDialog(){
	if(editDialog.omDialog('isOpen')){
		editDialog.omDialog('close');
	}
}
//刷新grid数据
function refreshData(){
	grid.omGrid('reload');
}
//打开编辑框
function toEdit(id){
	editDialog = $.shine.openDialog({id:"editDialog", title:"编辑用户", url:"${path}sysmgr/user_toEdit.do?e.userId="+id, width:500, height:300});
}
//删除记录
function toDelete(ids){
	if(confirm("确认删除所选记录？")){
		$.post('${path}sysmgr/user_delete.do','id='+ids,function(data){
            $.shine.listAjaxBack(data,grid);
        });
    }
}
//页面加载后执行
$(document).ready(function() {
	//新增按钮
	$('#btn_add').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/add.gif'},
		onClick : function(){
			editDialog = $.shine.openDialog({id:"editDialog", title:"新增用户", url:"${path}sysmgr/user_toAdd.do", width:500, height:300});
		}
	});
	$('#btn_modify').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/modify.gif'},
		onClick : function(){
			var selections = grid.omGrid('getSelections',true);
            var len = selections.length;
            if (len == 0) {
            	alert('请选择要修改的记录');
                return false;
            }
            if(len >1 ){
            	alert('只能选择一条记录');
                return false;
            }
            var id = selections[0].userId;
            toEdit(id);
		}
	});
	$('#btn_delete').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/delete.gif'},
		onClick : function(){
			var selections = grid.omGrid('getSelections',true);
            var len = selections.length;
            if (len == 0) {
            	alert('请至少选择一行记录');
                return false;
            }
            //将选择的记录的id传递到后台去并执行delete操作
            var ids = '';
            for(var i=0;i<len;i++){
            	ids += selections[i].userId + ',';
            }
            ids = ids.substr(0,ids.length-1);
            toDelete(ids);
		}
	});
	$('#btn_search').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/search.gif'},
		onClick : function(){
			searchDialog.omDialog("open");
		}
	});
	//查询对话框
	searchDialog = $("#query-form").omDialog({
        width: 400,
        autoOpen : false,
        modal : true,
        resizable : false,
        buttons : {
        	"查询" : function(){
				var where = $("#queryForm").serialize();
				dataUrl = "${path}sysmgr/user_list.do?"+where;
				
          		grid.omGrid('setData',dataUrl);	//给grid重新设置数据源
          		searchDialog.omDialog("close");
        		return false; //阻止form的默认提交动作
      		},"取消" : function() {
                searchDialog.omDialog("close");//关闭dialog
            }
        }
    });
	dataUrl = "${path}sysmgr/user_list.do?aa.bb=3";
	//创建grid表格
    grid = $.shine.omGrid({
    	id : 'grid',
        dataSource : dataUrl,
        singleSelect : false,
        colModel : [
                     {header : '用户名', name : 'username', width : 120, align : 'left'}, 
                     {header : '姓名', name : 'name',width : 150, align : 'left'},
                     {header : '操作', name : 'userId', width:100, align : 'center',renderer:function(value,rowData,rowIndex){
                    	 return "<a href='javascript:void(0);' onclick='toEdit(\""+value+"\");' title='修改'><img src='${path}r/css/themes/${themes}/image/icon/modify.gif' border='0' align='absmiddle' alt='修改'/></a>" +
                    	 "&nbsp;<a href='javascript:void(0);' onclick='toDelete(\""+value+"\");' title='删除'><img src='${path}r/css/themes/${themes}/image/icon/delete.gif' border='0' align='absmiddle' alt='删除'/></a>";
                     }}
                   ]
    });
	//将查询表单渲染为盒子模型
    $("#box").box();
});
</script>
</head>
<body class="list">

<div class="toolbar mar">
     <a href="javascript:void(0);" id="btn_add">新增</a>
     <a href="javascript:void(0);" id="btn_modify">修改</a>
     <a href="javascript:void(0);" id="btn_delete">删除</a>
     <a href="javascript:void(0);" id="btn_search">查询</a>
</div>
<table id="grid"></table>
<div id="query-form" style="padding: 5px 10px;">
	<div id="box">
    <form id="queryForm">
    <table>
        <tr>
            <td>用户名：</td>
            <td><input name="Q^S^username^EQ" /></td>
        </tr>
        <tr>
            <td>姓名：</td>
            <td><input name="Q^S^name^LK" /></td>
        </tr>
        <tr>
            <td>角色：</td>
            <td><input name="Q^I^roles.roleId^EQ" /></td>
        </tr>
        <tr>
            <td>排序：</td>
            <td>
            	<select name="S^">
            		<option value="">无</option>
            		<option value="userId">ID升序</option>
            		<option value="userId^desc">ID降序</option>
            		<option value="roles.roleId^asc">角色ID升序</option>
            		<option value="roles.roleId^desc">角色ID降序</option>
            	</select>
            </td>
        </tr>
    </table>
	</form>
	</div>
</div>
</body>
</html>