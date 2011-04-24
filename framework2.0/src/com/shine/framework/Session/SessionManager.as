package com.shine.framework.Session
{
	import com.shine.framework.core.util.ArrayMap;

	public class SessionManager
	{
		private static var _instance:SessionManager;
		//Session map
		public var sessionMap:ArrayMap=new ArrayMap;
		
		public function SessionManager(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():SessionManager
		{
			if (SessionManager._instance == null)
			{
				SessionManager._instance=new SessionManager(new SingletonEnforcer());
			}
			return SessionManager._instance;
		}
		
		//加入session控制
		public function put(key:String,value:Object):void{
			sessionMap.put(key,value);
		}
		
		//获取session数据
		public function get(key:String):Object{
			return sessionMap.get(key);
		}
	}
}
class SingletonEnforcer
{
}
class SessionModel
{
}