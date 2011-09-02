/*************************************************
Validator v2.0
作者:yjh
QQ:306912728
2009-05-11

使用方法:	
<form id="demo" name="demo" onSubmit="return Validator.Validate(this,2)">
  <table>
    <tr>
      <td>年龄:<input name="Year" dataType="Range" msg="年龄必须在18~28之间" min="18" max="28">
      </td>
    </tr>
    <tr>
      <td>限制多选按钮组的选中个数 
代码示例： 
运动<input name="Favorite" value="1" type="checkbox">
上网<input name="Favorite" value="2" type="checkbox">
听音乐<input name="Favorite" value="3" type="checkbox">
看书<input name="Favorite" value="4" type="checkbox"" dataType="Group" min="2" max="3" msg="必须选择2~3种爱好"> 

      </td>
    </tr>
    <tr>
      <td>	  
		<input name="Submit" type="submit" value="确定提交">
		<input onClick="Validator.Validate(document.getElementById('demo'))" value="检验模式1" type="button">
		<input onClick="Validator.Validate(document.getElementById('demo'),2)" value="检验模式2" type="button">
		<input onClick="Validator.Validate(document.getElementById('demo'),3)" value="检验模式3" type="button">
	  </td>
    </tr>
  </table>
</form>

调用方法:
Validator.Validate(obj,3)
Validate方法有两个可选参数，
第一个为表单对象
第二个参数可选值为1,2和3，默认值为1

[dataType]="Require | Chinese | English | Number | Integer | Double | Email | Url | Phone | Mobile | Currency | Zip | IdCard | QQ | Date | SafeString | Repeat | Compare | Range | Limit | LimitB | Group | Custom"
 
类型：字符串。必选。 
说明：用于设定表单项的输入数据验证类型。 
	Require 必填项 
	Chinese 中文 
	English  英文
	Number  数字 
	Integer  整数 
	Double  实数 
	Email Email地址格式 
	Url  基于HTTP协议的网址格式 
	Phone  电话号码格式 
	Mobile  手机号码格式 
	Currency  货币格式 
	Zip 邮政编码 
	IdCard 身份证号码 
	QQ QQ号码 
	Date  日期 
	SafeString  安全密码 
	Repeat  重复输入 
	Compare 关系比较 
	Ip  IP地址
	Range 输入范围 应包含参数 min="18" max="28"
	Limit 限制输入长度 
	LimitB 限制输入的字节长度 
	Group  验证单/多选按钮组 
	Custom  自定义正则表达式验证

[msg]="string" 
	类型：字符串。必选。 
	说明：在验证失败时要提示的出错信息。 

[operator]="NotEqual | GreaterThan | GreaterThanEqual | LessThan | LessThanEqual | Equal" 
	类型：字符串。在dataType属性值为Compare时可选(默认值为Equal)。 
	说明：参考to属性。
	各选值所对应的关系操作符：
	可选值 意义说明 
	NotEqual 不等于 != 
	GreaterThan  大于 > 
	GreaterThanEqual 大于等于 >= 
	LessThan  小于 < 
	LessThanEqual  小于等于 <= 
	Equal  等于 = 
 
[require]="true | false" 
	类型：字符串。可选。 
	说明：用于设定表单项的验证方式。当值为false时表单项不是必填项，但当有填写时，
	仍然要执行dataType属性所设定的验证方法，值为true或任何非false字符时可省略此属性。 
[to]="sting | int" 
	类型：字符串。当dataType值为Repeat或Compare时必选。 
	说明：当dataType值为Repeat时，to的值为某表单项的name属性值，
	用于设定当前表单项的值是否与目标表单项的值一致；当dataType的值为Compare时，
	to的选值类型为实数，用于判断当前表单项的输入与to的值是否符合operator属性值所指定的关系。 
[format]="ymd | dmy" 
	类型：字符串。在dataType属性值为Date时可选(默认值为ymd)。 
	说明：用于验证输入是否为符合format属性值所指定格式的日期。
	符合规则的输入示例 : 2004-11-23，2004/11/23，04.11.23，23-11-2004等
	注意：当输入的年份为2位时，如果数值小于30，将使年份看作处于21世纪，否则为20世纪。 
[regexp]="object" 
	类型：字符串。在dataType属性值为Custom时必选。 
	说明：用于验证输入是否符合regexp属性所指定的正则表达式。 

*************************************************/
var Validator = {
	Require : /.+/,
	Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	Phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
	Mobile : /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/,
	Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	IdCard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
	Currency : /^\d+(\.\d+)?$/,
	Number : /^\d+$/,
	Zip : /^[1-9]\d{5}$/,
	QQ : /^[1-9]\d{4,8}$/,
	Integer : /^[-\+]?\d+$/,
	Double : /^[-\+]?\d+(\.\d+)?$/,
	English : /^[A-Za-z]+$/,
	Chinese :  /^[\u0391-\uFFE5]+$/,
	UnSafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	Ip : /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
	IsSafe : function(str){return !this.UnSafe.test(str);},
	SafeString : "this.IsSafe(value)",
	Limit : "this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
	LimitB : "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
	Date : "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
	Repeat : "value == document.getElementsByName(getAttribute('to'))[0].value",
	Range : "!isNaN(value)&&parseInt(getAttribute('min')) < parseInt(value) && parseInt(value) < parseInt(getAttribute('max'))",
	Compare : "this.compare(value,getAttribute('operator'),getAttribute('to'))",
	Custom : "this.Exec(value, getAttribute('regexp'))",
	Group : "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
	ErrorItem : [document.forms[0]],
	ErrorMessage : ["以下原因导致提交失败：\t\t\t\t"],
	Validate : function(theForm, mode){
		var obj = theForm || event.srcElement;
		var count = obj.elements.length;
		this.ErrorMessage.length = 1;
		this.ErrorItem.length = 1;
		this.ErrorItem[0] = obj;
		for(var i=0;i<count;i++){
			with(obj.elements[i]){
				var _dataType = getAttribute("dataType");
				if(typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined")  continue;
				this.ClearState(obj.elements[i]);
				
				if(getAttribute("require") == "false" && value == "") continue;
				value=value.trim();
				switch(_dataType){
					case "Date" :
					case "Repeat" :
					case "Range" :
					case "Compare" :
					case "Custom" :
					case "Group" : 
					case "Limit" :
					case "LimitB" :
					case "SafeString" :
						if(!eval(this[_dataType]))	{
							this.AddError(i,this.getErrorMassage(_dataType,getAttribute("msg")));
						}
						break;
					default :
						if(!this[_dataType].test(value)){
							this.AddError(i,this.getErrorMassage(_dataType,getAttribute("msg")));
						}
						break;
				}
			}
		}
		if(this.ErrorMessage.length > 1){
			mode = mode || 1;
			var errCount = this.ErrorItem.length;
			switch(mode){
			case 2 :
				for(var i=1;i<errCount;i++)
					this.ErrorItem[i].style.color = "red";
			case 1 :
				alert(this.ErrorMessage.join("\n"));
				this.ErrorItem[1].focus();
				break;
			case 3 :
				for(var i=1;i<errCount;i++){
				try{
					var span = document.createElement("SPAN");
					span.id = "__ErrorMessagePanel";
					span.style.color = "red";
					span.className = "rl_span_error";
					this.ErrorItem[i].parentNode.appendChild(span);
					span.innerHTML = this.ErrorMessage[i].replace(/\d+:/,"-");
					}
					catch(e){alert(e.description);}
				}
				this.ErrorItem[1].focus();
				break;
			default :
				alert(this.ErrorMessage.join("\n"));
				break;
			}
			return false;
		}
		return true;
	},
	getErrorMassage : function(type,msg){
		var defMsg={};
		defMsg["Require"]="必填项";
		defMsg["Chinese"]="只允许中文";
		defMsg["English"]="只允许英文";
		defMsg["Number"]="只允许数字";
		defMsg["Integer"]="只允许整数";
		defMsg["Double"]="只允许实数";
		defMsg["Email"]="Email地址格式不对";
		defMsg["Url"]="网址格式不对";
		defMsg["Phone"]="电话号码格式不对";
		defMsg["Mobile"]="手机号码格式不对";
		defMsg["Currency"]="货币格式不对";
		defMsg["Zip"]="邮政编码不对";
		defMsg["IdCard"]="身份证号码格式不对";
		defMsg["QQ"]="QQ号格式不对";
		defMsg["Date"]="日期格式不对";
		defMsg["SafeString"]="不太安全的密码";
		defMsg["Repeat"]="重复输入不对";
		defMsg["Compare"]="不对";
		defMsg["Ip"]="IP地址";
		defMsg["Range"]="超过范围";
		defMsg["Limit"]="超过限定长度";
		defMsg["LimitB"]="限制输入的字节长度";
		defMsg["Group"]="必选一项";
		defMsg["Custom"]="格式不对";
		
		var retMsg=msg||defMsg[type];
		return retMsg;
	},
	limit : function(len,min, max){
		min = min || 0;
		max = max || Number.MAX_VALUE;
		return min <= len && len <= max;
	},
	LenB : function(str){
		return str.replace(/[^\x00-\xff]/g,"**").length;
	},
	ClearState : function(elem){
		with(elem){
			if(style.color == "red")
				style.color = "";
			var lastNode = parentNode.childNodes[parentNode.childNodes.length-1];
			if(lastNode.id == "__ErrorMessagePanel")
				parentNode.removeChild(lastNode);
		}
	},
	AddError : function(index, str){
		this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
		this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ":" + str;
	},
	Exec : function(op, reg){
		return new RegExp(reg,"g").test(op);
	},
	compare : function(op1,operator,op2){
		switch (operator) {
			case "NotEqual":
				return (op1 != op2);
			case "GreaterThan":
				return (op1 > op2);
			case "GreaterThanEqual":
				return (op1 >= op2);
			case "LessThan":
				return (op1 < op2);
			case "LessThanEqual":
				return (op1 <= op2);
			default:
				return (op1 == op2);            
		}
	},
	MustChecked : function(name, min, max){
		var groups = document.getElementsByName(name);
		var hasChecked = 0;
		min = min || 1;
		max = max || groups.length;
		for(var i=groups.length-1;i>=0;i--)
			if(groups[i].checked) hasChecked++;
		return min <= hasChecked && hasChecked <= max;
	},
	IsDate : function(op, formatString){
		formatString = formatString || "ymd";
		var m, year, month, day;
		switch(formatString){
			case "ymd" :
				m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
				if(m == null ) return false;
				day = m[6];
				month = m[5]--;
				year =  (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
				break;
			case "dmy" :
				m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
				if(m == null ) return false;
				day = m[1];
				month = m[3]--;
				year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
				break;
			default :
				break;
		}
		if(!parseInt(month)) return false;
		month = month==12 ?0:month;
		var date = new Date(year, month, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate());
		function GetFullYear(y){return ((y<30 ? "20" : "19") + y)|0;}
	}
 }