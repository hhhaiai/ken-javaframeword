<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>角色管理</title>
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<script type="text/javascript" src="${path}r/js/my.js"></script>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/css/${themes}/om-${themes}.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="default" rel="stylesheet" href="${path}r/css/themes/${themes}/list.css"/>
<script type="text/javascript">
$(document).ready(function() {
	var dialog = $("#dialog-form").omDialog({
        width: 500,
        autoOpen : false,
        modal : true,
        resizable : false,
        buttons : {
            "提交" : function(){
				submitDialog();
          		return false; //阻止form的默认提交动作
      		},"取消" : function() {
                $("#dialog-form").omDialog("close");//关闭dialog
            }
        }
    });
    //显示dialog并初始化里面的输入框的数据
    var showDialog = function(title,rowData){
        validator.resetForm();
        rowData = rowData || {};
        $("input[name='e.id']",dialog).val(rowData.id);
        $("input[name='e.name']",dialog).val(rowData.name);
        $("textarea[name='e.remark']",dialog).val(rowData.remark);
        dialog.omDialog("option", "title", title);
        dialog.omDialog("open");//显示dialog
    };
    //dialog中点提交按钮时将数据提交到后台并执行相应的add或modify操作
    var submitDialog = function(){
        if (validator.form()) {
	        var url = "${path}sysmgr/role_"+(isAdd?"save":"update")+".do";
	        $.post(url,$("#editForm").serialize(),function(data){
	        	jkp.persistBack(data,$('#grid'),$("#dialog-form"));
	        });
        }
    };
    // 对表单进行校验
    var validator = $('#editForm').validate({
        rules : {
            'e.name' : {
    			required : true,
    			maxlength : 50
    		}, 
            'e.remark' : {
    			required : false,
    			maxlength : 10
    		} 
        }, 
        messages : {
            'e.name' : {
        		required : "角色名不能为空",
        		maxlength : "角色名不能超过50个字符"
        	},
            'e.remark' : {
        		maxlength : "备注不能超过100个字符"
        	}
        }
    });
    var isAdd = true; //弹出窗口中是添加操作还是修改操作？
	$('#btn_add').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/add.gif'},
		onClick : function(){
			isAdd = true;
			showDialog('新增角色');//显示dialog
		}
	});
	$('#btn_modify').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/modify.gif'},
		onClick : function(){
			var selections=$('#grid').omGrid('getSelections',true);
            var len = selections.length;
            if (len == 0) {
            	alert('请选择要修改的记录');
                return false;
            }
            if(len >1 ){
            	alert('只能选择一条记录');
                return false;
            }
            var id = selections[0].roleId;
            $.post('${path}sysmgr/role_viewAjax.do','e.roleId='+id,function(rs){
            	isAdd = false;
				showDialog('编辑['+rs.name+']',rs);
            });
		}
	});
	$('#btn_delete').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/delete.gif'},
		onClick : function(){
			var selections=$('#grid').omGrid('getSelections',true);
            var len = selections.length;
            if (len == 0) {
            	alert('请至少选择一行记录');
                return false;
            }
            if(confirm("确认删除所选的"+len+"条记录？")){
	            //将选择的记录的id传递到后台去并执行delete操作
	            var ids = '';
	            for(var i=0;i<len;i++){
	            	ids += selections[i].roleId + ',';
	            }
	            ids = ids.substr(0,ids.length-1);
	            $.post('${path}sysmgr/role_delete.do','id='+ids,function(data){
	                jkp.persistBack(data,$('#grid'));
	            });
            }
		}
	});
    $('#grid').omGrid({
        dataSource : '${path}sysmgr/role_list.do',
        singleSelect : false,
        colModel : [ {header : 'ID', name : 'roleId', width : 100, align : 'center'}, 
                     {header : '角色名', name : 'name', width:120, align : 'left'}, 
                     {header : '备注', name : 'remark', align : 'left', width : 'autoExpand'}
                   ]
    });
});
</script>
</head>
<body>

<div class="toolbar mar">
     <a href="javascript:void(0);" id="btn_add">添加</a>
     <a href="javascript:void(0);" id="btn_modify">修改</a>
     <a href="javascript:void(0);" id="btn_delete">删除</a>
</div>
<table id="grid"></table>
<div id="dialog-form">
    <form id="editForm">
    <input type="hidden" name="e.id" value=""/>
    <table>
        <tr>
            <td>角色名：</td>
            <td><input name="e.name" /></td>
        </tr>
        <tr>
            <td>备注：</td>
            <td>
            	<textarea name="e.remark" rows="3" cols="55" style="width:350px;height:50px;"></textarea>
            </td>
        </tr>
    </table>
	</form>
</div>
</body>
</html>