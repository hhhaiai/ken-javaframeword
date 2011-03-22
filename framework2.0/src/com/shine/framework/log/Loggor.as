package com.shine.framework.log
{
	public class Loggor
	{
		private static var _instance:Loggor;
		public var status:Boolean=false;
		
		public function Loggor(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():Loggor
		{
			if (Loggor._instance == null)
			{
				Loggor._instance=new Loggor(new SingletonEnforcer());
			}
			return Loggor._instance;
		}
		
		public function init():void{
			this.status=true;
		}
		
		public function log(value:String,url:String,method:String=null,type:String=null):void{
			
		}
	}
}
class SingletonEnforcer
{
}