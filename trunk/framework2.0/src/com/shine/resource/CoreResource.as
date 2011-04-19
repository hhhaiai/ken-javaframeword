package com.shine.resource
{
	public class CoreResource
	{
		private static var _instance:CoreResource;
		
		[Embed(source="resource/image/config/canvasLoading.gif" , mimeType="application/octet-stream")]
		public var loadingGif:Class;
		
		public function CoreResource(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():CoreResource
		{
			if (CoreResource._instance == null)
			{
				CoreResource._instance=new CoreResource(new SingletonEnforcer());
			}
			return CoreResource._instance;
		}
	}
}
class SingletonEnforcer
{
}