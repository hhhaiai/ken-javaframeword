package com.shine.framework.core.util
{
	import com.adobe.serialization.json.JSON;
	
	public class JsonUtils
	{
		public function JsonUtils()
		{
		}
		
		public static function getArray(value:String):Array{
			return (JSON.decode(value) as Array);
		}
		
		
	}
}