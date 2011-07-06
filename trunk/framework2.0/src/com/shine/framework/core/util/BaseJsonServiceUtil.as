package com.shine.framework.core.util
{import mx.controls.Alert;
	import mx.rpc.events.FaultEvent;
	import mx.rpc.events.ResultEvent;
	import mx.rpc.http.HTTPService;
	
	import com.shine.framework.log.Loggor;
	import com.shine.framework.core.util.DateUtil;
	
	public class BaseJsonServiceUtil
	{
		private var httpService:HTTPService;
		//已经获取完json执行的异步方法
		public var method:Function;
		//获取xml出错执行的异步方法
		public var failMethod:Function;
		//httpservice json url
		public var jsonUrl:String;
		//是否清理缓存
		public var cleanCache:String="off";
		//是否开始debug模式
		public var debug:String="off";
		//http执行方法 httpMethod="GET" or httpMethod="POST"
		public var httpMethod:String="GET";
		//post value
		public var postValue:Object;
		
		public function BaseJsonServiceUtil()
		{
		}
		
		//get方法
		public function getResultJson(jsonUrl:String, method:Function, failMethod:Function=null, cleanCache:String="off", debug:String="off"):void
		{
			this.method=method;
			this.failMethod=failMethod;
			this.debug=debug;
			this.jsonUrl=jsonUrl;
			httpService=new HTTPService();
			httpService.method="GET";
			httpService.useProxy=false;
			httpService.resultFormat=HTTPService.RESULT_FORMAT_TEXT;
			httpService.addEventListener("result", httpResult);
			if (failMethod != null)
				httpService.addEventListener(FaultEvent.FAULT, failResult);
			if (cleanCache == "on")
			{
				if(jsonUrl.indexOf("?")!=-1){
					jsonUrl=jsonUrl + String.fromCharCode(0038) + "random=" + String(Math.random() * 10);
				}else{
					jsonUrl=jsonUrl +"?random=" + String(Math.random() * 10);
				}
			}
			httpService.url=jsonUrl;
			httpService.send();
		}
		
		//post方法
		public function postResultJson(jsonUrl:String, method:Function, postValue:Object=null, failMethod:Function=null, cleanCache:String="off", debug:String="off"):void
		{
			this.method=method;
			this.failMethod=failMethod;
			this.debug=debug;
			this.jsonUrl=jsonUrl;
			httpService=new HTTPService();
			httpService.method="post";
			httpService.useProxy=false;
			httpService.resultFormat=HTTPService.RESULT_FORMAT_TEXT;
			httpService.addEventListener("result", httpResult);
			if (failMethod != null)
				httpService.addEventListener(FaultEvent.FAULT, failResult);
			if (cleanCache == "on")
			{
				if(jsonUrl.indexOf("?")!=-1){
					jsonUrl=jsonUrl + String.fromCharCode(0038) + "random=" + String(Math.random() * 10);
				}else{
					jsonUrl=jsonUrl +"?random=" + String(Math.random() * 10);
				}
			}
			httpService.url=jsonUrl;
			if(postValue!=null){
				httpService.send(postValue);
			}else{
				httpService.send();
			}
		}
		
		//有Json模式异步执行的方法
		public function run():void{
			if(httpMethod=="GET"){
				getResultJson(this.jsonUrl, this.method, this.failMethod, this.cleanCache, this.debug);
			}else{
				postResultJson(this.jsonUrl, this.method, this.postValue, this.failMethod, this.cleanCache, this.debug);
			}
		}
		
		//http service result method
		private function httpResult(event:ResultEvent):void
		{
			resultJson(String(event.result));
		}
		
		//http service fail method
		private function failResult(event:FaultEvent):void
		{
			if (failMethod != null)
				failMethod.call(this);
		}
		
		//result method suport override
		protected function resultJson(value:String):void
		{
			if (debug == "on")
			{
				if(Loggor.getInstance().status){
					//Loggor.getInstance().log(value.toXMLString(),DateUtil.getDate(),this.xmlUrl,String(method),"httpService");
				}else{
					Alert.show(value);
				}
			}
			if(method!=	null)
				method.call(this, value);
			value=null;
		}
	}
}