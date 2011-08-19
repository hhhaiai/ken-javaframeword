package com.shine.cofferChart.control
{
	import com.shine.framework.core.model.BaseXmlModel;
	
	public class MainControl extends BaseXmlModel
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