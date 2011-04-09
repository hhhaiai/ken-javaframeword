package com.shine.topo.control
{
	import mx.utils.ArrayUtil;

	public class SaveControl
	{
		private static var _saveControl:SaveControl;
		
		public var xml:XML;
		
		public function SaveControl(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():SaveControl
		{
			if (SaveControl._saveControl == null)
			{
				SaveControl._saveControl=new SaveControl(new SingletonEnforcer());
			}
			return SaveControl._saveControl;
		}
		
		public function changeXmlValue(tag:String,attributes:Array,attributesValue:Array,attribute:String,value:String):void{
			
		}
	}
}
class SingletonEnforcer
{
}