package com.shine.framework.core.util
{
	import mx.controls.Alert;
	import mx.rpc.events.FaultEvent;
	import mx.rpc.events.ResultEvent;
	import mx.rpc.http.HTTPService;
	
	import com.shine.framework.log.Loggor;
	import com.shine.framework.core.util.DateUtil;
	
	/**
	 * Base Http Service
	 * 
	 * @author viruscodecn@gmail.com
	 * @project FlexFramework 2.0 2011-01-13
	 */
	public class BaseHttpServiceUtil
	{
		private var xmlService:HTTPService;
		//已经获取完xml执行的异步方法
		public var method:Function;
		//获取xml出错执行的异步方法
		public var failMethod:Function;
		//httpservice xml url
		public var xmlUrl:String;
		//是否清理缓存
		public var cleanCache:String="off";
		//是否开始debug模式
		public var debug:String="off";
		//http执行方法 httpMethod="GET" or httpMethod="POST"
		public var httpMethod:String="GET";
		//post value
		public var postValue:Object;
		
		public function BaseHttpServiceUtil()
		{
		}
		
		//get方法
		public function getResultXml(xmlUrl:String, method:Function, failMethod:Function=null, cleanCache:String="off", debug:String="off"):void
		{
			this.method=method;
			this.failMethod=failMethod;
			this.debug=debug;
			this.xmlUrl=xmlUrl;
			xmlService=new HTTPService();
			xmlService.method="GET";
			xmlService.useProxy=false;
			xmlService.resultFormat=HTTPService.RESULT_FORMAT_XML;
			xmlService.addEventListener("result", httpResult);
			if (failMethod != null)
				xmlService.addEventListener(FaultEvent.FAULT, failResult);
			if (cleanCache == "on")
			{
				if(xmlUrl.indexOf("?")!=-1){
					xmlUrl=xmlUrl + String.fromCharCode(0038) + "random=" + String(Math.random() * 10);
				}else{
					xmlUrl=xmlUrl +"?random=" + String(Math.random() * 10);
				}
			}
			xmlService.url=xmlUrl;
			xmlService.send();
		}
		
		//post方法
		public function postResultXml(xmlUrl:String, method:Function, postValue:Object=null, failMethod:Function=null, cleanCache:String="off", debug:String="off"):void
		{
			this.method=method;
			this.failMethod=failMethod;
			this.debug=debug;
			this.xmlUrl=xmlUrl;
			xmlService=new HTTPService();
			xmlService.method="post";
			xmlService.useProxy=false;
			xmlService.resultFormat=HTTPService.RESULT_FORMAT_XML;
			xmlService.addEventListener("result", httpResult);
			if (failMethod != null)
				xmlService.addEventListener(FaultEvent.FAULT, failResult);
			if (cleanCache == "on")
			{
				if(xmlUrl.indexOf("?")!=-1){
					xmlUrl=xmlUrl + String.fromCharCode(0038) + "random=" + String(Math.random() * 10);
				}else{
					xmlUrl=xmlUrl +"?random=" + String(Math.random() * 10);
				}
			}
			xmlService.url=xmlUrl;
			if(postValue!=null){
				xmlService.send(postValue);
			}else{
				xmlService.send();
			}
			
		}
		
		//有xml模式异步执行的方法
		public function run():void{
			if(httpMethod=="GET"){
				getResultXml(this.xmlUrl, this.method, this.failMethod, this.cleanCache, this.debug);
			}else{
				postResultXml(this.xmlUrl, this.method, this.postValue, this.failMethod, this.cleanCache, this.debug);
			}
		}
		
		//http service result method
		private function httpResult(event:ResultEvent):void
		{
			resultXml(XML(event.result));
		}
		
		//http service fail method
		private function failResult(event:FaultEvent):void
		{
			Alert.show(event.toString());
			if (failMethod != null)
				failMethod.call(this);
		}
		
		//result method suport override
		protected function resultXml(value:XML):void
		{
			if (debug == "on")
			{
				if(Loggor.getInstance().status){
					//Loggor.getInstance().log(value.toXMLString(),DateUtil.getDate(),this.xmlUrl,String(method),"httpService");
				}else{
					Alert.show(value.toXMLString());
				}
			}
			if(method!=	null)
				method.call(this, value);
			value=null;
		}
	}
}