package com.shine.featuresView.control
{
	import com.shine.topo.control.BaseControl;
	
	public class MainContorl extends BaseControl
	{
		private static var _instance:MainContorl;
		
		public function MainContorl(value:SingletonEnforcer)
		{
			super();
		}
		
		public static function getInstance():MainContorl{
			if (MainContorl._instance == null)
			{
				MainContorl._instance=new MainContorl(new SingletonEnforcer());
			}
			return MainContorl._instance;
		}
	}
}
class SingletonEnforcer
{
}