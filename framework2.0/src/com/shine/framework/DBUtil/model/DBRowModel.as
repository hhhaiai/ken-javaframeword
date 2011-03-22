package com.shine.framework.DBUtil.model
{
	import com.shine.framework.core.model.BaseXmlModel;
	
	import flash.media.Video;
	
	public class DBRowModel extends BaseXmlModel
	{
		public function DBRowModel()
		{
			super();
		}
		
		public function setDBXml(value:String):void{
			this.xml=value;
		}
		
		public function getDBXml():String{
			return null;
		}
	}
}