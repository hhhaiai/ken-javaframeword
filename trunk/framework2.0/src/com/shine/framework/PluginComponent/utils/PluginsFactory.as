package com.shine.framework.PluginComponent.utils
{
	public class PluginsFactory
	{
		
		private static var _instance:PluginsFactory;
		
		public function PluginsFactory()
		{
		}
		
		public function getFactory():void{
			if (PluginsFactory._instance == null)
			{
				PluginsFactory._instance=new PluginsFactory(new SingletonEnforcer());
			}
			return _instance;
		}
	}
}
class SingletonEnforcer
{
}