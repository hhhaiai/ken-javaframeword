package com.shine.flexcoffer.util
{
	import mx.controls.Alert;
	import mx.rpc.events.FaultEvent;
	import mx.rpc.events.ResultEvent;
	import mx.rpc.remoting.mxml.RemoteObject;
	
	public class BaseRoServiceUtil
	{
		public var destination:String="classLoader";
		//remote server host
		public var host:String="";
		//remote server java class path
		public var classPath:String="";
		//remote server java method
		public var classMethod:String="";
		//input data to java method
		public var value:Object;
		//return to flex method
		public var method:Function;
		
		public function BaseRoServiceUtil()
		{
		}
		
		public function loadClass(classPath:String, classMethod:String, value:Object):void
		{
			if (classPath.length != 0 && classMethod.length != 0)
			{
				var loader:RemoteObject=new RemoteObject;
				loader.destination=destination;
				loader.addEventListener(FaultEvent.FAULT, error);
				if(host.length==0){
					loader.endpoint="messagebroker/amf";
				}else{
					loader.endpoint=host + "/messagebroker/amf";
				}
				loader.loadMethod(classPath, classMethod, value);
				loader.addEventListener(ResultEvent.RESULT, getRomoteHelloRes);
			}
			else
			{
				Alert.show("please check remote classPath and classMethod");
			}
		}
		
		private function getRomoteHelloRes(e:ResultEvent):void
		{
			if (method != null)
				method.call(this, e.result);
		}
		
		private function error(e:FaultEvent):void
		{
			Alert.show(e.message.toString());
		}
		
		public function run():void
		{
			loadClass(classPath, classMethod, value);
		}
	}
}