package com.shine.resource
{
	import flash.utils.ByteArray;

	public class CoreResource
	{
		private static var _instance:CoreResource;
		
		[Embed(source="resource/image/config/canvasLoading.gif" , mimeType="application/octet-stream")]
		public var _loadingGif:Class;
		
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
		
		public function get loadingGif():ByteArray{
			return new _loadingGif();
		}
	}
}
class SingletonEnforcer
{
}