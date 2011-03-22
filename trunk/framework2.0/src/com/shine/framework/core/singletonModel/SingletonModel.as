package com.shine.framework.core.singletonModel
{

	public class SingletonModel
	{
		private static var _instance:SingletonModel;

		public function SingletonModel(enforcer:SingletonEnforcer)
		{
		}

		public static function getInstance():SingletonModel
		{
			if (SingletonModel._instance == null)
			{
				SingletonModel._instance=new SingletonModel(new SingletonEnforcer());
			}
			return SingletonModel._instance;
		}
	}
}
class SingletonEnforcer
{
}