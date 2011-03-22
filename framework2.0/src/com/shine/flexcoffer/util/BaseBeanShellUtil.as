package com.shine.flexcoffer.util
{
	import mx.rpc.events.FaultEvent;
	import mx.rpc.events.ResultEvent;
	import mx.rpc.remoting.mxml.RemoteObject;
	import mx.controls.Alert;
	
	public class BaseBeanShellUtil
	{
		public var destination:String="beanShell";
		//remote server host
		public var host:String="";
		//java code
		public var code:String="";
		//return flex method
		public var method:Function;
		//user java code flex object
		public var object:Object;
		
		public function BaseBeanShellUtil()
		{
		}
		
		//execute java code return method
		public function beanShell(code:String, method:Function):void
		{
			if (code.length != 0)
			{
				var beanShell:RemoteObject=new RemoteObject;
				beanShell.destination=destination;
				beanShell.addEventListener(FaultEvent.FAULT, error);
				if(host.length==0){
					beanShell.endpoint="messagebroker/amf";
				}else{
					beanShell.endpoint=host + "/messagebroker/amf";
				}
				beanShell.executBeanShell(handleCode(code));
				beanShell.addEventListener(ResultEvent.RESULT, getRomoteHelloRes);
			}
			
		}
		
		//format java code
		private function handleCode(code:String):String
		{
			if (object != null)
			{
				var newCode:String="";
				var array:Array=code.split(/#/);
				newCode=newCode + array[0];
				var num:int=array.length;
				for (var i:int=1; i < num; i++)
				{
					if (i % 2 != 0)
					{
						newCode=newCode + "\"" + String(object[String(array[i])]) + "\"";
					}
					else
					{
						newCode=newCode + String(String(array[i]));
					}
					
				}
				return newCode;
			}
			else
			{
				Alert.show("No way to identify embedded as class");
				return null;
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
			beanShell(code, method);
		}
	}
}