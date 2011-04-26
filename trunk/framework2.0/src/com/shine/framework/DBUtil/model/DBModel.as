package com.shine.framework.DBUtil.model
{
	import com.shine.framework.core.util.ArrayMap;
	
	public class DBModel extends ArrayMap
	{
		public function DBModel()
		{
			super();
		}
		
		public function setXml(value:String):void{
			
		}
		
		public function getXml():XML{
			return null;
		}
		
		public function addRow(value:DBRowModel):void{
			this.put(this.getLength(),value);
		}
		
		public function getRow(value:int):DBRowModel{
			return this.get(value) as DBRowModel;
		}
	}
}