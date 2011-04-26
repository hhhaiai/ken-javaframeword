package com.shine.framework.DBUtil.model
{
	import com.shine.framework.core.util.ArrayMap;
	
	public class DBModel extends ArrayMap
	{
		public function DBModel()
		{
			super();
		}
		
		//加入xml
		public function setXml(value:String):void{
			this.removeAll();
		}
		
		//获取xml
		public function getXml():XML{
			return null;
		}
		
		//加入新的数据库
		public function addRow(value:DBRowModel):void{
			this.put(this.getLength(),value);
		}
		
		//获取数据
		public function getRow(value:int):DBRowModel{
			return this.get(value) as DBRowModel;
		}
	}
}