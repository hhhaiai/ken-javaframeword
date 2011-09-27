package com.shine.cofferChart.control
{
	import com.shine.framework.core.control.BaseControl;
	
	public class MainControl extends BaseControl
	{
		private static var _instance:MainControl;
		public function MainControl(enforcer:SingletonEnforcer)
		{
			super();
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