/** Ajax 有关方法
 * @encode UTF-8
 * @author JiangKunpeng
 */

/** 根据浏览器类型创建请求对象
 * return 请求对象
 */
function createXmlHttpRequest() {
	var xmlHttpRequest;
	if (window.ActiveXObject) {
		xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		if (window.XMLHttpRequest) {
			xmlHttpRequest = new XMLHttpRequest();
		}
	}
	return xmlHttpRequest;
}

/** 传入访问url，把返回值传给指定方法
 * @param url			请求的URL
 * @param method		请求方式(GET/POST,用GET方式时注意缓存)
 * @param data			传入的参数
 * @param methodName	回调方法或者处理结果的方法名
 */
function ajax2Url(url, method, data, methodName) {
	var xmlHttpRequest = createXmlHttpRequest();
	method = method.toUpperCase();
	xmlHttpRequest.open(method, url, true);
	if(method=='POST'){
		xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	}else{
		url = urlAppendData(url,data);
		data = null;
	}
	if(typeof methodName == 'string'){
		xmlHttpRequest.onreadystatechange = function () {
			myCallBack(xmlHttpRequest,methodName);
		};
	}else{
		xmlHttpRequest.onreadystatechange = function(){
			methodName(xmlHttpRequest);
		};
	}
	xmlHttpRequest.send(data);
}
/** 传入并执行Ajax回调方法
 * @param xmlHttpRequest	请求对象
 * @param methodName		要调用的方法名
 */
function myCallBack(xmlHttpRequest,methodName) {
	if (xmlHttpRequest.readyState == 4) {
		if(xmlHttpRequest.status == 404){
			alert("找不到请求地址!");
		}else if(xmlHttpRequest.status == 500){
			alert("服务器异常!");
		}else if(xmlHttpRequest.status == 200){
			var result = xmlHttpRequest.responseText;
			eval(methodName + "(result)");
		}
	}
}

/** 传入访问url，把返回结果显示在指定元素上
 * @param url			请求的URL
 * @param method		请求方式(GET/POST)
 * @param data			传入的参数
 * @param container		显示结果的元素
 * @param msg			发送请求后的提示信息
 */
function ajaxUrl2Container(url,method,data,container,msg){
	ajax2Url(url, method, data, function(xmlHttpRequest){
		result2Container(xmlHttpRequest,container,msg);
	});
}

/** 将请求结果显示在元素上
 * @param xmlHttpRequest	请求对象
 * @param container			要显示结果的元素
 * @param msg				发送请求后的提示信息
 */
function result2Container(xmlHttpRequest,container,msg){
	if(typeof container == 'string'){
		container = document.getElementById(container);
	}
		
	if(xmlHttpRequest.readyState == 1){
		container.innerHTML = msg;
	}else if(xmlHttpRequest.readyState == 4){
		if(xmlHttpRequest.status == 404){
			container.innerHTML = "找不到请求地址!";
		}else if(xmlHttpRequest.status == 500){
			container.innerHTML = "服务器异常!";
		}else if(xmlHttpRequest.status == 200){
			container.innerHTML = xmlHttpRequest.responseText;
		}
	}
}

/**
 * 提交表单
 * @param pageForm		表单
 * @param container		显示结果的容器
 * @param msg			提交请求后显示的提示信息
 */
function submitForm(pageForm,container,msg){
	if(typeof pageForm == 'string')
		pageForm = document.getElementById(pageForm);
	ajaxUrl2Container(pageForm.action,pageForm.method,form2String(pageForm),container,msg);
}

/** 给URL拼接参数 
 * @param url	原URL
 * @param data	要拼接的参数
 * return 拼接参数后的URL
 */
function urlAppendData(url,data){
	if(data==null||data=='')
		return url;
	if(url.indexOf('?')!=-1){
		url = url+'&'+data;
	}else{
		url = url+'?'+data;
	}
	return url;
}

/** 把表单数据转成请求字符串 
 * @param form_obj	form
 * return 将表单转成的字符串
 */
function form2String(form_obj)
{
	var query_string='';
	var and='';
	if(typeof form_obj == 'string'){
		form_obj = document.getElementById(form_obj);
	}
	var e;
	for (i=0;i<form_obj.length ;i++)
	{
		e=form_obj[i];
		if (e.name!='')
		{
			if (e.type=='select-one')
			{
				element_value=e.options[e.selectedIndex].value;
			}
			else if (e.type=='checkbox' || e.type=='radio')
			{
				if (e.checked==false)
				{
					break;	
				}
				element_value=e.value;
			}
			else
			{
				element_value=e.value;
			}
			query_string+=and+e.name+'='+element_value.replace(/\&/g,"%26");
			and="&"
		}
		
	}
	return query_string;
}