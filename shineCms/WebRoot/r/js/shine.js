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
		$.shine.showAjaxMsg(data,function(){
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
		var code = rs.code;
		var msgObj;
    	if(code == 1){	//成功
    		msgObj = {title: "操作提示", content: "<font color='blue'>"+rs.msg+"</font>", type:"success", timeout: 2000};
    		if(successHandle){
    			try{
	    			successHandle.call();
    			}catch(e){
    				alert(e);
    			}
    		}
    	}else if(code == 2){	//失败
    		msgObj = {title: "操作提示", content: "<font color='scarlet'>"+rs.msg+"</font>", type:"warning", timeout: 2000};
    	}else{	//3：后台异常、4：登录超时、5：没有权限
    		msgObj = {title: "操作提示", content: "<font color='red'>"+rs.msg+"</font>", type:"error", timeout: 2000};
    	}
    	this.showTip(msgObj);
	},
	
	/**
	 * 显示提示信息(如果可以则使用顶层页面弹出信息,否则由本页面弹出)
	 * @param {Object} msgObj
	 */
	showTip:function(msgObj){
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
	openDialog : function(opt){
		var setting = {
			id:"",
			autoOpen: false,
            width:600,
            height:400,
            modal: true,
            url:"about:blank"
		}
		$.extend(true,setting,opt);
		var divId = setting.id;
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
		//为了避免延迟，所以在OpenDialog后再设置iframe的url，如果URL与上次相同则不重复设置
		if($("#"+iframeId).attr("src")!=setting.url)
			$("#"+iframeId).attr("src",setting.url);
		return dlg;
	},
	
	/**
	 * 创建omGrid表格
	 * @param {Object} opt
	 * @return {TypeName} 
	 */
	omGrid : function(opt){
		var setting = {
			id: "",
			errorMsg: "取数出错或者没有权限",
			onError: function(XMLHttpRequest,textStatus,errorThrown,event){
		    	$.shine.showTip({title: "提示", content: "<font color='red'>取数出错或者没有权限</font>", type:"error", timeout: 2000});
		    }
		}
		$.extend(true,setting,opt);
		var _grid = $('#'+opt.id).omGrid(setting);
		return _grid;
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
	accept: "禁止上传的文件类型"
};

//自定义JQuery函数
(function($) {
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
})(jQuery);

/**
 * 将DIV生成Box样式
 * 用法：$("#box").box();
 * 可通过参数type来选择背景样式，如：$("#box").box({type:2});
 * 其中type可赋值 1:白色背景(默认) 2:天蓝背景
 */
(function($) {
	$.omWidget('shine.box', {
		options:{
			type : 1
		},
		_create:function(){
			var options=this.options,el=this.element.show();
			var h = el.html();
			el.addClass("box1");
			var tp,ct,bt;
			if(options.type==1){
				tp = this._getBox1Top();
				ct = this._getBox1Middle();
				bt = this._getBox1Bottom();
			}else if(options.type==2){
				tp = this._getBox2Top();
				ct = this._getBox2Middle();
				bt = this._getBox2Bottom();
			}
			el.wrapInner($(ct));
			el.prepend(tp);
			el.append(bt);
		},
		_getBox1Top : function(){
			var s = '<div class="box1_topcenter">' +
						'<div class="box1_topleft">' +
							'<div class="box1_topright"></div>' +
						'</div>' +
					'</div>';
			return s;
		},
		_getBox1Middle:function(){
			var s = '<div class="box1_middlecenter">' +
						'<div class="box1_middleleft">' +
							'<div class="box1_middleright">' +
								'<div class="boxContent" style="overflow: visible;">';
			return s;
		},
		_getBox1Bottom : function(){
			var s = '<div class="box1_bottomcenter">' +
						'<div class="box1_bottomleft">' +
							'<div class="box1_bottomright"></div>' +
						'</div>' +
					'</div>';
			return s;
		},
		_getBox2Top : function(){
			var s = '<div class="box1_topcenter2">' +
						'<div class="box1_topleft2">' +
							'<div class="box1_topright2"></div>' +
						'</div>' +
					'</div>';
			return s;
		},
		_getBox2Middle : function(){
			var s = '<div class="box1_middlecenter">' +
						'<div class="box1_middleleft2">' +
							'<div class="box1_middleright2">' +
								'<div class="boxContent" style="overflow: visible;">';
			return s;
		},
		_getBox2Bottom : function(){
			var s = '<div class="box1_bottomcenter2">' +
						'<div class="box1_bottomleft2">' +
							'<div class="box1_bottomright2"></div>' +
						'</div>' +
					'</div>';
			return s;
		},
		destroy : function(){
        	var el = this.element;
        	var ct = el.find(".boxContent");
        	var ht = ct.html();
        	el.contents().remove();		//这里会有点问题：里面的omCombo点击没数据了
        	//el.append(ct);	//这样的话连下拉框都没了,所以用下面的html()
        	el.removeClass("box1");
        	el.html(ht);
        }
	});
})(jQuery);