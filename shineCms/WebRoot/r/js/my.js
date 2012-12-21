/**
 * 自定义JS方法
 * @encode UTF-8
 * @author JiangKunpeng
 * 修改者      修改时间         版本       修改描述
 * 
 */

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