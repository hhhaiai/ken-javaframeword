package com.shine.framework.core.control
{
	public class MainControl
	{
		private static var _instance:MainControl;
		public function MainControl(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():MainControl{
			if (MainControl._instance == null)
			{
				MainControl._instance=new MainControl(new SingletonEnforcer());
			}
			return MainControl._instance;
		}
	}
}
class SingletonEnforcer
{
}