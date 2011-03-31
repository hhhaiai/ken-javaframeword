package com.shine.framework.core.control
{
	public class Control
	{
		private static var _instance:Control;
		public function Control(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():Control{
			if (Control._instance == null)
			{
				Control._instance=new Control(new SingletonEnforcer());
			}
			return Control._instance;
		}
	}
}
class SingletonEnforcer
{
}