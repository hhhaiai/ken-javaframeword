/**
名称：Cookie函数
版本：1.0.1 (Beta)
作者：洪磊
E-mail：[email]honglei@live.com[/email]
*/
var HL = HL || {};
HL.Cookie = {
/*
函数名称：HL.Cookie.Get([string name])
函数功能：得到Cookie
参数：name 可选项，要取得的Cookie名称
说明：name为空时将通过数组形式返回全部Cookie，name不为空时返回此Cookie名称的值，没有任何值时返回undefined
*/
	Get : function(name){
		var cv = document.cookie.split("; ");//使用"; "分割Cookie
		var cva = [], temp;
		/*循环的得到Cookie名称与值*/
		for(i=0; i<cv.length; i++){
			temp = cv[i].split("=");//用"="分割Cookie的名称与值
			cva[temp[0]] = unescape(temp[1]);
		}
		if(name) return cva[name];//如果有name则输出这个name的Cookie值
		else return cva;//如果没有name则输出以名称为key，值为Value的数组
	},
/*
函数名称：HL.Cookie.Set(string name, string  value[, int expires[, string path[, string domain[, string secure]]]])
函数功能：存入Cookie
参数：name 必要项，要存入的Cookie名称
      value 必要项，要存入的Cookie名称对应的值
      expires 可选项，Cookie的过期时间，可以填入以秒为单位的保存时间，也可以填入日期格式（wdy, DD-Mon-YYYY HH:MM:SS GMT）的到期时间
      path 可选项，Cookie在服务器端的有效路径
      domain 可选项，该Cookie的有效域名
      secure 可选项， 指明Cookie 是否仅通过安全的 HTTPS 连接传送，0或false或空时为假
说明：保存成功则返回true，保存失败返回false
*/
	Set : function(name, value, expires, path, domain, secure){
		if(!name || !value) return false;//如果没有name和value则返回false
		if(name == "" || value == "") return false;//如果name和value为空则返回false
		/*对于过期时间的处理*/
		if(expires){
			/*如果是数字则换算成GMT时间，当前时间加上以秒为单位的expires*/
			if(/^[0-9]+$/.test(expires)){
				var today = new Date();
				expires = new Date(today.getTime()+expires*1000).toGMTString();
			/*判断expires格式是否正确，不正确则赋值为undefined*/
			}else if(!/^wed, \d{2} \w{3} \d{4} \d{2}\:\d{2}\:\d{2} GMT$/.test(expires)){
				expires = undefined;
			}
		}
		/*合并cookie的相关值*/
		var cv = name+"="+escape(value)+";"
		       + ((expires) ? " expires="+expires+";" : "")
		       + ((path) ? "path="+path+";" : "")
		       + ((domain) ? "domain="+domain+";" : "")
		       + ((secure && secure != 0) ? "secure" : "");
		/*判断Cookie总长度是否大于4K*/
		if(cv.length < 4096){
			document.cookie = cv;//写入cookie
			return true;
		}else{
			return false;
		}
	},
/*
函数名称：HL.Cookie.Del(string name[, string path[, string domain]])
函数功能：删除Cookie
参数：name 必要项，要删除的Cookie名称
      path 可选项，要删除的Cookie在服务器端的有效路径
      domain 可选项，要删除的Cookie的有效域名
说明：删除成功返回true，删除失败返回false
*/
	Del : function(name, path, domain){
		if(!name) return false;//如果没有name则返回false
		if(name == "") return false;//如果name为空则返回false
		if(!this.Get(name)) return false;//如果要删除的name值不存在则返回false
		/*合并Cookie的相关值*/
		document.cookie = name+"=;"
		                  + ((path) ? "path="+path+";" : "")
		                  + ((domain) ? "domain="+domain+";" : "")
		                  + "expires=Thu, 01-Jan-1970 00:00:01 GMT;";
		return true;
	}
}

