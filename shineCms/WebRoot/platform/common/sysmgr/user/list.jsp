<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/path.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>用户管理</title>
<script type="text/javascript" src="${path}r/operamasks-ui/js/jquery.min.js"></script>
<script type="text/javascript" src="${path}r/operamasks-ui/js/operamasks-ui.min.js"></script>
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/themes/${themes}/om-base.css">
<link title="default" rel="stylesheet" href="${path}r/operamasks-ui/themes/${themes}/om-all.css">
<link rel="stylesheet" href="${path}r/css/base.css"/>
<link title="default" rel="stylesheet" href="${path}r/css/themes/${themes}/list.css"/>
<script type="text/javascript">
$(document).ready(function() {
	var dialog = $("#dialog-form").omDialog({
        width: 400,
        autoOpen : false,
        modal : true,
        resizable : false,
        buttons : {
            "提交" : function(){
          
          return false; //阻止form的默认提交动作
      	},
            "取消" : function() {
                $("#dialog-form").omDialog("close");//关闭dialog
            }
        }
    });
	var qdlg = $("#query-form").omDialog({
        width: 400,
        autoOpen : false,
        modal : true,
        resizable : false,
        buttons : {
            "查询" : function(){
				var q1 = $("input[name='Q_username_eq']",qdlg).val();
				var q2 = $("input[name='Q_name_lk']",qdlg).val();
				var url = '${path}sysmgr/user_listJSON.do?Q^S^username^EQ='+q1+'&Q^S^name^LK='+q2;
          		$('#grid').omGrid('setData',url);
          		$("#query-form").omDialog("close");
        		return false; //阻止form的默认提交动作
      	},
            "取消" : function() {
                $("#query-form").omDialog("close");//关闭dialog
            }
        }
    });
    //显示dialog并初始化里面的输入框的数据
    var showDialog = function(title,rowData){
        validator.resetForm();
        rowData = rowData || {};
        $("input[name='e.username']",dialog).val(rowData.username);
        $("input[name='e.name']",dialog).val(rowData.name);
        dialog.omDialog("option", "title", title);
        dialog.omDialog("open");//显示dialog
    };
    //dialog中点提交按钮时将数据提交到后台并执行相应的add或modify操作
    var submitDialog = function(){
        if (validator.form()) {
	        var submitData={
	            'e.id':$("input[name='e.id']",dialog).val(),
	            'e.username':$("input[name='e.username']",dialog).val(),
	            'e.password':$("input[name='e.password']",dialog).val(),
	            'e.name':$("input[name='e.name']",dialog).val()
	        };
	        $.post('${path}sysmgr/user_saveAjax.do',submitData,function(){
	            if(isAdd){
	                //$('#grid').omGrid('reload',1);//如果是添加则滚动到第一页并刷新
	                $('#grid').omGrid('reload');
	                $.omMessageTip.show({title: "操作成功", content: "添加数据成功", timeout: 1500});
	            }else{
	                $('#grid').omGrid('reload');//如果是修改则刷新当前页
	                $.omMessageTip.show({title: "操作成功", content: "修改数据成功", timeout: 1500});
	            }
	            $("#dialog-form").omDialog("close"); //关闭dialog
	        });
        }
    };
    // 对表单进行校验
    var validator = $('#userForm').validate({
        rules : {
            'e.username' : {
    			required : true,
    			maxlength : 50
    		}, 
            'e.password' : {
    			required : true,
    			maxlength : 20
    		},
            'e.name' : {
    			required : true,
    			maxlength : 50
    		} 
        }, 
        messages : {
            'e.username' : {
        		required : "用户名不能为空",
        		maxlength : "用户名不能超过50个字符"
        	},
            'e.password' : {
        		required : "密码不能为空",
        		maxlength : "密码不能超过20个字符"
        	},
            'e.name' : {
        		required : "姓名不能为空",
        		maxlength : "姓名不能超过50个字符"
        	}
        }
    });
    var isAdd = true; //弹出窗口中是添加操作还是修改操作？
	$('#btn_add').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/add.gif'},
		onClick : function(){
			isAdd = true;
			showDialog('新增');//显示dialog
		}
	});
	$('#btn_modify').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/modify.gif'}
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
	            	ids += selections[i].userId + ',';
	            }
	            ids = ids.substr(0,ids.length-1);
	            $.post('${path}sysmgr/user_delete.do','id='+ids,function(rs){
	                $.omMessageTip.show({title: "提示信息", content: rs, timeout: 2000});
	                if(rs.indexOf("成功")>0)
	                	$('#grid').omGrid('reload');//刷新当前页数据
	            });
            }
		}
	});
	$('#btn_refresh').omButton({
		icons : {left : '${path}r/css/themes/${themes}/image/icon/delete.gif'},
		onClick : function(){
			qdlg.omDialog("open");
		}
	});
    $('#grid').omGrid({
        dataSource : '${path}sysmgr/user_listJSON.do',
        singleSelect : false,
        colModel : [ {header : 'ID', name : 'userId', width : 100, align : 'center'}, 
                     {header : '用户名', name : 'username', width : 120, align : 'left'}, 
                     {header : '姓名', name : 'name', align : 'left', width : 'autoExpand'} ]
    });
});
</script>
</head>

<body>
<div class="toolbar mar">
     <a href="javascript:void(0);" id="btn_add">添加</a>
     <a href="javascript:void(0);" id="btn_modify">修改</a>
     <a href="javascript:void(0);" id="btn_delete">删除</a>
     <a href="javascript:void(0);" id="btn_refresh">查询</a>
</div>
<table id="grid"></table>
<div id="dialog-form">
    <form id="userForm">
    <input name="e.id" style="display: none"/>
    <table>
        <tr>
            <td>用户名：</td>
            <td><input name="e.username" /></td>
        </tr>
        <tr>
            <td>密码：</td>
            <td><input name="e.password" /></td>
        </tr>
        <tr>
            <td>姓名：</td>
            <td><input name="e.name" /></td>
        </tr>
    </table>
	</form>
</div>
<div id="query-form">
    <form id="queryForm">
    <table>
        <tr>
            <td>用户名：</td>
            <td><input name="Q_username_eq" /></td>
        </tr>
        <tr>
            <td>姓名：</td>
            <td><input name="Q_name_lk" /></td>
        </tr>
    </table>
	</form>
</div>
</body>
</html>