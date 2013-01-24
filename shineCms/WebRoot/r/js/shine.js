/**
 * 自定义JS函数
 * @encode UTF-8
 * @author JiangKunpeng
 * 修改者      修改时间         版本       修改描述
 * 
 */

/**
 * 自定义JQuery函数
 */
$.shine = {
	/**
	 * 在列表页中执行Ajax增、删、改后的回调函数
	 * @param data	后台返回的数据
	 * @param grid	要刷新的grid
	 * @param dialog	要关掉的窗口
	 */
	listAjaxBack : function(data,grid,dialog){
		this.showAjaxMsg(data,function(){
			if(grid)
    			grid.omGrid('reload');	//刷新列表数据
    		if(dialog)
            	dialog.omDialog("close"); //关闭dialog
		})
	},
	
	/**
	 * 显示Ajax提交后的信息提示
	 * @param data	返回的结果数据
	 * @param successHandle	返回结果为成功后的回调函数,如果没有则不调用
	 */
	showAjaxMsg : function(data,successHandle){
		var rs = eval("("+data+")");
		var msgObj;
    	if(rs.code == 1){	//成功
    		msgObj = {title: "操作提示", content: "<font color='blue'>"+rs.msg+"</font>", type:"success", timeout: 2000};
    		if(successHandle)
    			successHandle.call();
    	}else if(rs.code == 2){	//失败
    		msgObj = {title: "操作提示", content: "<font color='scarlet'>"+rs.msg+"</font>", type:"warning", timeout: 2000};
    	}else{	//后台异常
    		msgObj = {title: "操作提示", content: "<font color='red'>"+rs.msg+"</font>", type:"error", timeout: 2000};
    	}
    	try{
    		window.top.$.omMessageTip.show(msgObj);
    	}catch(e){
    		$.omMessageTip.show(msgObj);
    	}
	},
	
	/**
	 * 创建并打开对话框
	 * @param {Object} opt
	 * @return {TypeName} 
	 */
	openDialog: function(opt){
		var setting = {
			name:"",
			autoOpen: false,
            width:600,
            height:400,
            modal: true,
            url:"about:blank"
		}
		$.extend(true,setting,opt);
		var divId = setting.name;
		var iframeId = "Dialog_Iframe_"+setting.name;
		var div,iframe;
		if(setting.url!=""){
			if($("#"+iframeId).length==0){
				iframe = $("<iframe>",{
					id: iframeId,
					frameborder: 0,
					css:{
						width:"100%",
						height:"100%"
		            }
				});
			}
		}
		if($("#"+divId).length==0){
			div = $("<div>",{
				id:divId,
				html:iframe
			});
		}else{
			div = $("#"+divId);
			div.html(iframe);
		}
		var dlg = div.omDialog(setting)
		if(!div.omDialog("isOpen")){
			div.omDialog("open");
		}
		//为了避免延迟，所以在OpenDialog后再设置iframe的url
		$("#"+iframeId).attr("src",setting.url);
		return dlg;
	}
};

//针对OM-UI验证器定义中文验证提示
$.validator.messages = {
	required: "必填项",
	number: "请输入数字",
	digits: "必须为非负整数",
	date: "日期格式不正确",
	email: "Email格式不正确",
	url: "URL地址不正确",
	minlength: jQuery.format("至少输入{0}字符"),
	maxlength: jQuery.format("最多输入{0}字符"),
	rangelength: jQuery.format("字符长度必须在{0}至{1}之间"),
	min: jQuery.format("不能小于{0}"),
	max: jQuery.format("不能大于{0}"),
	equalTo: "两次输入不一致",
	range: jQuery.format("大小必须在{0}至{1}之间"),
	accept: "不能上传的文件类型"
}

//扩展JQuery函数
$.extend($.fn, {
	//将表单对象序列化成JSON
    serializeJson: function(){
		var serializeObj={};  
	    var array=this.serializeArray();  
	    $(array).each(function(){  
	        if(serializeObj[this.name]){  
	            if($.isArray(serializeObj[this.name])){  
	                serializeObj[this.name].push(this.value);  
	            }else{  
	                serializeObj[this.name]=[serializeObj[this.name],this.value];  
	            }  
	        }else{  
	            serializeObj[this.name]=this.value;   
	        }  
	    });
	    return serializeObj; 
    }
});